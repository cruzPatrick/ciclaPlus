import { z } from 'zod';
import { nome, telefone, dataNascimento, tipoBike, fotoUrl, senha, idMongo, perfilTipo } from './comum.js';

// null ou "" limpam o campo opcional.
const limpavel = (schema) => z.union([schema, z.literal(''), z.null()]);

export const atualizarPerfilSchema = z
  .object({
    nome: nome.optional(),
    telefone: limpavel(telefone).optional(),
    dataNascimento: limpavel(dataNascimento).optional(),
    tipoBike: limpavel(tipoBike).optional(),
    foto: limpavel(fotoUrl).optional(),
    perfil: perfilTipo.optional(), // alternar Ciclista/Equipe (botão da tela de Perfil)
  })
  .strict()
  .refine((o) => Object.keys(o).length > 0, 'Envie ao menos um campo para atualizar.');

export const trocarSenhaSchema = z
  .object({ senhaAtual: z.string().min(1, 'Informe a senha atual.').max(200), novaSenha: senha })
  .strict();

export const excluirContaSchema = z
  .object({ senha: z.string().min(1, 'Informe a senha para confirmar.').max(200) })
  .strict();

export const idParamSchema = z.object({ id: idMongo }).strict();
