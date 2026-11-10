import { apiGet, apiPost, apiPatch, apiDelete } from "./client.js";
import { api } from "./apiClient.js";
import { usuarioLogadoId } from "./sessao.js";
import { normalizarTempo, paraSegundos } from "../utils/tempo.js";

// --- Usuários (login / cadastro / perfil) -------------------------------
// Agora vêm da API Express (backend/), com JWT. Ver src/api/apiClient.js.
//
// ATENÇÃO (Boost): a API ainda não tem "boostAte" no perfil (o Boost do
// backend é outro modelo: POST /boost). Enquanto a tela de Boost não migrar,
// o estado dela fica no navegador (localStorage, por usuário), só para a
// demonstração continuar funcionando. Quem migrar Boost para a API remove isto.
const chaveBoost = (id) => `ciclaplus.boostAte.${id}`;
function lerBoost(id) {
  try {
    return localStorage.getItem(chaveBoost(id)) || null;
  } catch {
    return null;
  }
}
function gravarBoost(id, valor) {
  try {
    if (valor) localStorage.setItem(chaveBoost(id), valor);
    else localStorage.removeItem(chaveBoost(id));
  } catch {
    /* sem localStorage: o boost só não persiste */
  }
}

export const usuariosApi = {
  // Devolve { token, usuario }; credenciais erradas → ApiError 401.
  autenticar: (email, senha) => api.post("/auth/login", { email, senha }),
  cadastrar: (dados) => api.post("/auth/cadastro", dados),
  async buscarPorId(id) {
    const eu = String(id) === String(usuarioLogadoId());
    const perfil = await api.get(eu ? "/perfil" : `/perfil/${id}`);
    return eu ? { ...perfil, boostAte: lerBoost(id) } : perfil;
  },
  async atualizar(id, dados) {
    const { boostAte, ...restante } = dados;
    if (boostAte !== undefined) gravarBoost(id, boostAte);
    if (Object.keys(restante).length > 0) await api.patch("/perfil", restante);
    return usuariosApi.buscarPorId(id);
  },
  trocarSenha: (senhaAtual, novaSenha) => api.put("/perfil/senha", { senhaAtual, novaSenha }),
  excluirConta: (senha) => api.delete("/perfil", { senha }),
};

// --- Filtro por conta (dados pessoais) ----------------------------------
// Toda coleção pessoal é por conta: cada um enxerga só os próprios
// registros. O filtro roda no JS — a querystring do json-server@1 (beta)
// é instável com múltiplos parâmetros (mesmo motivo do login/mensagens).
async function porConta(caminho, usuarioId) {
  const todos = await apiGet(caminho);
  return todos.filter((registro) => String(registro.usuarioId) === String(usuarioId));
}

// --- Descoberta (candidatos pro "Dar Match") ---------------------------
export const candidatosApi = {
  listarPorUsuario: (usuarioId) => porConta("/candidatos", usuarioId),
  adicionar: (candidato) => apiPost("/candidatos", candidato),
  remover: (id) => apiDelete(`/candidatos/${id}`),
};

// --- Matches -------------------------------------------------------------
// `mutuo: false` = você deu match e a outra pessoa ainda não retribuiu.
export const matchesApi = {
  listarPorUsuario: (usuarioId) => porConta("/matches", usuarioId),
  adicionar: (match) => apiPost("/matches", match),
  atualizar: (id, dados) => apiPatch(`/matches/${id}`, dados),
  remover: (id) => apiDelete(`/matches/${id}`),
};

// --- Mensagens (Chat, por match) -----------------------------------------
export const mensagensApi = {
  // Mesmo motivo do login: filtra no JS em vez de confiar no querystring
  // do json-server@1 beta.
  async listarPorMatch(matchId) {
    const mensagens = await apiGet("/mensagens");
    return mensagens.filter((m) => String(m.matchId) === String(matchId));
  },
  enviar: (mensagem) => apiPost("/mensagens", mensagem),
  // Apaga a conversa inteira de um match (Desfazer match). Em sequência, não em
  // paralelo: o json-server reescreve o db.json a cada exclusão.
  async removerPorMatch(matchId) {
    const mensagens = await apiGet("/mensagens");
    for (const m of mensagens.filter((m) => String(m.matchId) === String(matchId))) {
      await apiDelete(`/mensagens/${m.id}`);
    }
  },
};

// --- Treinos ---------------------------------------------------------------
export const treinosApi = {
  listarPorUsuario: (usuarioId) => porConta("/treinos", usuarioId),
  // Equipes são diretório compartilhado (igual ao Ranking), não dado
  // pessoal — continua global.
  equipes: () => apiGet("/equipes"),
  marcar: (treino) => apiPost("/treinos", treino),
  atualizar: (id, dados) => apiPatch(`/treinos/${id}`, dados),
  remover: (id) => apiDelete(`/treinos/${id}`),
};

// --- Passeios (Manter Passeio: CRUD completo) -------------------------------
export const passeiosApi = {
  listarPorUsuario: (usuarioId) => porConta("/passeios", usuarioId),
  criar: (passeio) => apiPost("/passeios", passeio),
  atualizar: (id, dados) => apiPatch(`/passeios/${id}`, dados),
  remover: (id) => apiDelete(`/passeios/${id}`),
};

// --- Percursos (diretório compartilhado, usado pra verificar o tempo) -------
export const percursosApi = {
  listar: () => apiGet("/percursos"),
};

// --- Tempos (Cronômetro simulado ou GPS) -----------------------------------
export const temposApi = {
  listarPorUsuario: (usuarioId) => porConta("/tempos", usuarioId),
  adicionar: (tempo) => apiPost("/tempos", tempo),
  atualizar: (id, dados) => apiPatch(`/tempos/${id}`, dados),
  remover: (id) => apiDelete(`/tempos/${id}`),
};

// --- Confrontos --------------------------------------------------------
export const confrontosApi = {
  listarPorUsuario: (usuarioId) => porConta("/confrontos", usuarioId),
  marcar: (confronto) => apiPost("/confrontos", confronto),
  atualizar: (id, dados) => apiPatch(`/confrontos/${id}`, dados),
  remover: (id) => apiDelete(`/confrontos/${id}`),
  // Apaga o histórico de confrontos da conta com uma pessoa (Desfazer match).
  async removerDoAdversario(usuarioId, adversario) {
    const meus = await porConta("/confrontos", usuarioId);
    for (const c of meus.filter((c) => c.adversario === adversario)) {
      await apiDelete(`/confrontos/${c.id}`);
    }
  },
};

// --- Consultoria -----------------------------------------------------------
export const consultoriasApi = {
  listarPorUsuario: (usuarioId) => porConta("/consultorias", usuarioId),
  solicitar: (consultoria) => apiPost("/consultorias", consultoria),
  remover: (id) => apiDelete(`/consultorias/${id}`),
};

// --- Ranking ---------------------------------------------------------------
// Regra fixa da demonstração (documentada na tela de Ranking): só entra
// pontuação depois que o resultado do confronto foi confirmado pelas DUAS
// partes. Vitória vale 100 pontos; derrota, 25 (participação).
export const PONTOS_POR_RESULTADO = { Vitória: 100, Derrota: 25 };

export const rankingApi = {
  // Ranking geral vem da API: derivado dos confrontos ENCERRADOS (100/25).
  async geral() {
    const { itens } = await api.get("/ranking?limite=100");
    return itens;
  },
  melhoresTemposPorPercurso: () => apiGet("/melhoresTemposPorPercurso"),

  // Soma os pontos do resultado confirmado à linha da pessoa logada (cria a
  // linha se ainda não existir) e atualiza o melhor tempo dela.
  async registrarResultado({ usuarioId, resultado }) {
    const [ranking, usuario, tempos] = await Promise.all([
      apiGet("/ranking"),
      usuariosApi.buscarPorId(usuarioId),
      porConta("/tempos", usuarioId),
    ]);
    const pontos = PONTOS_POR_RESULTADO[resultado] ?? 0;
    const melhorTempo =
      tempos.map((t) => normalizarTempo(t.tempo)).sort()[0] ?? null;
    const linha = ranking.find((r) => String(r.usuarioId) === String(usuarioId));

    if (linha) {
      return apiPatch(`/ranking/${linha.id}`, {
        nome: usuario.nome,
        pontuacao: linha.pontuacao + pontos,
        melhorTempo: melhorTempo ?? linha.melhorTempo,
      });
    }
    return apiPost("/ranking", {
      nome: usuario.nome,
      pontuacao: pontos,
      melhorTempo: melhorTempo ?? "--:--:--",
      usuarioId: String(usuarioId),
    });
  },

  // Mantém "melhores tempos por percurso" coerente com os tempos reais
  // registrados: só grava se for o primeiro tempo da pessoa naquele percurso
  // ou se for melhor que o que já estava lá.
  async registrarTempo({ percurso, ciclista, tempo, distanciaKm }) {
    const tabela = await apiGet("/melhoresTemposPorPercurso");
    const atual = tabela.find((r) => r.percurso === percurso && r.ciclista === ciclista);
    const novo = normalizarTempo(tempo);
    if (!atual) {
      return apiPost("/melhoresTemposPorPercurso", { percurso, ciclista, tempo: novo, distanciaKm });
    }
    if (paraSegundos(novo) < paraSegundos(atual.tempo)) {
      return apiPatch(`/melhoresTemposPorPercurso/${atual.id}`, { tempo: novo });
    }
    return atual;
  },
};
