# Correção da AV1 — GPTI — Cicla+

Repositório: https://github.com/cruzPatrick/ciclaPlus

Artefatos: `docs/business-case.md`, `docs/termo-de-abertura.md`, `docs/plano-de-projetoV7.md`, `docs/dicionario-eap.md`.

A nota é do Grupo F de GPTI e vale para cada aluno do grupo. Nesta etapa, a ausência de commit não zera ninguém. O nome na atividade do cronograma é o contrato da etapa seguinte. A especificação de referência é a matriz de requisitos do Cicla+ usada na AV1 de PSW: perfis Ciclista e Equipe, 15 casos de uso, Match, treino, percurso, confronto, ranking e Boost, com o `json-server` como API do marco 1.

| Aluno | Nota |
| --- | ---: |
| Bernardo Dias Borio | 98 |
| Daniel Dezerto Rimes | 98 |
| Rafael Duarte Yahata | 98 |
| Rafael Voigt Villas Boas | 98 |

## Parte comum — 98/100

| Parte | Nota |
| --- | ---: |
| Business case | 10/10 |
| Termo de abertura | 15/15 |
| Escopo e EAP | 15/15 |
| Cronograma com nomes | 24/25 |
| Custo, partes e riscos | 14/15 |
| Dicionário da EAP | 15/15 |
| Um projeto só | 5/5 |

### Business case — 10/10

A seção 4 compara manter o esboço, concluir o frontend com `json-server` e antecipar Express com MongoDB, e recomenda a segunda. A seção 5 traz a capacidade de 4,5 h por integrante de PSW e 4 h por integrante de GPTI, o desembolso de R$ 0,00 e o custo simulado de R$ 6.170,60, com a ressalva de que a parcela de M2 depende de aprovação. A seção 6 trata o Boost como monetização futura, sem estimativa que comprove retorno. É o produto da especificação, com a ordem de grandeza do protótipo.

### Termo de abertura — 15/15

O termo autoriza o marco 1: frontend demonstrável dos 15 casos de uso, com dados fictícios servidos pelo `json-server`, até 06/10/2026. A seção que trata da extensão deixa Express e MongoDB para M2, condicionados a decisão da equipe e aprovação do patrocinador. Há marcos, premissas, critérios de sucesso e a tabela de aprovação.

### Escopo e EAP — 15/15

A declaração (4.1) e a matriz de rastreabilidade (4.3) cobrem os dois perfis e os 15 casos. A EAP separa 1.3 base técnica, 1.4 frontend do marco 1 e, como extensão condicionada, 1.5 backend e 1.6 integração, com a regra de que nenhuma atividade de backend ocorre até 05/10/2026. O recorte é o mesmo que a PSW entregou.

### Cronograma com nomes — 24/25

A rede D01 a D12 e G01 a G09 tem predecessora, semana e esforço, com o caminho crítico D01 → D08 → M1 e a cadeia G01 → G05. A seção 5.5 põe, em cada semana, Gabriel Cabral, Hugo Lima e Patrick Cruz com uma tarefa e as horas ("D05 — perfil 4,5 h", "D05 — Match/Chat 4,5 h", "D05 — Boost/perfil equipe 4,5 h"). A seção 5.6 faz o mesmo para Rafael Voigt, Rafael Yahata, Daniel Dezerto e Bernardo Borio, da iniciação aos três Status Reports e ao encerramento.

Desconto:

- 1 ponto. Nas linhas de atividade da seção 5.2, o responsável de G06 a G08 é "Rafael Voigt, Rafael Yahata, Daniel Dezerto e Bernardo Borio", e o das linhas D são os três de PSW juntos. A divisão por pessoa fica só na semana.

### Custo, partes e riscos — 14/15

O orçamento usa a taxa-sombra R$ 18,8461538/h sobre 147 h de PSW e 134 h de GPTI. A contingência de 25 h está nomeada por evento, com quem executa, e a reserva gerencial só sai com aprovação do patrocinador. Os riscos RT01 a RT04 e RG01 a RG04 têm probabilidade, impacto em horas, gatilho, resposta e responsável nominal. A seção 7 nomeia Rafael Voigt na comunicação com o patrocinador, e a seção 5.6 põe os Status Reports em Bernardo Borio.

Desconto:

- 1 ponto. Os oito riscos são ameaças. Não há uma oportunidade registrada com resposta.

### Dicionário da EAP — 15/15

Cada pacote tem um A com nome e um R com nome e papel entre parênteses: "Rafael Voigt (Business Case), Rafael Yahata (Termo), Daniel Dezerto (revisão) e Bernardo Borio (consistência)" em 1.1.1; "Gabriel Cabral (requisitos), Hugo Lima (casos de uso) e Patrick Cruz (critérios de aceite)" em 1.2.2. O aceite é observável e é o do Cicla+: Match, treino, percurso, tempo e resultado com regras verificáveis; login e troca de perfil sem OAuth; ranking e confrontos com dados suficientes para percorrer os critérios.

### Um projeto só — 5/5

Caso, termo, plano e dicionário tratam do mesmo frontend de marco 1, com os mesmos códigos, a mesma condição para M2 e as mesmas sete pessoas.

## O que esta nota deixa para a etapa seguinte

A seção 5.5 põe Gabriel Cabral, Hugo Lima e Patrick Cruz cada um numa tarefa e nas horas da semana. A seção 5.6 faz o mesmo para Rafael Voigt, Rafael Yahata, Daniel Dezerto e Bernardo Borio, inclusive na gestão. A etapa seguinte cobra essa célula. O backend D09 a D12 só entra depois da autorização que o plano exige.
