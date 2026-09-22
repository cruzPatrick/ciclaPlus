# Cicla+ — Contexto Completo do Projeto

*Documento consolidado: domínio, requisitos, decisões de refinamento e estrutura
técnica. Pensado para dar contexto completo a quem (humano ou IA) for continuar
o desenvolvimento.*

---

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
        TreinoEquipe.jsx       -> "/app/treino-equipe"
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
