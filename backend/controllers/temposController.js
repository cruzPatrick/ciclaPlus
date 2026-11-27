import mongoose from 'mongoose';
import { garantirPercursos } from '../models/Percurso.js';
import Tempo from '../models/Tempo.js';

const CAMPOS = ['trajeto', 'percursoId', 'duracao', 'distancia', 'origem'];

function camposDoBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return {};
  return Object.fromEntries(CAMPOS.filter((campo) => campo in body).map((campo) => [campo, body[campo]]));
}

function validar(dados, parcial = false) {
  if (!parcial) {
    for (const campo of ['trajeto', 'duracao', 'distancia', 'origem']) {
      if (dados[campo] === undefined) return `${campo} é obrigatório.`;
    }
  }

  if (dados.trajeto !== undefined && (typeof dados.trajeto !== 'string' || !dados.trajeto.trim())) {
    return 'trajeto deve ser um texto não vazio.';
  }
  if (
    dados.percursoId !== undefined &&
    dados.percursoId !== null &&
    (typeof dados.percursoId !== 'string' || !dados.percursoId.trim())
  ) {
    return 'percursoId deve ser um texto ou null.';
  }
  if (
    dados.duracao !== undefined &&
    (typeof dados.duracao !== 'string' ||
      !/^\d{2}:[0-5]\d:[0-5]\d$/.test(dados.duracao) ||
      dados.duracao === '00:00:00')
  ) {
    return 'duracao deve ser maior que zero e estar no formato HH:MM:SS.';
  }
  if (
    dados.distancia !== undefined &&
    (typeof dados.distancia !== 'number' || !Number.isFinite(dados.distancia) || dados.distancia < 0)
  ) {
    return 'distancia deve ser um número maior ou igual a zero.';
  }
  if (dados.origem !== undefined && !['gps', 'simulado'].includes(dados.origem)) {
    return 'origem deve ser "gps" ou "simulado".';
  }

  return null;
}

function paraSegundos(duracao) {
  const [horas, minutos, segundos] = duracao.split(':').map(Number);
  return horas * 3600 + minutos * 60 + segundos;
}

function normalizarNome(nome) {
  return nome.trim().toLocaleLowerCase('pt-BR');
}

async function validarPercurso(dados) {
  const percursos = await garantirPercursos();
  const percursoId = dados.percursoId;
  const trajeto = dados.trajeto?.trim();
  let percurso = null;

  if (percursoId !== undefined && percursoId !== null) {
    percurso = percursos.find((item) => item.id === String(percursoId));
    if (!percurso) {
      return { erro: 'percursoId não corresponde a um percurso cadastrado.' };
    }
  }

  if (trajeto) {
    const percursoDoNome = percursos.find(
      (item) => normalizarNome(item.nome) === normalizarNome(trajeto),
    );
    if (percurso && percursoDoNome?.id !== percurso.id) {
      return { erro: 'trajeto não corresponde ao percursoId informado.' };
    }
    percurso ??= percursoDoNome;
  }

  if (!percurso && dados.origem !== 'gps') {
    return { erro: 'trajeto informado não corresponde a um percurso cadastrado.' };
  }

  return {
    dados: percurso
      ? {
          percursoId: percurso.id,
          trajeto: percurso.nome,
          distancia: percurso.distanciaKm,
        }
      : { percursoId: null },
  };
}

export async function listar(req, res) {
  const tempos = await Tempo.find({ usuarioId: req.usuarioId }).sort({ createdAt: -1 });
  res.json(tempos);
}

export async function criar(req, res) {
  const dados = camposDoBody(req.body ?? {});
  const erro = validar(dados);
  if (erro) return res.status(400).json({ erro });

  const resultado = await validarPercurso(dados);
  if (resultado.erro) return res.status(400).json({ erro: resultado.erro });
  Object.assign(dados, resultado.dados);

  const tempo = await Tempo.create({ ...dados, usuarioId: req.usuarioId });
  res.status(201).json(tempo);
}

export async function atualizar(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ erro: 'Tempo não encontrado.' });
  }

  const dados = camposDoBody(req.body ?? {});
  if (Object.keys(dados).length === 0) return res.status(400).json({ erro: 'Nenhum campo para atualizar.' });
  const erro = validar(dados, true);
  if (erro) return res.status(400).json({ erro });

  const tempo = await Tempo.findOne({ _id: req.params.id, usuarioId: req.usuarioId });
  if (!tempo) return res.status(404).json({ erro: 'Tempo não encontrado.' });

  if (dados.trajeto !== undefined || dados.percursoId !== undefined || dados.origem !== undefined) {
    const resultado = await validarPercurso({ ...tempo.toObject(), ...dados });
    if (resultado.erro) return res.status(400).json({ erro: resultado.erro });
    Object.assign(dados, resultado.dados);
  }

  Object.assign(tempo, dados);
  await tempo.save();
  res.json(tempo);
}

export async function excluir(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ erro: 'Tempo não encontrado.' });
  }

  const tempo = await Tempo.findOneAndDelete({ _id: req.params.id, usuarioId: req.usuarioId });
  if (!tempo) return res.status(404).json({ erro: 'Tempo não encontrado.' });
  res.status(204).end();
}

export async function melhoresPorPercurso(_req, res) {
  const tempos = await Tempo.find({ percursoId: { $type: 'string', $ne: '' } })
    .populate('usuarioId', 'nome')
    .lean();
  const melhores = new Map();

  for (const tempo of tempos) {
    const atual = melhores.get(tempo.percursoId);
    const segundos = paraSegundos(tempo.duracao);
    const criadoEm = new Date(tempo.createdAt).getTime();
    const atualCriadoEm = atual ? new Date(atual.createdAt).getTime() : Infinity;

    if (
      !atual ||
      segundos < paraSegundos(atual.duracao) ||
      (segundos === paraSegundos(atual.duracao) && criadoEm < atualCriadoEm)
    ) {
      melhores.set(tempo.percursoId, tempo);
    }
  }

  res.json(
    [...melhores.values()]
      .sort((a, b) => a.percursoId.localeCompare(b.percursoId))
      .map((tempo) => ({
        id: String(tempo._id),
        percursoId: tempo.percursoId,
        trajeto: tempo.trajeto,
        duracao: tempo.duracao,
        distancia: tempo.distancia,
        origem: tempo.origem,
        usuarioId: String(tempo.usuarioId?._id ?? tempo.usuarioId),
        ciclista: tempo.usuarioId?.nome ?? null,
        criadoEm: tempo.createdAt,
      })),
  );
}
