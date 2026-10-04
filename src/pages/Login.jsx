import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useCiclaData.js";
import { salvarUsuarioLogado } from "../api/sessao.js";

const esquemaLogin = z.object({
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  senha: z.string().min(1, "Informe a senha"),
});

export default function Login() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(esquemaLogin) });

  const textoApresentacao =
    "Conecte-se com outros ciclistas, encontre parceiros para pedalar, " +
    "participe de desafios e acompanhe sua evolução através dos rankings " +
    "da comunidade.";

  async function aoEnviar(dados) {
    const usuario = await loginMutation.mutateAsync(dados);
    if (!usuario) {
      setError("root", { message: "E-mail ou senha incorretos." });
      return;
    }
    salvarUsuarioLogado(usuario.id);
    navigate("/app/descoberta");
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
              Teste com: <strong>teste@ciclaplus.com</strong> / senha{" "}
              <strong>123456</strong>
            </p>
          </header>

          {(errors.root || loginMutation.isError) && (
            <aside className="bg-light border border-danger text-danger rounded p-2 small mb-3 text-center">
              {errors.root?.message ??
                "Não foi possível falar com o servidor. O json-server está rodando? (npm run mock)"}
            </aside>
          )}

          <form onSubmit={handleSubmit(aoEnviar)} noValidate>
            <section className="form-floating position-relative mb-2">
              <span className="material-icons">person</span>
              <input
                type="email"
                className={"form-control" + (errors.email ? " is-invalid" : "")}
                id="iemail"
                placeholder="Seu e-mail"
                autoComplete="email"
                {...register("email")}
              />
              <label htmlFor="iemail">E-mail</label>
              {errors.email && (
                <p className="invalid-feedback d-block small mb-0">{errors.email.message}</p>
              )}
            </section>

            <section className="form-floating position-relative mb-3">
              <span className="material-icons">vpn_key</span>
              <input
                type="password"
                className={"form-control" + (errors.senha ? " is-invalid" : "")}
                id="isenha"
                placeholder="Sua senha"
                autoComplete="current-password"
                {...register("senha")}
              />
              <label htmlFor="isenha">Senha</label>
              {errors.senha && (
                <p className="invalid-feedback d-block small mb-0">{errors.senha.message}</p>
              )}
            </section>

            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>

            <Link to="/cadastro" className="btn btn-outline-primary w-100 mt-2">
              Criar conta
              <span className="material-icons align-middle ms-1">person_add</span>
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
