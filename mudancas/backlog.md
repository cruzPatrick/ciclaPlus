# backlog.md — Cicla+ (pendências e tarefas futuras)

*Tarefas ainda não começadas ou em andamento. Ao concluir algo daqui, move
pra `changelog.md` com o registro da rodada. Regras e contexto do projeto:
`soul.md`.*

---

## Funcionalidades / product

- [ ] **CRUD de Equipe** (Manter Equipe completo — lacuna da Matriz CRUD).
  `db.json` já tem a coleção `equipes` (usada no formulário de Treino em
  Equipe), mas só leitura — faltam criar/editar/excluir.
- [ ] **Consulta dedicada de Confrontos** (histórico/filtros) — hoje a lista
  na própria tela cobre listar, criar, avançar o fluxo e cancelar.
- [ ] **Perfil Equipe com telas próprias** (hoje só muda o menu e a aba de
  treino): ranking de equipes, confronto entre equipes.
- [ ] **Segundo usuário de verdade** respondendo match/confronto (hoje a outra
  parte é simulada por botões "Simular: ...").

## Persistência / backend

Resolvido na rodada de 2026-10-01: ver `changelog.md`. Dados agora vêm
de `db.json` via json-server (`npm run mock`), consumidos com Tanstack
Query; login/cadastro validam contra o backend mockado; sessão
(`usuarioId`) fica em `localStorage`. Escopo por conta (só `matches` em
2026-10-02, estendido no mesmo dia a `candidatos`, `treinos`, `tempos`,
`confrontos` e `consultorias`) também resolvido — ver `changelog.md`.
**API Express + MongoDB (M2, pasta `backend/`):** já cobre **usuário, login (JWT),
perfil (CRUD, foto, tipo de bike, troca de senha, exclusão de conta) e ranking**
(derivado de confrontos encerrados, 100/25). Pendências:

- [ ] **Migrar os demais módulos para a API** (Hugo e demais): matches/descoberta,
  chat, confrontos, boost, treinos, passeios, tempos, percursos, consultorias. Seguir
  `backend/CONVENCOES.md`. Até lá, o ranking geral fica vazio (os confrontos do app
  ainda vivem no json-server) e os dados do json-server (filtrados por `usuarioId`)
  não aparecem para contas novas da API.
- [ ] **Boost na tela** usa `localStorage` (shim em `src/api/ciclaApi.js`); trocar por
  `GET/POST /api/v1/boost` ao migrar. `useConfirmarResultado` ainda grava o ranking do
  json-server (sem efeito): remover ao migrar confrontos.
- [ ] **Alinhar a API ao fluxo do app** (cancelar confronto, rótulo "Aguardando
  retribuição"); hoje a API encerra o confronto em um passo e grava `vencedor`.
- [ ] **Repetir no servidor a validação de data/hora no passado** nos módulos
  migrados (hoje só em `src/utils/dataHora.js`).
- [ ] **Distância nos candidatos** (a API não tem localização; `tipoBike` e `foto`
  já existem no perfil).
- [ ] **Upload de foto** (hoje o perfil aceita só link https), recuperação de senha por
  e-mail e refresh token.
- [ ] **Melhores tempos por percurso** pertencem ao módulo Tempos (ainda json-server).
- [ ] **`passeios` e `percursos` não existem no `db.json`** (o app chama `/passeios` e
  `/percursos`): criar as coleções ou migrar; achado fora do escopo de perfil/ranking.
- [ ] Dados fictícios do ranking para demonstração: a testar depois (decisão do grupo).

## Infra / deploy

- [ ] **Testar o deploy manual de novo do zero** — na última publicação
  (2026-09-24) o GitHub Pages apareceu desabilitado e o run falhou no
  `configure-pages`; foi reabilitado via API (`POST /pages` com
  `build_type: workflow`). Vale confirmar que segue habilitado nas próximas
  publicações.
- [ ] **Marcador do mapa com margem de ~50 km** (reportado em 2026-09-24 em
  produção): suspeita de problema do navegador/PC (estimativa por IP sem
  GPS ativo). Confirmar se ativar a localização do Windows + permitir no
  navegador resolve; se não, investigar `accuracy` vinda da API.

## Nice to have

- [ ] Modo escuro pro app inteiro (hoje só o overlay do menu é escuro —
  paleta precisa ser revista antes).
- [ ] Investigar o aviso de chunk > 500 kB que continua (o Leaflet já é lazy; o resto é Bootstrap JS + React).

---

*(Mova os itens concluídos para o `changelog.md` e apague daqui.)*
