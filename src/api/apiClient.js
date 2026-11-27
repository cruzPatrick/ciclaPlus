// Cliente HTTP da API Express (backend/). Envia o token JWT em todas as
// chamadas. O json-server (client.js) continua existindo só para os módulos
// que ainda não migraram para a API.
import { tokenSessao, limparSessao } from "./sessao.js";

export const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

export class ApiError extends Error {
  constructor(status, mensagem, detalhes) {
    super(mensagem);
    this.status = status;
    this.detalhes = detalhes;
  }
}

async function requisitar(metodo, caminho, corpo) {
  const token = tokenSessao();
  let resposta;
  try {
    resposta = await fetch(`${API_BASE}${caminho}`, {
      method: metodo,
      headers: {
        ...(corpo !== undefined && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new ApiError(0, "Não foi possível falar com a API. Ela está rodando? (cd backend && npm start)");
  }

  if (resposta.status === 204) return null;
  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    // Sessão expirada/inválida: limpa e volta pro login (exceto nas próprias
    // rotas de login/cadastro, onde 401 só significa "credenciais erradas").
    if (resposta.status === 401 && !caminho.startsWith("/auth/")) {
      limparSessao();
      window.location.assign("/login");
    }
    throw new ApiError(resposta.status, dados?.erro ?? `Erro ${resposta.status} na API.`, dados?.detalhes);
  }
  return dados;
}

export const api = {
  get: (caminho) => requisitar("GET", caminho),
  post: (caminho, corpo) => requisitar("POST", caminho, corpo ?? {}),
  put: (caminho, corpo) => requisitar("PUT", caminho, corpo ?? {}),
  patch: (caminho, corpo) => requisitar("PATCH", caminho, corpo ?? {}),
  delete: (caminho, corpo) => requisitar("DELETE", caminho, corpo),
};
