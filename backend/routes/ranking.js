import { Router } from 'express';
import Confronto from '../models/Confronto.js';
import Usuario from '../models/Usuario.js';
import { validar } from '../middleware/validar.js';
import { rankingQuerySchema } from '../validators/ranking.js';

const router = Router(); // montado em /ranking

// REGRA (decidida pelo grupo): vencedor de confronto encerrado = 100 pontos,
// perdedor = 25. O ranking é DERIVADO dos confrontos: ninguém grava pontuação,
// então não há como forjá-la por esta API. Confronto sem vencedor não pontua.
export const PONTOS_VITORIA = 100;
export const PONTOS_DERROTA = 25;

async function calcularRanking() {
  const confrontos = await Confronto.find({ status: 'encerrado', vencedor: { $ne: null } })
    .select('desafiante desafiado vencedor')
    .lean();
  const placar = new Map();
  const conta = (id, campo) => {
    const chave = String(id);
    const p = placar.get(chave) ?? { usuarioId: chave, vitorias: 0, derrotas: 0 };
    p[campo] += 1;
    placar.set(chave, p);
  };
  for (const c of confrontos) {
    const venceu = String(c.vencedor);
    const perdeu = String(c.desafiante) === venceu ? c.desafiado : c.desafiante;
    conta(venceu, 'vitorias');
    conta(perdeu, 'derrotas');
  }
  const usuarios = await Usuario.find({ _id: { $in: [...placar.keys()] } }).select('nome tipoBike foto').lean();
  const porId = new Map(usuarios.map((u) => [String(u._id), u]));

  const lista = [...placar.values()]
    .filter((p) => porId.has(p.usuarioId))
    .map((p) => ({
      ...p,
      nome: porId.get(p.usuarioId).nome,
      tipoBike: porId.get(p.usuarioId).tipoBike ?? null,
      foto: porId.get(p.usuarioId).foto ?? null,
      pontuacao: p.vitorias * PONTOS_VITORIA + p.derrotas * PONTOS_DERROTA,
    }))
    .sort((a, b) => b.pontuacao - a.pontuacao || b.vitorias - a.vitorias || a.nome.localeCompare(b.nome, 'pt-BR') || a.usuarioId.localeCompare(b.usuarioId));
  // Empates de pontuação dividem a mesma posição.
  lista.forEach((item, i) => {
    item.posicao = i > 0 && lista[i - 1].pontuacao === item.pontuacao ? lista[i - 1].posicao : i + 1;
  });
  return lista;
}

// GET /ranking?pagina=1&limite=50 -> { itens, total, pagina, limite }
router.get('/', validar(rankingQuerySchema, 'query'), async (req, res) => {
  const { pagina, limite } = req.validado.query;
  const lista = await calcularRanking();
  const itens = lista.slice((pagina - 1) * limite, pagina * limite).map((i) => ({ ...i, souEu: i.usuarioId === req.usuarioId }));
  res.json({ itens, total: lista.length, pagina, limite });
});

// GET /ranking/eu -> minha posição (posicao null se ainda não tenho confrontos encerrados)
router.get('/eu', async (req, res) => {
  const lista = await calcularRanking();
  const meu = lista.find((i) => i.usuarioId === req.usuarioId);
  res.json(meu ?? { usuarioId: req.usuarioId, posicao: null, vitorias: 0, derrotas: 0, pontuacao: 0 });
});

export default router;
