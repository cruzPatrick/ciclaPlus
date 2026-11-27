import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';
import { API } from './helpers.js';

describe('infraestrutura', () => {
  test('rota inexistente responde 404 em JSON', async () => {
    const r = await request(app).get(`${API}/nao-existe`);
    assert.equal(r.status, 404);
    assert.ok(r.body.erro);
  });

  test('rota sem o prefixo /api/v1 não existe', async () => {
    assert.equal((await request(app).get('/matches')).status, 404);
  });

  test('JSON malformado responde 400 sem vazar detalhes internos', async () => {
    const r = await request(app).post(`${API}/auth/login`).set('Content-Type', 'application/json').send('{"email":');
    assert.equal(r.status, 400);
    assert.equal(r.body.erro, 'JSON inválido.');
    assert.equal(JSON.stringify(r.body).includes('at '), false);
  });

  test('corpo grande demais responde 413', async () => {
    const r = await request(app).post(`${API}/auth/login`).send({ email: 'a@a.com', senha: 'x'.repeat(60000) });
    assert.equal(r.status, 413);
  });

  test('headers de segurança do helmet e sem x-powered-by', async () => {
    const r = await request(app).get(`${API}/nao-existe`);
    assert.equal(r.headers['x-powered-by'], undefined);
    assert.equal(r.headers['x-content-type-options'], 'nosniff');
  });

  test('CORS: só a origem configurada recebe permissão', async () => {
    const ok = await request(app).get(`${API}/nao-existe`).set('Origin', 'http://localhost:5173');
    assert.equal(ok.headers['access-control-allow-origin'], 'http://localhost:5173');
    const ruim = await request(app).get(`${API}/nao-existe`).set('Origin', 'http://site-malicioso.com');
    assert.equal(ruim.headers['access-control-allow-origin'], undefined);
  });
});
