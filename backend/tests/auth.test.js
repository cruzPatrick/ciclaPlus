import { describe, test, before, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { criarApp } from '../app.js';
import Usuario from '../models/Usuario.js';
import env from '../config/env.js';
import { conectarTeste, limparBanco, anonimo, API } from './helpers.js';

const valido = { nome: 'Ana Beatriz', email: 'ana@teste.com', senha: 'senhaboa123' };

before(conectarTeste);
beforeEach(limparBanco);
after(() => mongoose.disconnect());

describe('cadastro', () => {
  test('cria usuário, devolve token e nunca devolve senha/hash', async () => {
    const r = await anonimo().post('/auth/cadastro', valido);
    assert.equal(r.status, 201);
    assert.ok(r.body.token);
    assert.equal(r.body.usuario.email, 'ana@teste.com');
    assert.equal(r.body.usuario.perfil, 'ciclista');
    assert.ok(r.body.usuario.id);
    for (const campo of ['senha', 'senhaHash', 'tokenVersao', '_id']) assert.equal(campo in r.body.usuario, false, campo);
  });

  test('a senha é guardada com hash, nunca em texto', async () => {
    await anonimo().post('/auth/cadastro', valido);
    const u = await Usuario.findOne({ email: 'ana@teste.com' }).select('+senhaHash').lean();
    assert.notEqual(u.senhaHash, valido.senha);
    assert.match(u.senhaHash, /^\$2[aby]\$/);
  });

  test('e-mail duplicado (mesmo com outra caixa) responde 409', async () => {
    await anonimo().post('/auth/cadastro', valido);
    const r = await anonimo().post('/auth/cadastro', { ...valido, email: 'ANA@teste.com' });
    assert.equal(r.status, 409);
  });

  test('rejeita dados inválidos com 400', async () => {
    const casos = [
      { ...valido, senha: '1234567' }, // curta
      { ...valido, email: 'nao-e-email' },
      { ...valido, nome: ' ' },
      { ...valido, dataNascimento: '2999-01-01' },
      { ...valido, dataNascimento: '2020-02-31' },
      { ...valido, perfil: 'admin' },
      { ...valido, senha: 'x'.repeat(73) },
      { ...valido, extra: 'campo desconhecido' },
      { ...valido, email: { $ne: null } }, // injeção de operador
      { ...valido, nome: { $gt: '' } },
    ];
    for (const corpo of casos) {
      const r = await anonimo().post('/auth/cadastro', corpo);
      assert.equal(r.status, 400, JSON.stringify(corpo));
    }
    assert.equal(await Usuario.countDocuments(), 0);
  });
});

describe('login', () => {
  beforeEach(() => anonimo().post('/auth/cadastro', valido));

  test('com credenciais corretas devolve token válido para /perfil', async () => {
    const r = await anonimo().post('/auth/login', { email: 'Ana@Teste.com', senha: valido.senha });
    assert.equal(r.status, 200);
    const eu = await request((await import('../app.js')).default).get(`${API}/perfil`).set('Authorization', `Bearer ${r.body.token}`);
    assert.equal(eu.status, 200);
    assert.equal(eu.body.email, 'ana@teste.com');
  });

  test('senha errada e e-mail inexistente dão a MESMA resposta 401', async () => {
    const a = await anonimo().post('/auth/login', { email: 'ana@teste.com', senha: 'errada123' });
    const b = await anonimo().post('/auth/login', { email: 'ninguem@teste.com', senha: 'errada123' });
    assert.equal(a.status, 401);
    assert.equal(b.status, 401);
    assert.deepEqual(a.body, b.body);
  });

  test('injeção de operador no login é rejeitada (400)', async () => {
    const r = await anonimo().post('/auth/login', { email: { $ne: '' }, senha: { $ne: '' } });
    assert.equal(r.status, 400);
  });
});

describe('token', () => {
  test('token expirado, assinado com outro segredo ou sem "sub" válido dá 401', async () => {
    const { body } = await anonimo().post('/auth/cadastro', valido);
    const id = body.usuario.id;
    const app = (await import('../app.js')).default;
    const tokens = [
      jwt.sign({ sub: id, v: 0 }, env.JWT_SECRET, { expiresIn: -10 }),
      jwt.sign({ sub: id, v: 0 }, 'outro-segredo-qualquer-com-mais-de-32-caracteres'),
      jwt.sign({ sub: 'nao-e-id', v: 0 }, env.JWT_SECRET),
      jwt.sign({ sub: id, v: 0 }, '', { algorithm: 'none' }),
    ];
    for (const t of tokens) {
      const r = await request(app).get(`${API}/perfil`).set('Authorization', `Bearer ${t}`);
      assert.equal(r.status, 401);
    }
  });
});

describe('rate limit do login/cadastro', () => {
  test('excedido o limite responde 429', async () => {
    const pequeno = criarApp({ limiteAuth: 3 });
    const status = [];
    for (let i = 0; i < 5; i++) {
      status.push((await request(pequeno).post(`${API}/auth/login`).send({ email: 'a@a.com', senha: 'x' })).status);
    }
    assert.deepEqual(status, [401, 401, 401, 429, 429]);
  });
});
