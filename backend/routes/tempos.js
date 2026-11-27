import { Router } from 'express';
import {
  atualizar,
  criar,
  excluir,
  listar,
  melhoresPorPercurso,
} from '../controllers/temposController.js';

const router = Router();

router.get('/melhores-por-percurso', melhoresPorPercurso);
router.get('/', listar);
router.post('/', criar);
router.patch('/:id', atualizar);
router.delete('/:id', excluir);

export default router;
