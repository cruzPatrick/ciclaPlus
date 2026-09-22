import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";

export default function Cadastro() {
  const navigate = useNavigate();

  // Campos do formulário como variável local — nada de fetch/backend aqui.
  const campos = [
    { id: "nome", label: "Nome", type: "text", placeholder: "Digite seu nome" },
    { id: "email", label: "E-mail", type: "email", placeholder: "Digite seu e-mail" },
    { id: "telefone", label: "Telefone", type: "tel", placeholder: "Digite seu telefone" },
    { id: "data-nascimento", label: "Data de nascimento", type: "date", placeholder: "" },
  ];

  function handleSubmit(evento) {
    evento.preventDefault();
    // Sem backend ainda — só simula o cadastro indo pro login.
    navigate("/login");
  }

  return (
    // Coluna com altura mínima da viewport: o Footer (mt-auto) fica no pé
    // da tela mesmo quando o formulário não preenche a viewport.
    <div className="d-flex flex-column min-vh-100">
      <Header titulo="Cadastrar novo ciclista" />

      <main className="container py-4" style={{ maxWidth: "480px" }}>
        <form onSubmit={handleSubmit}>
          {campos.map((campo) => (
            <div className="mb-3" key={campo.id}>
              <label htmlFor={campo.id} className="form-label">
                {campo.label}
              </label>
              <input
                type={campo.type}
                className="form-control"
                id={campo.id}
                name={campo.id}
                placeholder={campo.placeholder}
                required
              />
            </div>
          ))}

          <button type="submit" className="btn btn-primary w-100">
            Cadastrar
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
