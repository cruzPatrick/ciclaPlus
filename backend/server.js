import app from './app.js';
import env from './config/env.js';
import { conectar } from './config/db.js';

await conectar();
console.log('MongoDB conectado');
app.listen(env.PORT, () => console.log(`API do CiclaPlus em http://localhost:${env.PORT}/api/v1`));
