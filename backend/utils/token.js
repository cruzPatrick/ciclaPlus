import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export function gerarToken(usuario) {
  return jwt.sign({ sub: String(usuario._id), v: usuario.tokenVersao ?? 0 }, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: env.JWT_EXPIRES_IN,
  });
}
