// Cria ou reutiliza um usuário de teste e imprime o id para x-usuario-id.
// Uso (na pasta backend): node seedTeste.js
import mongoose from 'mongoose';
import Usuario from './models/Usuario.js';
import Match, { parOrdenado } from './models/Match.js';

const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27018/ciclaplus';
const email = 'teste.frontend@ciclaplus.com';
const emailParceiro = 'parceiro.teste@ciclaplus.com';

try {
  await mongoose.connect(uri);

  let usuario = await Usuario.findOne({ email });
  if (!usuario) {
    usuario = await Usuario.create({
      nome: 'Teste Frontend',
      email,
      senha: '123456',
      perfil: 'ciclista',
    });
  }

  let parceiro = await Usuario.findOne({ email: emailParceiro });
  if (!parceiro) {
    parceiro = await Usuario.create({
      nome: 'Parceiro Teste',
      email: emailParceiro,
      senha: '123456',
      perfil: 'ciclista',
    });
  }

  if (!(await Match.entre(usuario._id, parceiro._id))) {
    const [usuarioA, usuarioB] = parOrdenado(usuario._id, parceiro._id);
    await Match.create({ usuarioA, usuarioB });
  }

  console.log(`x-usuario-id: ${usuario._id}`);
  console.log(`Parceiro de treino: ${parceiro.nome} (${parceiro._id})`);
} finally {
  await mongoose.disconnect();
}
