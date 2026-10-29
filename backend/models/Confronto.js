import mongoose from 'mongoose';
import { toJSON } from './_toJSON.js';
const { Schema } = mongoose;

// Status guardado de forma NEUTRA (não depende de quem olha).
// A API traduz para "pendente_aceite_adversario" / "pendente_meu_aceite"
// conforme quem está consultando (ver routes/confrontos.js).
const confrontoSchema = new Schema(
  {
    desafiante: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    desafiado: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    status: {
      type: String,
      enum: ['pendente', 'confirmado', 'resultado_registrado', 'encerrado'],
      default: 'pendente',
    },
    // Resultado do ponto de vista de quem registrou (registradoPor).
    resultado: { type: String, enum: ['Vitória', 'Derrota', null], default: null },
    registradoPor: { type: Schema.Types.ObjectId, ref: 'Usuario', default: null },
    // Preenchido ao encerrar. O ranking pode usar isso.
    vencedor: { type: Schema.Types.ObjectId, ref: 'Usuario', default: null },
  },
  { timestamps: true, toJSON },
);

export default mongoose.model('Confronto', confrontoSchema);
