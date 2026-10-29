import { Router } from 'express';
import Match from '../models/Match.js';
import Mensagem from '../models/Mensagem.js';

const router = Router(); // montado em /mensagens

// Chat.jsx compara mensagem.autor === "Você", então devolvemos "Você" para as
// minhas mensagens. "minha" fica disponível para quando limparem isso do front.
function paraCliente(m, eu) {
  const minha = String(m.remetente._id ?? m.remetente) === eu;
  return {
    id: m.id,
    matchId: String(m.matchId),
    texto: m.texto,
    autor: minha ? 'Você' : m.remetente.nome,
    minha,
    criadoEm: m.createdAt,
  };
}

// GET /mensagens?matchId=...
router.get('/', async (req, res) => {
  const eu = req.usuarioId;
  const match = await Match.doUsuario(req.query.matchId, eu);
  if (!match) return res.status(403).json({ erro: 'Sem acesso a esta conversa.' });

  const mensagens = await Mensagem.find({ matchId: match._id })
    .sort({ createdAt: 1 })
    .limit(300)
    .populate('remetente', 'nome');

  res.json(mensagens.map((m) => paraCliente(m, eu)));
});

// POST /mensagens   body: { matchId, texto }   (autor vem do header, não do body)
router.post('/', async (req, res) => {
  const eu = req.usuarioId;
  const { matchId, texto } = req.body ?? {};

  const match = await Match.doUsuario(matchId, eu);
  if (!match) return res.status(403).json({ erro: 'Sem match, sem chat.' });

  const limpo = String(texto ?? '').trim();
  if (!limpo || limpo.length > 1000) {
    return res.status(400).json({ erro: 'Mensagem vazia ou longa demais (máx. 1000).' });
  }

  const m = await Mensagem.create({ matchId: match._id, remetente: eu, texto: limpo });
  await m.populate('remetente', 'nome');
  res.status(201).json(paraCliente(m, eu));
});

export default router;
