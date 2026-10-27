import { Suspense, lazy } from "react";
import { useSearchParams } from "react-router-dom";
import CronometroSimulado from "./CronometroSimulado.jsx";

// O Leaflet só carrega quando a aba GPS é aberta (o bundle principal não
// paga o custo de ~150 kB de mapa pra quem usa o modo simulado).
const MapaGps = lazy(() => import("./MapaGps.jsx"));

// Cronômetro: modo simulado (padrão, sem GPS) ou GPS opcional. O modo fica
// na URL (?modo=simulado|gps), como o tipo da página de Treino.
export default function Mapa() {
  const [searchParams, setSearchParams] = useSearchParams();
  const modo = searchParams.get("modo") === "gps" ? "gps" : "simulado";

  function escolherModo(novoModo) {
    setSearchParams({ modo: novoModo }, { replace: true });
  }

  return (
    <main className="container py-4 d-flex flex-column align-items-center">
      <section className="cicla-coluna">
        <header className="mb-3">
          <h1 className="h3 text-center text-lg-start">Cronometrar percurso</h1>
        </header>

        <ul className="nav nav-pills gap-2 mb-3">
          <li className="nav-item">
            <button
              type="button"
              className={"nav-link" + (modo === "simulado" ? " active" : "")}
              aria-pressed={modo === "simulado"}
              onClick={() => escolherModo("simulado")}
            >
              Simulado
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={"nav-link" + (modo === "gps" ? " active" : "")}
              aria-pressed={modo === "gps"}
              onClick={() => escolherModo("gps")}
            >
              GPS (opcional)
            </button>
          </li>
        </ul>

        {modo === "simulado" ? (
          <CronometroSimulado />
        ) : (
          <Suspense fallback={<p className="text-body-secondary">Carregando mapa...</p>}>
            <MapaGps />
          </Suspense>
        )}
      </section>
    </main>
  );
}
