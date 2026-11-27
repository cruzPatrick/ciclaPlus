import Like from '../models/Like.js';
import Match from '../models/Match.js';
import Mensagem from '../models/Mensagem.js';
import Confronto from '../models/Confronto.js';
import Boost from '../models/Boost.js';

// Ao excluir uma conta, cada módulo apaga o que referencia o usuário.
// QUEM CRIAR UMA COLEÇÃO NOVA COM REFERÊNCIA A USUÁRIO deve registrar aqui uma
// função (usuarioId) => Promise. Sem isso sobram registros órfãos.
// Obs.: Confronto apagado remove a pontuação do adversário naquele confronto
// (o ranking é derivado dos confrontos encerrados).
const limpezas = [
  async (id) => {
    const matches = await Match.find({ $or: [{ usuarioA: id }, { usuarioB: id }] }).select('_id').lean();
    const ids = matches.map((m) => m._id);
    await Mensagem.deleteMany({
      $or: [{ usuarioA: id }, { usuarioB: id }, { remetente: id }, { matchId: { $in: ids } }],
    });
    await Match.deleteMany({ _id: { $in: ids } });
  },
  (id) => Like.deleteMany({ $or: [{ de: id }, { para: id }] }),
  (id) => Confronto.deleteMany({ $or: [{ desafiante: id }, { desafiado: id }] }),
  (id) => Boost.deleteMany({ usuario: id }),
];

export function registrarLimpezaConta(fn) {
  limpezas.push(fn);
}

export async function limparDadosDoUsuario(usuarioId) {
  for (const limpar of limpezas) await limpar(usuarioId);
}
