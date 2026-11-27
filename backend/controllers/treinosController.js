import mongoose from 'mongoose';
import Treino from '../models/Treino.js';

const CAMPOS = ['data', 'hora', 'tipo', 'parceiroOuEquipe', 'feito'];

function camposDoBody(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return {};
  return Object.fromEntries(CAMPOS.filter((campo) => campo in body).map((campo) => [campo, body[campo]]));
}

function validar(dados, parcial = false) {
  if (!parcial) {
    for (const campo of ['data', 'hora', 'tipo', 'parceiroOuEquipe']) {
      if (dados[campo] === undefined) return `${campo} é obrigatório.`;
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
  if (dados.feito !== undefined && typeof dados.feito !== 'boolean') {
    return 'feito deve ser booleano.';
  }

  return null;
}

export async function listar(req, res) {
  const treinos = await Treino.find({ usuarioId: req.usuarioId }).sort({ data: 1, hora: 1 });
  res.json(treinos);
}

export async function criar(req, res) {
  const dados = camposDoBody(req.body ?? {});
  const erro = validar(dados);
  if (erro) return res.status(400).json({ erro });

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

  const treino = await Treino.findOneAndUpdate(
    { _id: req.params.id, usuarioId: req.usuarioId },
    { $set: dados },
    { new: true, runValidators: true },
  );
  if (!treino) return res.status(404).json({ erro: 'Treino não encontrado.' });
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
