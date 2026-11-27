import AppError from '../utils/AppError.js';

// validar(schema, 'body' | 'query' | 'params'): valida com zod e guarda o
// resultado em req.validado[origem]. Schemas de corpo usam .strict(), então
// campos desconhecidos (ex.: "perfil", "$set") são rejeitados com 400.
export function validar(schema, origem = 'body') {
  return (req, _res, next) => {
    const resultado = schema.safeParse(req[origem] ?? {});
    if (!resultado.success) {
      const detalhes = resultado.error.issues.map((i) => ({
        campo: i.path.join('.') || origem,
        mensagem: i.message,
      }));
      return next(new AppError(400, detalhes[0]?.mensagem ?? 'Dados inválidos.', detalhes));
    }
    req.validado = { ...(req.validado ?? {}), [origem]: resultado.data };
    next();
  };
}
