# Convenções do backend (para quem for migrar um módulo)

Leia antes de criar rota nova. Patrick mantém a infraestrutura; cada módulo é de quem o implementa.

## Checklist de uma rota nova

1. **Prefixo e autenticação:** registre em `routes/index.js` como
   `router.use('/meu-modulo', usuarioAtual, minhasRotas)`. A URL final é `/api/v1/meu-modulo`.
2. **Quem é o usuário:** use SEMPRE `req.usuarioId` (vem do token). Nunca aceite id de
   usuário "dono" no body, query ou header (evita IDOR). Em `/:id`, confira que o
   registro pertence a `req.usuarioId` antes de ler/alterar.
3. **Validação:** crie o schema em `validators/` com zod `.strict()` e use
   `validar(schema, 'body' | 'query' | 'params')`; dados validados ficam em
   `req.validado.<origem>`. IDs: `idMongo` de `validators/comum.js`.
4. **Erros:** `throw new AppError(status, 'mensagem em português')`. Express 5 já repassa
   erros de rotas `async`. Nunca devolva stack ou mensagem interna.
5. **Respostas:** JSON, `id` em vez de `_id` (use `toJSON` de `models/_toJSON.js`), erro
   como `{ erro }`. Nunca devolva campos sensíveis (`senhaHash` já é `select:false`).
6. **Dados ligados ao usuário:** se a coleção referencia usuário, registre a limpeza em
   `config/limpezaConta.js` (`registrarLimpezaConta`) para a exclusão de conta não deixar órfãos.
7. **Config:** variável nova entra em `config/env.js` (zod) e em `.env.example`. Nada de
   `process.env` solto nem segredo no código.
8. **Compatibilidade de driver:** prefira `updateOne`/`find`+JS a `findByIdAndUpdate` com
   `select:false` (o FerretDB usado em alguns ambientes não suporta).

## Testes

- `tests/helpers.js`: `conectarTeste`, `limparBanco`, `como(usuario)` (requisições com token),
  `anonimo()`. O banco de teste precisa ter "test" no nome.
- `npm test` roda os arquivos em série (compartilham o mesmo banco). Cubra: sem token (401),
  dados inválidos (400), recurso de outra pessoa (403/404) e o caminho feliz.

## Frontend

Chame a API por `src/api/apiClient.js` (`api.get/post/patch/put/delete`) dentro de
`src/api/ciclaApi.js` e exponha por hooks em `src/hooks/useCiclaData.js`. Erros chegam como
`ApiError` (`status`, `message`); 401 em rota autenticada limpa a sessão e volta ao login.
