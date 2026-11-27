// Sessão: guarda o token JWT e o id do usuário logado no localStorage.
// O token é o que prova a identidade para a API; o id só serve para chaves de
// cache e para os módulos que ainda filtram por conta no json-server.
const CHAVE_TOKEN = "ciclaplus.token";
const CHAVE_ID = "ciclaplus.usuarioId";

export function salvarSessao({ token, usuario }) {
  localStorage.setItem(CHAVE_TOKEN, token);
  localStorage.setItem(CHAVE_ID, String(usuario.id));
}

// Troca de senha devolve um token novo para o mesmo usuário.
export function salvarToken(token) {
  localStorage.setItem(CHAVE_TOKEN, token);
}

export function tokenSessao() {
  return localStorage.getItem(CHAVE_TOKEN) || null;
}

// Id como string (ObjectId do Mongo). Sem token, não há sessão.
export function usuarioLogadoId() {
  if (!tokenSessao()) return null;
  return localStorage.getItem(CHAVE_ID) || null;
}

export function limparSessao() {
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_ID);
}
