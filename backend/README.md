# CiclaPlus — API (Express 5 + MongoDB)

API local com dados fictícios (escopo do M2: sem GPS ou pagamento). Cobre
**autenticação, perfil, ranking**, Match, Chat, Confronto e Boost. Prefixo de todas
as rotas: **`/api/v1`**. Respostas de erro: `{ "erro": "mensagem", "detalhes"?: [...] }`.

## Rodar

```bash
docker run -d --name ciclaplus-mongo -p 27018:27017 -v ciclaplus-mongo-data:/data/db mongo   # 1ª vez
npm install
cp .env.example .env     # defina JWT_SECRET (mín. 32 caracteres; comando no próprio arquivo)
npm start                # http://localhost:3000/api/v1
npm test                 # banco "ciclaplus_test" (porta 27018)
node scripts/seed-usuarios.js   # 3 contas fictícias (senha em SEED_SENHA, padrão ciclaplus123)
```

## Variáveis de ambiente (`.env.example`)

`NODE_ENV`, `PORT` (3000), `MONGODB_URI` (`mongodb://127.0.0.1:27018/ciclaplus`),
`MONGODB_URI_TEST`, `JWT_SECRET` (obrigatório em produção), `JWT_EXPIRES_IN` (7d),
`BCRYPT_ROUNDS` (10), `CORS_ORIGINS` (`http://localhost:5173`), `RATE_LIMIT_GERAL`
(300/15 min), `RATE_LIMIT_AUTH` (10/15 min). Configuração inválida impede o start.

## Autenticação

`POST /auth/cadastro` e `POST /auth/login` devolvem `{ token, usuario }`. As demais
rotas exigem `Authorization: Bearer <token>`; a identidade vem **só do token**.
Trocar a senha invalida os tokens antigos; excluir a conta também.

## Rotas

| Método e caminho | O que faz |
|---|---|
| `POST /auth/cadastro` `{nome,email,senha,telefone?,dataNascimento?,perfil?}` | Cria conta (senha ≥ 8) → 201 |
| `POST /auth/login` `{email,senha}` | Entra → `{token, usuario}` |
| `GET /perfil` | Meus dados |
| `PATCH /perfil` `{nome?,telefone?,dataNascimento?,tipoBike?,foto?,perfil?}` | Atualiza (`null`/`""` limpam opcionais; foto = URL https) |
| `PUT /perfil/senha` `{senhaAtual,novaSenha}` | Troca a senha e devolve token novo |
| `DELETE /perfil` `{senha}` | Exclui a conta e os dados ligados a ela → 204 |
| `GET /perfil/:id` | Dados públicos de outra pessoa (nome, perfil, bike, foto) |
| `GET /ranking?pagina=&limite=` | Ranking geral: `{itens,total,pagina,limite}` |
| `GET /ranking/eu` | Minha posição e pontos |
| `GET /candidatos` | Quem ainda não avaliei (com Boost primeiro) |
| `POST /candidatos/:id/avaliar` `{status}` | `match` ou `passou`; devolve `{deuMatch, matchId}` |
| `GET /matches` | Meus matches |
| `DELETE /matches/:id?apagarMensagens=&apagarConfrontos=` | Desfaz o match |
| `GET /mensagens?matchId=` / `POST /mensagens` | Conversa / envia (exige match) |
| `GET /confrontos` / `POST /confrontos` / `PATCH /confrontos/:id` | Fluxo de confronto |
| `GET /boost` / `POST /boost` | Consulta / ativa (30 min) |

## Regras

- **Ranking** é derivado dos confrontos `encerrado` com `vencedor`: vitória 100, derrota
  25 (`encerrado` ≡ `resultado_confirmado` do app). Ninguém grava pontuação.
- **Excluir conta** apaga likes, matches, mensagens, confrontos e boost da pessoa
  (`config/limpezaConta.js`). Consequência: confrontos apagados deixam de pontuar o adversário.
- Perfil: e-mail e senha não mudam por `PATCH /perfil`; campos desconhecidos dão 400.


- Match só existe quando as duas pessoas deram match uma na outra.
- Chat só entre quem tem match.
- Confronto: o desafiado aceita; qualquer um registra o resultado; quem NÃO
  registrou confirma o encerramento. O resultado aparece invertido para o outro lado.
- Boost: prioridade na fila de sugestões, sem cobrança.
- Desfazer match sempre remove o match e devolve as duas pessoas à fila da Descoberta. Apagar o histórico de mensagens e/ou de confrontos é opcional (escolha de quem desfaz) e vale para os dois lados.
- Se as mensagens NÃO forem apagadas, ficam guardadas e a conversa volta caso os dois deem match de novo.


## Testar com duas contas

1. Suba o Mongo e a API; rode `node scripts/seed-usuarios.js`.
2. Abra `teste-duas-contas.http` (REST Client do VS Code), execute os dois logins e siga
   as requisições em ordem (match, chat, confronto, desfazer match, boost).
3. Ou rode `npm test` (cobre esse fluxo e auth, perfil, ranking e infraestrutura).

## Estrutura

```
backend/
  app.js, server.js        -> Express (helmet, CORS, rate limit) e porta
  config/                  -> env.js (zod), db.js, limpezaConta.js
  middleware/              -> usuarioAtual (JWT), validar (zod), errorHandler, notFound
  models/ routes/ validators/ utils/
  scripts/seed-usuarios.js
  tests/                   -> setup.js, helpers.js, *.test.js (npm test roda em série)
```
