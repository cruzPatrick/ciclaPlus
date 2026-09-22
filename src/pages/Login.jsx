import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [erro, setErro] = useState("");

  // Dados locais do componente — nada vem de backend aqui.
  const textoApresentacao =
    "Conecte-se com outros ciclistas, encontre parceiros para pedalar, " +
    "participe de desafios e acompanhe sua evolução através dos rankings " +
    "da comunidade.";

  // Usuário de teste fixo, só pra simular um login de verdade sem backend.
  const usuarioTeste = { email: "teste@ciclaplus.com", senha: "123456" };

  function handleSubmit(evento) {
    evento.preventDefault();
    const dados = new FormData(evento.target);
    const email = dados.get("email");
    const senha = dados.get("senha");

    if (email === usuarioTeste.email && senha === usuarioTeste.senha) {
      setErro("");
      navigate("/app/descoberta");
    } else {
      setErro("E-mail ou senha incorretos.");
    }
  }

  return (
    <main className="d-flex justify-content-center align-items-center min-vh-100 bg-primary">
      <div className="auth-card bg-white">
        <div className="auth-card__photo" />

        <div className="p-3">
          <h1 className="h4 text-center mb-2">Cicla+</h1>
          <p className="small text-body-secondary text-center mb-3">
            {textoApresentacao}
          </p>
          <p className="small text-center text-body-secondary mb-2">
            Teste com: <strong>{usuarioTeste.email}</strong> / senha{" "}
            <strong>{usuarioTeste.senha}</strong>
          </p>

          {erro && (
            <div className="alert alert-danger py-2 small" role="alert">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-floating position-relative mb-2">
              <span className="material-icons">person</span>
              <input
                type="email"
                className="form-control"
                id="iemail"
                name="email"
                placeholder="Seu e-mail"
                autoComplete="email"
                required
              />
              <label htmlFor="iemail">E-mail</label>
            </div>

            <div className="form-floating position-relative mb-3">
              <span className="material-icons">vpn_key</span>
              <input
                type="password"
                className="form-control"
                id="isenha"
                name="senha"
                placeholder="Sua senha"
                autoComplete="current-password"
                required
              />
              <label htmlFor="isenha">Senha</label>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Entrar
            </button>

            <Link
              to="/cadastro"
              className="btn btn-outline-primary w-100 mt-2"
            >
              Criar conta
              <span className="material-icons align-middle ms-1">
                person_add
              </span>
            </Link>

            <a href="#" className="btn btn-outline-secondary w-100 mt-2">
              Esqueci minha senha
              <span className="material-icons align-middle ms-1">mail</span>
            </a>
          </form>
        </div>
      </div>
    </main>
  );
}
