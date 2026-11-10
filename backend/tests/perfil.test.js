import { describe, test, before, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js';
import Usuario from '../models/Usuario.js';
import Like from '../models/Like.js';
import Match from '../models/Match.js';
import Mensagem from '../models/Mensagem.js';
import Confronto from '../models/Confronto.js';
import Boost from '../models/Boost.js';
import { conectarTeste, limparBanco, como, anonimo, API } from './helpers.js';

const SENHA = 'senhaboa123';
let ana;
let bruno;
let tokenAna;

async function cadastrar(nome, email) {
  const r = await anonimo().post('/auth/cadastro', { nome, email, senha: SENHA });
  return { usuario: await Usuario.findById(r.body.usuario.id), token: r.body.token };
}

before(conectarTeste);
beforeEach(async () => {
  await limparBanco();
  ({ usuario: ana, token: tokenAna } = await cadastrar('Ana Beatriz', 'ana@teste.com'));
  ({ usuario: bruno } = await cadastrar('Bruno Costa', 'bruno@teste.com'));
});
after(() => mongoose.disconnect());

describe('GET /perfil', () => {
  test('exige autenticação', async () => {
    assert.equal((await anonimo().get('/perfil')).status, 401);
  });

  test('devolve só os meus dados, sem campos sensíveis', async () => {
    const r = await como(ana).get('/perfil');
    assert.equal(r.status, 200);
    assert.equal(r.body.email, 'ana@teste.com');
    for (const c of ['senha', 'senhaHash', 'tokenVersao', '_id']) assert.equal(c in r.body, false, c);
  });
});

describe('PATCH /perfil', () => {
  test('atualiza nome, telefone, nascimento, tipo de bike e foto', async () => {
    const r = await como(ana).patch('/perfil', {
      nome: 'Ana B.',
      telefone: '(21) 99999-0000',
      dataNascimento: '1998-04-12',
      tipoBike: 'Speed',
      foto: 'https://exemplo.com/ana.jpg',
    });
    assert.equal(r.status, 200);
    assert.equal(r.body.nome, 'Ana B.');
    assert.equal(r.body.tipoBike, 'Speed');
    assert.equal((await como(ana).get('/perfil')).body.foto, 'https://exemplo.com/ana.jpg');
  });

  test('null ou "" limpam campos opcionais', async () => {
    await como(ana).patch('/perfil', { tipoBike: 'MTB', foto: 'https://exemplo.com/a.jpg' });
    const r = await como(ana).patch('/perfil', { tipoBike: null, foto: '' });
    assert.equal(r.status, 200);
    assert.equal('tipoBike' in r.body, false);
    assert.equal('foto' in r.body, false);
  });

  test('campos protegidos não podem ser alterados (400) e nada é gravado', async () => {
    for (const corpo of [
      { email: 'novo@teste.com' },
      { perfil: 'admin' }, // só ciclista/equipe
      { senhaHash: 'x' },
      { senha: 'novasenha123' },
      { tokenVersao: 99 },
      { _id: String(bruno._id) },
      { id: String(bruno._id) },
      { nome: 'Ok', admin: true },
    ]) {
      const r = await como(ana).patch('/perfil', corpo);
      assert.equal(r.status, 400, JSON.stringify(corpo));
    }
    const depois = await Usuario.findById(ana._id).select('+senhaHash').lean();
    assert.equal(depois.email, 'ana@teste.com');
    assert.equal(depois.perfil, 'ciclista');
    assert.equal(depois.tokenVersao, 0);
  });

  test('alterna o perfil entre ciclista e equipe', async () => {
    const r = await como(ana).patch('/perfil', { perfil: 'equipe' });
    assert.equal(r.status, 200);
    assert.equal(r.body.perfil, 'equipe');
  });

  test('entradas inválidas são recusadas', async () => {
    for (const corpo of [
      {},
      { nome: '' },
      { nome: 'x'.repeat(101) },
      { foto: 'http://inseguro.com/a.jpg' },
      { foto: 'javascript:alert(1)' },
      { dataNascimento: '12/04/1998' },
      { nome: { $set: { perfil: 'equipe' } } },
      { tipoBike: ['a'] },
    ]) {
      assert.equal((await como(ana).patch('/perfil', corpo)).status, 400, JSON.stringify(corpo));
    }
  });

  test('IDOR: não há como alterar o perfil de outra pessoa (identidade vem do token)', async () => {
    const r = await como(ana).patch('/perfil', { nome: 'Hackeado' });
    assert.equal(r.status, 200);
    assert.equal((await Usuario.findById(bruno._id)).nome, 'Bruno Costa');
    // rotas com :id para escrita não existem
    assert.equal((await como(ana).patch(`/perfil/${bruno._id}`, { nome: 'X' })).status, 404);
    assert.equal((await como(ana).delete(`/perfil/${bruno._id}`, { senha: SENHA })).status, 404);
    assert.ok(await Usuario.findById(bruno._id));
  });
});

describe('GET /perfil/:id (público)', () => {
  test('mostra só dados públicos de outra pessoa', async () => {
    await como(bruno).patch('/perfil', { telefone: '(21) 98888-7777', tipoBike: 'Gravel' });
    const r = await como(ana).get(`/perfil/${bruno._id}`);
    assert.equal(r.status, 200);
    assert.deepEqual(Object.keys(r.body).sort(), ['id', 'nome', 'perfil', 'tipoBike']);
  });

  test('id malformado dá 400 e id inexistente dá 404', async () => {
    assert.equal((await como(ana).get('/perfil/123')).status, 400);
    assert.equal((await como(ana).get('/perfil/%7B%22$ne%22:1%7D')).status, 400);
    assert.equal((await como(ana).get(`/perfil/${new mongoose.Types.ObjectId()}`)).status, 404);
  });

  test('exige autenticação', async () => {
    assert.equal((await anonimo().get(`/perfil/${bruno._id}`)).status, 401);
  });
});

describe('PUT /perfil/senha', () => {
  test('troca a senha, entra com a nova e invalida o token antigo', async () => {
    const r = await como(ana).put('/perfil/senha', { senhaAtual: SENHA, novaSenha: 'outrasenha456' });
    assert.equal(r.status, 200);
    assert.ok(r.body.token);
    // token antigo morreu
    const antigo = await request(app).get(`${API}/perfil`).set('Authorization', `Bearer ${tokenAna}`);
    assert.equal(antigo.status, 401);
    // token novo funciona
    const novo = await request(app).get(`${API}/perfil`).set('Authorization', `Bearer ${r.body.token}`);
    assert.equal(novo.status, 200);
    // login: senha velha falha, nova funciona
    assert.equal((await anonimo().post('/auth/login', { email: 'ana@teste.com', senha: SENHA })).status, 401);
    assert.equal((await anonimo().post('/auth/login', { email: 'ana@teste.com', senha: 'outrasenha456' })).status, 200);
  });

  test('senha atual errada dá 403 e nada muda', async () => {
    const r = await como(ana).put('/perfil/senha', { senhaAtual: 'errada12345', novaSenha: 'outrasenha456' });
    assert.equal(r.status, 403);
    assert.equal((await anonimo().post('/auth/login', { email: 'ana@teste.com', senha: SENHA })).status, 200);
  });

  test('nova senha curta ou campos extras dão 400', async () => {
    assert.equal((await como(ana).put('/perfil/senha', { senhaAtual: SENHA, novaSenha: 'curta' })).status, 400);
    assert.equal((await como(ana).put('/perfil/senha', { senhaAtual: SENHA, novaSenha: 'outrasenha456', usuarioId: String(bruno._id) })).status, 400);
  });
});

describe('DELETE /perfil', () => {
  test('exige a senha correta', async () => {
    assert.equal((await como(ana).delete('/perfil', {})).status, 400);
    assert.equal((await como(ana).delete('/perfil', { senha: 'errada12345' })).status, 403);
    assert.ok(await Usuario.findById(ana._id));
  });

  test('apaga a conta e os dados ligados (likes, match, mensagens, confrontos, boost), preservando os de terceiros', async () => {
    const { usuario: carla } = await cadastrar('Carla', 'carla@teste.com');
    await Like.create([
      { de: ana._id, para: bruno._id, status: 'match' },
      { de: bruno._id, para: ana._id, status: 'match' },
      { de: bruno._id, para: carla._id, status: 'match' },
    ]);
    const m = await Match.create({ usuarioA: ana._id, usuarioB: bruno._id });
    const mOutro = await Match.create({ usuarioA: bruno._id, usuarioB: carla._id });
    await Mensagem.create([
      { matchId: m._id, usuarioA: ana._id, usuarioB: bruno._id, remetente: ana._id, texto: 'oi' },
      { matchId: mOutro._id, usuarioA: bruno._id, usuarioB: carla._id, remetente: bruno._id, texto: 'olá' },
    ]);
    await Confronto.create([
      { desafiante: ana._id, desafiado: bruno._id },
      { desafiante: bruno._id, desafiado: carla._id },
    ]);
    await Boost.create({ usuario: ana._id, fim: new Date(Date.now() + 60000) });

    const r = await como(ana).delete('/perfil', { senha: SENHA });
    assert.equal(r.status, 204);

    assert.equal(await Usuario.countDocuments({ _id: ana._id }), 0);
    assert.equal(await Like.countDocuments({ $or: [{ de: ana._id }, { para: ana._id }] }), 0);
    assert.equal(await Match.countDocuments({ _id: m._id }), 0);
    assert.equal(await Mensagem.countDocuments({ matchId: m._id }), 0);
    assert.equal(await Confronto.countDocuments({ $or: [{ desafiante: ana._id }, { desafiado: ana._id }] }), 0);
    assert.equal(await Boost.countDocuments({ usuario: ana._id }), 0);
    // dados que não envolvem a Ana continuam
    assert.equal(await Like.countDocuments({ de: bruno._id, para: carla._id }), 1);
    assert.equal(await Match.countDocuments({ _id: mOutro._id }), 1);
    assert.equal(await Mensagem.countDocuments({ matchId: mOutro._id }), 1);
    assert.equal(await Confronto.countDocuments({ desafiante: bruno._id, desafiado: carla._id }), 1);
  });

  test('depois de excluída, o token antigo e o login deixam de funcionar', async () => {
    await como(ana).delete('/perfil', { senha: SENHA });
    assert.equal((await request(app).get(`${API}/perfil`).set('Authorization', `Bearer ${tokenAna}`)).status, 401);
    assert.equal((await anonimo().post('/auth/login', { email: 'ana@teste.com', senha: SENHA })).status, 401);
  });

  test('a outra pessoa continua usando a API sem erro (sem órfãos nas listas)', async () => {
    await Confronto.create({ desafiante: ana._id, desafiado: bruno._id });
    await como(ana).delete('/perfil', { senha: SENHA });
    assert.equal((await como(bruno).get('/confrontos')).status, 200);
    assert.equal((await como(bruno).get('/matches')).status, 200);
  });
});
