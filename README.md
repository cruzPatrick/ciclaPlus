# Cicla+ — protótipo em React

Migração do protótipo HTML do Cicla+ pra React, usando Bootstrap 5 como
framework CSS, Tanstack Query + json-server como backend mockado, e
react-hook-form + zod em todo formulário.

## Como rodar

Precisa de **dois terminais** — um pro backend mockado, outro pro app:

Em ambos os terminais, entre na pasta `frontend` com `cd frontend` antes
de executar os comandos abaixo:

```bash
npm install

# terminal 1 — backend mockado (json-server, porta 3001)
npm run mock

# terminal 2 — app React (Vite, porta 5173)
npm run dev
```

Login de teste: `teste@ciclaplus.com` / `123456` (dado inicial em
`db.json`). Cadastro cria um usuário novo de verdade no mock.

## Estrutura de páginas (estilo Strava)

- `/` → `Landing.jsx` — página pública, antes de logar (hero + CTA).
- `/login`, `/cadastro` — autenticação, contra o backend mockado.
- `/app/*` → `AppLayout.jsx` (menu fixo, exige sessão) + uma página
  própria por rota, em vez de sections empilhadas com âncora:
  `/app/descoberta`, `/app/chat`, `/app/treino-individual`,
  `/app/treino-equipe`, `/app/cronometro`, `/app/tempos`,
  `/app/confronto`, `/app/consultoria`, `/app/ranking`, `/app/perfil`.

Login e Cadastro autenticam/criam conta de verdade contra o json-server
e guardam a sessão (`usuarioId`) em `localStorage`.

## Decisões de estrutura

Os caminhos desta seção são relativos à pasta `frontend`.

- **Cores sem CSS custom**: `src/styles/custom.scss` sobrescreve as
  variáveis do Bootstrap (`$primary`, `$secondary`) com a paleta Cicla+
  (Pine Blue `#357266`, Taupe Grey `#6F5E5C`) e adiciona o Ash Grey
  (`#AEB7B3`) como uma terceira "theme color" (`$theme-colors`). Isso faz o
  Bootstrap gerar sozinho `.btn-ciclagrey`, `.bg-ciclagrey`,
  `.text-ciclagrey` etc. — sem escrever CSS pra cada variante.
- **Import parcial do Bootstrap**: em vez de `@import "bootstrap/scss/bootstrap"`
  (tudo), o `custom.scss` importa só os módulos usados (grid, forms,
  buttons, navbar, card, tables...). Isso reduz o CSS final — se adicionar
  um componente novo do Bootstrap (ex: modal, accordion), é só importar o
  módulo correspondente.
- **CSS custom mínimo**: só existe CSS "de verdade" pra reproduzir o card
  de login/cadastro do repositório base (`projeto-login`), que tem um
  formato bem específico (foto no topo, inputs com ícone) que o Bootstrap
  sozinho não cobre.
- **Backend mockado, não dados locais**: `db.json` (na pasta `frontend`) é
  servido pelo json-server em `http://localhost:3001`. Nenhum componente
  faz `fetch` direto — tudo passa por `src/api/ciclaApi.js` e pelos hooks
  do Tanstack Query em `src/hooks/useCiclaData.js`. Pra editar os dados
  iniciais (candidatos do Dar Match, matches, mensagens, treinos, tempos,
  confrontos, consultorias, ranking), edite `db.json` com o json-server
  parado (ele reescreve o arquivo a cada mutação).
- **Formulários com react-hook-form + zod**: todo formulário (Login,
  Cadastro, Chat, Treino, Confronto, Consultoria, Perfil) valida com um
  schema zod via `@hookform/resolvers/zod` — mensagens de erro inline,
  sem `alert()`.
- **Uma página por rota**: cada funcionalidade que antes era uma section
  vira sua própria página em `src/pages/app/`, montada dentro do
  `AppLayout.jsx` (menu fixo + `<Outlet/>`), sem lógica de composição
  numa Home só.

## Estrutura

```
frontend/
  src/
    api/                  -> client.js (fetch wrapper), ciclaApi.js (funções por recurso), sessao.js
    hooks/useCiclaData.js  -> hooks do Tanstack Query (useQuery/useMutation por recurso)
    pages/
      Landing.jsx        -> página pública
      Login.jsx, Cadastro.jsx
      app/                -> uma página por funcionalidade (rotas /app/*)
    components/
      layout/             -> Header, Footer, AppLayout (menu fixo + guarda de rota)
    styles/custom.scss     -> tema Bootstrap + paleta Cicla+
  public/                  -> imagens e ícones
  db.json                  -> dados iniciais do backend mockado (json-server)
  index.html
  package.json
  package-lock.json
  vite.config.js
docs/                      -> documentos de gerência
mudancas/                  -> contexto e histórico do projeto
```
