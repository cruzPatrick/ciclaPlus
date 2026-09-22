import { NavLink, Outlet } from "react-router-dom";
import Footer from "./Footer.jsx";

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
    // Envolve tudo em uma coluna de altura mínima da viewport: o menu fica
    // no topo, o conteúdo no meio e o footer é empurrado pro fundo (mt-auto)
    // em vez de ficar colado logo abaixo do conteúdo, no meio da tela.
    <div className="d-flex flex-column min-vh-100">
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

      <Footer />
    </div>
  );
}
