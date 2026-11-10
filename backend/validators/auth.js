import { z } from 'zod';
import { email, senha, nome, telefone, dataNascimento, perfilTipo } from './comum.js';

export const cadastroSchema = z
  .object({
    nome,
    email,
    senha,
    telefone: telefone.optional(),
    dataNascimento: dataNascimento.optional(),
    perfil: perfilTipo.optional(),
  })
  .strict();

export const loginSchema = z
  .object({ email, senha: z.string().min(1, 'Informe a senha.').max(200) })
  .strict();
