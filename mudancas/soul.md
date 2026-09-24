# SOUL.md — Cicla+ (identidade e regras do projeto)

*Documento-âncora do projeto. Contexto de histórico: `changelog.md`.
Pendências: `backlog.md`. Quem for continuar o desenvolvimento (humano ou
IA) deve ler este arquivo primeiro.*

## O que é

**Cicla+** — rede social de ciclistas (projeto da disciplina de PSW). Usuários
dão match, conversam por chat, marcam treinos (individual/em equipe),
cronometram percursos com mapa, disputam confrontos e acompanham rankings.

- **Perfis de usuário:** Ciclista e Equipe.
- **Estado atual:** protótipo front-end **sem backend** — todo dado exibido é
  variável local dentro do componente. Nada persiste.
- **Login de teste fixo:** `teste@ciclaplus.com` / `123456`.

## Stack

| Camada | Tecnologia |
|---|---|
| Build | Vite 8 |
| UI | React 19 + react-router-dom 7 (SPA, `BrowserRouter` com `basename` do Pages) |
| Estilo | Bootstrap 5 via **import parcial do Sass** + paleta Cicla nas variáveis |
| Mapa | Leaflet 1.9 + tiles OpenStreetMap (sem chave de API) |
| Lint | oxlint (`npm run lint`) |
| Deploy | GitHub Pages via Actions, **só manual** (`workflow_dispatch`) |

## Regras invioláveis

1. **Sem backend:** dados sempre locais nos componentes; nunca inventar API.
   Persistência (localStorage/API) só quando a tarefa pedir explicitamente.
2. **Cores só via variáveis do Bootstrap** (paleta em `custom.scss`): não
   escrever cor hard-coded em CSS/JS — `$primary`/`$secondary`/`.bg-ciclagrey`
   já nascem certos. CSS custom só onde o Bootstrap não cobre.
3. **LGPD:** localização fica só em memória, nunca persistida nem enviada;
   sempre pedir consentimento explícito antes do prompt nativo.
4. **Deploy é manual:** push em `main` **não** publica. Publicar só via
   Actions → *Deploy to GitHub Pages* → *Run workflow*.
5. **Rotas antigas nunca quebram:** ao renomear rota, deixar `<Navigate>`
   de redirect (ex.: `cronometro` → `mapa`).
6. **"Perfil" é sempre o último item** do menu (hambúrguer e abas mobile).
7. **Rodar `npm.cmd run lint` e `npm.cmd run build` antes de commitar**
   (usar `npm.cmd`, o `npm.ps1` é bloqueado pela execution policy).
8. **Registrar toda rodada** no `changelog.md`; pendências novas vão para o
   `backlog.md`.
9. **Avisos do Sass** (deprecation do Bootstrap) e o **aviso de chunk >500 kB**
   (Leaflet) são esperados — não são erros.

## Paleta

| Cor | Hex | Papel |
|---|---|---|
| Pine Blue | `#357266` | Primária |
| Taupe Grey | `#6F5E5C` | Secundária |
| Ash Grey | `#AEB7B3` | Apoio |

Preto e branco só como neutros. Layout visual herdado do repositório
`projeto-login` (cards de auth + Material Icons), com essa paleta no lugar
das cores originais.

## Estrutura de rotas

```
/              Landing (pública)
/login         Login (valida usuário de teste fixo)
/cadastro      Cadastro (simula, não persiste)
/app/*         Área interna (AppLayout: hambúrguer desktop + abas mobile)
  descoberta | chat | treino | mapa | tempos | confronto |
  consultoria | ranking | perfil
```

Rotas antigas mantidas como redirect: `treino-individual`, `treino-equipe`
(`?tipo=`) e `cronometro` → `/app/mapa`.

## Tom e personalidade

- Tom **descontraído, direto e motivador** — linguagem de quem pedala junto,
  nunca corporativo/genérico.
- Textos em **português do Brasil**, com `pt-BR` no `html lang`.
- Mensagens de erro **explicam o próximo passo**, não só o problema.
- Microcopy de privacidade **clara e honesta** (dado não sai do navegador).
- Nomes de menu curtos (`Descobrir Ciclistas`, `Mapa`, `Ranking`).
- IA assistindo: este documento é a fonte de verdade; mudanças de regra só
  por alteração explícita nele.

---

*(Última atualização: 2026-09-24 — criação por divisão do antigo
`soul.md` em `SOUL.md` + `backlog.md` + `changelog.md`.)*
