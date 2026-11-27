import mongoose from 'mongoose';
import { toJSON } from './_toJSON.js';

const usuarioSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    telefone: String,
    dataNascimento: String,
    // Hash bcrypt. Nunca volta em consultas (select:false) nem no JSON.
    senhaHash: { type: String, select: false },
    // Sobe a cada troca de senha: tokens com versão antiga deixam de valer.
    tokenVersao: { type: Number, default: 0 },
    perfil: { type: String, enum: ['ciclista', 'equipe'], default: 'ciclista' },
    tipoBike: String, // opcional: aparece na Descoberta
    foto: String, // URL https da foto de perfil (opcional)
  },
  {
    timestamps: true,
    toJSON: {
      ...toJSON,
      transform: (doc, ret) => {
        toJSON.transform(doc, ret);
        delete ret.senhaHash;
        delete ret.tokenVersao;
        return ret;
      },
    },
  },
);

export default mongoose.model('Usuario', usuarioSchema);
