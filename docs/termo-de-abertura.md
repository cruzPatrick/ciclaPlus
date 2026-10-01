# Termo de Abertura do Projeto Cicla+

**Situação:** versão revisada para validação · **Atualização:** 01/10/2026

**Documentação:** 05/10/2026 · **Frontend:** 06/10/2026

Documento relacionado: [Business Case](business-case.md).

## 1. Finalidade e valor esperado

O Cicla+ propõe facilitar a busca por parceiros de treino e a organização de atividades para ciclistas e equipes amadoras de ciclismo, com acompanhamento de desempenho por tempos, confrontos e rankings.

Nesta etapa, o projeto entrega um **frontend demonstrável, com dados locais e usuários fictícios**, para avaliação acadêmica.

## 2. Justificativa resumida

A proposta parte da dificuldade de encontrar parceiros compatíveis e organizar atividades dispersas em redes sociais e aplicativos de mensagens. O frontend permite apresentar e avaliar os fluxos de relacionamento, treino e desempenho antes de uma eventual evolução para uso real.

A formação de novas conexões e o aumento do engajamento são benefícios esperados, ainda sujeitos à validação com usuários.

## 3. Objetivos

1. Disponibilizar, até **06/10/2026**, demonstrações dos **15 casos de uso** listados e priorizados na matriz de requisitos, respeitando os perfis Ciclista e Equipe.
2. Demonstrar os fluxos de relacionamento, organização de atividades e acompanhamento de desempenho com dados locais, incluindo a regra de agendar treino com quem já deu match e a verificação de percurso no registro de tempo.
3. Entregar, até **05/10/2026**, Business Case, Termo de Abertura, Plano do Projeto e Dicionário da EAP, coerentes com o frontend previsto.

## 4. Escopo de alto nível

### Funcionalidades incluídas

| Grupo | Casos de uso |
| --- | --- |
| Relacionamento | Dar Match; Usar Chat; Usar Boost. |
| Atividades | Manter Passeio; Marcar Treino Individual; Marcar Treino em Equipe; Marcar Consultoria. |
| Desempenho | Cronometrar Desempenho; Manter Tempo; Conferir Ranking; Emitir Ranking. |
| Confrontos | Marcar Confronto; Confirmar Confronto; Registrar Resultado; Confirmar Encerramento. |

As funcionalidades serão demonstradas no frontend com dados locais e usuários fictícios. O Boost será apresentado como funcionalidade de destaque de perfil, sem cobrança real.

As operações complementares recomendadas pela matriz não ampliam automaticamente este escopo; sua inclusão depende de decisão da equipe de desenvolvimento.

### Fora desta etapa

- Backend e banco de dados.
- Operação entre usuários reais em dispositivos diferentes.
- Processamento de pagamentos.
- Comércio de bicicletas ou equipamentos.
- Integração nativa com smartwatches ou sensores externos.

## 5. Critérios de sucesso

- Os 15 casos de uso permitem executar suas interações previstas com dados de demonstração, sem depender de backend.
- Os fluxos relacionados mantêm coerência entre telas durante a demonstração; regras de match, treino, percurso, tempo e resultado são verificáveis.
- Os quatro documentos são entregues em 05/10/2026 e o frontend em 06/10/2026.
- O professor avalia e aceita a entrega e sua documentação. A aprovação será registrada após a avaliação.

## 6. Equipes e partes interessadas

### Gerência do projeto — Grupo F

Responsável pelo planejamento, pela documentação e pelo acompanhamento da entrega.

- Bernardo Dias Borio
- Rafael Voigt Villas Boas
- Daniel Dezerto Rimes
- Rafael Duarte Yahata

### Equipe de desenvolvimento

Responsável pela implementação do frontend e pela aprovação das decisões de escopo.

- Gabriel Cabral Almeida de Carvalho
- Patrick Cruz Azevedo
- Hugo Lima de Almeida Antunes Aguiar

### Demais partes interessadas

| Parte interessada | Papel |
| --- | --- |
| Professor | Patrocinador acadêmico e avaliador, conforme a definição do termo original apresentado pela gerência. Avalia a entrega e sua documentação. |
| Ciclistas e equipes amadoras | Público beneficiado e perfis de referência para os requisitos. |

Mudanças de escopo devem ser decididas pela equipe de desenvolvimento e comunicadas à gerência para atualização dos documentos. As exigências da avaliação acadêmica devem continuar sendo atendidas.

## 7. Marcos de entrega

| Marco | Prazo |
| --- | --- |
| Entrega do Business Case, Termo de Abertura, Plano do Projeto e Dicionário da EAP | **05/10/2026** |
| Entrega do frontend completo, com as funcionalidades planejadas demonstráveis | **06/10/2026** |

A conclusão e a verificação dos fluxos de relacionamento, atividades e desempenho antecedem a entrega do frontend. Seu detalhamento será organizado no Plano do Projeto.

## 8. Recursos e restrições

Segundo o levantamento com a equipe, a implementação está concentrada em um integrante devido à disponibilidade de computador. Esse integrante informou dedicação de **quatro a seis horas semanais**; esse valor não representa a capacidade total da equipe. O planejamento deve considerar essa restrição e os prazos fixos de entrega.

A etapa utiliza o repositório e o ambiente de desenvolvimento do frontend.

**Recursos financeiros:** não há valor de orçamento definido neste termo. Permanece pendente confirmar se haverá desembolso ou uso exclusivo de recursos já disponíveis. Recursos e eventuais custos serão registrados no Plano do Projeto; ausência de valor informado não significa custo zero nem autorização de despesa.

## 9. Premissas e riscos iniciais

| Premissa | Risco associado |
| --- | --- |
| As regras entre telas podem ser demonstradas com dados locais. | Dificuldades para compartilhar os dados e integrar os fluxos podem impedir uma demonstração completa. |
| O computador e a disponibilidade informada permitem executar o trabalho restante. | Indisponibilidade do equipamento ou do integrante que concentra a implementação pode comprometer o prazo. |
| O ambiente de demonstração permite obter localização e verificar o percurso. | Permissão negada ou localização imprecisa pode impedir a validação do registro de tempo. |

## 10. Critérios de encerramento ou cancelamento

O projeto é encerrado após a entrega dos quatro documentos e do frontend e o registro da avaliação do professor.

A inviabilidade técnica que impeça a demonstração ou a indisponibilidade de recursos essenciais, sem alternativa viável dentro do prazo, é motivo para avaliar replanejamento ou cancelamento junto às equipes e ao professor. As alterações de escopo cabem à equipe de desenvolvimento.

## 11. Registro de validação

Este registro deve ser atualizado quando as validações ocorrerem. A publicação do documento no repositório não representa aprovação.

| Validação | Responsável | Situação | Data |
| --- | --- | --- | --- |
| Conferência do escopo e dos 15 casos de uso previstos para a entrega | Equipe de desenvolvimento | Pendente de registro | — |
| Aprovação acadêmica do Termo de Abertura | Professor | Pendente de registro | — |

## Referências

- Termo de Abertura inicial apresentado pela gerência.
- Cicla+ — Matrizes de Requisitos: matriz CRUD, perfis e priorização dos casos de uso.
- Informações de escopo, equipe, recursos e prazos fornecidas pelas equipes.
- [Business Case do Cicla+](business-case.md).
