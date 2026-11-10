import { Router } from 'express';
import bcrypt from 'bcryptjs';
import env from '../config/env.js';
import Usuario from '../models/Usuario.js';
import AppError from '../utils/AppError.js';
import { gerarToken } from '../utils/token.js';
import { validar } from '../middleware/validar.js';
import { cadastroSchema, loginSchema } from '../validators/auth.js';

const router = Router(); // montado em /auth

// Hash de uma senha qualquer: usado para o login gastar o mesmo tempo
// quando o e-mail não existe (dificulta descobrir e-mails cadastrados).
const HASH_FALSO = bcrypt.hashSync('senha-falsa-para-igualar-tempo', env.BCRYPT_ROUNDS);

// POST /auth/cadastro -> 201 { token, usuario }
router.post('/cadastro', validar(cadastroSchema), async (req, res) => {
  const { senha, ...dados } = req.validado.body;
  if (await Usuario.exists({ email: dados.email })) throw new AppError(409, 'E-mail já cadastrado.');
  const senhaHash = await bcrypt.hash(senha, env.BCRYPT_ROUNDS);
  let usuario;
  try {
    usuario = await Usuario.create({ ...dados, senhaHash });
  } catch (erro) {
    if (erro.code === 11000) throw new AppError(409, 'E-mail já cadastrado.'); // corrida entre dois cadastros
    throw erro;
  }
  res.status(201).json({ token: gerarToken(usuario), usuario });
});

// POST /auth/login -> { token, usuario }
router.post('/login', validar(loginSchema), async (req, res) => {
  const { email, senha } = req.validado.body;
  const usuario = await Usuario.findOne({ email }).select('+senhaHash');
  const confere = await bcrypt.compare(senha, usuario?.senhaHash ?? HASH_FALSO);
  if (!usuario || !confere) throw new AppError(401, 'E-mail ou senha inválidos.');
  res.json({ token: gerarToken(usuario), usuario });
});

export default router;
