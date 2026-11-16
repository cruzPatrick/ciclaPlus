import mongoose from 'mongoose';
import { toJSON } from './_toJSON.js';

const tempoSchema = new mongoose.Schema(
  {
    trajeto: { type: String, required: true, trim: true },
    percursoId: { type: String, default: null, trim: true },
    duracao: {
      type: String,
      required: true,
      match: /^\d{2}:[0-5]\d:[0-5]\d$/,
    },
    distancia: { type: Number, required: true, min: 0 },
    origem: { type: String, enum: ['gps', 'simulado'], required: true },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  },
  { timestamps: true, toJSON },
);

export default mongoose.model('Tempo', tempoSchema);
