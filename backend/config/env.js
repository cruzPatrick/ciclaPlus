import 'dotenv/config';
import crypto from 'node:crypto';
import { z } from 'zod';

// Todas as variáveis de ambiente passam por aqui. O servidor NÃO sobe com
// configuração inválida (falha cedo, com mensagem clara).
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  MONGODB_URI: z.string().min(1).default('mongodb://127.0.0.1:27018/ciclaplus'),
  MONGODB_URI_TEST: z.string().min(1).default('mongodb://127.0.0.1:27018/ciclaplus_test'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET precisa ter pelo menos 32 caracteres').optional(),
  JWT_EXPIRES_IN: z.string().min(1).default('7d'),
  BCRYPT_ROUNDS: z.coerce.number().int().min(4).max(14).default(10),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),
  RATE_LIMIT_GERAL: z.coerce.number().int().min(1).default(300), // por IP / 15 min
  RATE_LIMIT_AUTH: z.coerce.number().int().min(1).default(10), // login/cadastro por IP / 15 min
});

const lido = schema.safeParse(process.env);
if (!lido.success) {
  const problemas = lido.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
  throw new Error(`Configuração de ambiente inválida:\n${problemas}`);
}

const env = { ...lido.data };

if (!env.JWT_SECRET) {
  if (env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET é obrigatório em produção (mínimo 32 caracteres).');
  }
  // Fora de produção: segredo aleatório por processo (sessões caem ao reiniciar).
  env.JWT_SECRET = crypto.randomBytes(48).toString('hex');
  if (env.NODE_ENV === 'development') {
    console.warn('[aviso] JWT_SECRET não definido: usando segredo temporário. Copie .env.example para .env.');
  }
}

env.corsOrigins = env.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean);
env.producao = env.NODE_ENV === 'production';

export default Object.freeze(env);
