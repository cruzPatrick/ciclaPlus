import { describe, test, before, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import Usuario from '../models/Usuario.js';
import Confronto from '../models/Confronto.js';
import { conectarTeste, limparBanco, como, anonimo } from './helpers.js';

let ana, bruno, carla;
const encerrado = (venc, perd) => Confronto.create({ desafiante: venc._id, desafiado: perd._id, status: 'encerrado', vencedor: venc._id });

before(conectarTeste);
beforeEach(async () => {
  await limparBanco();
  [ana, bruno, carla] = await Usuario.create([
    { nome: 'Ana', email: 'ana@t.com' },
    { nome: 'Bruno', email: 'bruno@t.com' },
    { nome: 'Carla', email: 'carla@t.com' },
  ]);
});
after(() => mongoose.disconnect());

describe('GET /ranking', () => {
  test('exige autenticação', async () => {
    assert.equal((await anonimo().get('/ranking')).status, 401);
  });

  test('vazio quando não há confrontos encerrados', async () => {
    const r = await como(ana).get('/ranking');
    assert.equal(r.status, 200);
    assert.deepEqual(r.body, { itens: [], total: 0, pagina: 1, limite: 50 });
  });

  test('vencedor ganha 100 e perdedor 25, ordenado por pontuação', async () => {
    await encerrado(ana, bruno);
    await encerrado(ana, carla);
    await encerrado(bruno, carla);
    const r = await como(ana).get('/ranking');
    const resumo = r.body.itens.map((i) => [i.nome, i.pontuacao, i.vitorias, i.derrotas, i.posicao]);
    assert.deepEqual(resumo, [
      ['Ana', 200, 2, 0, 1],
      ['Bruno', 125, 1, 1, 2],
      ['Carla', 50, 0, 2, 3],
    ]);
    assert.equal(r.body.itens[0].souEu, true);
    assert.equal(r.body.itens[1].souEu, false);
  });

  test('só confrontos ENCERRADOS pontuam (pendente, confirmado e resultado registrado não)', async () => {
    for (const status of ['pendente', 'confirmado', 'resultado_registrado']) {
      await Confronto.create({ desafiante: ana._id, desafiado: bruno._id, status, vencedor: ana._id });
    }
    await Confronto.create({ desafiante: ana._id, desafiado: bruno._id, status: 'encerrado', vencedor: null }); // sem vencedor
    assert.equal((await como(ana).get('/ranking')).body.total, 0);
  });

  test('empate de pontuação divide a posição', async () => {
    await encerrado(ana, carla);
    await encerrado(bruno, carla);
    const posicoes = (await como(ana).get('/ranking')).body.itens.map((i) => [i.nome, i.posicao]);
    assert.deepEqual(posicoes, [['Ana', 1], ['Bruno', 1], ['Carla', 3]]);
  });

  test('paginação e validação dos parâmetros', async () => {
    await encerrado(ana, bruno);
    await encerrado(ana, carla);
    const p2 = await como(ana).get('/ranking?pagina=2&limite=1');
    assert.equal(p2.body.itens.length, 1);
    assert.equal(p2.body.total, 3);
    assert.equal((await como(ana).get('/ranking?limite=1000')).status, 400);
    assert.equal((await como(ana).get('/ranking?pagina=0')).status, 400);
    assert.equal((await como(ana).get('/ranking?pagina=abc')).status, 400);
    assert.equal((await como(ana).get('/ranking?pontuacao=999')).status, 400);
  });

  test('não há como gravar pontuação pela API de ranking', async () => {
    for (const metodo of ['post', 'put', 'patch']) {
      const r = await como(ana)[metodo]('/ranking', { usuarioId: String(ana._id), pontuacao: 99999 });
      assert.equal(r.status, 404);
    }
  });
});

describe('GET /ranking/eu', () => {
  test('sem confrontos: posição nula e zeros', async () => {
    const r = await como(ana).get('/ranking/eu');
    assert.equal(r.body.posicao, null);
    assert.equal(r.body.pontuacao, 0);
  });

  test('com confrontos: minha posição e pontos', async () => {
    await encerrado(ana, bruno);
    const r = await como(bruno).get('/ranking/eu');
    assert.equal(r.body.posicao, 2);
    assert.equal(r.body.pontuacao, 25);
  });
});
