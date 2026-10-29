// Testes de Match, Chat, Confronto, Desfazer match e Boost.
// Usam o MongoDB local, mas num banco SEPARADO (nome com "test"): nunca rode
// contra o banco da aplicação, porque cada teste apaga as coleções.
//
//   docker start ciclaplus-mongo
//   npm test
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

const URI = process.env.MONGODB_URI_TEST ?? 'mongodb://127.0.0.1:27018/ciclaplus_test';
const MODELOS = [Usuario, Like, Match, Mensagem, Confronto, Boost];

// Requisições feitas "como" um usuário (header x-usuario-id).
function como(usuario) {
  const id = String(usuario._id);
  const com = (req) => req.set('x-usuario-id', id);
  return {
    get: (url) => com(request(app).get(url)),
    post: (url, corpo = {}) => com(request(app).post(url)).send(corpo),
    patch: (url, corpo = {}) => com(request(app).patch(url)).send(corpo),
    delete: (url) => com(request(app).delete(url)),
  };
}

const idDe = (usuario) => String(usuario._id);
const idInexistente = () => String(new mongoose.Types.ObjectId());

let ana;
let bruno;
let camila;

// Match recíproco entre dois usuários; devolve o id do match.
async function darMatch(a, b) {
  await como(a).post(`/candidatos/${idDe(b)}/avaliar`, { status: 'match' });
  const resposta = await como(b).post(`/candidatos/${idDe(a)}/avaliar`, { status: 'match' });
  return resposta.body.matchId;
}

before(async () => {
  await mongoose.connect(URI);
  assert.match(
    mongoose.connection.name,
    /test/,
    'Os testes apagam dados: use um banco com "test" no nome (MONGODB_URI_TEST).',
  );
  await Promise.all(MODELOS.map((modelo) => modelo.init())); // garante os índices únicos
});

beforeEach(async () => {
  assert.match(mongoose.connection.name, /test/);
  await Promise.all(MODELOS.map((modelo) => modelo.deleteMany({})));
  [ana, bruno, camila] = await Usuario.create([
    { nome: 'Ana Beatriz', email: 'ana@teste.com', senha: '123456' },
    { nome: 'Bruno Costa', email: 'bruno@teste.com', senha: '123456' },
    { nome: 'Camila Rocha', email: 'camila@teste.com', senha: '123456' },
  ]);
});

after(async () => {
  await mongoose.disconnect();
});

describe('identificação do usuário', () => {
  test('sem o header x-usuario-id a API responde 401', async () => {
    const resposta = await request(app).get('/matches');
    assert.equal(resposta.status, 401);
  });

  test('id que não é um ObjectId responde 401', async () => {
    const resposta = await request(app).get('/matches').set('x-usuario-id', '123');
    assert.equal(resposta.status, 401);
  });
});

describe('Descoberta e match', () => {
  test('a fila não inclui o próprio usuário', async () => {
    const resposta = await como(ana).get('/candidatos');
    assert.equal(resposta.status, 200);
    assert.deepEqual(resposta.body.map((c) => c.id).sort(), [idDe(bruno), idDe(camila)].sort());
  });

  test('avaliar alguém tira a pessoa da fila', async () => {
    await como(ana).post(`/candidatos/${idDe(bruno)}/avaliar`, { status: 'passou' });
    const resposta = await como(ana).get('/candidatos');
    assert.deepEqual(resposta.body.map((c) => c.id), [idDe(camila)]);
  });

  test('match de um lado só não cria match', async () => {
    const resposta = await como(ana).post(`/candidatos/${idDe(bruno)}/avaliar`, { status: 'match' });
    assert.equal(resposta.status, 201);
    assert.equal(resposta.body.deuMatch, false);
    assert.deepEqual((await como(ana).get('/matches')).body, []);
    assert.deepEqual((await como(bruno).get('/matches')).body, []);
  });

  test('match recíproco cria o match para os dois lados', async () => {
    await como(ana).post(`/candidatos/${idDe(bruno)}/avaliar`, { status: 'match' });
    const resposta = await como(bruno).post(`/candidatos/${idDe(ana)}/avaliar`, { status: 'match' });
    assert.equal(resposta.body.deuMatch, true);

    const daAna = (await como(ana).get('/matches')).body;
    const doBruno = (await como(bruno).get('/matches')).body;
    assert.equal(daAna.length, 1);
    assert.equal(daAna[0].parceiroId, idDe(bruno));
    assert.equal(daAna[0].nome, 'Bruno Costa');
    assert.equal(doBruno.length, 1);
    assert.equal(doBruno[0].parceiroId, idDe(ana));
  });

  test('não deixa avaliar a mesma pessoa duas vezes', async () => {
    await como(ana).post(`/candidatos/${idDe(bruno)}/avaliar`, { status: 'passou' });
    const resposta = await como(ana).post(`/candidatos/${idDe(bruno)}/avaliar`, { status: 'match' });
    assert.equal(resposta.status, 409);
  });

  test('não deixa avaliar a si mesmo', async () => {
    const resposta = await como(ana).post(`/candidatos/${idDe(ana)}/avaliar`, { status: 'match' });
    assert.equal(resposta.status, 400);
  });

  test('status inválido responde 400 e candidato inexistente responde 404', async () => {
    const invalido = await como(ana).post(`/candidatos/${idDe(bruno)}/avaliar`, { status: 'talvez' });
    assert.equal(invalido.status, 400);
    const inexistente = await como(ana).post(`/candidatos/${idInexistente()}/avaliar`, { status: 'match' });
    assert.equal(inexistente.status, 404);
  });
});

describe('Chat', () => {
  test('sem match não existe chat', async () => {
    const resposta = await como(ana).post('/mensagens', { matchId: idInexistente(), texto: 'oi' });
    assert.equal(resposta.status, 403);
  });

  test('cada lado vê "Você" nas próprias mensagens e o nome do outro nas dele', async () => {
    const matchId = await darMatch(ana, bruno);
    const envio = await como(ana).post('/mensagens', { matchId, texto: 'Bora pedalar sábado?' });
    assert.equal(envio.status, 201);

    const naAna = (await como(ana).get(`/mensagens?matchId=${matchId}`)).body;
    assert.equal(naAna.length, 1);
    assert.equal(naAna[0].autor, 'Você');
    assert.equal(naAna[0].minha, true);

    const noBruno = (await como(bruno).get(`/mensagens?matchId=${matchId}`)).body;
    assert.equal(noBruno[0].autor, 'Ana Beatriz');
    assert.equal(noBruno[0].minha, false);
    assert.equal(noBruno[0].texto, 'Bora pedalar sábado?');
  });

  test('quem não faz parte do match não lê nem escreve', async () => {
    const matchId = await darMatch(ana, bruno);
    assert.equal((await como(camila).get(`/mensagens?matchId=${matchId}`)).status, 403);
    assert.equal((await como(camila).post('/mensagens', { matchId, texto: 'oi' })).status, 403);
  });

  test('mensagem vazia é recusada', async () => {
    const matchId = await darMatch(ana, bruno);
    const resposta = await como(ana).post('/mensagens', { matchId, texto: '   ' });
    assert.equal(resposta.status, 400);
  });
});

describe('Confronto', () => {
  test('só dá para desafiar quem deu match', async () => {
    const resposta = await como(ana).post('/confrontos', { adversarioId: idDe(bruno) });
    assert.equal(resposta.status, 403);
  });

  test('o status é traduzido para quem está olhando', async () => {
    await darMatch(ana, bruno);
    const criado = await como(ana).post('/confrontos', { adversarioId: idDe(bruno) });
    assert.equal(criado.status, 201);
    assert.equal(criado.body.status, 'pendente_aceite_adversario');

    const doBruno = (await como(bruno).get('/confrontos')).body;
    assert.equal(doBruno[0].status, 'pendente_meu_aceite');
    assert.equal(doBruno[0].adversario, 'Ana Beatriz');
  });

  test('o desafiante não aceita o próprio desafio', async () => {
    await darMatch(ana, bruno);
    const { body } = await como(ana).post('/confrontos', { adversarioId: idDe(bruno) });
    const resposta = await como(ana).patch(`/confrontos/${body.id}`, { status: 'confirmado' });
    assert.equal(resposta.status, 409);
  });

  test('não registra resultado antes do aceite nem resultado inválido', async () => {
    await darMatch(ana, bruno);
    const { body } = await como(ana).post('/confrontos', { adversarioId: idDe(bruno) });
    const cedo = await como(ana).patch(`/confrontos/${body.id}`, {
      status: 'resultado_registrado',
      resultado: 'Vitória',
    });
    assert.equal(cedo.status, 409);

    await como(bruno).patch(`/confrontos/${body.id}`, { status: 'confirmado' });
    const invalido = await como(ana).patch(`/confrontos/${body.id}`, {
      status: 'resultado_registrado',
      resultado: 'Talvez',
    });
    assert.equal(invalido.status, 400);
  });

  test('fluxo completo: aceite, resultado invertido para o outro lado e encerramento bilateral', async () => {
    await darMatch(ana, bruno);
    const { body } = await como(ana).post('/confrontos', { adversarioId: idDe(bruno) });
    const id = body.id;

    const aceite = await como(bruno).patch(`/confrontos/${id}`, { status: 'confirmado' });
    assert.equal(aceite.status, 200);
    assert.equal(aceite.body.status, 'confirmado');

    await como(ana).patch(`/confrontos/${id}`, { status: 'resultado_registrado', resultado: 'Vitória' });
    const naAna = (await como(ana).get('/confrontos')).body[0];
    const noBruno = (await como(bruno).get('/confrontos')).body[0];
    assert.equal(naAna.resultado, 'Vitória');
    assert.equal(naAna.euRegistrei, true);
    assert.equal(noBruno.resultado, 'Derrota');
    assert.equal(noBruno.euRegistrei, false);

    // Quem registrou não encerra; o adversário encerra.
    assert.equal((await como(ana).patch(`/confrontos/${id}`, { status: 'encerrado' })).status, 409);
    const encerrado = await como(bruno).patch(`/confrontos/${id}`, { status: 'encerrado' });
    assert.equal(encerrado.status, 200);
    assert.equal(encerrado.body.status, 'encerrado');

    const salvo = await Confronto.findById(id);
    assert.equal(String(salvo.vencedor), idDe(ana));
  });

  test('não permite dois confrontos abertos com a mesma pessoa', async () => {
    await darMatch(ana, bruno);
    await como(ana).post('/confrontos', { adversarioId: idDe(bruno) });
    const segundo = await como(bruno).post('/confrontos', { adversarioId: idDe(ana) });
    assert.equal(segundo.status, 409);
  });
});

describe('Desfazer match', () => {
  // Match + uma mensagem + um confronto entre Ana e Bruno.
  async function prepararHistorico() {
    const matchId = await darMatch(ana, bruno);
    await como(ana).post('/mensagens', { matchId, texto: 'oi' });
    await como(ana).post('/confrontos', { adversarioId: idDe(bruno) });
    return matchId;
  }

  test('sem opções, desfaz o match e mantém confrontos', async () => {
    const matchId = await prepararHistorico();
    const resposta = await como(ana).delete(`/matches/${matchId}`);
    assert.equal(resposta.status, 204);

    assert.deepEqual((await como(ana).get('/matches')).body, []);
    assert.deepEqual((await como(bruno).get('/matches')).body, []);
    assert.equal((await como(ana).get('/confrontos')).body.length, 1);
    assert.equal((await como(bruno).get('/confrontos')).body.length, 1);
  });

  test('sem opções, as mensagens ficam guardadas e voltam num novo match', async () => {
    const matchId = await prepararHistorico();
    await como(ana).delete(`/matches/${matchId}`);

    const novoMatchId = await darMatch(ana, bruno);
    assert.notEqual(novoMatchId, matchId);
    const mensagens = (await como(bruno).get(`/mensagens?matchId=${novoMatchId}`)).body;
    assert.equal(mensagens.length, 1);
    assert.equal(mensagens[0].texto, 'oi');
  });

  test('apagarMensagens=true apaga a conversa de vez', async () => {
    const matchId = await prepararHistorico();
    await como(ana).delete(`/matches/${matchId}?apagarMensagens=true`);

    const novoMatchId = await darMatch(ana, bruno);
    const mensagens = (await como(ana).get(`/mensagens?matchId=${novoMatchId}`)).body;
    assert.equal(mensagens.length, 0);
  });

  test('apagarConfrontos=true apaga o histórico para os dois lados', async () => {
    const matchId = await prepararHistorico();
    await como(bruno).delete(`/matches/${matchId}?apagarConfrontos=true`);

    assert.deepEqual((await como(ana).get('/confrontos')).body, []);
    assert.deepEqual((await como(bruno).get('/confrontos')).body, []);
  });

  test('as duas pessoas voltam para a fila da Descoberta', async () => {
    const matchId = await darMatch(ana, bruno);
    assert.deepEqual((await como(ana).get('/candidatos')).body.map((c) => c.id), [idDe(camila)]);

    await como(ana).delete(`/matches/${matchId}`);
    const filaAna = (await como(ana).get('/candidatos')).body.map((c) => c.id);
    const filaBruno = (await como(bruno).get('/candidatos')).body.map((c) => c.id);
    assert.ok(filaAna.includes(idDe(bruno)));
    assert.ok(filaBruno.includes(idDe(ana)));
  });

  test('quem não participa do match não consegue desfazê-lo', async () => {
    const matchId = await darMatch(ana, bruno);
    const resposta = await como(camila).delete(`/matches/${matchId}`);
    assert.equal(resposta.status, 404);
    assert.equal((await como(ana).get('/matches')).body.length, 1);
  });

  test('depois de desfeito, o outro lado perde o acesso à conversa', async () => {
    const matchId = await prepararHistorico();
    await como(ana).delete(`/matches/${matchId}`);
    assert.equal((await como(bruno).get(`/mensagens?matchId=${matchId}`)).status, 403);
  });
});

describe('Boost', () => {
  test('começa inativo, ativa e depois consulta como ativo', async () => {
    const antes = (await como(camila).get('/boost')).body;
    assert.equal(antes.ativo, false);
    assert.equal(antes.fim, null);

    const ativacao = await como(camila).post('/boost');
    assert.equal(ativacao.status, 201);
    assert.equal(ativacao.body.ativo, true);

    const depois = (await como(camila).get('/boost')).body;
    assert.equal(depois.ativo, true);
    assert.ok(new Date(depois.fim) > new Date());
  });

  test('não permite dois boosts ao mesmo tempo', async () => {
    await como(camila).post('/boost');
    const segundo = await como(camila).post('/boost');
    assert.equal(segundo.status, 409);
  });

  test('quem está com Boost aparece primeiro na fila dos outros', async () => {
    await como(camila).post('/boost');
    const fila = (await como(ana).get('/candidatos')).body;
    assert.equal(fila[0].id, idDe(camila));
    assert.equal(fila[0].emBoost, true);
    assert.equal(fila[1].emBoost, false);
  });
});
