import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefone: String,
    dataNascimento: String,
    senha: String, // provisório: sem hash, só para a demonstração local
    perfil: { type: String, enum: ['ciclista', 'equipe'], default: 'ciclista' },
    tipoBike: String, // opcional: aparece na Descoberta
  },
  { timestamps: true },
);

export default mongoose.model('Usuario', usuarioSchema);