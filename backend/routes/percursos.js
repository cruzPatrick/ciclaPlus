import { Router } from 'express';
import { garantirPercursos } from '../models/Percurso.js';

const router = Router();

router.get('/', async (_req, res) => {
  res.json(await garantirPercursos());
});

export default router;
