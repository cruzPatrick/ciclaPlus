import { apiGet, apiPost, apiPatch, apiDelete } from "./client.js";

// --- Usuários (login / cadastro / perfil) -----------------------------
export const usuariosApi = {
  // Filtra no JS, não via querystring: o motor de filtro por múltiplos
  // parâmetros do json-server@1 (beta) se mostrou instável em teste local
  // (`?email=...&senha=...` retornando vazio mesmo com o registro
  // existindo). Com o volume de dados mockado isso não tem custo real.
  async autenticar(email, senha) {
    const usuarios = await apiGet("/usuarios");
    return usuarios.find((u) => u.email === email && u.senha === senha) ?? null;
  },
  async emailJaExiste(email) {
    const usuarios = await apiGet("/usuarios");
    return usuarios.some((u) => u.email === email);
  },
  cadastrar(dados) {
    return apiPost("/usuarios", { ...dados, perfil: "ciclista" });
  },
  buscarPorId(id) {
    return apiGet(`/usuarios/${id}`);
  },
  atualizar(id, dados) {
    return apiPatch(`/usuarios/${id}`, dados);
  },
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
  remover: (id) => apiDelete(`/candidatos/${id}`),
};

// --- Matches -------------------------------------------------------------
export const matchesApi = {
  listarPorUsuario: (usuarioId) => porConta("/matches", usuarioId),
  adicionar: (match) => apiPost("/matches", match),
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
};

// --- Treinos ---------------------------------------------------------------
export const treinosApi = {
  listarPorUsuario: (usuarioId) => porConta("/treinos", usuarioId),
  // Equipes são diretório compartilhado (igual ao Ranking), não dado
  // pessoal — continua global.
  equipes: () => apiGet("/equipes"),
  marcar: (treino) => apiPost("/treinos", treino),
  atualizar: (id, dados) => apiPatch(`/treinos/${id}`, dados),
};

// --- Tempos (só preenchido pelo Cronômetro guiado pelo mapa) -------------
export const temposApi = {
  listarPorUsuario: (usuarioId) => porConta("/tempos", usuarioId),
  adicionar: (tempo) => apiPost("/tempos", tempo),
  remover: (id) => apiDelete(`/tempos/${id}`),
};

// --- Confrontos --------------------------------------------------------
export const confrontosApi = {
  listarPorUsuario: (usuarioId) => porConta("/confrontos", usuarioId),
  marcar: (confronto) => apiPost("/confrontos", confronto),
  atualizar: (id, dados) => apiPatch(`/confrontos/${id}`, dados),
};

// --- Consultoria -----------------------------------------------------------
export const consultoriasApi = {
  listarPorUsuario: (usuarioId) => porConta("/consultorias", usuarioId),
  solicitar: (consultoria) => apiPost("/consultorias", consultoria),
};

// --- Ranking (somente leitura — é derivado dos resultados do sistema) ----
export const rankingApi = {
  geral: () => apiGet("/ranking"),
  melhoresTemposPorPercurso: () => apiGet("/melhoresTemposPorPercurso"),
};
