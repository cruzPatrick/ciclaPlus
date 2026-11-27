import mongoose from 'mongoose';
import Match from '../models/Match.js';
import Treino from '../models/Treino.js';
import Usuario from '../models/Usuario.js';

const CAMPOS = ['data', 'hora', 'tipo', 'parceiroOuEquipe', 'parceiroId', 'feito'];

function camposDoBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return {};
  return Object.fromEntries(CAMPOS.filter((campo) => campo in body).map((campo) => [campo, body[campo]]));
}

function validar(dados, parcial = false) {
  if (!parcial) {
    for (const campo of ['data', 'hora', 'tipo']) {
      if (dados[campo] === undefined) return `${campo} é obrigatório.`;
    }
    if (dados.tipo === 'individual' && dados.parceiroId === undefined) {
      return 'parceiroId é obrigatório para treino individual.';
    }
    if (dados.tipo === 'equipe' && dados.parceiroOuEquipe === undefined) {
      return 'parceiroOuEquipe é obrigatório para treino em equipe.';
    }
  }

  if (dados.data !== undefined && (typeof dados.data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dados.data))) {
    return 'data deve estar no formato AAAA-MM-DD.';
  }
  if (dados.hora !== undefined && (typeof dados.hora !== 'string' || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(dados.hora))) {
    return 'hora deve estar no formato HH:MM.';
  }
  if (dados.tipo !== undefined && !['individual', 'equipe'].includes(dados.tipo)) {
    return 'tipo deve ser "individual" ou "equipe".';
  }
  if (
    dados.parceiroOuEquipe !== undefined &&
    (typeof dados.parceiroOuEquipe !== 'string' || !dados.parceiroOuEquipe.trim())
  ) {
    return 'parceiroOuEquipe deve ser um texto não vazio.';
  }
  if (
    dados.parceiroId !== undefined &&
    dados.parceiroId !== null &&
    !mongoose.isValidObjectId(dados.parceiroId)
  ) {
    return 'parceiroId deve identificar um usuário válido.';
  }
  if (dados.tipo === 'individual' && dados.parceiroId === null) {
    return 'parceiroId é obrigatório para treino individual.';
  }
  if (dados.feito !== undefined && typeof dados.feito !== 'boolean') {
    return 'feito deve ser booleano.';
  }

  return null;
}

async function buscarParceiroAceito(parceiroId, usuarioId) {
  if (!mongoose.isValidObjectId(parceiroId) || String(parceiroId) === String(usuarioId)) {
    return { erro: 'Informe um parceiro válido para o treino individual.', status: 400 };
  }

  const [parceiro, match] = await Promise.all([
    Usuario.findById(parceiroId).select('nome').lean(),
    Match.entre(usuarioId, parceiroId),
  ]);
  if (!parceiro || !match) {
    return {
      erro: 'Treino individual só pode ser agendado com um parceiro que tenha match recíproco.',
      status: 403,
    };
  }
  return { parceiro };
}

export async function listar(req, res) {
  const treinos = await Treino.find({ usuarioId: req.usuarioId }).sort({ data: 1, hora: 1 });
  res.json(treinos);
}

export async function criar(req, res) {
  const dados = camposDoBody(req.body ?? {});
  const erro = validar(dados);
  if (erro) return res.status(400).json({ erro });

  if (dados.tipo === 'individual') {
    const resultado = await buscarParceiroAceito(dados.parceiroId, req.usuarioId);
    if (resultado.erro) return res.status(resultado.status).json({ erro: resultado.erro });
    dados.parceiroOuEquipe = resultado.parceiro.nome;
  } else {
    dados.parceiroId = null;
  }

  const treino = await Treino.create({ ...dados, usuarioId: req.usuarioId });
  res.status(201).json(treino);
}

export async function atualizar(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ erro: 'Treino não encontrado.' });
  }

  const dados = camposDoBody(req.body ?? {});
  if (Object.keys(dados).length === 0) return res.status(400).json({ erro: 'Nenhum campo para atualizar.' });
  const erro = validar(dados, true);
  if (erro) return res.status(400).json({ erro });

  const treino = await Treino.findOne({ _id: req.params.id, usuarioId: req.usuarioId });
  if (!treino) return res.status(404).json({ erro: 'Treino não encontrado.' });

  const tipoFinal = dados.tipo ?? treino.tipo;
  if (tipoFinal === 'individual') {
    const parceiroAlterado =
      dados.parceiroId !== undefined || (dados.tipo !== undefined && dados.tipo !== treino.tipo);
    if (dados.parceiroOuEquipe !== undefined && !parceiroAlterado) {
      return res.status(400).json({ erro: 'Use parceiroId para alterar o parceiro do treino.' });
    }
    if (parceiroAlterado) {
      const parceiroId =
        dados.parceiroId !== undefined
          ? dados.parceiroId
          : tipoFinal === treino.tipo
            ? treino.parceiroId
            : null;
      const resultado = await buscarParceiroAceito(parceiroId, req.usuarioId);
      if (resultado.erro) return res.status(resultado.status).json({ erro: resultado.erro });
      dados.parceiroId = resultado.parceiro._id;
      dados.parceiroOuEquipe = resultado.parceiro.nome;
    }
  } else {
    if (dados.tipo === 'equipe' && treino.tipo !== 'equipe' && dados.parceiroOuEquipe === undefined) {
      return res.status(400).json({ erro: 'parceiroOuEquipe é obrigatório para treino em equipe.' });
    }
    if (dados.tipo === 'equipe' || dados.parceiroId !== undefined) dados.parceiroId = null;
  }

  Object.assign(treino, dados);
  await treino.save();
  res.json(treino);
}

export async function excluir(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ erro: 'Treino não encontrado.' });
  }

  const treino = await Treino.findOneAndDelete({ _id: req.params.id, usuarioId: req.usuarioId });
  if (!treino) return res.status(404).json({ erro: 'Treino não encontrado.' });
  res.status(204).end();
}
