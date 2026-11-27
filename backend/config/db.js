import mongoose from 'mongoose';
import env from './env.js';

export async function conectar(uri = env.MONGODB_URI) {
  await mongoose.connect(uri);
  return mongoose.connection;
}

export async function desconectar() {
  await mongoose.disconnect();
}
