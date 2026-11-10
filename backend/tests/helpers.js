import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js';
import env from '../config/env.js';
import Usuario from '../models/Usuario.js';
import Like from '../models/Like.js';
import Match from '../models/Match.js';
import Mensagem from '../models/Mensagem.js';
import Confronto from '../models/Confronto.js';
import Boost from '../models/Boost.js';
import { gerarToken } from '../utils/token.js';

export const API = '/api/v1';
export const MODELOS = [Usuario, Like, Match, Mensagem, Confronto, Boost];

// Conecta SOMENTE em banco com "test" no nome: os testes apagam coleções.
export async function conectarTeste() {
  await mongoose.connect(env.MONGODB_URI_TEST);
  assert.match(mongoose.connection.name, /test/, 'Use um banco com "test" no nome (MONGODB_URI_TEST).');
  await Promise.all(MODELOS.map((m) => m.init()));
}

export async function limparBanco() {
  assert.match(mongoose.connection.name, /test/);
  await Promise.all(MODELOS.map((m) => m.deleteMany({})));
}

export const bearer = (usuario) => ({ Authorization: `Bearer ${gerarToken(usuario)}` });

export function como(usuario) {
  const h = bearer(usuario);
  return {
    get: (url) => request(app).get(API + url).set(h),
    post: (url, corpo = {}) => request(app).post(API + url).set(h).send(corpo),
    patch: (url, corpo = {}) => request(app).patch(API + url).set(h).send(corpo),
    put: (url, corpo = {}) => request(app).put(API + url).set(h).send(corpo),
    delete: (url, corpo) => request(app).delete(API + url).set(h).send(corpo),
  };
}

export const anonimo = () => ({
  get: (url) => request(app).get(API + url),
  post: (url, corpo = {}) => request(app).post(API + url).send(corpo),
});
