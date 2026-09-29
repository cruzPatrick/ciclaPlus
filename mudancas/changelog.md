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
