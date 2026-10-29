import mongoose from 'mongoose';
const { Schema } = mongoose;

// Uma avaliação na Descoberta: "de" avaliou "para" com match ou passou.
// Match só nasce quando as duas pessoas deram "match" uma na outra.
const likeSchema = new Schema(
  {
    de: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    para: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    status: { type: String, enum: ['match', 'passou'], required: true },
  },
  { timestamps: true },
);
likeSchema.index({ de: 1, para: 1 }, { unique: true });

export default mongoose.model('Like', likeSchema);
