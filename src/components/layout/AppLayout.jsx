import { useEffect, useRef, useState } from "react";
import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer.jsx";
import { usuarioLogadoId } from "../../api/sessao.js";
import { usePerfilUsuario } from "../../hooks/useCiclaData.js";

// Itens do menu, com os perfis que enxergam cada um. O perfil Equipe não
// namora (Dar Match, Chat) nem disputa Confrontos individuais. "Perfil" é
// sempre o último (regra 6 do soul.md).
const CICLISTA = ["ciclista"];
const AMBOS = ["ciclista", "equipe"];
const ITENS = [
  { to: "descoberta", texto: "Dar Match", perfis: CICLISTA },
  { to: "chat", texto: "Chat", perfis: CICLISTA },
  { to: "passeios", texto: "Passeios", perfis: AMBOS },
  { to: "treino", texto: "Treino", perfis: AMBOS },
  { to: "mapa", texto: "Cronômetro", perfis: AMBOS },
  { to: "tempos", texto: "Gerenciar Tempos", perfis: AMBOS },
  { to: "confronto", texto: "Confrontos", perfis: CICLISTA },
  { to: "consultoria", texto: "Consultoria", perfis: AMBOS },
  { to: "ranking", texto: "Ranking", perfis: AMBOS },
  { to: "boost", texto: "Boost", perfis: AMBOS },
  { to: "perfil", texto: "Perfil", perfis: AMBOS },
];

function DesktopMenu({ itens }) {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    function onKeyDown(evento) {
      if (evento.key === "Escape") setAberto(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <nav className="d-none d-lg-block">
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

      <section
        className={"cicla-overlay" + (aberto ? " cicla-overlay--aberto" : "")}
        onClick={() => setAberto(false)}
      >
        <section
          className="cicla-overlay-panel"
          aria-hidden={!aberto}
          onClick={(evento) => evento.stopPropagation()}
        >
          <span className="cicla-overlay-brand">Cicla+</span>
          <ul>
            {itens.map((item) => (
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
        </section>
      </section>
    </nav>
  );
}

function MobileTabs({ itens }) {
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
    <nav className="d-lg-none cicla-tabs-wrapper bg-primary">
      <section className="cicla-tabs-scroll">
        {itens.map((item) => (
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
      </section>
    </nav>
  );
}

export default function AppLayout() {
  const usuarioId = usuarioLogadoId();
  const { data: conta } = usePerfilUsuario(usuarioId);
  const location = useLocation();

  // Guarda de rota mínima: sem sessão, nenhuma tela de /app/* é acessível.
  if (usuarioId == null) {
    return <Navigate to="/login" replace />;
  }

  // O menu muda com o perfil (Ciclista × Equipe). Enquanto a conta carrega,
  // vale o perfil padrão (Ciclista).
  const perfil = conta?.perfil ?? "ciclista";
  const itens = ITENS.filter((item) => item.perfis.includes(perfil));

  // Rota existente mas não permitida pro perfil atual (ex.: Equipe abrindo
  // /app/chat por link salvo) volta pra primeira tela do perfil.
  const subrota = location.pathname.split("/").filter(Boolean)[1];
  const rotaConhecida = ITENS.some((item) => item.to === subrota);
  if (conta && rotaConhecida && !itens.some((item) => item.to === subrota)) {
    return <Navigate to={`/app/${itens[0].to}`} replace />;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <DesktopMenu itens={itens} />
      <MobileTabs itens={itens} />

      <Outlet />

      <Footer />
    </div>
  );
}