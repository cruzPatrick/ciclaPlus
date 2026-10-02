// Cliente HTTP fino pro backend mockado (json-server, porta 3001 — ver
// `npm run mock`). Nenhum componente faz fetch direto: tudo passa por aqui
// e por src/api/ciclaApi.js, que é o que os hooks do Tanstack Query chamam.
export const API_URL = "http://localhost:3001";

async function tratarResposta(resposta) {
  if (!resposta.ok) {
    const corpo = await resposta.text().catch(() => "");
    throw new Error(
      `Erro ${resposta.status} ao falar com o json-server (${resposta.url}). ` +
        `Confere se ele está rodando: npm run mock. ${corpo}`.trim()
    );
  }
  if (resposta.status === 204) return null;
  return resposta.json();
}

export function apiGet(caminho) {
  return fetch(`${API_URL}${caminho}`).then(tratarResposta);
}

export function apiPost(caminho, corpo) {
  return fetch(`${API_URL}${caminho}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  }).then(tratarResposta);
}

export function apiPatch(caminho, corpo) {
  return fetch(`${API_URL}${caminho}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  }).then(tratarResposta);
}

export function apiDelete(caminho) {
  return fetch(`${API_URL}${caminho}`, { method: "DELETE" }).then(tratarResposta);
}
