import env from '../config/env.js';

// Formato único de erro: { erro, detalhes? }. Nunca expõe stack nem mensagem
// interna ao cliente (a stack só vai para o log do servidor).
export function errorHandler(err, _req, res, _next) {
  if (err.esperado) {
    return res.status(err.status).json({ erro: err.message, ...(err.detalhes && { detalhes: err.detalhes }) });
  }
  if (err.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido.' });
  if (err.type === 'entity.too.large') return res.status(413).json({ erro: 'Corpo da requisição grande demais.' });
  if (err.name === 'CastError') return res.status(400).json({ erro: 'Identificador inválido.' });
  if (err.name === 'ValidationError') return res.status(400).json({ erro: 'Dados inválidos.' });
  if (err.code === 11000) return res.status(409).json({ erro: 'Registro duplicado.' });

  if (env.NODE_ENV !== 'test') console.error(err);
  res.status(500).json({ erro: 'Erro interno na API. Tente de novo em instantes.' });
}
