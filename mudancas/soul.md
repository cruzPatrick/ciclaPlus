# Cicla+ — Documentação completa (contexto + histórico)

*Documento único que reúne o contexto geral do projeto e o histórico de
alterações do front-end. Pensado para dar contexto completo a quem (humano ou
IA) for continuar o desenvolvimento. **Este é o único MD da pasta `mudancas/`
(a partir de 2026-09-24) — todos os anteriores foram consolidados aqui:
`00-contexto-completo-do-projeto.md`, `01-historico-de-alteracoes.md`,
`02-historico-de-alteracoes.md` e a versão inicial `README.md`.** nesse arquivo
(era `README.md`; renomeado para `soul.md` a pedido do Patrick).

---

# Parte 1 — Contexto completo do projeto

## 1. Visão geral

**Cicla+** é uma rede social de ciclistas: os usuários dão match com outros
ciclistas, conversam por chat, marcam treinos (individuais ou em equipe),
cronometram desempenho, disputam confrontos e acompanham um ranking.

- Projeto da disciplina de PSW.
- Dois perfis de usuário: **Ciclista** e **Equipe**.
- Entregas até aqui: Matriz CRUD, Matriz Perfil × Funcionalidade,
  Priorização dos Requisitos, Prototipagem (HTML estático) e Refinamento da
  Prototipagem (migração para React).
- Estado atual: **protótipo front-end sem backend** — todos os dados exibidos
  nas telas são variáveis locais dentro dos componentes, não vêm de API.

## 2. Matriz CRUD

Entidades do domínio: Ciclista, Equipe, Treino, Confronto, Ranking.

| Caso de Uso | Ciclista | Equipe | Treino | Confronto | Ranking |
|---|---|---|---|---|---|
| Dar Match | R | - | - | - | - |
| Usar Chat | R | - | - | - | - |
| Usar Boost | U | - | - | - | - |
| Manter Passeio | R | - | CRUD | - | - |
| Marcar Treino Individual | R | - | C | - | - |
| Marcar Treino em Equipe | R | R | C | - | - |
| Cronometrar Desempenho | R | - | U | - | - |
| Manter Tempo | - | - | U | - | - |
| Marcar Confronto | R | - | - | C | - |
| Confirmar Confronto | R | - | - | U | - |
| Registrar Resultado | R | - | - | U | U |
| Confirmar Encerramento | R | - | - | U | U |
| Marcar Consultoria | R | R | - | - | - |
| Conferir Ranking | R | - | - | - | R |
| Emitir Ranking | - | - | - | - | R |

**Lacunas identificadas na análise de cobertura CRUD** (casos de uso
complementares recomendados, ainda não implementados):

1. Cadastrar Ciclista (existe como tela, mas não como caso de uso formal na
   matriz original)
2. Excluir Ciclista
3. Manter Equipe (CRUD completo)
4. Consultar Confronto
5. Cancelar Confronto

## 3. Matriz Perfil × Funcionalidade

| Funcionalidade | Ciclista | Equipe |
|---|---|---|
| Dar Match | X | - |
| Usar Chat | X | - |
| Usar Boost | X | - |
| Manter Passeio | X | - |
| Marcar Treino Individual | X | - |
| Marcar Treino em Equipe | X | X |
| Cronometrar Desempenho | X | X |
| Manter Tempo | X | X |
| Marcar Confronto | X | - |
| Confirmar Confronto | X | - |
| Registrar Resultado | X | - |
| Confirmar Encerramento | X | - |
| Marcar Consultoria | X | X |
| Conferir Ranking | X | X |
| Emitir Ranking | - | X |

Funcionalidades compartilhadas entre os dois perfis (tendem a precisar de
interface diferenciada por perfil, ainda não implementada): Marcar Treino em
Equipe, Cronometrar Desempenho, Manter Tempo, Marcar Consultoria, Conferir
Ranking.

## 4. Priorização dos Requisitos

**Prioridade 1 — Core Business:** Dar Match, Usar Chat, Marcar Treino em
Equipe, Marcar Confronto, Confirmar Confronto, Registrar Resultado, Confirmar
Encerramento, Conferir Ranking.

**Prioridade 2 — Suporte ao fluxo principal:** Cronometrar Desempenho, Manter
Tempo, Emitir Ranking, Marcar Treino Individual.

**Prioridade 3 — Complementares:** Manter Passeio, Marcar Consultoria, Usar
Boost.

*(Matrizes completas com responsáveis por caso de uso em
`01-prototipagem-matrizes-de-requisitos.md`.)*

## 5. Paleta de cores Cicla+

| Cor | Hex | Papel |
|---|---|---|
| Pine Blue | `#357266` | Cor primária |
| Taupe Grey | `#6F5E5C` | Cor secundária |
| Ash Grey | `#AEB7B3` | Cor de apoio |

Preto e branco são usados só como neutros. O layout visual (estrutura do
card de login/cadastro, uso de Material Icons) foi herdado do repositório
[`projeto-login`](https://github.com/cruzPatrick/projeto-login), mas com essa
paleta no lugar das cores originais dele (azul/amarelo/violeta).

## 6. Refinamento da prototipagem: migração para React

O protótipo original (HTML/CSS estático) foi migrado para React, mantendo o
domínio e os fluxos das matrizes acima. Decisões principais:

- **Framework CSS:** Bootstrap 5 (avaliadas e descartadas alternativas mais
  enxutas: UnoCSS, Tachyons, Open Props).
- **Cores sem CSS custom por componente:** a paleta Cicla+ entra nas
  variáveis do Bootstrap (`$primary`, `$secondary`, e o Ash Grey como
  entrada extra em `$theme-colors`), então `.btn-primary`, `.bg-secondary`,
  `.text-ciclagrey` etc. já nascem com a cor certa.
- **Import parcial do Bootstrap:** só os módulos Sass realmente usados são
  importados (grid, forms, buttons, navbar, card, tables...), não o
  framework inteiro — reduz o CSS final gerado.
- **Dados locais nos componentes:** cada tela guarda seus próprios dados como
  variável local (array/objeto no corpo da função) — sem API/backend ainda.
- **Separação de páginas (inspirada no Strava):** em vez de uma Home só com
  todas as funcionalidades empilhadas e navegação por âncora, a navegação
  tem duas camadas:
  - **Landing pública** (`/`) — antes do login, sem conteúdo do app.
  - **Área interna** (`/app/*`) — uma página própria por funcionalidade,
    navegadas por um menu fixo, em vez de scroll com âncora.
- **SPA de verdade:** roteamento 100% client-side. No projeto Vite isso é
  via `react-router-dom` (`BrowserRouter`); no HTML standalone, via hash da
  URL (`#app/chat`), porque não há bundler disponível.
- **Login com usuário de teste fixo:** sem backend, o login valida contra um
  usuário fixo no código (`teste@ciclaplus.com` / `123456`) — só pra simular
  autenticação de verdade; qualquer outra combinação mostra erro.

## 7. Duas versões do protótipo

### 7.1 Projeto Vite + React (`cicla-plus-react.zip`)

Código-fonte separado em componentes, com rotas reais. Recomendado pra
continuar o desenvolvimento.

```
cicla-react/
  index.html
  package.json
  src/
    main.jsx              -> entry point, importa custom.scss e o JS do Bootstrap
    App.jsx                -> define as rotas (react-router-dom)
    styles/
      custom.scss          -> tema Bootstrap + paleta Cicla+ (import parcial)
    pages/
      Landing.jsx           -> "/", página pública
      Login.jsx              -> "/login", valida usuário de teste fixo
      Cadastro.jsx           -> "/cadastro", simula cadastro (não persiste)
      app/
        Descoberta.jsx        -> "/app/descoberta"
        Chat.jsx               -> "/app/chat"
        TreinoIndividual.jsx   -> "/app/treino-individual"
        TreinoEquipe.jsx        -> "/app/treino-equipe"
        Cronometro.jsx         -> "/app/cronometro"
        Tempos.jsx             -> "/app/tempos"
        Confronto.jsx          -> "/app/confronto"
        Consultoria.jsx        -> "/app/consultoria"
        Ranking.jsx            -> "/app/ranking"
    components/
      layout/
        Header.jsx            -> usado por Cadastro
        Footer.jsx             -> usado por Cadastro e AppLayout
        AppLayout.jsx           -> menu fixo + <Outlet/> das páginas /app/*
```

**Como rodar:**

```bash
npm install
npm run dev     # abre em http://localhost:5173/
npm run build   # gera build de produção em dist/
```

**Aviso esperado no terminal:** ao rodar `npm run dev` ou `npm run build`,
aparecem várias "Deprecation Warning" do Sass (`@import` deprecated,
`if-function`, `global-builtin`, `color-functions`...). São avisos internos
do próprio Bootstrap 5.3, que ainda usa sintaxe antiga do Sass — não são
erros e não impedem o projeto de rodar. Aparecem em qualquer projeto que use
Bootstrap + Sass hoje em dia.

**Pegadinha de deploy:** como é SPA com rotas client-side, se alguém acessar
`/app/chat` direto (ou der F5 nela) num servidor de produção sem configuração,
o servidor pode devolver 404 — precisa de uma regra de rewrite (toda rota
desconhecida cai no `index.html`).

### 7.2 HTML standalone (`cicla-plus-standalone.html`)

Um único arquivo `.html`, sem passo de build — React, Bootstrap e Babel
carregados via CDN, JSX transpilado no navegador. Pensado pra abrir em
máquinas sem Node/Vite (ex: laboratório da faculdade com política de
execução do PowerShell bloqueada e sem permissão de admin).

- Mesmas páginas e mesma paleta do projeto Vite, mas:
  - Cores aplicadas via um bloco `<style>` sobrescrevendo as CSS custom
    properties do Bootstrap (equivalente ao `custom.scss`, sem Sass).
  - Navegação por hash da URL (`#login`, `#app/ranking`) em vez de
    `react-router-dom`.
  - A foto do card de login vai embutida como `data:image/jpeg;base64,...`
    (não há servidor de arquivos estáticos).
- **Como rodar:** só abrir o arquivo no navegador (duplo clique ou
  Arquivo → Abrir). Precisa de internet pra carregar as libs via CDN.

## 8. Estado atual / limitações conhecidas

- **Sem backend:** login, cadastro e todos os dados exibidos (ranking, chat,
  equipes...) são simulados com variáveis locais ou usuário de teste fixo.
- **Cadastro não persiste:** o formulário de cadastro só simula o fluxo
  (navega pro login), não salva o ciclista em lugar nenhum.
- **Login:** válido só para `teste@ciclaplus.com` / `123456`.

## 9. Próximos passos previstos

- Persistência de cadastro (ex: `localStorage` no standalone, ou API real no
  projeto Vite).
- Integração com backend/API pra substituir os dados locais dos componentes.
- Cobrir as lacunas identificadas na Matriz CRUD (seção 2): CRUD completo de
  Equipe, Excluir Ciclista, Consultar/Cancelar Confronto.
- Interfaces diferenciadas por perfil (Ciclista vs. Equipe) nas
  funcionalidades compartilhadas listadas na seção 3.

---

# Parte 2 — Histórico de alterações (front-end)

*Log para manter o contexto de cada ação feita no protótipo. Cada rodada de
trabalho vira uma seção nova aqui, com o problema, a causa raiz, a solução,
os arquivos tocados e como verificar.*

---

## 2026-09-22 — Correções de layout: footer no meio da tela + ícones do login

### Contexto da rodada

Etapa de PSW focada em **refinar o front-end** (melhorar as telas existentes)
e ir cobrindo os casos de uso das matrizes de requisitos. Nesta rodada:
resolver os dois problemas visuais apontados. Nada de backend — os dados
continuam locais nos componentes.

---

### Problema 1 — Footer aparecia no meio da tela (todas as páginas)

**Causa raiz:** nenhuma página tinha altura mínima de viewport. O `<footer>`
era renderizado logo depois do conteúdo; como o conteúdo de várias telas
(Landing, Cadastro e a maioria das telas em `/app/*`) é curto, o footer
acabava colado no meio da tela, com um vão de fundo embaixo.

**Solução — "sticky footer" com flexbox (padrão do Bootstrap, sem CSS
custom):**

1. Cada página passa a envolver seu conteúdo em
   `<div className="d-flex flex-column min-vh-100">` — coluna flexível com
   altura mínima igual à da janela.
2. O `<footer>` ganha `mt-auto` (em vez de `mt-4`) — dentro da coluna
   flexível, `margin-top: auto` empurra o footer para o pé da tela quando o
   conteúdo é curto; quando o conteúdo é maior que a tela, a página rola
   normalmente e o footer continua no fim.
3. `AppLayout` deixou de duplicar o markup do footer e passou a reutilizar o
   componente `Footer.jsx` (DRY) — era o mesmo HTML na mão.

**Arquivos alterados:**

| Arquivo | Mudança |
|---|---|
| `src/pages/Landing.jsx` | wrapper `d-flex flex-column min-vh-100`; footer com `mt-auto` |
| `src/pages/Cadastro.jsx` | wrapper `d-flex flex-column min-vh-100` (o `Footer` já traz `mt-auto`) |
| `src/components/layout/AppLayout.jsx` | wrapper `d-flex flex-column min-vh-100`; footer inline → `<Footer />` |
| `src/components/layout/Footer.jsx` | `mt-4` → `mt-auto` (vale para Cadastro e todas as telas `/app/*`) |

**Como verificar:** abrir `/`, `/cadastro` e qualquer rota `/app/*` com o
conteúdo curto — o footer deve encostar no pé da janela, sem vão embaixo.

---

### Problema 2 — Ícones de usuário e senha sobre o texto do campo (login)

**Causa raiz:** no card de login, o ícone (`.material-icons`) e o rótulo
flutuante do campo (`E-mail` / `Senha`) ocupavam o **mesmo lugar**: o ícone
com `left: 0.75rem` + `top: 50%` e o `<label>` do `.form-floating` do
Bootstrap também começando em `0.75rem` na altura central do campo — o ícone
ficava por cima do texto do rótulo. O `input` já tinha `padding-left: 2.5rem`
(por isso o texto digitado não colidia), mas o `label` não.

**Solução:** aplicar o mesmo `padding-left: 2.5rem` no rótulo, para ele
começar depois da faixa do ícone:

```scss
.auth-card .form-floating > label {
  padding-left: 2.5rem;
}
```

**Arquivo alterado:** `src/styles/custom.scss` (regra nova na seção
`.auth-card`, único CSS custom do projeto).

**Como verificar:** em `/login`, com o campo vazio o texto `E-mail`/`Senha`
aparece à direita do ícone; ao focar/preencher, o rótulo sobe sem passar por
cima do ícone e o texto digitado começa na mesma linha do rótulo.

---

### Verificação feita nesta rodada

- CSS compilado servido pelo Vite conferido via
  `http://localhost:<porta>/src/styles/custom.scss?direct` — regra nova
  presente.
- `npm run lint` (oxlint): **0 warnings / 0 errors**.
- HMR do Vite aplicou as mudanças sem erro de compilação.
- Avisos de deprecation do Sass no terminal são internos do Bootstrap 5.3
  (esperados, documentados na seção 7.1 desta documentação).

### Observações de ambiente

- Neste terminal, `npm` (via `npm.ps1`) é bloqueado pela execution policy do
  PowerShell — usar **`npm.cmd run dev`** / `npm.cmd run lint`.
- O dev server sobe em `http://localhost:5173/`; se a porta estiver em uso
  (outra instância do projeto aberta), o Vite sobe em `5174`, `5175`...

---

## 2026-09-22 — Publicação no GitHub Pages

### Objetivo

Publicar o protótipo em **https://cruzpatrick.github.io/ciclaPlus/** e
deploy automático a cada push em `main`.

> **Nota (2026-09-23):** o deploy automático descrito abaixo foi **removido**
> — veja a entrada "Deploy automático removido do GitHub Pages" mais abaixo.
> O site só é atualizado por deploy manual (Actions → Run workflow).

### O que foi feito

| Arquivo | Mudança |
|---|---|
| `vite.config.js` | `base: '/ciclaPlus/'` **só no build** (no dev server continua `/`, pra não quebrar o `npm run dev`); plugin `spa-404-fallback` que copia `dist/index.html` → `dist/404.html` |
| `src/main.jsx` | `basename={import.meta.env.BASE_URL}` no `BrowserRouter` — o app agora roda numa subpasta (`/ciclaPlus/`), sem isso todo `<Link to="/login">` iria pra `github.io/login` |
| `.github/workflows/deploy-pages.yml` | workflow novo: `npm ci` → `npm run build` → `actions/deploy-pages` em todo push em `main` (também dá pra disparar manualmente em Actions) |

**Por que o `404.html`:** o GitHub Pages responde 404 pra qualquer rota
interna digitada direto na URL ou recarregada (ex.:
`/ciclaPlus/app/ranking`). Servindo o `index.html` como `404.html`, a app
carrega mesmo assim (status 404, mas com o HTML certo) e o react-router
resolve a rota.

**Registro Git:** dois commits em `main` —

- `bc8ba64` — Corrige footer no meio da tela e ícones sobre o texto no login
- `209a5d4` — Adiciona deploy automatico no GitHub Pages

**Configuração do repositório:** GitHub Pages habilitado via API com
`build_type: workflow` (Source = GitHub Actions). URL do site:
`https://cruzpatrick.github.io/ciclaPlus/`.

### Verificação feita nesta rodada

- `npm run build` local: build ok, `dist/404.html` gerado, assets com
  prefixo `/ciclaPlus/`.
- Workflow "Deploy to GitHub Pages": **success**
  ([run 35740158637](https://github.com/cruzPatrick/ciclaPlus/actions/runs/35740158637)).
- `https://cruzpatrick.github.io/ciclaPlus/` → **200** com o HTML da app.
- `https://cruzpatrick.github.io/ciclaPlus/app/ranking` → status **404**
  esperado, mas devolvendo o `index.html` (fallback) — a rota carrega.

### Observações

- Sem `gh` CLI nesta máquina; habilitação do Pages e acompanhamento do
  workflow foram via API do GitHub com a credencial já salva no git.
- ~~PRÓXIMO push em `main` já dispara o deploy sozinho.~~ *(desde
  2026-09-23 o deploy é manual)*

---

## 2026-09-23 — Menu de navegação da área interna: hamburguer (desktop) + abas animadas (mobile)

### Contexto da rodada

Refinamento de front-end a partir de wireframes desenhados à mão: substituir
a navbar única (mesma pra desktop e mobile) por dois layouts de navegação
diferentes por breakpoint, mantendo as mesmas 9 rotas de `/app/*`.

---

### Mudança — navbar única → hamburguer (desktop) + abas (mobile)

**Antes:** `AppLayout` renderizava uma única `<nav>` do Bootstrap
(`navbar-expand-lg`) com todos os links visíveis a partir do breakpoint
`lg`, e um `navbar-toggler` colapsável abaixo disso.

**Depois:** `AppLayout` passou a renderizar dois componentes, cada um visível
só no seu breakpoint (`d-none d-lg-block` / `d-lg-none` do Bootstrap):

1. **`DesktopMenu` (>= lg):** nenhum link fica visível por padrão — só um
   botão hamburguer fixo (`position: fixed`, canto superior esquerdo). Ao
   clicar, abre um overlay em tela cheia com fundo escuro + `backdrop-filter:
   blur(6px)` ("fosco"), e um painel vertical desliza da esquerda
   (`transform: translateX(-100%) → translateX(0)`, transição de 0.3s) com a
   lista de páginas. Fecha ao clicar fora, ao clicar num link, ou com Esc.
   O ícone anima pra um "X" (`rotate(45deg)`/`rotate(-45deg)` nas barras)
   quando aberto.
2. **`MobileTabs` (< lg):** barra de abas horizontal com scroll
   (`overflow-x: auto`, sem barra de rolagem visível), listando as 9
   páginas lado a lado. Uma `<span>` absoluta (`cicla-tab-indicator`) marca
   a aba ativa embaixo dela; a posição/largura é recalculada via
   `offsetLeft`/`offsetWidth` do elemento ativo a cada troca de rota
   (`useLocation` + `useEffect`), com transição CSS de 0.25s em `left` e
   `width` — dá o efeito de linha deslizando. A aba ativa também se
   auto-centraliza na rolagem (`scrollIntoView`).

**Decisão de tema:** o overlay do menu desktop é intencionalmente escuro
(única parte do app com tema escuro por enquanto) — o restante do app
continua na paleta Cicla+ normal. Modo escuro pro app inteiro é um próximo
passo futuro, quando a paleta de cores for revista.

**Arquivos alterados:**

| Arquivo | Mudança |
| --- | --- |
| `src/components/layout/AppLayout.jsx` | reescrito: `DesktopMenu` e `MobileTabs` como componentes internos, cada um renderizado condicionalmente por breakpoint; `NavLink` com `ref` pra medir a posição de cada aba |
| `src/styles/custom.scss` | novas classes `.cicla-hamburger`, `.cicla-overlay`, `.cicla-overlay-panel`, `.cicla-overlay-brand`, `.cicla-overlay-link`, `.cicla-tabs-wrapper`, `.cicla-tabs-scroll`, `.cicla-tab`, `.cicla-tab-indicator` |

**Como verificar:** abrir qualquer rota `/app/*`.
- Em telas `>= lg` (992px): só o ícone hamburguer deve aparecer no canto
  superior esquerdo; clicar nele abre o overlay escuro com o menu vertical;
  Esc ou clique fora fecha.
- Em telas `< lg`: a navbar antiga não deve mais aparecer — em vez disso,
  uma barra de abas rolável no topo, com uma linha branca embaixo da aba da
  rota atual, que desliza ao trocar de página.

### Verificação feita nesta rodada

- `npm run build`: build ok, sem erros (só os avisos de deprecation do Sass
  já documentados nesta documentação).
- `npm run lint` (oxlint): **0 warnings / 0 errors**.

---

## 2026-09-23 — Treino Individual + Treino em Equipe → página única "Treino" com abas

### Contexto da rodada

Consolidar duas páginas/rotas de treino em uma só, com a escolha do tipo
dentro da própria página — estilo "Treino" no menu, e dentro dele a opção
Individual ou Equipe.

### Mudança — duas rotas → uma página com abas de tipo

**Antes:** dois itens de menu e duas rotas (`/app/treino-individual` e
`/app/treino-equipe`), cada uma com seu próprio arquivo de página e formulário.

**Depois:**

- **`src/pages/app/Treino.jsx` (novo):** página única com um
  `nav nav-pills` no topo — abas **Individual** e **Em equipe** — e o
  formulário correspondente renderizado embaixo (o módulo `nav` do Bootstrap
  já era importado no `custom.scss`, então **nenhum CSS novo** foi
  necessário; a aba ativa usa o `.active` nativo, que já nasce na cor
  `$primary` da paleta Cicla+).
- **O tipo fica na URL:** `?tipo=individual` / `?tipo=equipe` via
  `useSearchParams` — sobrevive a F5, dá pra compartilhar o link já com o
  tipo certo, e a troca de aba usa `{ replace: true }` pra não encher o
  histórico do navegador. Sem parâmetro = Individual (padrão).
- **Rotas antigas mantidas como redirect** (`<Navigate>` no `App.jsx`):
  `/app/treino-individual` → `/app/treino?tipo=individual` e
  `/app/treino-equipe` → `/app/treino?tipo=equipe` — link antigo (inclusive
  no ar no GitHub Pages) continua caindo no lugar certo.
- **Menu:** `ITENS` no `AppLayout` foi de **9 para 8 itens** (hamburguer
  desktop e abas mobile passam a listar "Treino" uma única vez).
- **Forms agora têm `onSubmit` com `preventDefault`** — antes os dois
  formulários submetiam de verdade e recarregavam a SPA (bug pré-existente).

**Arquivos alterados:**

| Arquivo | Mudança |
| --- | --- |
| `src/pages/app/Treino.jsx` | novo — página única com abas Individual / Em equipe |
| `src/pages/app/TreinoIndividual.jsx` | **removido** (conteúdo movido pra `Treino.jsx`) |
| `src/pages/app/TreinoEquipe.jsx` | **removido** (conteúdo movido pra `Treino.jsx`) |
| `src/App.jsx` | rota `treino`; rotas antigas viraram `Navigate` com `?tipo=` |
| `src/components/layout/AppLayout.jsx` | dois itens de menu → um só (`treino`) |

**Como verificar:** abrir `/app/treino` — as abas Individual / Em equipe
alternam o formulário sem recarregar; a URL vira `?tipo=equipe` ao clicar em
"Em equipe"; o menu (hamburguer e abas mobile) mostra só "Treino";
digitando `/app/treino-equipe` na mão, redireciona pra
`/app/treino?tipo=equipe`.

### Verificação feita nesta rodada

- `npm run lint` (oxlint): **0 warnings / 0 errors**.
- `npm run build`: **ok** (só os avisos de deprecation do Sass já
  documentados nesta documentação).

---

## 2026-09-23 — Hambúrguer por cima da marca "Cicla+" (menu desktop)

### Problema

Em tela larga (>= lg), o botão hambúrguer fixo (`.cicla-hamburger`:
`top/left: 1rem`, 44×44px) ficava **por cima** da marca "Cicla+" do overlay
(`.cicla-overlay-brand`: `top/left: 1.5rem`) — os dois se sobrepunham no
canto superior esquerdo do painel, e o texto começava embaixo do botão.

### Solução

A marca passou pra **linha do botão, à direita dele**
(`top: 1.75rem; left: 4.75rem`), formando o cabeçalho `[X] Cicla+` do
painel. Só CSS mudou (`.cicla-overlay-brand` em `src/styles/custom.scss`);
nenhum JSX alterado. O restante do painel (`padding-top: 5rem`) segue
inalterado — a lista continua começando abaixo dos dois.

**Como verificar:** em tela >= 992px, abrir o hambúrguer em qualquer rota
`/app/*` — o "X" e o "Cicla+" devem aparecer lado a lado, sem sobreposição.

---

## 2026-09-23 — Deploy automático removido do GitHub Pages (agora só manual)

### Contexto da rodada

A pedido do responsável: parar de publicar automaticamente a cada push em
`main`. O site continua existindo em
**https://cruzpatrick.github.io/ciclaPlus/**, mas só atualiza quando o
deploy for disparado manualmente.

### Mudança — gatilho `push` removido do workflow

**Antes:** `.github/workflows/deploy-pages.yml` disparava em
`push` para `main` **e** manualmente via `workflow_dispatch` (a entrada de
2026-09-22 "Publicação no GitHub Pages" descreve esse comportamento — ela
está **desatualizada** em relação a este ponto).

**Depois:** o workflow tem **apenas** `workflow_dispatch` — build do Vite +
publicação no Pages acontecem só quando alguém aciona
**Actions → Deploy to GitHub Pages → Run workflow**. Push em `main`
(publicação incluída) **não** dispara mais nada.

**Arquivo alterado:**

| Arquivo | Mudança |
|---|---|
| `.github/workflows/deploy-pages.yml` | bloco `on.push.branches: [main]` removido; sobra só `on.workflow_dispatch`; comentário do topo atualizado |

**Registro Git:**

- `c2648c7` — Remove deploy automatico do GitHub Pages

**Como verificar:** `git push` em `main` e conferir em Actions que nenhum
run "Deploy to GitHub Pages" é criado; para publicar, disparar manualmente
pela UI do Actions.

---

## 2026-09-23 — Página Perfil: editar conta, mudar perfil e logoff

### Contexto da rodada

Criar as opções de conta da área interna: **logoff, mudar perfil e editar
conta** — sem CRUD nesta rodada (só a estrutura; nenhuma das opções grava
dados). Decisões combinadas:

- As 3 opções moram numa **página própria** (`/app/perfil`), não direto no
  menu.
- A página usa a **mesma foto do card de login**
  (`public/images/ciclista-login.jpg`) como banner — o "logo" escolhido foi
  a foto do ciclista (não o favicon nem o texto).
- O item de menu se chama **"Perfil"**, é **sempre o último**: parte de
  baixo do hambúrguer (desktop) e última aba escrita "Perfil" (mobile).

### Mudança — nova rota/página Perfil + item de menu

**`src/pages/app/Perfil.jsx` (novo):**

- Card arredondado (`.perfil-card`) espelhando o `auth-card` do login, com
  banner de foto no topo (`.perfil-banner`, 180px, mesma imagem do login).
- Exibe o e-mail da conta de teste fixa (`teste@ciclaplus.com`) — dado local,
  sem backend.
- 3 botões:
  - **Editar conta** (`btn-outline-primary`, ícone `edit`) — **sem ação**
    (CRUD futuro).
  - **Mudar perfil** (`btn-outline-primary`, ícone `swap_horiz`) — **sem
    ação** (CRUD futuro).
  - **Sair** (`btn-outline-danger`, ícone `logout`) — único funcional:
    `navigate("/login")`.

**Menu (`src/components/layout/AppLayout.jsx`):**

- `{ to: "perfil", texto: "Perfil" }` adicionado **por último** no array
  `ITENS` — o mesmo array alimenta `DesktopMenu` (hambúrguer) e
  `MobileTabs` (abas), então por padrão ele já cai na posição pedida nos
  dois: último link do painel lateral e última aba mobile. Quem mexer no
  menu no futuro deve **mantê-lo no fim** da lista.

**Rotas (`src/App.jsx`):**

- `<Route path="perfil" element={<Perfil />} />` dentro do layout `/app`.

**Arquivos alterados:**

| Arquivo | Mudança |
|---|---|
| `src/pages/app/Perfil.jsx` | **novo** — página de perfil com banner (foto do login) e botões Editar conta / Mudar perfil / Sair |
| `src/App.jsx` | import de `Perfil`; rota `perfil` dentro de `/app` |
| `src/components/layout/AppLayout.jsx` | item `{ to: "perfil", texto: "Perfil" }` como **último** de `ITENS` (hambúrguer e abas mobile) |
| `src/styles/custom.scss` | novas classes `.perfil-card` (card arredondado igual ao `auth-card`) e `.perfil-banner` (foto `ciclista-login.jpg`, mesmo padrão do `.auth-card__photo`) |

**Como verificar:**

- Desktop (>= 992px): abrir o hambúrguer em qualquer rota `/app/*` —
  **Perfil** deve ser o último item do painel; clicar abre `/app/perfil`.
- Mobile (< 992px): a barra de abas deve terminar com a aba escrita
  **Perfil** (rolagem horizontal até o fim).
- `/app/perfil`: banner com a foto do ciclista, 3 botões; **Sair** volta pra
  `/login`; "Editar conta" e "Mudar perfil" não fazem nada ainda (esperado).

### Verificação feita nesta rodada

- `npm run lint` (oxlint): **0 warnings / 0 errors**.
- `npm run build`: **ok** (só os avisos de deprecation do Sass já
  documentados nesta documentação).

**Registro Git:**

- `36c6e04` — Adiciona pagina Perfil com opcoes de editar conta, mudar perfil e logoff

---

## 2026-09-23 — Cronômetro com geolocalização e mapa + Ranking por percurso

*(Rodada feita pelo Claude — registrada no MD `01-historico-de-alteracoes.md`
que ele gerou; consolidada aqui na fusão de todos os MDs no `soul.md`.)*

### Contexto da rodada

Ideia trazida pelo Patrick: usar geolocalização pra validar que o
treino/confronto foi feito de fato numa ciclovia (evita "mentir" o tempo
registrado), e o Ranking passar a considerar não só a pontuação geral, mas
também o melhor tempo por percurso específico.

Preocupação levantada: LGPD. Como o app ainda não tem backend, a decisão
tomada foi capturar a localização só em memória (estado do componente),
sem persistir ou enviar pra servidor nenhum — e pedir consentimento
explícito, com uma tela própria explicando o motivo, antes do prompt
nativo do navegador.

### Mudança — `Cronometro.jsx`: consentimento + mapa Leaflet + rastreamento

**Antes:** tela estática, botão "Iniciar Cronômetro" sem nenhuma ação.

**Depois:** fluxo em três estados (`pendente` / `concedido` / `negado`):

1. **Tela de consentimento** — explica por que a localização é necessária
   e deixa claro que o dado não sai do navegador.
2. **Concedido** — inicializa um mapa Leaflet (tiles do OpenStreetMap, sem
   chave de API) centralizado na posição atual, com um marcador.
3. **"Iniciar Cronômetro"** — liga `navigator.geolocation.watchPosition`
   (rastreamento contínuo): marcador se move, `polyline` desenha o
   trajeto, distância somada via Haversine (local, sem lib extra) e um
   cronômetro (`setInterval` de 1s) mostra o tempo decorrido.
4. **"Parar Cronômetro"** — limpa o `watchPosition` e o intervalo.
5. **Negado / erro** — mensagem explicando que sem a permissão não dá pra
   validar o confronto; dá pra tentar de novo.

Todo o estado (posição, trajeto, tempo, distância) é local ao componente
— nada é persistido, salvo em `localStorage` ou enviado pra fora do
navegador.

**Biblioteca usada:** [Leaflet](https://leafletjs.com/) + tiles do
OpenStreetMap (não exige chave de API/cadastro).

### Mudança — `Ranking.jsx`: ranking por percurso

Duas tabelas — a geral (inalterada) e uma nova de "Melhores tempos por
percurso", agrupando por nome de ciclovia, com ciclista, tempo e distância.
Dados ainda locais/fixos (ex: `"Ciclovia da Orla"`).

**Arquivos alterados nesta rodada:**

| Arquivo | Mudança |
| --- | --- |
| `src/pages/app/Cronometro.jsx` | reescrito: consentimento, mapa Leaflet, rastreamento, cronômetro e distância |
| `src/pages/app/Ranking.jsx` | nova tabela de melhores tempos por percurso |
| `package.json` / `package-lock.json` | nova dependência: `leaflet` |

**Verificação:** `npm run build` ok (aviso de chunk > 500 kB por causa do
Leaflet) e `npm run lint` 0/0.

### Pendências abertas desta rodada

- **Percurso como entidade de verdade**: hoje "Ciclovia da Orla" é só uma
  string solta no array do Ranking. Falta modelar coordenadas de início/fim
  (ou referência ao trajeto gravado no mapa), pra validar de verdade se o
  confronto aconteceu ali.
- Conectar o resultado do cronômetro (tempo + trajeto) ao Ranking por
  percurso e ao fluxo de Confronto (hoje são estados locais independentes).

---

## 2026-09-24 — Correções no mapa (bug do container + marcador errado) e renomeação Cronômetro → Mapa

### Contexto da rodada

Patrick reportou dois bugs na tela do Cronômetro e pediu renomeação:

1. **"Map container not found"** no DevTools (F12) — o mapa não aparecia.
2. **Marcador no lugar errado** — o mapa abria mostrando o Maracanã em vez
   da localização real.
3. Renomear a página/menu de "Cronometrar Desempenho" para **"Mapa"**.

### Bug 1 — "Map container not found" (corrida de timing)

**Causa raiz:** `iniciarMapa()` era chamado via
`setTimeout(() => iniciarMapa(posicao), 0)` logo após
`setConsentimento("concedido")`. O `setTimeout(0)` **não garante** que o
React (v19, batch + scheduler via `MessageChannel`) já commitou o `<div
ref={mapaRef}>` no DOM — o timeout podia disparar antes do render.
Resultado: `mapaRef.current === null` → `L.map(null)` → erro, mapa nunca
criado (área em branco).

**Solução:** guardar a posição num ref (`posicaoInicialRef`) e criar o
mapa num `useEffect([consentimento])` — effects rodam **depois** do commit
do DOM, então o `<div>` sempre existe. Guarda extra
(`mapaInstanciaRef.current`) evita dupla inicialização (StrictMode).

### Bug 2 — marcador no Maracanã (posição inicial imprecisa)

**Causa raiz:** a primeira leitura de `getCurrentPosition` frequentemente
vem de **estimativa por IP/cache** (metros a km de distância — cai no
centro da cidade), e o `watchPosition` só era ligado ao apertar "Iniciar
Cronômetro" — até lá, o marcador ficava preso no fix inicial errado.

**Solução (três partes):**

1. `getCurrentPosition`/`watchPosition` agora usam
   `{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }` —
   `maximumAge: 0` proíbe posição em cache.
2. `watchPosition` passa a ligar **junto com o mapa** (no mesmo
  `useEffect`), não só ao iniciar o cronômetro: quando chega um fix mais
  preciso, o marcador recentraliza sozinho. Distância/trajeto só acumulam
  quando `rastreandoRef.current === true` (espelho síncrono do estado
  `rastreando`).
3. **Círculo de precisão** (`L.circle` com raio = `coords.accuracy`) ao
  redor do marcador + indicador textual "Precisão: ±X m"; se
  `accuracy > 1000 m`, alerta amarelo explicando que o navegador está
  estimando sem GPS e como ativar a localização no Windows.

### Mudança — renomeação "Cronometrar Desempenho" → "Mapa"

| Arquivo | Mudança |
| --- | --- |
| `src/pages/app/Cronometro.jsx` | **renomeado** → `src/pages/app/Mapa.jsx`; componente `Cronometro` → `Mapa`; `h1` e textos da tela agora dizem "Mapa" |
| `src/App.jsx` | import do `Mapa`; rota nova `mapa`; rota antiga `cronometro` vira `<Navigate to="/app/mapa">` (link velho continua funcionando) |
| `src/components/layout/AppLayout.jsx` | item de menu `{ to: "mapa", texto: "Mapa" }` (continua sendo o penúltimo item; **Perfil** permanece o último) |

Botões internos mantiveram o nome ("Iniciar Cronômetro" / "Parar
Cronômetro") — só o nome da página/tela mudou, como pedido.

**Observação:** a rota antiga `/app/cronometro` redireciona, então link
antigo (inclusive no ar no GitHub Pages) não quebra.

### Mudança — consolidação dos MDs da pasta `mudancas/`

- Todos os MDs foram fusionados num único **`mudancas/soul.md`** (antes
  `README.md`), renomeado a pedido:
  - `00-contexto-completo-do-projeto.md` → Parte 1 do `soul.md`.
  - `01-historico-de-alteracoes.md` (gerado pelo Claude, com a entrada da
    geolocalização) → absorvido como seção do Parte 2.
  - `02-historico-de-alteracoes.md` → já estava no `soul.md`.
- Arquivo `01-historico-de-alteracoes.md` removido após o merge.

### Verificação feita nesta rodada

- `npm run lint` (oxlint): **0 warnings / 0 errors**.
- `npm run build`: **ok** (aviso de chunk > 500 kB esperado por causa do
  Leaflet; demais avisos são os deprecation do Sass já documentados).
- Pendente de teste manual no navegador: marcador centralizar na localização
  real (pode exigir ativar a localização do Windows/PC).

---

## Próximos passos (pendências do front-end — valem pra qualquer rodada)

- Telas ainda rascunho (sem interação real): `Tempos`, `Consultoria`.
- Modelar o **percurso/ciclovia** como entidade de verdade (coordenadas de
  início/fim), não só uma string solta — necessário pra validar Confronto
  contra o trajeto gravado no Mapa de verdade.
- Conectar os três estados locais hoje independentes: resultado do
  cronômetro no Mapa (tempo + trajeto) → Ranking por percurso → fluxo de
  Confronto.
- CRUD de Conta na página `/app/perfil` (os botões "Editar conta" e "Mudar
  perfil" existem mas ainda não fazem nada — ver entrada de 2026-09-23).
- Cobrir lacunas da Matriz CRUD: CRUD de Equipe, Consultar/Cancelar
  Confronto, Excluir Ciclista.
- Interfaces diferenciadas por perfil (Ciclista × Equipe) nas
  funcionalidades compartilhadas.
- Persistência de cadastro/login (localStorage; API real numa etapa futura).

*(Nova entrada = nova seção acima desta linha.)*
