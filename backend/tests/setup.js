// Carregado por "node --import" ANTES de qualquer teste (ver npm test).
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'segredo-somente-para-testes-0123456789abcdef';
process.env.BCRYPT_ROUNDS = '4';
process.env.RATE_LIMIT_GERAL = '100000';
process.env.RATE_LIMIT_AUTH = '100000';
