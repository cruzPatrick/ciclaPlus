import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  // Dados locais do componente — nada vem de backend aqui.
  const textoApresentacao =
    "Conecte-se com outros ciclistas, encontre parceiros para pedalar, " +
    "participe de desafios e acompanhe sua evolução através dos rankings " +
    "da comunidade.";

  function handleSubmit(evento) {
    evento.preventDefault();
    // Sem backend ainda — só simula o login indo direto pra área interna.
    navigate("/app/descoberta");
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

          <form onSubmit={handleSubmit}>
            <div className="form-floating position-relative mb-2">
              <span className="material-icons">person</span>
              <input
                type="email"
                className="form-control"
                id="iemail"
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
