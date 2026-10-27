# backlog.md — Cicla+ (pendências e tarefas futuras)

*Tarefas ainda não começadas ou em andamento. Ao concluir algo daqui, move
pra `changelog.md` com o registro da rodada. Regras e contexto do projeto:
`SOUL.md`.*

---

## Funcionalidades / product

- [ ] **CRUD de Equipe** (Manter Equipe completo — lacuna da Matriz CRUD).
  `db.json` já tem a coleção `equipes` (usada no formulário de Treino em
  Equipe), mas só leitura — faltam criar/editar/excluir.
- [ ] **Excluir Ciclista** (lacuna da Matriz CRUD) — não existe fluxo de
  exclusão de conta.
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
