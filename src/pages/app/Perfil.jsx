import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const navigate = useNavigate();

  // Conta de teste fixa (mesma do login) — sem backend por enquanto.
  const conta = { email: "teste@ciclaplus.com" };

  return (
    <main className="container py-4">
      <div className="perfil-card bg-white">
        {/* Mesma foto do topo do card de login. */}
        <div className="perfil-banner" />

        <div className="p-3">
          <h1 className="h4 text-center mb-1">Perfil</h1>
          <p className="small text-body-secondary text-center mb-3">
            {conta.email}
          </p>

          <button type="button" className="btn btn-outline-primary w-100 mb-2">
            Editar conta
            <span className="material-icons align-middle ms-1">edit</span>
          </button>

          <button type="button" className="btn btn-outline-primary w-100 mb-2">
            Mudar perfil
            <span className="material-icons align-middle ms-1">swap_horiz</span>
          </button>

          <button
            type="button"
            className="btn btn-outline-danger w-100"
            onClick={() => navigate("/login")}
          >
            Sair
            <span className="material-icons align-middle ms-1">logout</span>
          </button>
        </div>
      </div>
    </main>
  );
}
