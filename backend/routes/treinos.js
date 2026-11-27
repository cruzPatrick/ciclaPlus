import { Router } from 'express';
import { atualizar, criar, excluir, listar } from '../controllers/treinosController.js';

const router = Router();

router.get('/', listar);
router.post('/', criar);
router.patch('/:id', atualizar);
router.delete('/:id', excluir);

export default router;
