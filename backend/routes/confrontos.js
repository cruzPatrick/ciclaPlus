import { Router } from 'express';
import mongoose from 'mongoose';
import Match from '../models/Match.js';
import Confronto from '../models/Confronto.js';

const router = Router(); // montado em /confrontos

const inverter = (r) => (r === 'Vitória' ? 'Derrota' : r === 'Derrota' ? 'Vitória' : r);

// Traduz o confronto para quem está olhando. Só devolve os 5 status que o
// Confronto.jsx conhece (STATUS[...] quebra a tela se vier outro valor).
function paraCliente(c, eu) {
  const souDesafiante = String(c.desafiante._id) === eu;
  const outro = souDesafiante ? c.desafiado : c.desafiante;
  const euRegistrei = Boolean(c.registradoPor) && String(c.registradoPor) === eu;

  let status = c.status;
  if (status === 'pendente') {
    status = souDesafiante ? 'pendente_aceite_adversario' : 'pendente_meu_aceite';
  }

  let resultado = c.resultado ?? null;
  if (resultado && !euRegistrei) resultado = inverter(resultado);

  return {
    id: c.id,
    adversario: outro.nome,
    status,
    resultado,
    euRegistrei, // o front esconde o botão "Encerrar" para quem registrou
    criadoEm: c.createdAt,
  };
}

const populate = (q) => q.populate('desafiante desafiado', 'nome');

// GET /confrontos
router.get('/', async (req, res) => {
  const eu = req.usuarioId;
  const lista = await populate(
    Confronto.find({ $or: [{ desafiante: eu }, { desafiado: eu }] }).sort({ createdAt: -1 }),
  );
  res.json(lista.map((c) => paraCliente(c, eu)));
});

// POST /confrontos   body: { adversarioId }  (id do usuário do match: "parceiroId")
router.post('/', async (req, res) => {
  const eu = req.usuarioId;
  const { adversarioId } = req.body ?? {};

  if (!mongoose.isValidObjectId(adversarioId) || adversarioId === eu) {
    return res.status(400).json({ erro: 'Adversário inválido.' });
  }
  if (!(await Match.entre(eu, adversarioId))) {
    return res.status(403).json({ erro: 'Só é possível desafiar quem deu match com você.' });
  }
  const aberto = await Confronto.exists({
    status: { $ne: 'encerrado' },
    $or: [
      { desafiante: eu, desafiado: adversarioId },
      { desafiante: adversarioId, desafiado: eu },
    ],
  });
  if (aberto) return res.status(409).json({ erro: 'Já existe um confronto em aberto com essa pessoa.' });

  const c = await Confronto.create({ desafiante: eu, desafiado: adversarioId });
  await c.populate('desafiante desafiado', 'nome');
  res.status(201).json(paraCliente(c, eu));
});

// PATCH /confrontos/:id   body: { status, resultado? }
//  confirmado            -> só o desafiado aceita (a partir de pendente)
//  resultado_registrado  -> qualquer um dos dois, a partir de confirmado
//  encerrado             -> só quem NÃO registrou o resultado (dupla confirmação)
router.patch('/:id', async (req, res) => {
  const eu = req.usuarioId;
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ erro: 'Não encontrado.' });

  const c = await populate(Confronto.findById(req.params.id));
  const participa =
    c && [String(c.desafiante._id), String(c.desafiado._id)].includes(eu);
  if (!participa) return res.status(404).json({ erro: 'Confronto não encontrado.' });

  const { status, resultado } = req.body ?? {};
  const souDesafiante = String(c.desafiante._id) === eu;

  if (status === 'confirmado') {
    if (c.status !== 'pendente' || souDesafiante) {
      return res.status(409).json({ erro: 'Só o desafiado pode aceitar um confronto pendente.' });
    }
    c.status = 'confirmado';
  } else if (status === 'resultado_registrado') {
    if (c.status !== 'confirmado') return res.status(409).json({ erro: 'Confronto não está autorizado.' });
    if (!['Vitória', 'Derrota'].includes(resultado)) {
      return res.status(400).json({ erro: 'resultado deve ser "Vitória" ou "Derrota".' });
    }
    c.status = 'resultado_registrado';
    c.resultado = resultado;
    c.registradoPor = eu;
  } else if (status === 'encerrado') {
    if (c.status !== 'resultado_registrado' || String(c.registradoPor) === eu) {
      return res.status(409).json({ erro: 'Quem confirma o encerramento é o adversário de quem registrou.' });
    }
    // Quem encerra é sempre o adversário de quem registrou: se o registrador
    // marcou Vitória, ele venceu; se marcou Derrota, quem encerra (eu) venceu.
    c.vencedor = c.resultado === 'Vitória' ? c.registradoPor : eu;
    c.status = 'encerrado';
  } else {
    return res.status(400).json({ erro: 'status inválido.' });
  }

  await c.save();
  res.json(paraCliente(c, eu));
});

export default router;
