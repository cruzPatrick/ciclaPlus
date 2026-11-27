import mongoose from 'mongoose';
import { toJSON } from './_toJSON.js';

const treinoSchema = new mongoose.Schema(
  {
    data: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    hora: { type: String, required: true, match: /^(?:[01]\d|2[0-3]):[0-5]\d$/ },
    tipo: { type: String, enum: ['individual', 'equipe'], required: true },
    parceiroOuEquipe: { type: String, required: true, trim: true },
    parceiroId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', default: null },
    feito: { type: Boolean, default: false },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  },
  { timestamps: true, toJSON },
);

export default mongoose.model('Treino', treinoSchema);
