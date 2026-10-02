# changelog.md — Cicla+ (histórico de tudo que já foi feito)

*Registro cronológico das rodadas de trabalho no protótipo: de onde veio
*cada mudança, por quê e como verificar. Diretrizes, stack e regras do
*projeto: `SOUL.md`. Pendências e tarefas futuras: `backlog.md`.*

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

## 2026-09-24 — Documentação dividida: soul.md → SOUL.md + backlog.md + changelog.md

### Contexto

A pedido do Patrick: separar o `soul.md` (que tinha virado um arquivo único
gigante misturando contexto, histórico e pendências) em três papéis claros.

### Mudança

| Arquivo | Papel |
|---|---|
| `SOUL.md` | diretrizes, stack, regras invioláveis, paleta, rotas e tom/personalidade (limite de 150 linhas, meta 50–100) |
| `backlog.md` | apenas pendências e tarefas futuras (checklist `- [ ]`) |
| `changelog.md` | histórico de tudo que já foi feito (todas as rodadas) |

- `soul.md` foi **removido**; conteúdo distribuído nos três arquivos.
- Itens do antigo "Próximos passos" migraram para o `backlog.md` (mais o
  bug dos 50 km do marcador, reportado nesta data).
- Regra registrada no `SOUL.md`: toda rodada nova entra no `changelog.md`;
  item concluído sai do `backlog.md`.

**Arquivos:** `mudancas/soul.md` (removido); `mudancas/SOUL.md`,
`mudancas/backlog.md`, `mudancas/changelog.md` (novos).

---

## 2026-09-27 — Renomeação de menu/tela: "Descobrir Ciclistas" → "Dar Match"

### Contexto da rodada

A pedido do Patrick: mudar o nome da parte de descobrir ciclistas pra
**"Dar Match"**. Só o nome exibido mudou — rota, arquivo e componente
continuam os mesmos (`/app/descoberta`), pra não quebrar links internos
nem o redirect do índice `/app`.

### Mudança

| Arquivo | Mudança |
|---|---|
| `src/components/layout/AppLayout.jsx` | item de menu `{ to: "descoberta", texto: "Dar Match" }` (hambúrguer desktop e abas mobile, que compartilham o array `ITENS`) |
| `src/pages/app/Descoberta.jsx` | `h1` da tela: "Descobrir Ciclistas" → "Dar Match" |
| `mudancas/SOUL.md` | exemplo de nomes de menu curtos atualizado (`Dar Match`, `Mapa`, `Ranking`) |

**Como verificar:** abrir qualquer rota `/app/*` — o primeiro item do
hambúrguer (desktop) e a primeira aba (mobile) devem aparecer como
**Dar Match**; `/app/descoberta` mostra o `h1` "Dar Match".

### Verificação feita nesta rodada

- `npm.cmd run lint` (oxlint): **0 warnings / 0 errors**.
- `npm.cmd run build`: **ok** (só os avisos esperados — deprecation do
  Sass e chunk > 500 kB do Leaflet).

---

## 2026-09-27 — Dar Match em fila de cards, Chat responsivo e Treino com lista de marcados

### Contexto da rodada

Refinamento de front-end das três telas: transformar a página **Dar Match**
numa fila de avaliação de cards (estilo "swipe"), dar ao **Chat** um
layout que muda de verdade no mobile, e fazer o **Treino** deixar de ser
só um form inerte — o agendamento agora alimenta uma lista de treinos
marcados. Tudo ainda com dados locais (regra 1: sem backend).

### Mudança 1 — `src/pages/app/Descoberta.jsx` (Dar Match): grid → fila de cards

**Antes:** grade de cards (`row`/`col-md-6`/`col-lg-4`) onde cada card
tinha um botão de texto "Dar Match"; depois de clicar, virava o badge
"Match dado ✓" e o card ficava parado ocupando espaço.

**Depois:**

- **`CardCandidato`** (componente novo, extraído): avatar circular com
  Material Icons (`person`), nome, `tipo · distância`, e dois botões
  circulares de 48px — **passar** (`close`, outline) e **dar match**
  (`favorite`, primary) — com `aria-label` por candidato.
- **Modelo de dado mudou:** `estiloPedal`/`deuMatch: boolean` →
  `tipo`/`status: "pendente" | "passou" | "match"`. A função virou
  `avaliar(id, status)`.
- **Mobile (`d-lg-none`):** só **um card por vez** — o primeiro da fila
  `pendentes` (`maxWidth: 300px`, centralizado). Ao decidir, o próximo
  aparece sozinho.
- **Desktop (`d-none d-lg-flex`):** todos os pendentes lado a lado
  (`flex-wrap gap-3`, cards de 220px).
- **Estado vazio:** quando não sobra pendente,
  "Sem novos ciclistas por perto no momento."
- Cards avaliados (`passou`/`match`) saem da fila — antes ficavam na tela.

### Mudança 2 — `src/pages/app/Chat.jsx`: um layout por breakpoint

**Antes:** um único layout de 4+8 colunas (lista + conversa) servindo
tanto mobile quanto desktop — no celular as duas metades ficavam
espremidas empilhadas.

**Depois:**

- Componentes extraídos: **`ItemConversa`** (item da lista com ícone
  `account_circle`, nome e `distanciaKm`) e **`ThreadConversa`**
  (histórico de mensagens + form de envio) — reusados nos dois layouts.
- **Mobile (`d-lg-none`):** estado `telaMobile` (`"lista"` | `"thread"`)
  — **uma tela por vez**: lista → ao tocar numa conversa abre a thread
  com botão **Voltar** (`arrow_back`); nunca aparecem juntas.
- **Desktop (`d-none d-lg-block`):** lista (`col-lg-4`) e thread
  (`col-lg-8`) lado a lado, como antes.
- Conversas ganharam `distanciaKm`; bolhas seguem a paleta (Você →
  `bg-primary` à direita; outro → `bg-ciclagrey`).

### Mudança 3 — `src/pages/app/Treino.jsx`: agendar agora cria registros

**Antes:** `onSubmit={previneEnvio}` nos dois forms — só evitavam o
reload da SPA, nada era criado.

**Depois:**

- **`marcarTreino(evento)`** lê os campos com `FormData`, monta
  `{ id: Date.now(), data, hora, tipo, feito: false }`, acrescenta em
  `treinosMarcados` (estado novo, com 1 item semente) e faz
  `evento.target.reset()`. Inputs com `required`.
- **Nova coluna "Marcados"** (`col-lg-8`, `table striped`): Data, Hora,
  Tipo (`RATULO_TIPO`) e checkbox **Feito** — `alternarFeito(id)` alterna
  o estado; o form fica em `col-lg-4`.
- Layout dos forms virou `row g-4` (form à esquerda, tabela à direita),
  em vez das duas `section` empilhadas.

**Arquivos alterados:**

| Arquivo | Mudança |
|---|---|
| `src/pages/app/Descoberta.jsx` | fila de cards com `CardCandidato`, `status` por candidato, layout mobile (1 por vez) × desktop (grade) |
| `src/pages/app/Chat.jsx` | `ItemConversa` + `ThreadConversa` extraídos; `telaMobile` (lista ↔ thread) no mobile; desktop lado a lado |
| `src/pages/app/Treino.jsx` | `marcarTreino` com `FormData`, lista `treinosMarcados` + tabela "Marcados" com checkbox Feito |

**Como verificar:**

- `/app/descoberta` — desktop: 3 cards com X/coração; clicar num card o
  remove da fila. Mobile (< 992px): um card por vez; esgotar a fila mostra
  a mensagem de vazio.
- `/app/chat` — desktop: lista + conversa lado a lado; mobile: só a
  lista, tocar abre a conversa com "Voltar".
- `/app/treino` — preencher data/hora e "Agendar": o treino aparece na
  tabela "Marcados"; o checkbox Feito marca/desmarca.

### Verificação feita nesta rodada

- `npm.cmd run lint` (oxlint): **0 warnings / 0 errors**.
- `npm.cmd run build`: **ok** (só os avisos esperados — deprecation do
  Sass e chunk > 500 kB do Leaflet).

---

## 2026-09-29 — Rodada Gemini: semântica HTML5 + a11y, swipe no Dar Match, aceite duplo no Confronto, Tempos funcional e nova cara do Cronômetro

### Contexto da rodada

Refinamento de front-end de **6 páginas** com apoio do **Gemini**. O
registro que ele gerou (`mudancas/gemini-code-1790690927316.md`) foi
**mergeado neste changelog** a pedido — um único histórico de verdade —
e o arquivo avulso removido após a fusão (mesmo precedente da fusão de
2026-09-24). Conteúdo do MD do Gemini aparece abaixo como
*"registro do Gemini"*; os detalhes extras vêm da leitura das diffs.

### 1. `Login` (`/login`)

*Registro do Gemini: substituição de alertas por elementos semânticos e
melhoria de acessibilidade/estrutura do form.*

- **Erro de credenciais:** `div.alert.alert-danger` → **`<aside>`**
  estilizado (`bg-light border border-danger text-danger rounded p-2`)
  — mesma regra de "sem alerta genérico" da seção de regras abaixo.
- **Semântica:** `div.auth-card` → `<article>`, foto → `<figure>`, bloco
  de conteúdo → `<section>`, título/apresentação → `<header>`, campos
  `.form-floating` → `<section>`.

### 2. `Dar Match / Descoberta` (`/app/descoberta`)

*Registro do Gemini: gestos de swipe no mobile com feedback visual e
grade estática no desktop.*

- **Mobile (swipe):** `CardCandidato` ganhou arraste por touch
  (`touchStart/Move/End`, threshold de **100 px**): arrastar pra
  **direita = match**, pra **esquerda = passar**. Durante o arraste o
  card acompanha o dedo (`translate3d` + `rotate(dx × 0.1)`) e mostra o
  selo **MATCH** (verde, `aside`, opacidade proporcional ao arraste) ou
  **PASSAR** (vermelho). Soltou dentro do threshold = card volta pro
  lugar. `touch-action: pan-y` pra não brigar com a rolagem.
- **Desktop:** continua a grade estática com os botões X/coração
  (`isMobile={false}` — sem arraste).
- **Instrução temporária:** "👈 Arraste para passar | Arraste para dar
  match 👉" aparece abaixo do card no mobile e some sozinha **1 s** após
  abrir a tela (`setTimeout`).
- **Semântica:** card → `<article>`, avatar → `<figure>`, nome/perfil →
  `<header>`, botões → `<nav>`, mensagem de fila vazia → `<aside>`.

### 3. `Cronômetro / Mapa` (`/app/mapa`)

*Registro do Gemini: layout responsivo, fluxo de permissão ajustado e
avisos de precisão via `<aside>`.*

- **Títulos:** "Mapa" → **"Cronometrar percurso"** nas duas telas
  (consentimento e mapa). ⚠️ o item do menu também mudou (ver seção 6) —
  o `SOUL.md` ainda diz "Mapa" (pendência no `backlog.md`).
- **Tela de consentimento:** vira um **card centralizado**
  (`min-vh-100`, `maxWidth: 480px`) com o texto de LGPD e o botão
  "Permitir localização e continuar" em largura total.
- **Tela do mapa:** container centralizado de `720px`; **timer e
  distância** num painel (`<article>` com rótulos "Timer"/"Distância");
  iniciar/parar viraram **botões circulares de 44px** com ícone
  (`play_arrow`/`stop`) e `aria-label`. O indicador inline "Precisão:
  ±X m" saiu da barra — a precisão agora aparece só no **aviso**
  (`<aside>` amarelo) quando `accuracy > 1000 m`.
- **Mapa:** `<div>` → **`<figure>`** com 450px de altura, borda arredondada
  de `1rem`, `border-primary-subtle` e `shadow-sm`.
- **Avisos de erro/permissão:** `alert` → `<aside>` estilizado.
- **Observação:** os comentários explicativos do arquivo (corrida de
  timing do Leaflet, `maximumAge: 0`, Haversine...) foram **removidos** —
  o contexto histórico continua documentado nesta e nas entradas antigas.

### 4. `Gerenciar Tempos` (`/app/tempos`)

*Registro do Gemini: centralização/limite de largura, barra de ações
responsiva e modo de edição.*

- **De rascunho a funcional:** a tela agora tem lista local de trajetos
  (4 itens semente: nome, tempo, distância), **busca por nome**
  (`input type="search"` + botão com ícone, `aria-label`), estado vazio
  ("Nenhum trajeto encontrado." em `<aside>`) e **exclusão** de trajeto.
- **Modo de edição:** botão **Editar/Concluir** alterna `modoEdicao`; no
  modo edição cada trajeto ganha o botão de excluir (ícone `delete`).
  No **desktop** o botão fica na barra de topo à direita; no **mobile**,
  num `<footer>` no rodapé da página.
- **Layout:** container centralizado com `maxWidth: 720px`; h1
  "Gerenciar Tempo" centralizado no mobile.
- **Semântica:** `<header>`, `<nav>` (barra), `<article>` (cards),
  `<section>`, `<footer>`, `<aside>` (estado vazio).

### 5. `Confrontos` (`/app/confronto`)

*Registro do Gemini: fluxo de aceite duplo — só matches podem ser
desafiados e o confronto tem estados de status.*

- **Só desafia quem deu match:** o input de texto livre virou
  **`<select>`** alimentado por `minhosMatches` (lista local que espelha
  os matches da aba Dar Match), com `required` e label
  `visually-hidden`.
- **Aceite duplo — novos status:**

  | Status | Rótulo (badge) | Ação disponível |
  |---|---|---|
  | `pendente_aceite_adversario` | Aguardando adversário | — (só espera) |
  | `pendente_meu_aceite` | Aguardando seu aceite | **Aceitar Confronto** |
  | `confirmado` | Confronto Autorizado | **Vitória** / **Derrota** |
  | `resultado_registrado` | Resultado registrado | **Encerrar** |
  | `encerrado` | Encerrado | — |

- Ao marcar um desafio novo, o confronto nasce em
  `pendente_aceite_adversario`; `aceitarDesafio` leva
  `pendente_meu_aceite` → `confirmado` (o velho "Confirmar Confronto"
  sumiu). Botões encurtaram (Vitória/Derrota/Encerrar).
- **Layout:** container `720px` centralizado; form num card "Desafiar um
  Match"; lista virou cards (`<article>`) em vez de `list-group`.
- **Semântica:** `<header>`, `<nav>` (ações), `<article>`, `<section>`,
  `<aside>` não usado aqui.

### 6. `AppLayout` (menu da área interna) — observado nas diffs

- **Item de menu `mapa`: "Mapa" → "Cronômetro"** (a rota continua
  `/app/mapa`; nenhum link quebra). ⚠️ conflito documentado com o
  `SOUL.md`, que ainda lista "Mapa" como nome de menu.
- **Semântica:** container externo do menu desktop e das abas mobile
  viraram `<nav>`; overlay, painel e scroll de abas viraram `<section>`.

---

## 📐 Regras de layout e design aplicadas *(mergeadas do MD do Gemini)*

1. **Substituição de alertas globais:** nenhum alerta genérico (`.alert`
   do Bootstrap ou `alert()` do JS) pra avisos/erros — usar **`<aside>`**
   com estilização leve (bordas suaves, fundo neutro) e mensagem clara
   que aponta o próximo passo. *(Conferido nesta rodada: zero
   ocorrências de `alert` em `src/`.)*
2. **Navegação adaptativa:** desktop (`d-lg-block`) = menu lateral
   retrátil (overlay + painel) por hambúrguer, com fechamento por `ESC`;
   mobile (`d-lg-none`) = barra de abas com rolagem horizontal e
   indicador deslizante sincronizado com a rota.
3. **Semântica HTML5 e acessibilidade:** uso de `<main>`, `<header>`,
   `<article>`, `<nav>`, `<aside>`, `<figure>` e `<footer>` no lugar de
   `<div>` genéricas; rótulos pra leitores de tela (`aria-label`,
   `visually-hidden`) em botões de ação e campos de busca.

---

**Arquivos alterados nesta rodada:**

| Arquivo | Mudança |
|---|---|
| `src/pages/Login.jsx` | erro em `<aside>`; semântica `article/figure/section/header` |
| `src/pages/app/Descoberta.jsx` | swipe com selos MATCH/PASSAR no mobile; instrução temporária; semântica |
| `src/pages/app/Mapa.jsx` | telas "Cronometrar percurso"; painel timer/distância; botões circulares; mapa 450px arredondado; avisos em `<aside>` |
| `src/pages/app/Tempos.jsx` | lista de trajetos + busca + modo edição/exclusão; container 720px |
| `src/pages/app/Confronto.jsx` | aceite duplo (5 status), select só com matches, cards |
| `src/components/layout/AppLayout.jsx` | menu "Cronômetro"; `div` → `nav`/`section` |
| `mudancas/gemini-code-1790690927316.md` | **removido** — conteúdo mergeado nesta entrada |

**Como verificar:**

- `/login` — errar a senha: o erro aparece num `<aside>` vermelho (sem
  `.alert`), não num `alert()` do navegador.
- `/app/descoberta` — no mobile, arrastar o card pra direita/esquerda:
  selo MATCH/PASSAR e o card sai da fila; instrução some após 1s. No
  desktop, grade com botões.
- `/app/mapa` — consentimento em card centralizado; depois, timer +
  distância no painel, play/stop redondos e mapa maior arredondado.
- `/app/tempos` — buscar filtra; Editar → ícone de excluir em cada card;
  "Concluir" sai do modo edição.
- `/app/confronto` — select só lista os matches; confronto novo nasce
  "Aguardando adversário"; o de "Aguardando seu aceite" tem botão
  Aceitar; só "Confronto Autorizado" registra Vitória/Derrota.

### Observações desta rodada

- Nome do menu/tela divergiu dos docs: código agora usa **"Cronômetro"**
  (menu) e **"Cronometrar percurso"** (h1), `SOUL.md` ainda diz "Mapa" —
  pendência registrada no `backlog.md`.
- Instrução de swipe do Dar Match dura só **1 s** (talvez curto demais —
  avaliar se vale deixar até o primeiro swipe).
- Comentários explicativos do código das 6 páginas foram removidos
  (contexto preservado neste changelog).
- Arquivos salvos sem newline final (`\ No newline at end of file`).
- **Ajuste de lint nesta rodada:** a remoção do
  `// eslint-disable-next-line react-hooks/exhaustive-deps` expôs 2
  warnings novos do oxlint (`react(immutability)` em `Mapa.jsx` —
  `iniciarMapa`/`atualizarPosicao` lidas no `useEffect` antes da
  declaração). Corrigido movendo as duas funções pra **antes** do effect
  que as usa (mesmo comportamento em runtime, hoisting — só a ordem no
  arquivo mudou).

### Verificação feita nesta rodada

- `npm.cmd run lint` (oxlint): **0 warnings / 0 errors** (2 warnings
  introduzidos pela rodada foram corrigidos — ver observação acima).
- `npm.cmd run build`: **ok** (`EXIT=0`; `dist/index.html` e
  `dist/404.html` gerados; só os avisos esperados — deprecation do Sass
  e chunk > 500 kB do Leaflet).

---

## 2026-09-30 — HTML semântico varrido pelo projeto: div → article/section/figure

### Contexto da rodada

A pedido do Patrick: **usar HTML semântico em todo o projeto**, reabrir
todos os documentos (`SOUL.md`, `backlog.md`, `changelog.md`, `README.md`)
e atacar os arquivos com **muita `<div>`**. Levantamento inicial: **27
`<div>` em 6 arquivos** — Landing (7), Treino (8), Chat (6), Perfil (3),
Cadastro (2), AppLayout (1). As demais telas já estavam semânticas
(login, Dar Match, Cronômetro/Mapa, Tempos, Confrontos — rodada de
2026-09-29), assim como `Header.jsx` e `Footer.jsx`.

### Regra de conversão aplicada (agora regra 10 do `SOUL.md`)

| Vira semântico | Fica `<div>` (layout puro) |
|---|---|
| `card` → `<article>` | page wrapper `d-flex flex-column min-vh-100` |
| `card-body` / bloco de conteúdo → `<section>` | `container`, `row` |
| `col*` que aloja um bloco de conteúdo → `<section>` | wrappers de breakpoint (`d-lg-none`, `d-none d-lg-block`) |
| campos de formulário (label+input) → `<section>` | agrupamentos visuais sem conteúdo próprio |
| banner/foto → `<figure>` (com `m-0`, padrão do `auth-card`) | |
| avisos/erros → `<aside>` (já era, mantido) | |

### Mudança por arquivo

| Arquivo | Antes (divs) | Depois | O que mudou |
|---|---|---|---|
| `src/pages/Landing.jsx` | 7 | 5 | destaque: `col-md-4` → `<section>`, `card` → `<article>`, `card-body` → `<section>` |
| `src/pages/app/Treino.jsx` | 8 | 1 | `col-lg-4` (form) e `col-lg-8` (Marcados) → `<section>`; 5 wrappers de campo → `<section>` |
| `src/pages/app/Chat.jsx` | 6 | 3 | caixa de mensagens → `<section>`; `col-lg-4` (lista) e `col-lg-8` (thread) → `<section>` |
| `src/pages/app/Perfil.jsx` | 3 | 0 | `perfil-card` → `<article>`, banner → `<figure class="perfil-banner m-0">`, conteúdo → `<section>` |
| `src/pages/Cadastro.jsx` | 2 | 1 | wrapper de campo do form → `<section>` |
| `src/components/layout/AppLayout.jsx` | 1 | 1 | só o page wrapper — mantido (layout puro) |

**Saldo: 27 → 11 `<div>`** (11 de abertura, 11 de fechamento — conferido
com grep), todas em puro layout Bootstrap. Nenhuma classe CSS mudou —
`section`/`article`/`figure` recebem as mesmas classes do Bootstrap, então
o visual fica idêntico.

**Também atualizado nesta rodada:**

- `mudancas/SOUL.md` — **regra 10** (HTML semântico) adicionada às regras
  invioláveis, codificando o pedido desta rodada.
- `mudancas/backlog.md` — item "Telas ainda rascunho" agora só cita
  `Consultoria` (`Tempos` ficou funcional na rodada de 2026-09-29;
  conferido lendo `Consultoria.jsx`, que continua estático).

**Como verificar:**

- F12 em qualquer página: `main`, `header`, `nav`, `section`, `article`,
  `figure`, `footer` no lugar das divs de conteúdo; `<div>` restante só
  em wrapper/grid.
- `/` (Landing): os 3 cards de destaque continuam idênticos visualmente.
- `/app/perfil`: banner continua no topo do card (figure com `m-0` não
  ganhou a margem padrão de `figure`).
- `/app/treino` e `/app/chat`: forms, tabela e conversas inalterados.

### Verificação feita nesta rodada

- `npm.cmd run lint` (oxlint): **0 warnings / 0 errors**.
- `npm.cmd run build`: **ok** (`EXIT=0`; `dist/index.html` e
  `dist/404.html` gerados; só os avisos esperados — deprecation do Sass e
  chunk > 500 kB do Leaflet).

---

## 2026-09-30 — Chat restrito a matches reais, cronômetro sem resetar, tempo só via percurso rastreado

### Contexto da rodada

A pedido do Patrick, três correções de consistência de dados — até aqui,
"match", "conversa" e "tempo registrado" eram listas independentes, cada
tela com a sua própria simulação, sem nenhuma ligação real entre elas.

---

### Problema 1 — Chat mostrava gente com quem nunca se deu match

**Causa raiz:** `Chat.jsx` guardava sua própria lista fixa de conversas
(Ana Beatriz, Bruno Costa), sem nenhuma relação com o `status` dos
candidatos em `Descoberta.jsx`. Dar ou não match em "Dar Match" não
mudava em nada quem aparecia no Chat.

**Solução — state de matches levantado pro `AppLayout`:**

1. `AppLayout` passou a guardar `matches` (lista local, em memória — regra
   1 do `SOUL.md` continua valendo) e distribuir via `<Outlet context={{...}}/>`
   pras rotas filhas.
2. `Descoberta.jsx` chama `adicionarMatch` sempre que `avaliar(id, "match")`
   acontece — é o único lugar do app que grava um match novo.
3. `Chat.jsx` deixou de ter lista própria: as conversas agora são
   derivadas de `matches` (mensagens ficam num dicionário local por id,
   `mensagensPorMatch`). Sem nenhum match, a tela mostra só um aviso —
   não existe mais como abrir o Chat sem ter dado match antes.
4. Ana Beatriz e Bruno Costa nascem com `status: "match"` em `Descoberta`
   (preserva o histórico de conversa que já existia); Camila Rocha
   continua pendente, disponível pra demonstrar o match acontecendo ao
   vivo e aparecendo no Chat na hora.

**Arquivos alterados:** `src/components/layout/AppLayout.jsx`,
`src/pages/app/Descoberta.jsx`, `src/pages/app/Chat.jsx`.

**Como verificar:** abrir `/app/chat` — só Ana e Bruno aparecem. Ir em
`/app/descoberta`, dar match em Camila Rocha, voltar pro Chat — Camila
aparece na lista, com histórico vazio, pronta pra primeira mensagem.

---

### Problema 2 — Cronômetro zerava tempo/distância/trajeto ao retomar

**Causa raiz:** `iniciarCronometro()` fazia `setTempoMs(0)` e
`setDistanciaM(0)` incondicionalmente toda vez que era chamada — inclusive
ao apertar play de novo depois de um stop no meio do percurso, perdendo
todo o progresso. A trilha desenhada no mapa também reiniciava do zero a
cada novo play.

**Solução:**

1. `inicioRef.current = Date.now() - tempoMs` em vez de `Date.now()` — o
   cronômetro retoma a contagem de onde parou, não zera.
2. O ponto inicial da trilha (`trajetoRef`) só é definido quando ela está
   vazia (primeira vez rodando); ao retomar, a linha já desenhada
   continua a partir de onde parou.
3. `pararCronometro()` continua só pausando (já não zerava nada — esse
   comportamento foi mantido).
4. O reset de `tempoMs`/`distanciaM`/`trajetoRef` passou a acontecer só
   dentro da nova `finalizarCronometro()` (ver Problema 3), depois que o
   tempo já foi salvo.

**Arquivo alterado:** `src/pages/app/Mapa.jsx`.

**Como verificar:** em `/app/mapa`, iniciar o cronômetro, esperar alguns
segundos, parar, esperar, apertar play de novo — o timer continua
contando de onde parou, não volta pra `00:00`.

---

### Problema 3 — Nada impedia um tempo de "existir" sem vir do mapa

**Causa raiz:** `Tempos.jsx` guardava sua própria lista local de
trajetos — nada no código validava que um tempo realmente veio de um
percurso rastreado; era só dado simulado solto no componente.

**Solução:**

1. `tempos` também subiu pro `AppLayout` (junto de `matches`), com
   `adicionarTempo` e `excluirTempo` expostos pelo contexto do `Outlet`.
2. `Tempos.jsx` deixou de ter state próprio: lê `tempos` e usa
   `excluirTempo` do contexto. Não existe (nunca existiu, mas agora é
   estrutural) nenhum formulário pra adicionar um tempo manualmente ali.
3. `finalizarCronometro()`, nova função em `Mapa.jsx`, é o **único** lugar
   do app que chama `adicionarTempo` — só fica disponível
   (botão "Finalizar e salvar") quando `tempoMs > 0`, e só fica habilitada
   quando `distanciaM > 0`: exige ter realmente percorrido alguma
   distância rastreada pelo GPS, não só deixado o relógio correr parado.
   Com `tempoMs > 0` e `distanciaM === 0`, aparece um aviso em `<aside>`
   explicando o motivo.

**Arquivos alterados:** `src/components/layout/AppLayout.jsx`,
`src/pages/app/Mapa.jsx`, `src/pages/app/Tempos.jsx`.

**Como verificar:** em `/app/mapa`, iniciar o cronômetro sem se mover —
o botão de finalizar aparece desabilitado com o aviso de distância. Com
localização ativa e alguma distância percorrida, finalizar salva o tempo
e ele aparece em `/app/tempos` (sem nenhum jeito de adicionar um tempo
por lá diretamente).

---

### Observações desta rodada

- `Confronto.jsx` **ainda** mantém sua própria lista local de "matches"
  (`minhosMatches`), independente da lista real levantada nesta rodada —
  não foi tocado aqui por estar fora do pedido, mas é a mesma
  inconsistência do Problema 1, só que numa tela diferente. Registrado no
  `backlog.md`.
- Nome do trajeto salvo pelo Cronômetro é gerado automaticamente
  (`Percurso <data>`) — não existe campo pra nomear o percurso ainda.

### Verificação feita nesta rodada

- `npm run lint` (oxlint): **0 warnings / 0 errors**.
- `npm run build`: **ok** (`EXIT=0`; só o aviso esperado de chunk > 500 kB
  do Leaflet).

---

## 2026-10-01 — Backend mockado (json-server), Tanstack Query, react-hook-form + zod em todo o app

### Contexto da rodada

O professor pediu, pra validar a entrega, que o sistema cumprisse:
escopo prometido implementado e integrado com backend mockado
(json-server); tecnologias de sala (ES6, React, react-hook-form, zod,
Tanstack Query, responsividade via framework de mercado — não media
query/CSS gerado por IA); software realmente usável; código limpo;
dados iniciais pro json-server. Essa rodada reestrutura o app pra
atender isso.

### O que mudou, por camada

**Backend mockado:** `db.json` na raiz, com as 11 coleções do domínio
(`usuarios`, `candidatos`, `matches`, `mensagens`, `treinos`, `equipes`,
`tempos`, `confrontos`, `consultorias`, `ranking`,
`melhoresTemposPorPercurso`). `npm run mock` sobe o json-server na porta
3001.

**Camada de API:** `src/api/client.js` (fetch wrapper com tratamento de
erro) + `src/api/ciclaApi.js` (uma função por operação, agrupada por
recurso). Nenhum componente chama `fetch` diretamente.

**Tanstack Query:** `QueryClientProvider` em `main.jsx`; todos os hooks
de dados em `src/hooks/useCiclaData.js` (`useQuery`/`useMutation`, com
`invalidateQueries` nas mutations pra manter o cache coerente). O state
que tinha sido levantado pro `AppLayout` na rodada anterior (matches,
tempos) saiu de lá — Tanstack Query já é o mecanismo de estado
compartilhado entre páginas, não precisa mais de Outlet context.
`AppLayout` ganhou uma guarda de rota mínima: sem sessão
(`usuarioLogadoId()`), redireciona pra `/login`.

**react-hook-form + zod:** schema de validação em todo formulário da
aplicação — Login, Cadastro, Chat (mensagem), Treino (individual e
equipe), Confronto (desafiar um match), Consultoria (solicitar) e
Perfil (editar conta).

**Telas que eram rascunho/inertes viraram funcionais:**
- `Consultoria.jsx` — tinha zero interação; agora lista solicitações e
  tem formulário de solicitação de verdade, persistido no `db.json`.
- `Perfil.jsx` — "Editar conta" e "Mudar perfil" eram botões que não
  faziam nada; agora editam/alternam de verdade via `PATCH /usuarios/:id`.
  "Sair" agora limpa a sessão e navega pra `/login`.
- `Login.jsx` — antes só aceitava um usuário fixo hard-coded; agora
  autentica contra o `db.json`.
- `Cadastro.jsx` — antes não salvava nada; agora cria o usuário via
  `POST /usuarios` (com checagem de e-mail duplicado).

**Correção de bug do json-server 1.x beta (achado durante o teste
manual desta rodada):** o motor de filtro por querystring do
`json-server@1.0.0-beta.15` se mostrou instável — `?email=...` sozinho
funciona, mas `?email=...&senha=...` combinado, ou `?senha=...`/`?id=...`
sozinhos, retornavam `[]` mesmo com o registro existindo. Pra não
depender de um comportamento de beta, `usuariosApi.autenticar`,
`usuariosApi.emailJaExiste` e `mensagensApi.listarPorMatch` passaram a
buscar a coleção inteira e filtrar no JavaScript. Com o volume de dados
mockado isso não tem custo de performance perceptível.

### Arquivos novos
`db.json`, `src/api/client.js`, `src/api/ciclaApi.js`,
`src/api/sessao.js`, `src/hooks/useCiclaData.js`.

### Arquivos reescritos
`src/main.jsx`, `src/components/layout/AppLayout.jsx`, `src/pages/Login.jsx`,
`src/pages/Cadastro.jsx`, `src/pages/app/Descoberta.jsx`,
`src/pages/app/Chat.jsx`, `src/pages/app/Mapa.jsx`, `src/pages/app/Tempos.jsx`,
`src/pages/app/Confronto.jsx`, `src/pages/app/Treino.jsx`,
`src/pages/app/Ranking.jsx`, `src/pages/app/Consultoria.jsx`,
`src/pages/app/Perfil.jsx`, `package.json` (script `mock`).

### Pendências que ficam — justificativa (pedido do professor)

Não dá pra fechar nesta rodada, documentado em vez de simulado:
- **Interfaces diferenciadas por perfil** (Ciclista × Equipe): a troca de
  perfil já persiste de verdade, mas nenhuma tela muda de comportamento
  com base nela ainda — exige revisar cada tela compartilhada uma a uma.
- **CRUD de Equipe, Consultar/Cancelar Confronto, Excluir Ciclista**
  (lacunas originais da Matriz CRUD): ainda não implementados — ver
  `backlog.md` para detalhe de cada um.
- **Ranking não deriva dos tempos reais do Cronômetro** — `ranking` e
  `melhoresTemposPorPercurso` continuam dados semeados à parte de
  `tempos`, porque o percurso ainda não é uma entidade de verdade (mesma
  pendência já registrada antes desta rodada).

### Como verificar

1. `npm install` (primeira vez) — instala `@tanstack/react-query`,
   `react-hook-form`, `zod`, `@hookform/resolvers` e `json-server`, novos
   nesta rodada.
2. `npm run mock` num terminal (json-server na porta 3001).
3. `npm run dev` em outro terminal.
4. Login com `teste@ciclaplus.com` / `123456` — testado ponta a ponta
   nesta rodada via script Node simulando as chamadas do front (login,
   listar mensagens por match, avaliar candidato → match → chat →
   finalizar cronômetro → tempo salvo), todas confirmadas funcionando
   contra o json-server real.

### Verificação feita nesta rodada

- `npm run lint` (oxlint): **0 warnings / 0 errors**.
- `npm run build`: **ok** (`EXIT=0`; só o aviso esperado de chunk > 500 kB
  do Leaflet).
- Fluxo ponta a ponta contra o json-server real (login, mensagens por
  match, match → chat → tempo): **confirmado funcionando** via script.
- **Não verificado nesta rodada:** o app React de fato rodando num
  navegador (só a build e as chamadas HTTP cruas foram testadas no
  ambiente onde essa rodada foi feita, que não tem navegador disponível).
  Recomendo rodar `npm run mock` + `npm run dev` localmente e conferir
  visualmente antes de considerar essa rodada 100% fechada.

---

## 2026-10-02 — Cadastro rejeita data de nascimento futura e matches viram dados por conta

### Contexto da rodada

Dois bugs reportados pelo Patrick:

1. **Cadastro aceitava data de nascimento no futuro** — o campo só tinha
   `min(1)` no zod. Prova no próprio `db.json`: o usuário `astorias` foi
   criado com `dataNascimento: "2026-10-22"` (data futura na época).
2. **Ao trocar de conta, os matches da conta anterior continuavam
   aparecendo** — `matches` era coleção global: sem `usuarioId` em
   lugar nenhum, e `useMatches()` devolvia a lista inteira pra qualquer
   usuário logado (Chat e Confronto, que consomem o hook, herdavam o
   problema).

### Mudança 1 — `src/pages/Cadastro.jsx`: validação da data

- Função `hoje()` local (`YYYY-MM-DD` no fuso do Brasil — `toISOString`
  usa UTC e adiantaria um dia perto da meia-noite).
- `dataNascimento` no zod ganhou `.refine`: formato de data **e**
  `valor <= hoje()`, com a mensagem "A data de nascimento não pode estar
  no futuro".
- Input ganhou `max={hoje()}`: o date picker nativo já bloqueia escolher
  data futura (a validação do zod cobre digitação manual/programática).

### Mudança 2 — matches por conta

| Arquivo | Mudança |
|---|---|
| `src/api/ciclaApi.js` | `matchesApi.listar` → `listarPorUsuario(usuarioId)`, filtrando no JS (mesmo workaround do beta do json-server usado no login) |
| `src/hooks/useCiclaData.js` | `useMatches()` lê `usuarioLogadoId()`; o id entra na `queryKey` (senão a cache do Tanstack mostraria os matches da conta anterior depois da troca de login) e `enabled` só com sessão; `useAvaliarCandidato` grava `usuarioId` no match novo |
| `src/api/sessao.js` | `usuarioLogadoId()` devolve a string crua em vez de `Number()` — ids gerados pelo json-server são alfanuméricos (`"ye1i6QUqlGY"` → `NaN`, o que quebrava `GET /usuarios/NaN` no Perfil de contas novas) |
| `db.json` | os 4 matches semeados ganharam `usuarioId: "1"` (dono = conta de teste) |

**Bugs irmãos corrigidos junto:** o `NaN` do id (acima) e, por herdagem,
Chat e Confronto passaram a ser por conta sem mexer nos componentes.

### Mudança 3 — escopo por conta estendido a todas as coleções pessoais

Pedido do Patrick na mesma data ("resolva esses problemas"): o padrão de
`matches` foi estendido às demais coleções pessoais.

| Coleção | Leitura | Escrita |
|---|---|---|
| `candidatos`, `treinos`, `tempos`, `confrontos`, `consultorias` | helper `porConta()` no `ciclaApi.js` — `listarPorUsuario(usuarioId)` filtrando no JS | `usuarioId` carimbado nas mutations (hooks `useMarcarTreino`, `useAdicionarTempo`, `useMarcarConfronto`, `useSolicitarConsultoria`) |
| `equipes`, `ranking`, `melhoresTemposPorPercurso` | globais — diretório/leaderboard compartilhado, não dado pessoal | — |

- Hooks `useCandidatos`/`useTreinos`/`useTempos`/`useConfrontos`/
  `useConsultorias` no mesmo molde do `useMatches`: id na `queryKey`,
  `enabled` só com sessão.
- `db.json`: registros semeados das 4 coleções ganharam `usuarioId: "1"`.

### Mudança 4 — dados do `db.json`

- **Fila do Dar Match reabastecida** (estava `candidatos: []` — resíduo do
  teste ponta a ponta da rodada de 2026-10-01): 3 candidatos pra conta de
  teste (Pedro Lima, Júlia Souza, Rafael Nunes) e 3 pra conta secundária
  (Larissa Prado, Caio Mendes, Beatriz Rocha), cada fila com o dono.
- **Data de nascimento futura do usuário `astorias` corrigida**
  (`2026-10-22` → `1999-07-21`) — resíduo do bug 1.

### Como verificar

- Login `teste@ciclaplus.com` → Chat com Ana Beatriz/Bruno Costa/Camila
  Rocha/Elisa Martins. Sair e entrar com `tes@gmail.com` → Chat vazio
  ("Você ainda não deu match com ninguém"), Perfil carrega, Confronto sem
  adversários. Criar um match na conta 2: não aparece na conta 1.
- `/cadastro` com data futura: erro inline "A data de nascimento não pode
  estar no futuro", não navega; com data passada, cadastra normal.

### Verificação feita nesta rodada

- `npm.cmd run lint` (oxlint): **0 warnings / 0 errors**.
- `npm.cmd run build`: **ok** (`EXIT=0`).
- **17 checks automatizados no navegador real** (Brave via DevTools
  Protocol, driver em `%TEMP%\opencode\brave-drive\verify.mjs`):
  **17/17 PASS, zero erros de console** — cobrem troca de conta nos dois
  sentidos, Perfil com id alfanumérico, criação de match isolado por
  conta, `max`/refine da data (rejeita futura, aceita válida) e limpeza
  de todos os dados de teste (usuário, match e candidato de verificação
  removidos do `db.json`).
- **+14 checks de escopo por coleção** (`verify2.mjs`, só leitura):
  **14/14 PASS, zero erros de console** — conta 1 vê fila/treino/tempo/
  confronto/consultoria dela e nada da conta 2, e vice-versa. Rodada
  fechada com **31/31**.
