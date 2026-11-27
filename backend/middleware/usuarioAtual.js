import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import env from '../config/env.js';
import Usuario from '../models/Usuario.js';
import AppError from '../utils/AppError.js';

// Autenticação ÚNICA da API. A identidade vem SOMENTE do token JWT
// (Authorization: Bearer <token>) e fica em req.usuarioId. Nunca confie em
// id vindo de body, query ou header para dizer "quem é o usuário".
export async function usuarioAtual(req, _res, next) {
  try {
    const [tipo, token] = (req.header('authorization') ?? '').split(' ');
    if (tipo !== 'Bearer' || !token) throw new AppError(401, 'Autenticação necessária.');

    let payload;
    try {
      payload = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
    } catch {
      throw new AppError(401, 'Sessão inválida ou expirada.');
    }
    if (!mongoose.isValidObjectId(payload.sub)) throw new AppError(401, 'Sessão inválida ou expirada.');

    const usuario = await Usuario.findById(payload.sub).select('tokenVersao').lean();
    if (!usuario) throw new AppError(401, 'Sessão inválida ou expirada.'); // conta apagada
    if ((payload.v ?? 0) !== (usuario.tokenVersao ?? 0)) {
      throw new AppError(401, 'Sessão inválida ou expirada.'); // senha trocada depois
    }
    req.usuarioId = String(usuario._id);
    next();
  } catch (erro) {
    next(erro);
  }
}
