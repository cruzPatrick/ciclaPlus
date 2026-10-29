import { Router } from 'express';
import mongoose from 'mongoose';
import Usuario from '../models/Usuario.js'; // modelo de usuário (precisa de "nome"; "tipoBike" é opcional)
import Like from '../models/Like.js';
import Match, { parOrdenado } from '../models/Match.js';
import Mensagem from '../models/Mensagem.js';
import Boost from '../models/Boost.js';

const router = Router(); // montado em /candidatos

// GET /candidatos -> outros usuários que eu ainda não avaliei.
// Quem está com boost ativo aparece primeiro.
router.get('/', async (req, res) => {
  const eu = req.usuarioId;
  const avaliados = await Like.find({ de: eu }).distinct('para');
  const comBoost = new Set(
    (await Boost.find({ fim: { $gt: new Date() } }).distinct('usuario')).map(String),
  );

  const usuarios = await Usuario.find({ _id: { $nin: [eu, ...avaliados] } })
    .select('nome tipoBike')
    .lean();

  usuarios.sort(
    (a, b) => Number(comBoost.has(String(b._id))) - Number(comBoost.has(String(a._id))),
  );

  res.json(
    usuarios.map((u) => ({
      id: String(u._id),
      nome: u.nome,
      tipo: u.tipoBike ?? 'Ciclista',
      distanciaKm: null, // o cadastro ainda não tem localização
      emBoost: comBoost.has(String(u._id)),
    })),
  );
});

// POST /candidatos/:id/avaliar   body: { status: "match" | "passou" }
router.post('/:id/avaliar', async (req, res) => {
  const eu = req.usuarioId;
  const alvo = req.params.id;
  const { status } = req.body ?? {};

  if (!mongoose.isValidObjectId(alvo) || alvo === eu) {
    return res.status(400).json({ erro: 'Candidato inválido.' });
  }
  if (!['match', 'passou'].includes(status)) {
    return res.status(400).json({ erro: 'status deve ser "match" ou "passou".' });
  }
  if (!(await Usuario.exists({ _id: alvo }))) {
    return res.status(404).json({ erro: 'Candidato não encontrado.' });
  }

  try {
    await Like.create({ de: eu, para: alvo, status });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ erro: 'Você já avaliou este ciclista.' });
    throw e;
  }

  let match = null;
  if (status === 'match' && (await Like.exists({ de: alvo, para: eu, status: 'match' }))) {
    const [usuarioA, usuarioB] = parOrdenado(eu, alvo);
    try {
      match = await Match.create({ usuarioA, usuarioB });
      // Se o match anterior foi desfeito SEM apagar as mensagens, a conversa volta.
      await Mensagem.updateMany(
        { matchId: null, usuarioA, usuarioB },
        { $set: { matchId: match._id }, $unset: { usuarioA: '', usuarioB: '' } },
      );
    } catch (e) {
      if (e.code !== 11000) throw e;
      match = await Match.entre(eu, alvo);
    }
  }

  res.status(201).json({ deuMatch: Boolean(match), matchId: match ? match.id : null });
});

export default router;
