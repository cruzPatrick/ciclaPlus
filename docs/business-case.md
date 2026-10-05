# Business Case Cicla+

**Finalidade:** justificar a entrega acadêmica do frontend

**Situação:** versão revisada para validação · **Atualização:** 05/10/2026

Documento relacionado: [Termo de Abertura do Projeto](termo-de-abertura.md).

## 1. Problema e público

A proposta parte da dificuldade de ciclistas e equipes amadoras de ciclismo encontrarem parceiros de treino e organizarem atividades dispersas em redes sociais e aplicativos de mensagens.

O Cicla+ propõe reunir relacionamento e acompanhamento de desempenho em uma interface voltada a esse público.

## 2. Solução proposta

Concluir o frontend para demonstrar os **15 casos de uso listados e priorizados na matriz de requisitos**. A entrega abrange match, chat, Boost, passeios, treinos, consultoria, cronometragem, manutenção de tempos, confrontos e rankings, respeitando os perfis Ciclista e Equipe. A relação completa está no [escopo do Termo de Abertura](termo-de-abertura.md#4-escopo-de-alto-nível).

A demonstração de M1 usará **usuários fictícios e dados servidos localmente pelo backend mockado `json-server`**. O mock dá suporte à leitura e à atualização dos dados usados pelo frontend. Backend próprio em Express, persistência em MongoDB, comunicação entre usuários reais e cobrança de serviços ficam fora desta entrega.

A API Express e o MongoDB são uma extensão proposta para M2 no [Plano do Projeto](plano-projeto1.md), condicionada à decisão da equipe de desenvolvimento e à aprovação do patrocinador. O uso do `json-server` em M1 já faz parte da solução atual.

## 3. Valor esperado

Espera-se facilitar a busca por parceiros, a organização de atividades e a consulta ao desempenho, com rankings e confrontos como incentivo à participação.

A entrega acadêmica permite avaliar esses fluxos antes de evoluir o produto. Os benefícios de uso e engajamento ainda precisam ser validados com o público; não representam resultados já comprovados.

## 4. Alternativas e recomendação

| Alternativa | Avaliação para esta etapa |
| --- | --- |
| Manter o frontend como esboço | Não atende à entrega das funcionalidades demonstráveis. |
| **Concluir o frontend com dados fictícios e `json-server` local** | **Permite demonstrar os fluxos da entrega M1 com a integração já adotada pela equipe.** |
| Ampliar agora para uma API Express com MongoDB | Antecipa a extensão proposta para M2, amplia o trabalho da entrega atual e aumenta o risco de atraso. |

**Recomendação:** concluir o frontend integrado ao `json-server` local, mantendo todas as funcionalidades planejadas demonstráveis para a avaliação de M1.

## 5. Recursos e viabilidade

O projeto aproveita o frontend existente e a integração com `json-server`. No levantamento inicial, a implementação estava concentrada em um integrante com computador e disponibilidade de **quatro a seis horas semanais**. O Plano do Projeto passou a distribuir o trabalho entre os três integrantes Dev e os quatro de gerência, com premissas de capacidade de **4,5 h semanais por integrante Dev** e **4 h semanais por integrante de gerência nas semanas S4–S12**.

A integração entre telas e a disponibilidade efetiva de pessoas e equipamentos continuam sendo riscos ao prazo. As alocações do plano são estimativas de planejamento e devem ser conferidas com o trabalho restante.

**Custos:** o Plano do Projeto prevê desembolso de **R$ 0,00**, condicionado ao uso dos recursos já disponíveis. Para fins acadêmicos, estima **R$ 6.170,60** de custo econômico simulado, incluindo reservas, para o cenário completo M1 + M2. Esse valor inclui a extensão ainda sujeita à aprovação; não corresponde a pagamento previsto nem a orçamento exclusivo de M1. A simulação de esforço e custo não comprova retorno financeiro.

## 6. Monetização futura

O Boost poderá gerar receita ao oferecer destaque aos perfis. Essa hipótese ainda não tem estimativas de demanda, preço ou retorno financeiro que comprovem sua viabilidade.

Nesta entrega, o recurso será demonstrado **sem pagamento real**.

## 7. Entrega e avaliação

| Entrega | Prazo |
| --- | --- |
| Business Case, Termo de Abertura, Plano do Projeto e Dicionário da EAP | **05/10/2026** |
| Frontend com os casos de uso demonstráveis | **06/10/2026** |

O professor realizará a avaliação acadêmica; a equipe de desenvolvimento aprova as decisões de escopo. Os critérios de sucesso e o registro de validação estão no [Termo de Abertura](termo-de-abertura.md).

## Referências

- Business Case simplificado contido no Termo de Abertura inicial.
- Cicla+ — Matrizes de Requisitos: matriz CRUD, perfis e priorização dos casos de uso.
- Informações confirmadas de escopo, recursos e prazos fornecidas pelas equipes.
- [Termo de Abertura do Projeto Cicla+](termo-de-abertura.md).
- [Plano do Projeto Cicla+](plano-projeto1.md).
