import { z } from 'zod';

export const rankingQuerySchema = z
  .object({
    pagina: z.coerce.number().int().min(1).default(1),
    limite: z.coerce.number().int().min(1).max(100).default(50),
  })
  .strict();
