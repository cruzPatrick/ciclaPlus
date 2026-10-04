// Sessão mínima: só guarda o id do usuário logado no localStorage. Não é
// autenticação de verdade (json-server não tem isso) — é o suficiente pra
// Perfil.jsx saber qual usuário buscar/editar e pra proteger a navegação.
const CHAVE = "ciclaplus.usuarioId";

export function salvarUsuarioLogado(id) {
  localStorage.setItem(CHAVE, String(id));
}

// Devolve o id como string, sem passar por Number(): ids gerados pelo
// json-server podem ser alfanuméricos ("ye1i6QUqlGY") e Number() viraria
// NaN, quebrando busca de usuário e filtro de matches por conta.
export function usuarioLogadoId() {
  return localStorage.getItem(CHAVE) || null;
}

export function limparSessao() {
  localStorage.removeItem(CHAVE);
}
