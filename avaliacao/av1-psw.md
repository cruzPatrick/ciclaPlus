# Correção da AV1 — PSW — Cicla+

Repositório: https://github.com/cruzPatrick/ciclaPlus

A nota de cada aluno é a parte comum do grupo mais a qualidade individual. Quem não tem commit no repositório recebe a parte comum do grupo, sem a parte individual. A parte comum vale 60 pontos: stack da disciplina (30) e escopo funcionando (30). Os 40 restantes avaliam a qualidade do que o próprio aluno fez.

| Aluno | Nota |
| --- | ---: |
| Patrick Cruz Azevedo | 80 |
| Gabriel Cabral Almeida de Carvalho | 46 |
| Hugo Lima de Almeida Antunes Aguiar | 46 |

## Parte comum — 46/60

O projeto sobe com as instruções do README: `npm run mock` na porta 3001 e `npm run dev` na porta 5173.

A stack vale 30/30. O frontend usa React com rotas, React Hook Form, Zod, TanStack Query 5 com mutations, JSON Server e Bootstrap 5. O cliente HTTP só segue em frente quando a resposta vem com sucesso.

O escopo vale 16/30. A régua são os seis pacotes do marco 1 no dicionário da EAP, 5 pontos cada. Nenhuma tela tem listar, criar, editar e excluir.

- Perfil, 3/5. Dá para consultar, editar e trocar entre Ciclista e Equipe, e a troca grava. O menu não muda com o perfil.
- Match, chat e boost, 2/5. O match grava e o ciclista sai da fila. O chat envia para quem já está na lista local; não há match da outra pessoa. Boost não existe.
- Atividades, 3/5. Treino individual, treino em equipe e consultoria gravam. Passeio não existe. O treino individual não exige match.
- Confronto, 3/5. O convite nasce pendente e o status muda. A mesma conta aceita, registra o resultado e encerra. Não há confirmação da outra parte.
- Tempo, 3/5. A tela lista, grava e exclui. O cronômetro usa a localização do navegador. A regra do plano pede entrada simulada, sem GPS nem serviço externo. Não há edição do tempo.
- Ranking, 2/5. A tabela aparece, lida do arquivo de dados. Registrar um resultado não muda a pontuação.

Conferido na tela: login vazio mostra o erro no campo; o acesso de teste entra em Dar Match; o match em Pedro Lima grava; um treino marcado em 02/11/2026 às 07:30 continua na lista depois de recarregar a página.

## Patrick Cruz Azevedo — 80

Os commits de código em `src/` estão no nome dele. A nota reúne os 46 pontos do grupo e 34 de qualidade.

Descontos na parte individual:

- 4 pontos. `mudancas/soul.md` ainda diz que o protótipo não tem backend e que o cadastro não persiste. O aplicativo grava no JSON Server. Quem lê a especificação mínima recebe a regra errada.
- 2 pontos. `src/pages/app/Chat.jsx` coloca estilo inline na distância do ciclista. O restante da interface está no Bootstrap, com erro no campo, carregando e erro de servidor separados.

O restante da parte dele está organizado: a API fica em `src/api/`, os hooks separam os dados por conta e atualizam a lista depois da escrita, e os formulários validam com Zod.

## Gabriel Cabral Almeida de Carvalho — 46

Não há commit, e-mail nem arquivo com o nome dele no repositório. O dicionário atribui a ele o perfil, as atividades e o confronto. Essas telas existem, no histórico de Patrick Cruz Azevedo. A nota é a parte comum do grupo, 46 pontos. Sem commit, não há parte individual a avaliar.

## Hugo Lima de Almeida Antunes Aguiar — 46

Não há commit, e-mail nem arquivo com o nome dele no repositório. O dicionário atribui a ele o match, o chat e o ranking. Essas telas existem, no histórico de Patrick Cruz Azevedo. A nota é a parte comum do grupo, 46 pontos. Sem commit, não há parte individual a avaliar.
