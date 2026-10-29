import mongoose from 'mongoose';
import { toJSON } from './_toJSON.js';
const { Schema } = mongoose;

const boostSchema = new Schema(
  {
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true, index: true },
    fim: { type: Date, required: true },
  },
  { timestamps: true, toJSON },
);

export default mongoose.model('Boost', boostSchema);
