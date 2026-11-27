// Cria 3 usuários fictícios no MongoDB local (senha com hash) para testar
// match/chat/confronto/ranking com DUAS contas. Só para desenvolvimento.
//
// Uso (na pasta do backend):  node scripts/seed-usuarios.js
// A senha das contas fictícias vem de SEED_SENHA (padrão: "ciclaplus123").
import bcrypt from 'bcryptjs';
import env from '../config/env.js';
import { conectar, desconectar } from '../config/db.js';
import Usuario from '../models/Usuario.js';

if (env.producao) throw new Error('Seed de usuários fictícios não roda em produção.');

const senha = process.env.SEED_SENHA ?? 'ciclaplus123';
const fake = [
  { nome: 'Ana Beatriz', email: 'ana@ciclaplus.com', telefone: '(21) 99999-0001', dataNascimento: '1998-04-12' },
  { nome: 'Bruno Costa', email: 'bruno@ciclaplus.com', telefone: '(21) 99999-0002', dataNascimento: '1997-08-30' },
  { nome: 'Camila Rocha', email: 'camila@ciclaplus.com', telefone: '(21) 99999-0003', dataNascimento: '1999-01-05' },
];

await conectar();
const senhaHash = await bcrypt.hash(senha, env.BCRYPT_ROUNDS);
for (const dados of fake) {
  let u = await Usuario.findOne({ email: dados.email });
  if (!u) u = await Usuario.create({ ...dados, senhaHash, perfil: 'ciclista' });
  console.log(`${u.nome.padEnd(14)} ${u.email.padEnd(22)} ${u._id}`);
}
console.log(`Senha das contas fictícias: ${senha}`);
await desconectar();
