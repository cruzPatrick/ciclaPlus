import { Router } from 'express';
import { usuarioAtual } from '../middleware/usuarioAtual.js';
import descoberta from './descoberta.js';
import matches from './matches.js';
import mensagens from './mensagens.js';
import confrontos from './confrontos.js';
import boost from './boost.js';

// No servidor do CiclaPlus:  app.use(rotasRelacionamento)
// O middleware é aplicado POR prefixo para não bloquear login/cadastro.
const router = Router();
router.use('/candidatos', usuarioAtual, descoberta);
router.use('/matches', usuarioAtual, matches);
router.use('/mensagens', usuarioAtual, mensagens);
router.use('/confrontos', usuarioAtual, confrontos);
router.use('/boost', usuarioAtual, boost);

export default router;
