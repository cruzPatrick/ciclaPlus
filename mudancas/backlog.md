# backlog.md — Cicla+ (pendências e tarefas futuras)

*Tarefas ainda não começadas ou em andamento. Ao concluir algo daqui, move
pra `changelog.md` com o registro da rodada. Regras e contexto do projeto:
`SOUL.md`.*

---

## Funcionalidades / product

- [ ] **Telas ainda rascunho (sem interação real):** `Tempos`,
  `Consultoria`.
- [ ] **Modelar o percurso/ciclovia como entidade de verdade** (coordenadas
  de início/fim, ou referência ao trajeto gravado no Mapa) — hoje
  "Ciclovia da Orla" é só uma string solta no array do Ranking. Necessário
  pra validar Confronto contra o trajeto de verdade.
- [ ] **Conectar os três estados locais hoje independentes:** resultado do
  cronômetro no Mapa (tempo + trajeto) → Ranking por percurso → fluxo de
  Confronto.
- [ ] **CRUD de Conta na página `/app/perfil`** — os botões "Editar conta" e
  "Mudar perfil" existem mas ainda não fazem nada (ver entrada de
  2026-09-23).
- [ ] **CRUD de Equipe** (Manter Equipe completo — lacuna da Matriz CRUD).
- [ ] **Consultar/Cancelar Confronto** (lacuna da Matriz CRUD).
- [ ] **Excluir Ciclista** (lacuna da Matriz CRUD).
- [ ] **Interfaces diferenciadas por perfil** (Ciclista × Equipe) nas
  funcionalidades compartilhadas: Marcar Treino em Equipe, Cronometrar
  Desempenho, Manter Tempo, Marcar Consultoria, Conferir Ranking.

## Persistência / backend

- [ ] **Persistência de cadastro/login** (localStorage; API real numa etapa
  futura). Hoje: login só valida `teste@ciclaplus.com` / `123456` e cadastro
  não salva nada.

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
- [ ] Lazy-loading do Leaflet (o bundle passa de 500 kB por causa dele).

---

*(Mova os itens concluídos para o `changelog.md` e apague daqui.)*
