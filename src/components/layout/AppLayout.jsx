import { NavLink, Outlet } from "react-router-dom";

export default function AppLayout() {
  // Itens do menu como variável local do componente.
  const itens = [
    { to: "descoberta", texto: "Descobrir Ciclistas" },
    { to: "chat", texto: "Chat" },
    { to: "treino-individual", texto: "Treino Individual" },
    { to: "treino-equipe", texto: "Treino em Equipe" },
    { to: "cronometro", texto: "Cronometrar Desempenho" },
    { to: "tempos", texto: "Gerenciar Tempos" },
    { to: "confronto", texto: "Confrontos" },
    { to: "consultoria", texto: "Consultoria" },
    { to: "ranking", texto: "Ranking" },
  ];

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand">Cicla+</span>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navCiclaPlus"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navCiclaPlus">
            <ul className="navbar-nav me-auto">
              {itens.map((item) => (
                <li className="nav-item" key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      "nav-link" + (isActive ? " active fw-bold" : "")
                    }
                  >
                    {item.texto}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <Outlet />

      <footer className="bg-primary text-white text-center py-3 mt-4">
        <p className="m-0 small">&copy; 2026 Cicla+. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}
