// Erro "esperado": o errorHandler devolve a mensagem ao cliente.
export default class AppError extends Error {
  constructor(status, mensagem, detalhes) {
    super(mensagem);
    this.status = status;
    this.detalhes = detalhes;
    this.esperado = true;
  }
}
