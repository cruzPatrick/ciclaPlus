# Dicionário da EAP — Módulo de Inscrição em Disciplinas

**Versão:** 1.1  
**Data:** 28/09/2026  
**Linha de base do escopo:** este dicionário, a declaração do escopo e a EAP em [plano-de-projeto.md](plano-de-projeto.md)

Cada linha é um pacote de trabalho. **A** é quem presta contas do aceite. **R** é quem executa. O nível abaixo do pacote, quando existe na EAP, é atividade do cronograma e não tem aceite próprio.

O identificador do pacote é o código da EAP. Marco, recurso e custo não se repetem aqui: nascem no cronograma e no orçamento do plano e podem ser acrescentados a este dicionário depois.

## 1.1 Gestão e coordenação

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.1.1 | Termo e plano mantidos | GPTI-1 | GPTI-1 a GPTI-4 | A versão citada na AV1 é a mesma usada no controle das semanas 9 a 12, ou a mudança está registrada. |
| 1.1.2 | Decisões, riscos e mudanças | GPTI-2 | GPTI-1 a GPTI-4 | Cada mudança de escopo, prazo ou custo tem pedido, decisão e efeito nas três linhas de base. |
| 1.1.3 | Aceites dos marcos | GPTI-4 | GPTI-4 | Há registro de aceite ou de recusa do M1 na semana 8 e do M2 na semana 12, com ciência do patrocinador. |
| 1.1.4 | Revisão técnica organizada | PSW-1 | PSW-1 a PSW-4 | Nenhum incremento entra na demonstração sem revisão de outro aluno e sem o autor explicar o trecho. |

## 1.2 Requisitos e desenho

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.2.1 | Escopo funcional inicial | GPTI-3 | PSW propõe; GPTI valida | A declaração da seção 4.1 cabe em uma leitura e lista o que está fora. |
| 1.2.2 | Atores e fluxos | GPTI-3 | PSW-1 a PSW-4 | Aluno e secretaria simulada têm ações distintas; um não executa a ação do outro. |
| 1.2.3 | Modelo e contratos | PSW-2 | PSW-1 a PSW-4 | O mesmo exemplo de payload serve ao `json-server` e à API Express. |
| 1.2.4 | Dados acadêmicos necessários | PSW-2 | PSW-2 | Ingresso, CR e histórico aparecem no contrato, separados da regra de cálculo. |
| 1.2.5 | Hipóteses e limitações | GPTI-3 | GPTI-3 | Cada regra sem validação institucional está marcada como hipótese do protótipo. |
| 1.2.6 | Navegação revisada | PSW-1 | PSW-1 a PSW-4 | Um roteiro percorre consulta, pedido, submissão e resultado sem passo oral não representado na tela. |

## 1.3 Base técnica e ambientes

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.3.1 | Aplicação React inicial | PSW-1 | PSW-1 a PSW-4 | Outro aluno executa a aplicação seguindo a instrução do repositório. |
| 1.3.2 | API Express inicial | PSW-3 | PSW-3 | A API responde uma rota de verificação sem o frontend acessar o MongoDB. |
| 1.3.3 | MongoDB de desenvolvimento | PSW-4 | PSW-4 | Um registro gravado é lido depois de reiniciar a API. |
| 1.3.4 | `json-server` do M1 | PSW-2 | PSW-2 | O frontend do M1 funciona com o mock no lugar da API própria. |
| 1.3.5 | Mock OAuth | PSW-3 | PSW-3 | O fluxo de login termina sem credencial real e sem chamada externa. |
| 1.3.6 | Mock acadêmico | PSW-2 | PSW-2 | Ingresso, CR e histórico fictícios são lidos nos campos combinados no contrato. |
| 1.3.7 | Perfil de secretaria | PSW-4 | PSW-4 | O perfil de aluno não abre a tela de configuração do período. |

## 1.4 Frontend do marco 1

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.4.1 | Interface da grade | PSW-1 | PSW-1 | Criar, consultar, editar e remover disciplina, com período curricular, usando dados do mock. Remoção não apaga o histórico de demonstração já usado. |
| 1.4.2 | Interface do período e das fases | PSW-3 | PSW-3 | As três fases têm início e fim; fase com data inválida não é salva. |
| 1.4.3 | Consulta da oferta | PSW-4 | PSW-4 | A lista mostra só disciplinas disponíveis, e o filtro por período exclui as demais. |
| 1.4.4 | Composição do pedido | PSW-2 | PSW-1 a PSW-4 | O aluno inclui, reordena, remove e submete. Antes do processamento, o status não diz efetivada. |
| 1.4.5 | Resultado e fases seguintes | PSW-3 | PSW-3 | O resultado separa efetivada e não efetivada. Na fase seguinte, só a não efetivada pode ser alterada. |
| 1.4.6 | Frontend ligado ao mock | PSW-2 | PSW-1 a PSW-4 | Os fluxos de 1.4.1 a 1.4.5 usam o `json-server`, não a API Express. |
| 1.4.7 | Demonstração do M1 | GPTI-2 | PSW-1 | A demonstração da semana 8 executa o roteiro e registra a limitação do mock. |

1.4 aceita a tela com o mock. 1.5 aceita a API no MongoDB. Um pacote não herda o aceite do outro.

## 1.5 Backend e regras de negócio

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.5.1 | API da grade | PSW-1 | PSW-1 | As operações da grade persistem no MongoDB e rejeitam disciplina sem período. |
| 1.5.2 | API do período e das fases | PSW-3 | PSW-3 | O período guarda três fases. Depois de aberta a fase 1, a configuração não é alterada. |
| 1.5.3 | API da oferta administrativa | PSW-4 | PSW-4 | Oferta sem vaga numérica ou sem disciplina existente não é gravada. |
| 1.5.4 | API de consulta | PSW-4 | PSW-4 | O filtro por período devolve somente as disciplinas daquele período. |
| 1.5.5 | API do pedido | PSW-2 | PSW-1 a PSW-4 | Incluir, reordenar, remover e submeter mudam o pedido e não criam vaga. |
| 1.5.6 | Cálculo e efetivação | PSW-3 | PSW-1 a PSW-4 | Os casos passam nesta ordem: período correto, ingresso mais antigo, CR maior e identificador. O conjunto inclui período errado, mesmo ingresso, CR diferente e identificador como último desempate. Sem pré-requisito ou sem vaga, não há efetivação. |
| 1.5.7 | Três fases | PSW-3 | PSW-3 e PSW-4 | A vaga efetivada na fase 1 continua nas fases 2 e 3. O recálculo usa só a vaga restante. |
| 1.5.8 | Adaptador acadêmico | PSW-2 | PSW-1 a PSW-3 | O cálculo lê ingresso, CR e histórico do mock, não de valor digitado na tela. |
| 1.5.9 | OAuth mockado na API | PSW-3 | PSW-1 a PSW-4 | A rota protegida recusa chamada sem o usuário simulado e não consulta provedor externo. |
| 1.5.10 | Permissão da secretaria | PSW-4 | PSW-4 | Aluno recebe recusa ao configurar período, vaga ou dependência. |
| 1.5.11 | Persistência de domínio | PSW-4 | PSW-1 a PSW-4 | Grade, oferta, pedido e resultado continuam disponíveis depois de reiniciar a API. |

1.5.6 passa nesses casos. 1.6.3 só os mostra de novo, na aplicação ligada ao Express.

## 1.6 Integração do marco 2

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.6.1 | Frontend na API Express | PSW-1 | PSW-1 a PSW-4 | Os fluxos do M1 executam contra Express, sem `json-server` no lugar da API própria. |
| 1.6.2 | Fluxos persistidos | PSW-4 | PSW-1 a PSW-4 | Pedido e resultado sobrevivem a novo acesso do mesmo aluno fictício. |
| 1.6.3 | Classificação demonstrada | PSW-3 | PSW-1 a PSW-4 | A demonstração reproduz a ordem e o bloqueio de pré-requisito com os casos do pacote 1.5.6. |
| 1.6.4 | Três fases integradas | PSW-3 | PSW-3 e PSW-4 | As três fases são percorridas na interface e a vaga antiga não é retirada. |
| 1.6.5 | API no mock acadêmico | PSW-2 | PSW-2 | Trocar o aluno fictício muda ingresso, CR ou histórico usados no cálculo. |
| 1.6.6 | Login mockado no fluxo integrado | PSW-3 | PSW-3 | O fluxo completo começa no mock de login e não abre o provedor institucional. |
| 1.6.7 | Secretaria no fluxo integrado | PSW-4 | PSW-4 | A configuração e o bloqueio do aluno funcionam na aplicação integrada. |
| 1.6.8 | Erros dos fluxos prioritários | PSW-1 | PSW-1 a PSW-4 | Pré-requisito ausente, vaga esgotada e configuração fechada produzem mensagem identificável, não tela em branco. |
| 1.6.9 | Demonstração final | GPTI-4 | PSW-1 | A semana 12 executa o roteiro de 1.6.1 a 1.6.8, ou registra o caso que falhou. |

1.6.9 executa o roteiro. 1.7 registra o que passou, o que falhou e o que ficou de fora.

## 1.7 Verificação e encerramento

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.7.1 | Testes dos fluxos prioritários | PSW-2 | PSW-1 a PSW-4 | Há resultado passado ou falho para consulta, pedido, submissão, classificação e fases. |
| 1.7.2 | Testes da ordem de classificação | PSW-3 | PSW-3 | Os casos cobrem período errado, mesmo ingresso, CR diferente e identificador como último desempate. |
| 1.7.3 | Defeitos tratados | PSW-1 | PSW-1 a PSW-4 | Defeito que viola aceite de pacote está corrigido ou listado como limitação da demonstração. |
| 1.7.4 | Instruções de execução | PSW-4 | PSW-4 | Outro aluno sobe o protótipo e o mock acadêmico só com o texto do repositório. |
| 1.7.5 | Encerramento e lições | GPTI-4 | GPTI-1 a GPTI-4 | O termo de encerramento diz o que foi aceito, o que ficou de fora e o que a turma não repetiria. |
| 1.7.6 | Pendências institucionais | GPTI-3 | GPTI-3 | A lista separa integração, validação da secretaria e produção como trabalho futuro, sem dono neste projeto. |
