import mongoose from 'mongoose';

// TEMPORÁRIO: até a autenticação (JWT) ficar pronta, o frontend manda o
// id do usuário logado no header "x-usuario-id" (já está em localStorage).
// Quando o JWT existir, troque SÓ este arquivo: leia o token e preencha
// req.usuarioId. As rotas abaixo não mudam.
export function usuarioAtual(req, res, next) {
  const id = req.header('x-usuario-id');
  if (!id || !mongoose.isValidObjectId(id)) {
    return res.status(401).json({ erro: 'Usuário não identificado.' });
  }
  req.usuarioId = id;
  next();
}
