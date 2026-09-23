import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer.jsx";

// Itens do menu como variável local do componente.
const ITENS = [
  { to: "descoberta", texto: "Descobrir Ciclistas" },
  { to: "chat", texto: "Chat" },
  { to: "treino", texto: "Treino" },
  { to: "cronometro", texto: "Cronometrar Desempenho" },
  { to: "tempos", texto: "Gerenciar Tempos" },
  { to: "confronto", texto: "Confrontos" },
  { to: "consultoria", texto: "Consultoria" },
  { to: "ranking", texto: "Ranking" },
];

// --------------------------------------------------------------------------
// Desktop: só um ícone de hamburguer fixo no canto. Ao clicar, abre um
// overlay escuro/fosco (backdrop-filter blur) com o menu em lista vertical.
// --------------------------------------------------------------------------
function DesktopMenu() {
  const [aberto, setAberto] = useState(false);

  // Fecha com Esc, pra não prender o teclado dentro do overlay.
  useEffect(() => {
    function onKeyDown(evento) {
      if (evento.key === "Escape") setAberto(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="d-none d-lg-block">
      <button
        type="button"
        className={"cicla-hamburger" + (aberto ? " cicla-hamburger--aberto" : "")}
        aria-label={aberto ? "Fechar menu" : "Abrir menu"}
        aria-expanded={aberto}
        onClick={() => setAberto((valor) => !valor)}
      >
        <span />
        <span />
        <span />
      </button>

      <div
        className={"cicla-overlay" + (aberto ? " cicla-overlay--aberto" : "")}
        onClick={() => setAberto(false)}
      >
        <nav
          className="cicla-overlay-panel"
          aria-hidden={!aberto}
          onClick={(evento) => evento.stopPropagation()}
        >
          <span className="cicla-overlay-brand">Cicla+</span>
          <ul>
            {ITENS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => setAberto(false)}
                  className={({ isActive }) =>
                    "cicla-overlay-link" + (isActive ? " active" : "")
                  }
                >
                  {item.texto}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Mobile: barra de abas horizontal (rola pro lado), com uma linha embaixo
// da aba atual que desliza com transição ao trocar de página.
// --------------------------------------------------------------------------
function MobileTabs() {
  const location = useLocation();
  const subrotaAtiva = location.pathname.split("/").filter(Boolean).pop();
  const tabsRef = useRef({});
  const [indicador, setIndicador] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const elemento = tabsRef.current[subrotaAtiva];
    if (!elemento) return;
    setIndicador({ left: elemento.offsetLeft, width: elemento.offsetWidth });
    elemento.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [subrotaAtiva]);

  return (
    <div className="d-lg-none cicla-tabs-wrapper bg-primary">
      <div className="cicla-tabs-scroll">
        {ITENS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            ref={(elemento) => {
              tabsRef.current[item.to] = elemento;
            }}
            className={({ isActive }) =>
              "cicla-tab" + (isActive ? " active" : "")
            }
          >
            {item.texto}
          </NavLink>
        ))}
        <span
          className="cicla-tab-indicator"
          style={{ left: indicador.left, width: indicador.width }}
        />
      </div>
    </div>
  );
}

export default function AppLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <DesktopMenu />
      <MobileTabs />

      <Outlet />

      <Footer />
    </div>
  );
}
