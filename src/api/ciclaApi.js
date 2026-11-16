import { apiGet, apiPost, apiPatch, apiDelete } from "./client.js";
import { normalizarTempo } from "../utils/tempo.js";
import { usuarioLogadoId } from "./sessao.js";

const API_BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL ?? "http://localhost:3000";

async function backendRequest(caminho, { method = "GET", body } = {}) {
  const usuarioId = usuarioLogadoId();
  if (!usuarioId) throw new Error("Usuário não identificado para acessar a API.");

  const headers = { "x-usuario-id": usuarioId };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const resposta = await fetch(`${API_BACKEND_URL}${caminho}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!resposta.ok) {
    const corpo = await resposta.text().catch(() => "");
    throw new Error(
      `Erro ${resposta.status} ao falar com a API (${resposta.url}). ${corpo}`.trim()
    );
  }
  if (resposta.status === 204) return null;
  return resposta.json();
}

const backendGet = (caminho) => backendRequest(caminho);
const backendPost = (caminho, body) => backendRequest(caminho, { method: "POST", body });
const backendPatch = (caminho, body) => backendRequest(caminho, { method: "PATCH", body });
const backendDelete = (caminho) => backendRequest(caminho, { method: "DELETE" });

function treinoParaBackend(treino) {
  const dados = { ...treino };
  const pessoaOuEquipe =
    dados.parceiroOuEquipe ?? (dados.tipo === "equipe" ? dados.equipe : dados.parceiro);
  delete dados.parceiro;
  delete dados.equipe;
  delete dados.usuarioId;
  if (pessoaOuEquipe !== undefined) dados.parceiroOuEquipe = pessoaOuEquipe;
  return dados;
}

function treinoDoBackend(treino) {
  const { parceiroOuEquipe, ...dados } = treino;
  return {
    ...dados,
    parceiro: treino.tipo === "individual" ? parceiroOuEquipe : null,
    equipe: treino.tipo === "equipe" ? parceiroOuEquipe : null,
  };
}

function tempoParaBackend(tempo) {
  const dados = { ...tempo };
  if (dados.nome !== undefined) dados.trajeto = dados.nome;
  if (dados.tempo !== undefined) dados.duracao = normalizarTempo(dados.tempo);
  if (dados.distanciaKm !== undefined) dados.distancia = dados.distanciaKm;
  delete dados.nome;
  delete dados.tempo;
  delete dados.distanciaKm;
  delete dados.usuarioId;
  return dados;
}

function tempoDoBackend(tempo) {
  return {
    ...tempo,
    nome: tempo.trajeto,
    tempo: normalizarTempo(tempo.duracao),
    distanciaKm: tempo.distancia,
  };
}

// --- Usuários (login / cadastro / perfil / boost) ----------------------
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
  async listarPorUsuario() {
    return (await backendGet("/treinos")).map(treinoDoBackend);
  },
  // Equipes são diretório compartilhado (igual ao Ranking), não dado
  // pessoal — continua global.
  equipes: () => apiGet("/equipes"),
  async marcar(treino) {
    return treinoDoBackend(await backendPost("/treinos", treinoParaBackend(treino)));
  },
  async atualizar(id, dados) {
    return treinoDoBackend(await backendPatch(`/treinos/${id}`, treinoParaBackend(dados)));
  },
  remover: (id) => backendDelete(`/treinos/${id}`),
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
  async listarPorUsuario() {
    return (await backendGet("/tempos")).map(tempoDoBackend);
  },
  async adicionar(tempo) {
    return tempoDoBackend(await backendPost("/tempos", tempoParaBackend(tempo)));
  },
  async atualizar(id, dados) {
    return tempoDoBackend(await backendPatch(`/tempos/${id}`, tempoParaBackend(dados)));
  },
  remover: (id) => backendDelete(`/tempos/${id}`),
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
  geral: () => apiGet("/ranking"),

  // Soma os pontos do resultado confirmado à linha da pessoa logada (cria a
  // linha se ainda não existir) e atualiza o melhor tempo dela.
  async registrarResultado({ usuarioId, resultado }) {
    const [ranking, usuario, tempos] = await Promise.all([
      apiGet("/ranking"),
      usuariosApi.buscarPorId(usuarioId),
      temposApi.listarPorUsuario(),
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

  async melhoresTemposPorPercurso() {
    const tempos = await backendGet("/tempos/melhores-por-percurso");
    return tempos.map((tempo) => ({
      ...tempo,
      percurso: tempo.trajeto,
      tempo: normalizarTempo(tempo.duracao),
      distanciaKm: tempo.distancia,
    }));
  },
};
