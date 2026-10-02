# backlog.md — Cicla+ (pendências e tarefas futuras)

*Tarefas ainda não começadas ou em andamento. Ao concluir algo daqui, move
pra `changelog.md` com o registro da rodada. Regras e contexto do projeto:
`SOUL.md`.*

---

## Funcionalidades / product

- [ ] **Modelar o percurso/ciclovia como entidade de verdade** (coordenadas
  de início/fim, ou referência ao trajeto gravado no Mapa) — hoje
  "Ciclovia da Orla" é só uma string repetida em `tempos` e em
  `melhoresTemposPorPercurso` no `db.json`, sem ligação real entre as
  duas coleções. Necessário pra validar Confronto contra o trajeto de
  verdade e pro Ranking refletir os tempos reais registrados no
  Cronômetro (hoje o Ranking é dado semeado à parte).
- [ ] **CRUD de Equipe** (Manter Equipe completo — lacuna da Matriz CRUD).
  `db.json` já tem a coleção `equipes` (usada no formulário de Treino em
  Equipe), mas só leitura — faltam criar/editar/excluir.
- [ ] **Consultar/Cancelar Confronto** (lacuna da Matriz CRUD) — hoje
  Confronto cobre Criar/Aceitar/Registrar resultado/Encerrar, mas não
  tem uma tela de consulta dedicada nem cancelamento.
- [ ] **Excluir Ciclista** (lacuna da Matriz CRUD) — não existe fluxo de
  exclusão de conta.
- [ ] **Interfaces diferenciadas por perfil** (Ciclista × Equipe) nas
  funcionalidades compartilhadas: Marcar Treino em Equipe, Cronometrar
  Desempenho, Manter Tempo, Marcar Consultoria, Conferir Ranking. A troca
  de perfil em `/app/perfil` já persiste no `db.json` (rodada de
  2026-10-01), mas nenhuma tela ainda muda de comportamento/layout com
  base nisso — fica tudo igual pros dois perfis.

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

- [ ] **Alinhar nome do menu/tela "Mapa" × "Cronômetro"** (rodada de
  2026-09-29): o código agora exibe **"Cronômetro"** no menu e
  **"Cronometrar percurso"** no `h1`, mas o `SOUL.md` e entradas antigas
  do changelog ainda dizem "Mapa". Decidir o nome canônico e atualizar
  os docs (ou o código).

## Nice to have

- [ ] Modo escuro pro app inteiro (hoje só o overlay do menu é escuro —
  paleta precisa ser revista antes).
- [ ] Lazy-loading do Leaflet (o bundle passa de 500 kB por causa dele).

---

*(Mova os itens concluídos para o `changelog.md` e apague daqui.)*
