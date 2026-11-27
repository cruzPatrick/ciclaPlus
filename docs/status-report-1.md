# Cicla+ - Status Report 1

**Controle do escopo do marco 1 | Corte: 10/10/2026 | Versão 1.1**

## 1. Data de status, período e referência da entrega

**Data de status:** 10/10/2026, data da instalação que escolhemos como corte. Período coberto: da linha de base de 05/10/2026 até esse corte. Verificação local: 10/10/2026. Usamos como referência a versão mais recente disponível na instalação: [c777368](https://github.com/cruzPatrick/ciclaPlus/commit/c777368132d50c9a86e52287cd80ff814f87605e), commit de 05/10/2026. A avaliação não inclui melhorias posteriores. Adotamos 10/10 como referência da instalação. Isso não comprova que a entrega ou demonstração prevista para 06/10 aconteceu naquela data. Não recebemos comprovante da apresentação; pedimos esse registro em Q09, sem concluir que houve atraso.

**Linha de base consultada:** comparamos a entrega com a declaração do escopo (§4.1), a EAP (§2), as regras (§3) e a matriz de rastreabilidade (§4.3) do [Plano v7](https://github.com/cruzPatrick/ciclaPlus/blob/c777368132d50c9a86e52287cd80ff814f87605e/docs/plano-de-projetoV7.md), junto com o [Dicionário da EAP v1.0](https://github.com/cruzPatrick/ciclaPlus/blob/c777368132d50c9a86e52287cd80ff814f87605e/docs/dicionario-eap.md), ambos de 05/10. Também usamos a matriz CRUD e Perfil × Funcionalidade que reunimos para entender os 15 casos. As sugestões de CRUD adicionais dessa matriz continuam sendo sugestões; não as tratamos como novas obrigações.

**Método:** a aplicação foi instalada em uma cópia separada, com React/Vite e json-server no próprio computador. Os testes das telas usaram Edge 155 e Playwright em Windows, Node 24.18.0 e npm 11.16.0. Só foram usados dados fictícios. Os testes alteraram os dados do servidor simulado (mock) dessa cópia, preservando o código. Instalação, build (geração da versão de distribuição) e lint (checagem de código) terminaram sem erros impeditivos. Os avisos de Sass e de tamanho dos arquivos gerados (bundle) não determinam nossa avaliação do escopo.

T01-T13 identificam os testes no arquivo de evidências que acompanha o relatório. T07 usa um confronto recebido preparado pelo teste. T09 simula coordenadas no navegador; essa preparação não é uma opção de simulação entregue pela PSW. Os demais testes usaram os dados entregues ou registros criados pela interface. Nossa avaliação se apoia nessa verificação automatizada, sem afirmar que cada integrante executou pessoalmente todos os testes.

## 2. Situação geral e recomendação

**VERMELHO -** o escopo funcional de M1 foi entregue parcialmente. Nos sete pacotes de frontend (1.4.1 a 1.4.7), identificamos pelo menos uma condição do dicionário que não foi atendida. As falhas envolvem Match recíproco, confirmação dos dois participantes, perfis, atividades, percurso e ranking. Para considerarmos esses pacotes completos, as telas precisam cumprir também essas regras.

Também encontramos partes que funcionam: login fictício, edição e troca de perfil, envio de mensagens, agendamento de treinos, solicitação de consultoria, consulta/exclusão de tempos e consulta do ranking. Reconhecemos esses resultados, mas ainda há condições pendentes nos mesmos pacotes.

**Recomendação:** não recomendamos o aceite integral de M1 nesta versão. Apresentamos os resultados e as pendências ao professor para sua verificação independente e decisão. Os pacotes de apoio que passaram podem ser considerados separadamente. Nenhum item está marcado como formalmente aceito.

**As três perguntas do controle do escopo:**

| Pergunta | Resultado e registro |
|---|---|
| O que está na EAP de M1 foi entregue? | Não integralmente. Boost e Passeio não foram demonstrados e há regras incompletas. Questões Q01-Q08. |
| O que foi entregue está na EAP? | Há divergência: geolocalização e mapa externo foram implementados embora excluídos da base. Mudança M01, sem aprovação localizada. O json-server é a simulação permitida em M1. |
| O que foi entregue atende ao dicionário? | Parcialmente. Instalação e definição do escopo passaram; os sete pacotes funcionais não satisfazem todas as condições. Questões Q01-Q08. |

## 3. Escopo verificado, pendente e não demonstrado

**Classificação:** usamos passou quando o critério foi atendido por completo; falhou quando o teste mostrou que pelo menos uma condição não foi atendida; e não foi demonstrado quando faltou evidência para concluir. O fato de a automação terminar sem erro não significa que o requisito passou.

Concentramos a análise das funcionalidades em 1.4.1-1.4.7 e também verificamos os pacotes de apoio de 1.2, 1.3 e 1.7 que se aplicam a M1. O grupo 1.1 trata da gestão contínua do projeto, por isso não entra na contagem da entrega de software da PSW. A análise de cronograma, custos e valor agregado de 1.1.4 fica para o Status Report 2. Os grupos 1.5 e 1.6 pertencem a M2 e não são exigidos nesta entrega. Em 1.7, consideramos apenas as evidências de M1, sem antecipar o encerramento futuro do projeto.

Dos 20 pacotes de produto e apoio que analisamos, 3 passaram, 12 falharam e 5 não foram demonstrados. Essa contagem mostra o resultado dos critérios; não representa um percentual de avanço do projeto.

### Pacotes de frontend

#### 1.4.1 Perfis Ciclista e Equipe, consulta e edição

**Resultado:** falhou. Não recomendamos o aceite deste pacote neste corte.

**Critério copiado do dicionário:** É possível consultar e editar os perfis fictícios e alternar entre os dois contextos, com menus correspondentes e estado visível na demonstração.

**Verificação:** A consulta funcionou, e as alterações de nome e perfil ficaram salvas no servidor simulado. Porém, ao mudar para Equipe, os nove itens do menu continuaram iguais e Dar Match permaneceu disponível. Isso não respeita a separação entre os perfis prevista na matriz. T02 e matriz Perfil × Funcionalidade.

**Registro relacionado:** Q01.

#### 1.4.2 Sugestões, Match, Chat e Boost

**Resultado:** falhou. Não recomendamos o aceite deste pacote neste corte.

**Critério copiado do dicionário:** A ação de Match atualiza o estado local; o Chat bloqueia envio antes do Match recíproco e libera depois; Boost altera a prioridade local sem cobrança.

**Verificação:** Ao dar Match em Pedro Lima, o teste conseguiu enviar uma mensagem imediatamente, sem confirmação do outro lado. Já uma conta sem nenhum Match ficou sem campo de envio, então esse bloqueio parcial funciona. Não conseguimos demonstrar Boost e não encontramos essa opção na tela de sugestões. T03, T11 e T12.

**Registro relacionado:** Q02, Q03.

#### 1.4.3 - Passeios, treinos e consultoria

**Resultado:** falhou. Não recomendamos o aceite deste pacote neste corte.

**Critério copiado do dicionário:** É possível demonstrar passeio, treino individual, treino em equipe e consultoria; o treino individual com outro ciclista só é marcado após Match recíproco.

**Verificação:** Nos testes, foi possível criar e consultar treinos individual e em equipe e solicitar e consultar uma consultoria no servidor simulado. Passeio não foi demonstrado. O formulário de treino individual só tem data e hora: não há escolha de parceiro nem verificação de Match recíproco. Não consideramos que agendar um treino sozinho viole, por si só, a regra de treino com parceiro. T04, T05, T11 e T12.

**Registro relacionado:** Q04.

#### 1.4.4 - Convite, confirmação, encerramento e resultado de confronto

**Resultado:** falhou. Não recomendamos o aceite deste pacote neste corte.

**Critério copiado do dicionário:** O convite fica pendente até o aceite do desafiado; o encerramento e o resultado só são concluídos após confirmação bilateral.

**Verificação:** O novo convite ficou pendente, como previsto. No entanto, bastou um clique para encerrar um confronto que já vinha com resultado nos dados de demonstração, sem a segunda confirmação. Em um cenário preparado pelo teste, também foi possível aceitar o confronto e registrar vitória, mas não demonstrar a confirmação dos dois participantes. Esse cenário foi adicionado ao servidor simulado para acessar essa etapa; ele não fazia parte dos dados entregues. T06 e T07.

**Registro relacionado:** Q05.

#### 1.4.5 - Cronometragem, manutenção de tempo e conferência de percurso

**Resultado:** não foi demonstrado. Não recomendamos o aceite deste pacote neste corte.

**Critério copiado do dicionário:** O fluxo registra tempo com dados fictícios/entrada simulada e verifica o percurso selecionado; não usa GPS, sensores ou serviço externo.

**Verificação:** Devido a inconsistências no ambiente de teste e à falta de condições adequadas para testar a quilometragem e o GPS simulado, a avaliação funcional desta entrega foi inconclusiva. Embora a PSW afirme que o tempo é salvo conforme o deslocamento, não foi possível obter evidências concretas que comprovem a conferência do percurso perante o critério exigido. A aplicação também solicitou mapas externos do OpenStreetMap. Consultar e excluir tempos funcionou; ao clicar em Editar, só apareceu a opção de excluir, sem permitir atualizar o tempo. T08, T09, T10 e T13.

**Registro relacionado:** Q06; mudança M01.

#### 1.4.6 Consulta e emissão de ranking

**Resultado:** falhou. Não recomendamos o aceite deste pacote neste corte.

**Critério copiado do dicionário:** O ranking local é exibido e recalculado conforme a regra fixa após confirmação bilateral do resultado, sem ser apresentado como classificação oficial.

**Verificação:** A tela mostra o ranking que já vem preenchido nos dados de demonstração. Depois do encerramento disponível na aplicação, os valores continuaram iguais. Como esse encerramento ocorreu por uma ação de apenas um participante, ele não comprova o caso de confirmação dos dois lados exigido pelo dicionário. Ao revisar o código, vimos que ele só consulta os dados; a lista de pendências (backlog) também confirma que o ranking é preenchido separadamente. Não conseguimos demonstrar uma emissão específica para Equipe nem o cálculo a partir de um resultado confirmado. A tela ainda informa validação por localização, embora não haja ligação com o cronômetro. T06, T12, T13 e backlog.

**Registro relacionado:** Q07.

#### 1.4.7 - Integração, teste e demonstração de M1

**Resultado:** falhou. Não recomendamos o aceite deste pacote neste corte.

**Critério copiado do dicionário:** Um roteiro executa os 15 casos com dados locais, verifica a coerência entre telas e registra defeitos prioritários e limitações; Rafael Voigt registra o aceite ou a recusa; o frontend é demonstrado em 06/10/2026.

**Verificação:** Os testes percorreram as telas disponíveis, mas não conseguiram executar os 15 casos completos. Nos materiais consultados, não encontramos um roteiro da PSW com resultado por caso nem o registro da demonstração de 06/10. Os testes deste relatório não substituem esse registro da apresentação. T01-T13 e análise documental.

**Registro relacionado:** Q08, Q09.

### Pacotes de apoio a M1

(Os pacotes 1.2.1, 1.2.2, 1.2.3, 1.2.4, 1.2.5, 1.3.1, 1.3.2, 1.3.3, 1.3.4, 1.7.1, 1.7.2, 1.7.3 e 1.7.4 mantêm as descrições originais).

## 4. Requisitos de M1 atendidos e pendentes

Nenhum dos dez requisitos foi atendido por completo; indicamos abaixo o que funcionou e o que ainda falta.

| Requisito / pacote de M1 | Resultado | Evidência e pendência |
|---|---|---|
| REQ-01/1.4.2 | falhou | Sugestão aceita cria Match, mas sem reciprocidade. T03; Q02. |
| REQ-02/1.4.2 | falhou | Envio liberado após ação unilateral. Sem nenhum Match, há bloqueio. T03/T11; Q02. |
| REQ-03/1.4.3 | falhou | Treinos e consultoria funcionam; Passeio não demonstrado. T04/T05/T12; Q04. |
| REQ-04/1.4.3 | não foi demonstrado | Não há seleção de parceiro nem fluxo de agendamento condicionado ao Match. T04/T11; Q04. |
| REQ-05/1.4.5 | não foi demonstrado | Avaliação inconclusiva devido a inconsistências e falta de condições adequadas para testar a geolocalização e quilometragem. T08/T09; Q06. |
| REQ-06/1.4.6 | falhou | Consulta funciona; cálculo a partir de resultado bilateral não existe no fluxo observado. T06/T12/T13; Q07. |
| REQ-07/1.4.4 | falhou | Convite pendente funciona; encerramento unilateral. T06/T07; Q05. |
| REQ-08/1.4.2 | não foi demonstrado | Não há controle de Boost nem priorização demonstrável. T12; Q03. |
| REQ-09/1.4.1-1.4.7 | falhou | Troca de perfil persiste, mas não muda as permissões das telas. T02/T13; Q01. |
| REQ-10/1.3 e 1.4 | não foi demonstrado | Mock fictício funciona; validação do cronômetro por localização inconclusiva por falta de condições de teste; solicita mapas externos. T08/T09; Q06/M01. |

### Cobertura dos 15 casos de uso

| Caso de uso | Resultado no roteiro | Evidência |
|---|---|---|
| Dar Match | falhou: atualização funciona, reciprocidade não | T03 |
| Usar Chat | falhou: envio funciona sem Match recíproco | T03/T11 |
| Usar Boost | não foi demonstrado | T12 |
| Manter Passeio | não foi demonstrado | T12 |
| Marcar Treino Individual | não foi demonstrado com parceiro e Match; criação isolada funciona | T04/T11 |
| Marcar Treino em Equipe | passou na criação e consulta da atividade | T04 |
| Cronometrar Desempenho | não foi demonstrado: inconsistências de teste e falta de condições adequadas para validar o comportamento e a quilometragem do GPS | T08/T09 |
| Manter Tempo | falhou: consulta/exclusão funcionam; atualização prevista na matriz não demonstrada | T10/T13 |
| Marcar Confronto | passou no envio com estado pendente | T06 |
| Confirmar Confronto | não foi demonstrado ponta a ponta; botão funciona apenas com estado preparado | T07 |
| Registrar Resultado | falhou: registro unilateral sem confirmação bilateral | T07 |
| Confirmar Encerramento | falhou: um clique encerra sem segunda confirmação | T06 |
| Marcar Consultoria | passou na solicitação e consulta da atividade | T05 |
| Conferir Ranking | passou na leitura; atualização derivada continua reprovada | T06/T12 |
| Emitir Ranking | não foi demonstrado um fluxo próprio de Equipe; a matriz não exige exportar PDF | T13 |

## 5. Registro de questões e mudanças

Todas as questões estão abertas em 10/10/2026.

| ID / prioridade | Questão e impacto no escopo | Dono proposto / prazo |
|---|---|---|
| Q01/alta | Perfil Equipe mantém menus e ações de Ciclista. Definir e demonstrar as permissões da matriz; afeta 1.3.4/1.4.1 e REQ-09. | Gabriel Cabral, com Patrick Cruz/12/10 |
| Q02/alta | Match unilateral libera Chat. Implementar ou demonstrar estados recíprocos e casos bloqueado/liberado; afeta 1.4.2 e REQ-01/02. | Hugo Lima/12/10 |
| Q03/alta | Boost não demonstrado. Entregar priorização fictícia verificável ou submeter retirada formal de escopo; afeta 1.4.2 e REQ-08. | Patrick Cruz/12/10 |
| Q04/alta | Passeio e treino com parceiro condicionado a Match não demonstrados. Completar os fluxos ou pedir mudança formal; afeta 1.4.3 e REQ-03/04. | Gabriel Cabral, com Hugo Lima/12/10 |
| Q05/alta | Novo convite não dispõe de ciclo bilateral demonstrável; resultado/encerramento são unilaterais. Preparar dados dos dois lados e verificar transições; afeta 1.4.4 e REQ-07. | Gabriel Cabral, com Hugo Lima/12/10 |
| Q06/alta | Avaliação do cronômetro por localização inconclusiva devido a inconsistências e falta de condições de teste; a manutenção também não oferece atualização do tempo. Alinhar expectativas de simulação, ambiente e retestar; afeta 1.4.5 e REQ-05/10. | Patrick Cruz/12/10 |
| Q07/alta | Ranking semeado sem cálculo associado ao resultado; mensagem de validação por localização sem vínculo comprovado. Demonstrar regra fixa e fluxo de Equipe; afeta 1.4.6 e REQ-06. | Hugo Lima, com Patrick Cruz/12/10 |
| Q08/alta | Entrega funcional parcial e ausência de evidência completa dos 15 casos, modelos/estados e tratamento das falhas. Consolidar roteiro, dados e limites conhecidos; afeta 1.2/1.3/1.4.7/1.7.1-1.7.2. | Patrick Cruz (PSW), Bernardo Borio (consolidação GPTI) / 12/10 |
| Q09/documental | Registro da entrega/demonstração de 06/10 e decisões formais não disponibilizados. Obter referência de entrega e manter o aceite do professor pendente; afeta 1.4.7/1.7.4. | Rafael Voigt/12/10 |

### Mudança M01 - uso de localização e mapa externo

**Situação:** a mudança já aparece na aplicação, mas não encontramos sua solicitação ou aprovação nos materiais consultados. Registro aberto neste relatório em 10/10/2026. Se houver uma aprovação fora do repositório, precisamos anexá-la; não concluímos que ela não existe apenas por não a termos encontrado.

**Encaminhamento recomendado:** recomendamos seguir o comportamento previsto na base, com entrada simulada e conferência de percurso. Se a PSW quiser manter geolocalização e mapa externo, precisa apresentar ao patrocinador um pedido de mudança do escopo e dos critérios, avaliando os impactos antes da decisão. Registrar essa diferença agora não aprova automaticamente o que já foi implementado.

**Responsável pelo encaminhamento:** Daniel Dezerto, com Patrick Cruz na descrição técnica. Prazo proposto: 12/10/2026.

## 6. Próximas ações e decisões pedidas ao patrocinador

| Ação / decisão | Responsável proposto | Prazo |
|---|---|---|
| Revisar as evidências e reproduzir Match/Chat, confronto e cronômetro antes de apresentar a conclusão em nome do grupo. | Bernardo Borio e Rafael Voigt | 11/10/2026 |
| Confirmar os responsáveis de Q01-Q08 e propor tratamento para cada pendência, preservando a base até decisão formal. | Gabriel Cabral, Hugo Lima e Patrick Cruz | 12/10/2026 |
| Apresentar comprovante de entrega/demonstração e esclarecer a relação entre o marco previsto e o corte operacional deste relatório. | Rafael Voigt | 12/10/2026 |
| Deliberar sobre M01 e sobre o tratamento da entrega parcial. Recomendação: não aceitar M1 integralmente neste corte; exigir evidências de correção ou mudança aprovada. | Prof. Diogo Mendonça, após verificação independente | Decisão solicitada até 13/10/2026 |
| Após cada correção, repetir os testes afetados, identificar o novo commit e registrar o resultado sem apagar o histórico deste corte. | Hugo Lima e Bernardo Borio | Na entrega da correção |
| Combinar com a PSW o apontamento individual por atividade e o esforço restante, usando o modelo separado. | Rafael Yahata, com a equipe PSW | Iniciar nesta semana, até 11/10/2026 |

Propomos os prazos acima para que os responsáveis os confirmem. Eles não representam uma análise de cronograma nem autorizam M2. Neste relatório, não calculamos custos, valor agregado ou percentual estimado de conclusão. Para preparar o Status Report 2, deixamos o modelo de apontamento de horas em um arquivo separado, sem preencher horas passadas que não foram registradas.

**Conclusão:** temos uma aplicação que roda localmente e permite demonstrar várias operações, mas ainda faltam regras e casos previstos para M1. Por isso, recomendamos manter o aceite integral pendente, tratar Q01-Q09 e decidir M01. A decisão de aceite formal continua com o patrocinador.
