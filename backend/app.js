import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import env from './config/env.js';
import rotas from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

// O app fica separado do server.js para os testes importarem sem abrir porta.
// "limites" permite aos testes de rate limit usar valores pequenos.
export function criarApp({ limiteGeral = env.RATE_LIMIT_GERAL, limiteAuth = env.RATE_LIMIT_AUTH } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      // Requisições sem Origin (curl, testes) passam; navegadores só das origens da lista.
      origin: (origem, cb) => cb(null, !origem || env.corsOrigins.includes(origem)),
    }),
  );
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: limiteGeral, standardHeaders: 'draft-7', legacyHeaders: false, message: { erro: 'Muitas requisições. Tente novamente mais tarde.' } }));
  app.use(express.json({ limit: '50kb' }));

  app.use('/api/v1', rotas(limiteAuth));
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

export default criarApp();
