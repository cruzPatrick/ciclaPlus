import mongoose from 'mongoose';
import { toJSON } from './_toJSON.js';
const { Schema } = mongoose;

// O par é guardado ORDENADO (usuarioA < usuarioB) para o índice único
// impedir match duplicado nos dois sentidos (A-B e B-A).
const matchSchema = new Schema(
  {
    usuarioA: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    usuarioB: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  },
  { timestamps: true, toJSON },
);
matchSchema.index({ usuarioA: 1, usuarioB: 1 }, { unique: true });

export function parOrdenado(x, y) {
  return String(x) < String(y) ? [x, y] : [y, x];
}

// Match entre duas pessoas (ou null).
matchSchema.statics.entre = function (x, y) {
  const [usuarioA, usuarioB] = parOrdenado(x, y);
  return this.findOne({ usuarioA, usuarioB });
};

// Match só se "usuarioId" faz parte dele (usado no chat).
matchSchema.statics.doUsuario = function (matchId, usuarioId) {
  if (!mongoose.isValidObjectId(matchId)) return null;
  return this.findOne({
    _id: matchId,
    $or: [{ usuarioA: usuarioId }, { usuarioB: usuarioId }],
  });
};

export default mongoose.model('Match', matchSchema);
