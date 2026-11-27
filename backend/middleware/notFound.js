export function notFound(_req, res) {
  res.status(404).json({ erro: 'Rota não encontrada.' });
}
