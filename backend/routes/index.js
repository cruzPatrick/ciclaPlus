import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { usuarioAtual } from '../middleware/usuarioAtual.js';
import auth from './auth.js';
import perfil from './perfil.js';
import ranking from './ranking.js';
import descoberta from './descoberta.js';
import matches from './matches.js';
import mensagens from './mensagens.js';
import confrontos from './confrontos.js';
import boost from './boost.js';

// app.use('/api/v1', rotas(limiteAuth))
// usuarioAtual (JWT) é aplicado POR prefixo para não bloquear login/cadastro.
export default function rotas(limiteAuth) {
  const router = Router();
  const limitarAuth = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: limiteAuth,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { erro: 'Muitas tentativas. Aguarde alguns minutos.' },
  });
  router.use('/auth', limitarAuth, auth);
  router.use('/perfil', usuarioAtual, perfil);
  router.use('/ranking', usuarioAtual, ranking);
  router.use('/candidatos', usuarioAtual, descoberta);
  router.use('/matches', usuarioAtual, matches);
  router.use('/mensagens', usuarioAtual, mensagens);
  router.use('/confrontos', usuarioAtual, confrontos);
  router.use('/boost', usuarioAtual, boost);
  return router;
}
