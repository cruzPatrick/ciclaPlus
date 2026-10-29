# CiclaPlus — módulo de Match, Chat, Boost e Confronto (M2)

> **Situação:** a API roda **em paralelo** ao app. O app React continua usando o
> json-server (`npm run mock`) nesses módulos. Ligar o frontend a esta API
> depende de migrar usuários e login para o MongoDB (ver `mudancas/backlog.md`).
> Enquanto isso, a API é exercitada pelos testes automatizados e pelo arquivo
> `teste-duas-contas.http`.

API Express + MongoDB local, dados fictícios (escopo do M2: sem usuários reais,
GPS ou pagamento).

## Como plugar no servidor da aplicação

1. Copie `models/`, `routes/` e `middleware/` para a pasta do backend.
2. Dependências: `express` (v5), `mongoose`, `cors`.
3. No servidor, depois de `express.json()` e `cors()` (neste pacote isso já está pronto em `app.js`):

   ```js
   import rotasRelacionamento from './routes/index.js';
   app.use(rotasRelacionamento);
   ```
4. O modelo `Usuario` da aplicação precisa de `nome`; `tipoBike` é opcional.
5. Variável de ambiente: `MONGODB_URI` (padrão `mongodb://127.0.0.1:27017/ciclaplus`).

## Identificação do usuário (provisório)

Toda rota exige o header `x-usuario-id` com o `_id` do usuário no Mongo. O
frontend, quando for ligado à API, enviará o id guardado em `localStorage`
(`ciclaplus.usuarioId`). Quando o JWT existir, troque só `middleware/usuarioAtual.js`.

## Rotas

| Método e caminho | O que faz |
|---|---|
| `GET /candidatos` | Quem ainda não avaliei (com Boost primeiro) |
| `POST /candidatos/:id/avaliar` `{status}` | `match` ou `passou`; devolve `{deuMatch, matchId}` |
| `GET /matches` | Meus matches (`id`, `parceiroId`, `nome`) |
| `DELETE /matches/:id?apagarMensagens=&apagarConfrontos=` | Desfaz o match e as avaliações; mensagens e confrontos só são apagados se pedido (`true`) |
| `GET /mensagens?matchId=` | Conversa (só participantes) |
| `POST /mensagens` `{matchId, texto}` | Envia (exige match) |
| `GET /confrontos` | Meus confrontos, com status visto por mim |
| `POST /confrontos` `{adversarioId}` | Desafia (exige match, sem confronto aberto) |
| `PATCH /confrontos/:id` `{status, resultado?}` | `confirmado`, `resultado_registrado`, `encerrado` |
| `GET /boost` / `POST /boost` | Consulta / ativa (30 min) |

## Regras

- Match só existe quando as duas pessoas deram match uma na outra.
- Chat só entre quem tem match.
- Confronto: o desafiado aceita; qualquer um registra o resultado; quem NÃO
  registrou confirma o encerramento. O resultado aparece invertido para o outro lado.
- Boost: prioridade na fila de sugestões, sem cobrança.
- Desfazer match sempre remove o match e devolve as duas pessoas à fila da Descoberta. Apagar o histórico de mensagens e/ou de confrontos é opcional (escolha de quem desfaz) e vale para os dois lados.
- Se as mensagens NÃO forem apagadas, ficam guardadas e a conversa volta caso os dois deem match de novo.

## Testar com duas contas

1. Suba o Mongo e a API (`docker start ciclaplus-mongo`, depois `npm start`).
2. `node scripts/seed-usuarios.js` imprime os `_id` de três usuários.
3. Abra `teste-duas-contas.http` (extensão REST Client do VS Code), troque `@A` e
   `@B` pelos ids e execute as requisições em ordem: match recíproco, chat,
   confronto até o encerramento, desfazer match e Boost.
4. Ou rode `npm test`, que cobre esse mesmo fluxo de forma automática.

## Estrutura da pasta

```
backend/
  app.js                   -> monta o Express (cors, json, rotas); usado pelo servidor e pelos testes
  server.js                -> conecta no MongoDB e abre a porta (3000)
  middleware/usuarioAtual.js
  models/                  -> Usuario, Like, Match, Mensagem, Confronto, Boost
  routes/                  -> descoberta, matches, mensagens, confrontos, boost (+ index.js)
  scripts/seed-usuarios.js -> cria 3 usuários fictícios
  tests/relacionamento.test.js
```

## Scripts (`package.json`)

```json
"type": "module",
"scripts": {
  "start": "node server.js",
  "test": "node --test \"tests/**/*.test.js\""
}
```

## Testes automatizados

Usam o executor nativo do Node (`node --test`) e o `supertest`, contra o MongoDB
local em um banco **separado** (`ciclaplus_test`). Cada teste apaga as coleções,
por isso o teste se recusa a rodar se o nome do banco não tiver "test".

```bash
docker start ciclaplus-mongo
npm install -D supertest   # uma vez
npm test
```

Para usar outro banco de teste: `MONGODB_URI_TEST=mongodb://127.0.0.1:27018/outro_test`.

Cobertura: identificação por header, Descoberta e match recíproco, Chat (acesso só
para quem tem match e rótulos de autor), Confronto (status por lado, resultado
invertido, encerramento bilateral, vencedor), Desfazer match (opções de apagar,
volta das mensagens num novo match, retorno à fila) e Boost.

O modelo `Usuario` usado nos testes precisa aceitar `nome`, `email` e `senha`
como campos mínimos.
