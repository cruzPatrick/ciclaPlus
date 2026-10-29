// Cria 3 usuários fictícios no MongoDB local e imprime os _id.
// Serve para testar match/chat/confronto com DUAS contas antes do login
// migrar para o Express. Ajuste os campos ao modelo Usuario da aplicação.
//
// Uso (na pasta do backend):  node scripts/seed-usuarios.js
import mongoose from 'mongoose';
import Usuario from '../models/Usuario.js'; // modelo de usuário da aplicação

const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/ciclaplus';

const fake = [
  { nome: 'Ana Beatriz', email: 'ana@ciclaplus.com', telefone: '(21) 99999-0001', dataNascimento: '1998-04-12' },
  { nome: 'Bruno Costa', email: 'bruno@ciclaplus.com', telefone: '(21) 99999-0002', dataNascimento: '1997-08-30' },
  { nome: 'Camila Rocha', email: 'camila@ciclaplus.com', telefone: '(21) 99999-0003', dataNascimento: '1999-01-05' },
];

await mongoose.connect(uri);
for (const dados of fake) {
  let u = await Usuario.findOne({ email: dados.email });
  if (!u) u = await Usuario.create({ ...dados, senha: '123456', perfil: 'ciclista' });
  console.log(`${u.nome.padEnd(14)} ${u._id}`);
}
await mongoose.disconnect();
