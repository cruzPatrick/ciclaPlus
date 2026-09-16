# Cicla+ — protótipo em React

Migração do protótipo HTML do Cicla+ pra React, usando Bootstrap 5 como
framework CSS e a paleta de cores do Cicla+.

## Como rodar

```bash
npm install
npm run dev
```

## Estrutura de páginas (estilo Strava)

- `/` → `Landing.jsx` — página pública, antes de logar (hero + CTA).
- `/login`, `/cadastro` — telas de autenticação.
- `/app/*` → `AppLayout.jsx` (menu fixo) + uma página própria por rota,
  em vez de sections empilhadas com âncora:
  `/app/descoberta`, `/app/chat`, `/app/treino-individual`,
  `/app/treino-equipe`, `/app/cronometro`, `/app/tempos`,
  `/app/confronto`, `/app/consultoria`, `/app/ranking`.

Login e Cadastro navegam direto pra `/app/descoberta` e `/login`
respectivamente ao submeter (ainda sem backend — é só a simulação do fluxo).

## Decisões de estrutura

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
- **Dados locais**: cada componente de tela guarda seus próprios dados em
  variáveis locais (arrays/objetos no corpo da função) — ex: a lista de
  conversas do chat, os ciclistas do ranking, as equipes do treino. Nada
  vem de API/backend ainda.
- **Uma página por rota**: cada funcionalidade que antes era uma section
  vira sua própria página em `src/pages/app/`, montada dentro do
  `AppLayout.jsx` (menu fixo + `<Outlet/>`), sem lógica de composição
  numa Home só.

## Estrutura

```
src/
  pages/
    Landing.jsx        -> página pública
    Login.jsx, Cadastro.jsx
    app/                -> uma página por funcionalidade (rotas /app/*)
  components/
    layout/             -> Header, Footer, AppLayout (menu fixo da área interna)
  styles/custom.scss     -> tema Bootstrap + paleta Cicla+
```
