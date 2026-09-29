import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [erro, setErro] = useState("");

  const textoApresentacao =
    "Conecte-se com outros ciclistas, encontre parceiros para pedalar, " +
    "participe de desafios e acompanhe sua evolução através dos rankings " +
    "da comunidade.";

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
      <article className="auth-card bg-white">
        <figure className="auth-card__photo m-0" />

        <section className="p-3">
          <header>
            <h1 className="h4 text-center mb-2">Cicla+</h1>
            <p className="small text-body-secondary text-center mb-3">
              {textoApresentacao}
            </p>
            <p className="small text-center text-body-secondary mb-2">
              Teste com: <strong>{usuarioTeste.email}</strong> / senha{" "}
              <strong>{usuarioTeste.senha}</strong>
            </p>
          </header>

          {erro && (
            <aside className="bg-light border border-danger text-danger rounded p-2 small mb-3 text-center">
              {erro}
            </aside>
          )}

          <form onSubmit={handleSubmit}>
            <section className="form-floating position-relative mb-2">
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
            </section>

            <section className="form-floating position-relative mb-3">
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
            </section>

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
        </section>
      </article>
    </main>
  );
}