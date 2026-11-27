import { z } from 'zod';
import mongoose from 'mongoose';

export const idMongo = z.string().refine((v) => mongoose.isValidObjectId(v) && /^[a-f0-9]{24}$/i.test(v), 'Identificador inválido.');

export const email = z.string().trim().toLowerCase().max(254).pipe(z.email('E-mail inválido.'));

// bcrypt só considera os 72 primeiros BYTES: limitamos para não truncar em silêncio.
export const senha = z
  .string()
  .min(8, 'A senha precisa ter pelo menos 8 caracteres.')
  .refine((v) => Buffer.byteLength(v) <= 72, 'A senha pode ter no máximo 72 bytes.');

export const nome = z.string().trim().min(2, 'Informe o nome.').max(100);

export const telefone = z.string().trim().max(30);

export const dataNascimento = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato AAAA-MM-DD.')
  .refine((v) => {
    const d = new Date(`${v}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(v) && v >= '1900-01-01' && d <= new Date();
  }, 'Data de nascimento inválida.');

export const tipoBike = z.string().trim().max(60);

export const fotoUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => {
    try {
      return new URL(v).protocol === 'https:';
    } catch {
      return false;
    }
  }, 'A foto precisa ser uma URL https válida.');

export const perfilTipo = z.enum(['ciclista', 'equipe']);
