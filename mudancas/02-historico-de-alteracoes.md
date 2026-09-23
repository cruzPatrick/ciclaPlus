# Cicla+ — Histórico de alterações (front-end)

*Log para manter o contexto de cada ação feita no protótipo. Cada rodada de
trabalho vira uma seção nova aqui, com o problema, a causa raiz, a solução,
os arquivos tocados e como verificar. O contexto geral do projeto continua em
`00-contexto-completo-do-projeto.md`.*

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
  (esperados, documentados no `00-contexto-completo-do-projeto.md`).

### Observações de ambiente

- Neste terminal, `npm` (via `npm.ps1`) é bloqueado pela execution policy do
  PowerShell — usar **`npm.cmd run dev`** / `npm.cmd run lint`.
- O dev server sobe em `http://localhost:5173/`; se a porta estiver em uso
  (outre instância do projeto aberta), o Vite sobe em `5174`, `5175`...

---

## 2026-09-22 — Publicação no GitHub Pages

### Objetivo

Publicar o protótipo em **https://cruzpatrick.github.io/ciclaPlus/** e
deploy automático a cada push em `main`.

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
- PRÓXIMO push em `main` já dispara o deploy sozinho.

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
  já documentados em `00-contexto-completo-do-projeto.md`).
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
  documentados em `00-contexto-completo-do-projeto.md`).

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

## Próximos passos (pendências do front-end — valem pra qualquer rodada)

- Refinar as telas internas hoje rascunho: `Descoberta` (match), `Chat`
  (abrir conversa e enviar mensagens), `Tempos`, `Confronto`, `Consultoria`,
  `Cronometro` (o botão "Iniciar Cronômetro" não faz nada ainda).
- Cobrir lacunas da Matriz CRUD: CRUD de Equipe, Consultar/Cancelar
  Confronto, Excluir Ciclista.
- Interfaces diferenciadas por perfil (Ciclista × Equipe) nas
  funcionalidades compartilhadas.
- Persistência de cadastro/login (localStorage; API real numa etapa futura).

*(Nova entrada = nova seção acima desta linha.)*
