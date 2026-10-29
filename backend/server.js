import mongoose from 'mongoose';
import app from './app.js';

const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27018/ciclaplus';
const porta = process.env.PORT ?? 3000;

await mongoose.connect(uri);
console.log('MongoDB conectado');
app.listen(porta, () => console.log(`API do CiclaPlus em http://localhost:${porta}`));
