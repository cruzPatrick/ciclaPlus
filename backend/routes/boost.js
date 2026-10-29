import { Router } from 'express';
import Boost from '../models/Boost.js';

const router = Router(); // montado em /boost

// PROPOSTA (confirmar com o grupo): boost dura 30 min e faz o usuário
// aparecer primeiro na Descoberta dos outros. Um por vez.
const DURACAO_MS = 30 * 60 * 1000;

const ativo = (usuario) => Boost.findOne({ usuario, fim: { $gt: new Date() } });

// GET /boost -> { ativo, fim }
router.get('/', async (req, res) => {
  const b = await ativo(req.usuarioId);
  res.json({ ativo: Boolean(b), fim: b ? b.fim : null });
});

// POST /boost -> ativa
router.post('/', async (req, res) => {
  if (await ativo(req.usuarioId)) {
    return res.status(409).json({ erro: 'Você já tem um boost ativo.' });
  }
  const b = await Boost.create({ usuario: req.usuarioId, fim: new Date(Date.now() + DURACAO_MS) });
  res.status(201).json({ ativo: true, fim: b.fim });
});

export default router;
