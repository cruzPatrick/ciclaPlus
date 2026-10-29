# SOUL.md — Cicla+ (identidade e regras do projeto)

*Documento-âncora do projeto. Contexto de histórico: `changelog.md`.
Pendências: `backlog.md`. Quem for continuar o desenvolvimento (humano ou
IA) deve ler este arquivo primeiro.*

## O que é

**Cicla+** — rede social de ciclistas (projeto da disciplina de PSW). Usuários
dão match, conversam por chat, marcam treinos (individual/em equipe),
cronometram percursos com mapa, disputam confrontos e acompanham rankings.

- **Perfis de usuário:** Ciclista e Equipe — o menu e algumas telas mudam
  conforme o perfil (ver "Estrutura de rotas").
- **Estado atual:** front-end integrado a um **backend mockado
  (json-server)**: tudo que as telas mostram vem de `db.json` e é gravado
  de volta (match, chat, treino, passeio, tempo, confronto, consultoria,
  boost, ranking). Cadastro cria usuário de verdade no mock.
- **Conta de teste (dado inicial do `db.json`):** `teste@ciclaplus.com` /
  `123456`. Login e cadastro validam contra o mock.
- **Só há uma conta logada por vez:** tudo que depende da *outra parte*
  (retribuir match, aceitar convite de confronto, confirmar resultado) é
  simulado por botões "Simular: ...".

## Stack
| Camada | Tecnologia |
|---|---|
| Build | Vite 8 |
| UI | React 19 + react-router-dom 7 (SPA, `BrowserRouter` com `basename` do Pages) |
| Dados | Tanstack Query (`@tanstack/react-query`) + json-server (`db.json`, porta 3001) — ver `src/api/` e `src/hooks/useCiclaData.js` |
| Formulários | react-hook-form + zod (`@hookform/resolvers/zod`) em todo formulário da aplicação |
| Estilo | Bootstrap 5 via **import parcial do Sass** + paleta Cicla nas variáveis |
| Mapa (GPS opcional) | Leaflet 1.9 + tiles OpenStreetMap, carregado só na aba GPS (`React.lazy`) |
| Lint | oxlint (`npm run lint`) |
| Deploy | GitHub Pages via Actions, **só manual** (`workflow_dispatch`) |
| Backend (M2) | Express 5 + Mongoose + MongoDB (Docker, porta 27018 local), porta 3000 — pasta `backend/`, **em paralelo** ao json-server (ainda não ligada ao app) |
| Testes do backend | `node --test` + `supertest`, banco separado `ciclaplus_test` (`npm test` em `backend/`) |

## Regras invioláveis

1. **Backend mockado via json-server:** dados vivem em `db.json`, servido
   em `http://localhost:3001` (`npm run mock`) e consumidos só através de
   `src/api/*` + hooks do Tanstack Query (`src/hooks/useCiclaData.js`) —
   nenhum componente faz `fetch` direto. Esta regra foi **revisada em
   2026-10-01**: até então era "sem backend, tudo local" — o professor
   passou a exigir integração com backend mockado, então o mock virou
   parte obrigatória do fluxo (ver `npm run dev` + `npm run mock` no
   README). Dados sensíveis de sessão (`usuarioId` logado) continuam só
   em `localStorage`, nunca em texto hard-coded.
   **Extensão M2 (2026-10-27):** existe uma API Express + MongoDB em `backend/`,
   com dados fictícios e uso local. Enquanto o login e os usuários não migrarem
   para ela, o app continua consumindo só o json-server. Quando for ligada, a regra
   de ouro permanece: nenhum componente faz `fetch` direto; tudo passa por
   `src/api/*` e pelos hooks do Tanstack Query.
   
2. **Cores só via variáveis do Bootstrap** (paleta em `custom.scss`): não
   escrever cor hard-coded em CSS/JS — `$primary`/`$secondary`/`.bg-ciclagrey`
   já nascem certos. CSS custom só onde o Bootstrap não cobre.
3. **LGPD:** o modo GPS do Cronômetro é opcional; a localização fica só em
   memória, nunca persistida nem enviada (só o tempo e a distância finais
   são gravados); sempre pedir consentimento explícito antes do prompt
   nativo. O modo padrão do Cronômetro é o **simulado**, sem GPS.
4. **Deploy é manual:** push em `main` **não** publica. Publicar só via
   Actions → *Deploy to GitHub Pages* → *Run workflow*.
5. **Rotas antigas nunca quebram:** ao renomear rota, deixar `<Navigate>`
   de redirect (ex.: `cronometro` → `mapa`).
6. **"Perfil" é sempre o último item** do menu (hambúrguer e abas mobile).
7. **Rodar `npm.cmd run lint` e `npm.cmd run build` antes de commitar**
   (usar `npm.cmd`, o `npm.ps1` é bloqueado pela execution policy).
8. **Registrar toda rodada** no `changelog.md`; pendências novas vão para o
   `backlog.md`.
9. **Avisos do Sass** (deprecation do Bootstrap) e o **aviso de chunk >500 kB**
   (Leaflet) são esperados — não são erros.
10. **HTML semântico em todo o projeto:** usar `<main>`, `<header>`,
    `<nav>`, `<section>`, `<article>`, `<aside>`, `<figure>` e `<footer>`
    no lugar de `<div>`; `<div>` só permanece em layout puro do Bootstrap
    (page wrapper `min-vh-100`, `container`, `row`, wrappers de breakpoint
    `d-lg-none`/`d-none d-lg-block`). Nenhum `alert()`/`.alert` — avisos
    são `<aside>`.
11. **Data e hora no passado nunca:** todo formulário com data ou hora usa
`src/utils/dataHora.js` — `min` no `<input>` e as regras `.refine()` no schema
zod. Enquanto o recurso estiver no json-server, a validação existe só no
frontend; ao migrar para o Express, repetir a regra no servidor.

## Regras de negócio (entre telas)

11. **Match recíproco:** dar match grava `mutuo: false`; só vira `true`
    quando a outra pessoa retribui (botão "Simular" em Dar Match →
    "Aguardando retribuição"). **Chat**, **treino individual** e
    **confronto** só aceitam match recíproco (`utils/match.js`).
12. **Confronto bilateral:** `pendente_aceite_adversario` → `confirmado` →
    `resultado_registrado` → `resultado_confirmado` → `encerrado`. Os passos
    da outra parte são simulados. Só o `resultado_confirmado` pontua no
    Ranking: vitória 100, derrota 25 (`PONTOS_POR_RESULTADO`).
13. **Tempo só existe com percurso verificado:** o Cronômetro simulado
    compara o percurso selecionado com o "percorrido" e recusa se forem
    diferentes; o modo GPS (opcional) só salva com distância rastreada. Tempo
    com percurso conhecido atualiza "melhores tempos por percurso".
14. **Boost** (`boostAte` no usuário) é demonstrativo, sem cobrança: quem tem
    `boost` aparece na frente da fila do Dar Match.
15. **Sem estilo inline** (`style={{}}`) em telas novas ou alteradas: usar
    utilitários do Bootstrap ou uma classe em `custom.scss`.

## Paleta

| Cor | Hex | Papel |
|---|---|---|
| Pine Blue | `#357266` | Primária |
| Taupe Grey | `#6F5E5C` | Secundária |
| Ash Grey | `#AEB7B3` | Apoio |

Preto e branco só como neutros. Layout visual herdado do repositório
`projeto-login` (cards de auth + Material Icons), com essa paleta no lugar
das cores originais.

## Estrutura de rotas

```
/              Landing (pública)
/login         Login (valida contra o db.json)
/cadastro      Cadastro (cria usuário no db.json; recusa e-mail repetido e
               data de nascimento futura)
/app/*         Área interna (AppLayout: hambúrguer desktop + abas mobile)
  descoberta | chat | passeios | treino | mapa | tempos | confronto |
  consultoria | ranking | boost | perfil
```

Menu por perfil (`ITENS` em `AppLayout.jsx`, campo `perfis`):

- **Ciclista:** todos os itens.
- **Equipe:** sem `descoberta`, `chat` e `confronto`; `treino` mostra só a
  aba "Em equipe". Rota proibida pro perfil redireciona pra primeira tela
  permitida.

Nomes canônicos de menu: **Cronômetro** (rota `/app/mapa`, `h1`
"Cronometrar percurso"), **Gerenciar Tempos**, **Confrontos**.

Rotas antigas mantidas como redirect: `treino-individual`, `treino-equipe`
(`?tipo=`) e `cronometro` → `/app/mapa`.

## Tom e personalidade

- Tom **descontraído, direto e motivador** — linguagem de quem pedala junto,
  nunca corporativo/genérico.
- Textos em **português do Brasil**, com `pt-BR` no `html lang`.
- Mensagens de erro **explicam o próximo passo**, não só o problema.
- Microcopy de privacidade **clara e honesta** (dado não sai do navegador).
- Nomes de menu curtos (`Dar Match`, `Mapa`, `Ranking`).
- IA assistindo: este documento é a fonte de verdade; mudanças de regra só
  por alteração explícita nele.

---

*(Última atualização: 2026-10-26 — alinhado ao backend mockado e às regras
de reciprocidade, Boost, Passeios e Cronômetro simulado.)*
