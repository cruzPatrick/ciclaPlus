import { Router } from 'express';
import Match from '../models/Match.js';
import Mensagem from '../models/Mensagem.js';
import Confronto from '../models/Confronto.js';
import Like from '../models/Like.js';

const router = Router(); // montado em /matches

// GET /matches -> meus matches, no formato que Chat.jsx e Confronto.jsx já usam.
router.get('/', async (req, res) => {
  const eu = req.usuarioId;
  const matches = await Match.find({ $or: [{ usuarioA: eu }, { usuarioB: eu }] })
    .populate('usuarioA usuarioB', 'nome')
    .sort({ createdAt: -1 });

  res.json(
    matches.map((m) => {
      const outro = String(m.usuarioA._id) === eu ? m.usuarioB : m.usuarioA;
      return {
        id: m.id,
        parceiroId: String(outro._id), // use no select do Confronto
        nome: outro.nome,
        distanciaKm: null,
      };
    }),
  );
});

// DELETE /matches/:id?apagarMensagens=true&apagarConfrontos=true
// Sempre desfaz o match e as avaliações entre os dois (os dois voltam para a fila
// da Descoberta). O resto é opcional, escolhido por quem desfaz, e vale para os
// DOIS lados:
//  - apagarMensagens: apaga a conversa. Sem isso, as mensagens ficam guardadas e
//    voltam se os dois derem match de novo (ver routes/descoberta.js).
//  - apagarConfrontos: apaga todos os confrontos entre os dois (inclusive encerrados).
// Sem os parâmetros, nada além do match e das avaliações é apagado.
// O match é removido por último: se algo falhar no meio, dá para tentar de novo.
router.delete('/:id', async (req, res) => {
  const match = await Match.doUsuario(req.params.id, req.usuarioId);
  if (!match) return res.status(404).json({ erro: 'Match não encontrado.' });

  const apagarMensagens = req.query.apagarMensagens === 'true';
  const apagarConfrontos = req.query.apagarConfrontos === 'true';
  const a = match.usuarioA;
  const b = match.usuarioB;

  if (apagarMensagens) {
    await Mensagem.deleteMany({
      $or: [{ matchId: match._id }, { matchId: null, usuarioA: a, usuarioB: b }],
    });
  } else {
    // Guarda a conversa, ligada ao par de pessoas em vez de ao match.
    await Mensagem.updateMany(
      { matchId: match._id },
      { $set: { matchId: null, usuarioA: a, usuarioB: b } },
    );
  }

  if (apagarConfrontos) {
    await Confronto.deleteMany({
      $or: [
        { desafiante: a, desafiado: b },
        { desafiante: b, desafiado: a },
      ],
    });
  }

  await Like.deleteMany({
    $or: [
      { de: a, para: b },
      { de: b, para: a },
    ],
  });
  await match.deleteOne();

  res.status(204).end();
});

export default router;
