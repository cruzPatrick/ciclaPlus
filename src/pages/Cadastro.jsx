import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import { useCadastrar } from "../hooks/useCiclaData.js";
import { usuariosApi } from "../api/ciclaApi.js";

// Data de hoje em YYYY-MM-DD no fuso local (toISOString usa UTC e pode
// adiantar um dia perto da meia-noite no Brasil).
function hoje() {
  const d = new Date();
  const dois = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;
}

const esquemaCadastro = z
  .object({
    nome: z.string().min(2, "Informe seu nome completo"),
    email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
    telefone: z.string().min(8, "Informe um telefone válido"),
    dataNascimento: z
      .string()
      .min(1, "Informe sua data de nascimento")
      .refine((valor) => /^\d{4}-\d{2}-\d{2}$/.test(valor) && valor <= hoje(), {
        message: "A data de nascimento não pode estar no futuro",
      }),
    senha: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
    confirmarSenha: z.string().min(1, "Confirme a senha"),
  })
  .refine((dados) => dados.senha === dados.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

const CAMPOS = [
  { id: "nome", label: "Nome", type: "text", placeholder: "Digite seu nome" },
  { id: "email", label: "E-mail", type: "email", placeholder: "Digite seu e-mail" },
  { id: "telefone", label: "Telefone", type: "tel", placeholder: "Digite seu telefone" },
  // max = hoje: o date picker nativo já bloqueia datas futuras (a validação
  // do zod cobre o caso de digitação manual).
  { id: "dataNascimento", label: "Data de nascimento", type: "date", placeholder: "", max: hoje() },
  { id: "senha", label: "Senha", type: "password", placeholder: "Crie uma senha" },
  { id: "confirmarSenha", label: "Confirme a senha", type: "password", placeholder: "Repita a senha" },
];

export default function Cadastro() {
  const navigate = useNavigate();
  const cadastrarMutation = useCadastrar();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(esquemaCadastro) });

  async function aoEnviar(dados) {
    const jaExiste = await usuariosApi.emailJaExiste(dados.email);
    if (jaExiste) {
      setError("email", { message: "Já existe uma conta com esse e-mail" });
      return;
    }

    const { confirmarSenha: _confirmarSenha, ...dadosParaSalvar } = dados;
    await cadastrarMutation.mutateAsync(dadosParaSalvar);
    navigate("/login");
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header titulo="Cadastrar novo ciclista" />

      <main className="container py-4" style={{ maxWidth: "480px" }}>
        {cadastrarMutation.isError && (
          <aside className="bg-light border border-danger text-danger rounded p-2 small mb-3 text-center">
            Não foi possível cadastrar. O json-server está rodando? (npm run mock)
          </aside>
        )}

        <form onSubmit={handleSubmit(aoEnviar)} noValidate>
          {CAMPOS.map((campo) => (
            <section className="mb-3" key={campo.id}>
              <label htmlFor={campo.id} className="form-label">
                {campo.label}
              </label>
              <input
                type={campo.type}
                className={"form-control" + (errors[campo.id] ? " is-invalid" : "")}
                id={campo.id}
                placeholder={campo.placeholder}
                max={campo.max}
                {...register(campo.id)}
              />
              {errors[campo.id] && (
                <p className="invalid-feedback d-block small mb-0">
                  {errors[campo.id].message}
                </p>
              )}
            </section>
          ))}

          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
