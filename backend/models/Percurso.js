import mongoose from 'mongoose';
import { toJSON } from './_toJSON.js';

const percursoSchema = new mongoose.Schema(
  {
    _id: { type: String },
    nome: { type: String, required: true, trim: true },
    distanciaKm: { type: Number, required: true, min: 0 },
  },
  { toJSON },
);

const Percurso = mongoose.model('Percurso', percursoSchema);

export const PERCURSOS_INICIAIS = [
  { id: 'orla', nome: 'Ciclovia da Orla', distanciaKm: 8.5 },
  { id: 'parque-central', nome: 'Volta do Parque Central', distanciaKm: 5.2 },
  { id: 'trilha-montanha', nome: 'Trilha da Montanha', distanciaKm: 14.1 },
  { id: 'urbano-centro', nome: 'Percurso Urbano Centro', distanciaKm: 9 },
];

export async function garantirPercursos() {
  let percursos = await Percurso.find().sort({ nome: 1 });
  if (percursos.length === 0) {
    await Percurso.bulkWrite(
      PERCURSOS_INICIAIS.map(({ id, ...dados }) => ({
        updateOne: {
          filter: { _id: id },
          update: { $setOnInsert: dados },
          upsert: true,
        },
      })),
    );
    percursos = await Percurso.find().sort({ nome: 1 });
  }
  return percursos;
}

export default Percurso;
