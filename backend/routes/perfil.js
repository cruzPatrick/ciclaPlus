import { Router } from 'express';
import bcrypt from 'bcryptjs';
import env from '../config/env.js';
import Usuario from '../models/Usuario.js';
import AppError from '../utils/AppError.js';
import { gerarToken } from '../utils/token.js';
import { validar } from '../middleware/validar.js';
import { limparDadosDoUsuario } from '../config/limpezaConta.js';
import { atualizarPerfilSchema, trocarSenhaSchema, excluirContaSchema, idParamSchema } from '../validators/perfil.js';

const router = Router(); // montado em /perfil (já atrás de usuarioAtual)

// A identidade é SEMPRE req.usuarioId (token). Nenhuma rota aqui aceita id
// de usuário no corpo; "/perfil/:id" é só leitura pública de outra pessoa.

// GET /perfil -> meus dados
router.get('/', async (req, res) => {
  const usuario = await Usuario.findById(req.usuarioId);
  if (!usuario) throw new AppError(404, 'Usuário não encontrado.');
  res.json(usuario);
});

// PATCH /perfil -> atualiza campos permitidos (e-mail e senha não passam por aqui)
router.patch('/', validar(atualizarPerfilSchema), async (req, res) => {
  const $set = {};
  const $unset = {};
  for (const [campo, valor] of Object.entries(req.validado.body)) {
    if (valor === null || valor === '') $unset[campo] = '';
    else $set[campo] = valor;
  }
  const alteracao = {};
  if (Object.keys($set).length) alteracao.$set = $set;
  if (Object.keys($unset).length) alteracao.$unset = $unset;
  // updateOne + findById (em vez de findByIdAndUpdate): funciona igual no MongoDB e no FerretDB.
  const { matchedCount } = await Usuario.updateOne({ _id: req.usuarioId }, alteracao, { runValidators: true });
  if (!matchedCount) throw new AppError(404, 'Usuário não encontrado.');
  res.json(await Usuario.findById(req.usuarioId));
});

// PUT /perfil/senha -> troca a senha; invalida os outros tokens e devolve um novo
router.put('/senha', validar(trocarSenhaSchema), async (req, res) => {
  const { senhaAtual, novaSenha } = req.validado.body;
  const usuario = await Usuario.findById(req.usuarioId).select('+senhaHash');
  if (!usuario) throw new AppError(404, 'Usuário não encontrado.');
  if (!(await bcrypt.compare(senhaAtual, usuario.senhaHash))) throw new AppError(403, 'Senha atual incorreta.');
  usuario.senhaHash = await bcrypt.hash(novaSenha, env.BCRYPT_ROUNDS);
  usuario.tokenVersao = (usuario.tokenVersao ?? 0) + 1;
  await usuario.save();
  res.json({ token: gerarToken(usuario) });
});

// DELETE /perfil { senha } -> exclui a conta e os dados ligados a ela
router.delete('/', validar(excluirContaSchema), async (req, res) => {
  const usuario = await Usuario.findById(req.usuarioId).select('+senhaHash');
  if (!usuario) throw new AppError(404, 'Usuário não encontrado.');
  if (!(await bcrypt.compare(req.validado.body.senha, usuario.senhaHash))) throw new AppError(403, 'Senha incorreta.');
  await limparDadosDoUsuario(usuario._id);
  await usuario.deleteOne();
  res.status(204).end();
});

// GET /perfil/:id -> dados PÚBLICOS de outra pessoa (sem e-mail, telefone, nascimento)
router.get('/:id', validar(idParamSchema, 'params'), async (req, res) => {
  const u = await Usuario.findById(req.validado.params.id).select('nome perfil tipoBike foto');
  if (!u) throw new AppError(404, 'Usuário não encontrado.');
  res.json(u);
});

export default router;
