import express from 'express';
import cors from 'cors';
import rotasRelacionamento from './routes/index.js';

// O app fica separado do server.js para os testes importarem sem abrir porta.
const app = express();
app.use(cors());
app.use(express.json());
app.use(rotasRelacionamento);

// Qualquer erro não tratado vira JSON (Express 5 já repassa erros de rotas async).
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ erro: 'Erro interno na API. Tente de novo em instantes.' });
});

export default app;
