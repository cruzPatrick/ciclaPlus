# Dicionário da EAP — Projeto Cicla+

**Versão:** 1.0 — frontend demonstrável e extensão integrada proposta  
**Data:** 05/10/2026  
**Linha de base do escopo:** este dicionário, a declaração do escopo e a EAP em [plano-de-projetoV7.md](plano-de-projetoV7.md), em conjunto com o [Termo de Abertura](termo-de-abertura.md) e o [Business Case](business-case.md).

Cada linha descreve um pacote-folha da EAP. **A** é quem presta contas do aceite; **R** é quem executa. A matriz 5.7 do Plano de Projeto designa A para os pacotes de nível superior; neste dicionário, a prestação de contas é detalhada por pacote-folha a partir do integrante que lidera a atividade correspondente nas alocações individuais das seções 5.5 e 5.6. Os R também refletem essas atribuições específicas, sem repetir automaticamente a equipe inteira em todas as entregas.

Os pacotes **1.5 e 1.6** são uma extensão proposta, fora da linha de base vigente até aprovação formal da equipe de desenvolvimento e do patrocinador. Nenhuma atividade de implementação ou conclusão do backend pode ocorrer até **05/10/2026, inclusive**. Se autorizada, a implementação começa em D09, na S9, em 13/10/2026. Os critérios abaixo definem como o trabalho seria aceito; não autorizam sua execução.

## 1.1 Gestão e coordenação do projeto

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.1.1 | Termo, Business Case e plano coerentes | Rafael Voigt | Rafael Voigt (Business Case), Rafael Yahata (Termo), Daniel Dezerto (revisão) e Bernardo Borio (consistência) | Os documentos identificam o mesmo escopo, os marcos M1/M2, as restrições e a condição de aprovação para M2; divergências ou mudanças têm registro e decisão. |
| 1.1.2 | Backlog, decisões, riscos e mudanças acompanhados | Rafael Yahata | Rafael Yahata (governança e riscos), Daniel Dezerto (stakeholders e mudanças), Bernardo Borio (registro) e Rafael Voigt (decisões de escopo) | Cada decisão ou mudança relevante identifica responsável, justificativa e impacto em escopo, prazo, esforço, custo e aceite; riscos têm gatilho e resposta registrados. |
| 1.1.3 | Demonstrações e aceites dos marcos registrados | Rafael Voigt | Rafael Voigt (aceite), Rafael Yahata (lições), Daniel Dezerto (encerramento), Bernardo Borio (arquivo); Gabriel Cabral (integração), Hugo Lima (testes) e Patrick Cruz (demonstração PSW) | Há registro de aceite ou recusa de M1 (documentos em 05/10 e frontend em 06/10) e, somente se autorizado, de M2 (demonstração PSW em 10/11 e aceite GPTI em 30/11), com ciência do patrocinador. |
| 1.1.4 | Cronograma, recursos, custos e engajamento controlados | Daniel Dezerto | Rafael Voigt (custos), Rafael Yahata (cronograma), Daniel Dezerto (qualidade) e Bernardo Borio (recursos e status) | O acompanhamento compara esforço realizado e restante com as atividades e limites do plano; desvios, riscos e decisões são registrados nos relatórios previstos. |

## 1.2 Requisitos e desenho funcional

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.2.1 | Escopo dos perfis Ciclista e Equipe consolidado | Rafael Voigt | Rafael Voigt (escopo); Gabriel Cabral, Hugo Lima e Patrick Cruz (definição dos perfis) | O escopo identifica os dois perfis, os 15 casos de uso e as capacidades fora desta etapa, sem apresentar o protótipo como serviço oficial. |
| 1.2.2 | Casos de uso, regras, permissões e critérios de aceite rastreados | Daniel Dezerto | Gabriel Cabral (requisitos), Hugo Lima (casos de uso) e Patrick Cruz (critérios de aceite); Daniel Dezerto (matriz) | Os 15 casos estão associados a perfil, fluxo e critério que possa ser demonstrado com dados fictícios; Match, treino, percurso, tempo e resultado têm regras verificáveis. |
| 1.2.3 | Modelo de domínio, estados e contratos de dados definidos | Gabriel Cabral | Gabriel Cabral (modelo), Hugo Lima (estados) e Patrick Cruz (regras locais) | Perfis, Match/Chat, atividades, confrontos, tempos e ranking têm campos e transições documentados; os estados usados pelas telas são consistentes entre si. |
| 1.2.4 | Hipóteses, limitações e decisões de mudança documentadas | Rafael Yahata | Rafael Voigt (limites de escopo), Rafael Yahata (pendências), Daniel Dezerto (mudanças) e Bernardo Borio (riscos/status) | Dados fictícios, ausência de GPS/pagamento/integração real e backend fora da linha de base são explicitados; qualquer mudança proposta tem decisão e impacto registrados. |
| 1.2.5 | Navegação e protótipos revisados internamente | Bernardo Borio | Gabriel Cabral (navegação), Hugo Lima (telas) e Patrick Cruz (protótipos); Rafael Voigt (escopo), Rafael Yahata (casos de uso), Daniel Dezerto (matriz) e Bernardo Borio (critérios de aceite) | Um roteiro percorre os fluxos dos perfis Ciclista e Equipe e cobre as telas necessárias aos 15 casos, sem depender de passo não representado ou serviço externo. |

## 1.3 Base técnica e dados de demonstração

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.3.1 | Aplicação React e ambiente local preparados | Gabriel Cabral | Gabriel Cabral (base React), Hugo Lima (componentes) e Patrick Cruz (rotas) | Outro integrante consegue iniciar a aplicação seguindo as instruções do repositório, sem credenciais ou serviço remoto. |
| 1.3.2 | Componentes, rotas e estado do frontend organizados | Hugo Lima | Gabriel Cabral (estado), Hugo Lima (componentes) e Patrick Cruz (rotas) | A navegação permite acessar os fluxos planejados e o estado mantém coerência ao alternar telas durante a demonstração. |
| 1.3.3 | Dados fictícios de demonstração preparados | Gabriel Cabral | Gabriel Cabral (modelo), Hugo Lima (relacionamento/atividades) e Patrick Cruz (desempenho/regras) | Há perfis Ciclista/Equipe, sugestões, Matches, mensagens, atividades, confrontos, tempos e resultados suficientes para percorrer os critérios de aceite sem dados reais. |
| 1.3.4 | Autenticação e alternância de perfis simuladas | Patrick Cruz | Patrick Cruz (rotas/autenticação simulada), Gabriel Cabral (perfis) e Hugo Lima (fluxos de relacionamento) | O fluxo de login e a troca entre Ciclista e Equipe funcionam sem credenciais reais ou chamada OAuth; cada perfil apresenta os menus previstos. |

## 1.4 Frontend do marco 1

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.4.1 | Perfis Ciclista e Equipe, consulta e edição | Gabriel Cabral | Gabriel Cabral (perfil), Patrick Cruz (perfil Equipe) e Hugo Lima (fluxos de relacionamento) | É possível consultar e editar os perfis fictícios e alternar entre os dois contextos, com menus correspondentes e estado visível na demonstração. |
| 1.4.2 | Sugestões, Match, Chat e Boost | Hugo Lima | Gabriel Cabral (sugestões), Hugo Lima (Match/Chat) e Patrick Cruz (Boost) | A ação de Match atualiza o estado local; o Chat bloqueia envio antes do Match recíproco e libera depois; Boost altera a prioridade local sem cobrança. |
| 1.4.3 | Passeios, treinos e consultoria | Gabriel Cabral | Gabriel Cabral (atividades), Hugo Lima (treino condicionado a Match) e Patrick Cruz (tempo/percurso relacionado às atividades) | É possível demonstrar passeio, treino individual, treino em equipe e consultoria; o treino individual com outro ciclista só é marcado após Match recíproco. |
| 1.4.4 | Convite, confirmação, encerramento e resultado de confronto | Gabriel Cabral | Gabriel Cabral (confronto), Hugo Lima (resultado/confirmação) e Patrick Cruz (regras de desempenho) | O convite fica pendente até o aceite do desafiado; o encerramento e o resultado só são concluídos após confirmação bilateral. |
| 1.4.5 | Cronometragem, manutenção de tempo e conferência de percurso | Patrick Cruz | Patrick Cruz (tempo/percurso) | O fluxo registra tempo com dados fictícios/entrada simulada e verifica o percurso selecionado; não usa GPS, sensores ou serviço externo. |
| 1.4.6 | Consulta e emissão de ranking | Hugo Lima | Hugo Lima (resultado/ranking), Patrick Cruz (regra de desempenho) | O ranking local é exibido e recalculado conforme a regra fixa após confirmação bilateral do resultado, sem ser apresentado como classificação oficial. |
| 1.4.7 | Integração, teste e demonstração de M1 | Patrick Cruz | Gabriel Cabral (integração), Hugo Lima (testes) e Patrick Cruz (demonstração) | Um roteiro executa os 15 casos com dados locais, verifica a coerência entre telas e registra defeitos prioritários e limitações; Rafael Voigt registra o aceite ou a recusa; o frontend é demonstrado em 06/10/2026. |

M1 aceita o frontend com dados locais e fictícios. Ele não depende do backend nem transfere aceite para os pacotes condicionais de 1.5 e 1.6.

## 1.5 Backend e regras de negócio — extensão condicionada

| Pacote | Entrega proposta | A | R | Aceite observável |
|---|---|---|---|---|
| 1.5.1 | API Express e configuração local reproduzível | Gabriel Cabral | Gabriel Cabral (API), Hugo Lima (ambiente local) e Patrick Cruz (contratos), somente após autorização | A API inicia localmente conforme instruções e responde a uma rota de verificação; a execução não depende de serviço institucional. |
| 1.5.2 | Modelo e persistência MongoDB de perfis e relacionamento | Gabriel Cabral | Gabriel Cabral (persistência), Hugo Lima (endpoints) e Patrick Cruz (testes), somente após autorização | Perfis, Matches, mensagens e estado de Boost são gravados e lidos após reiniciar a API, usando exclusivamente dados fictícios. |
| 1.5.3 | Endpoints de atividades | Hugo Lima | Hugo Lima (endpoints), Gabriel Cabral (modelo e integração) e Patrick Cruz (testes), somente após autorização | Passeios, treinos individuais/em equipe e consultorias podem ser criados e consultados; treino individual sem Match recíproco é recusado. |
| 1.5.4 | Endpoints de confronto e resultado | Gabriel Cabral | Gabriel Cabral (integração), Hugo Lima (regras de resultado) e Patrick Cruz (testes), somente após autorização | Convite, aceite, encerramento e resultado preservam as transições previstas; resultado não é finalizado sem confirmação bilateral. |
| 1.5.5 | Serviços de tempo e ranking | Hugo Lima | Gabriel Cabral (regras), Hugo Lima (ranking) e Patrick Cruz (tempo/percurso e testes), somente após autorização | Tempo e ranking são calculados com regra fixa e dados fictícios; a classificação é atualizada após resultado confirmado e continua identificada como demonstrativa. |
| 1.5.6 | Validações de Match para Chat e treino | Hugo Lima | Hugo Lima (validações), Gabriel Cabral (regras) e Patrick Cruz (testes), somente após autorização | Testes demonstram que Chat e agendamento individual são recusados sem Match recíproco e aceitos quando a condição é satisfeita. |
| 1.5.7 | Validação simulada de percurso no registro de tempo | Patrick Cruz | Patrick Cruz (percurso/tempo), Gabriel Cabral (persistência) e Hugo Lima (endpoint e testes), somente após autorização | Casos com percurso correspondente e divergente produzem resultados distintos e verificáveis sem GPS ou sensor real. |
| 1.5.8 | Testes de API, persistência, regras e erros prioritários | Patrick Cruz | Patrick Cruz (testes), Gabriel Cabral (integração) e Hugo Lima (validações), somente após autorização | Os testes cobrem respostas válidas e inválidas, persistência e regras críticas; falhas prioritárias retornam erro identificável e não deixam o estado inconsistente. |

Nenhuma entrega ou aceite de 1.5 pode ser tratado como iniciado/concluído até 05/10/2026, inclusive. O aceite dos pacotes requer aprovação formal da extensão e execução posterior a essa data.

## 1.6 Integração do marco 2 — extensão condicionada

| Pacote | Entrega proposta | A | R | Aceite observável |
|---|---|---|---|---|
| 1.6.1 | Frontend conectado aos endpoints Express prioritários | Gabriel Cabral | Gabriel Cabral (integração), Hugo Lima (endpoints) e Patrick Cruz (contratos e testes), após aprovação | Os fluxos selecionados do frontend executam contra a API Express local, sem substituir a API por mock durante o aceite integrado. |
| 1.6.2 | Fluxos demonstrados com persistência MongoDB | Gabriel Cabral | Gabriel Cabral (persistência), Hugo Lima (endpoints) e Patrick Cruz (testes), após aprovação | Alterações fictícias realizadas nos fluxos são recuperadas em novo acesso e após reinício da API. |
| 1.6.3 | Regras de Match/Chat, treino, percurso/tempo, confronto e ranking integradas | Hugo Lima | Gabriel Cabral (regras), Hugo Lima (validações) e Patrick Cruz (testes), após aprovação | Casos positivos e negativos reproduzem as condições de Match recíproco, treino individual, percurso/tempo e confirmação bilateral, com ranking coerente. |
| 1.6.4 | Testes ponta a ponta, instruções e limitações de M2 | Patrick Cruz | Gabriel Cabral (integração), Hugo Lima (instruções) e Patrick Cruz (testes), após aprovação | Outro integrante reproduz os fluxos integrados seguindo as instruções; Rafael Voigt, Rafael Yahata, Daniel Dezerto e Bernardo Borio validam e registram os testes e limitações conhecidos. |
| 1.6.5 | Demonstração e aceite interno de M2 | Rafael Voigt | Gabriel Cabral (integração), Hugo Lima (instruções) e Patrick Cruz (demonstração); Rafael Voigt (aceite), Rafael Yahata (lições), Daniel Dezerto (encerramento) e Bernardo Borio (arquivo) | Se a extensão for aprovada, o roteiro de M2 é demonstrado em 10/11/2026 e o aceite/recusa GPTI é registrado em 30/11/2026, com ciência do patrocinador. |

M2 não é parte da linha de base aprovada pelo Termo de Abertura ou Business Case. Seus aceites só se aplicam após aprovação formal; a demonstração local não autoriza operação com usuários ou dados reais.

## 1.7 Verificação e encerramento acadêmico

| Pacote | Entrega | A | R | Aceite observável |
|---|---|---|---|---|
| 1.7.1 | Testes de aceitação dos fluxos priorizados | Hugo Lima | Gabriel Cabral (integração), Hugo Lima (testes de fluxo) e Patrick Cruz (testes de regra); Bernardo Borio consolida evidências | Há resultado aprovado/reprovado para cada caso do roteiro; falhas têm evidência, prioridade e decisão de correção ou limitação. |
| 1.7.2 | Defeitos prioritários tratados | Gabriel Cabral | Gabriel Cabral, Hugo Lima e Patrick Cruz corrigem; Rafael Voigt coordena as decisões e Daniel Dezerto registra mudanças | Defeitos que impedem critérios de aceite são corrigidos e retestados ou registrados como limitação conhecida, com impacto na demonstração. |
| 1.7.3 | Instalação, configuração e execução documentadas | Hugo Lima | Gabriel Cabral (ambiente), Hugo Lima (instruções) e Patrick Cruz (execução/demonstração); Bernardo Borio revisa | Um integrante diferente do autor consegue iniciar a versão entregue seguindo as instruções, com dependências e limitações declaradas. |
| 1.7.4 | Aceites, lições e evolução futura registrados | Daniel Dezerto | Rafael Voigt (aceite), Rafael Yahata (lições e pendências), Daniel Dezerto (encerramento) e Bernardo Borio (arquivo); Gabriel Cabral, Hugo Lima e Patrick Cruz fornecem evidências | O encerramento distingue o que foi aceito em M1, o que ficou pendente/fora de escopo e o que depende de aprovação ou validação futura; não presume implantação institucional. |

## Referências

- [Plano de Projeto Cicla+ — versão 7](plano-de-projetoV7.md)
- [Termo de Abertura do Projeto Cicla+](termo-de-abertura.md)
- [Business Case Cicla+](business-case.md)
