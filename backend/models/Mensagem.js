import mongoose from 'mongoose';
import { toJSON } from './_toJSON.js';
const { Schema } = mongoose;

const mensagemSchema = new Schema(
  {
    // null = mensagens guardadas de um match desfeito sem apagar o histórico;
    // usuarioA/usuarioB identificam o par e a conversa volta (matchId preenchido
    // de novo) se os dois derem match outra vez.
    matchId: { type: Schema.Types.ObjectId, ref: 'Match', default: null },
    usuarioA: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    usuarioB: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    remetente: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    texto: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true, toJSON },
);
mensagemSchema.index({ matchId: 1, createdAt: 1 });

export default mongoose.model('Mensagem', mensagemSchema);
