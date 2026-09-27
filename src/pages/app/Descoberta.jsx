import { useState } from "react";

// Card de um candidato — mesmo componente usado na fila do mobile (um por
// vez) e na grade do desktop (vários ao mesmo tempo).
function CardCandidato({ candidato, onAvaliar }) {
  return (
    <div className="card h-100">
      <div className="card-body text-center">
        <div
          className="rounded-circle bg-ciclagrey d-flex align-items-center justify-content-center mx-auto mb-2"
          style={{ width: "72px", height: "72px" }}
        >
          <span className="material-icons" style={{ fontSize: "36px" }}>
            person
          </span>
        </div>
        <h2 className="h5 mb-1">{candidato.nome}</h2>
        <p className="small text-body-secondary mb-3">
          {candidato.tipo} · {candidato.distanciaKm} km
        </p>
        <div className="d-flex justify-content-center gap-3">
          <button
            type="button"
            className="btn btn-outline-secondary rounded-circle"
            style={{ width: "48px", height: "48px" }}
            aria-label={`Passar de ${candidato.nome}`}
            onClick={() => onAvaliar(candidato.id, "passou")}
          >
            <span className="material-icons">close</span>
          </button>
          <button
            type="button"
            className="btn btn-primary rounded-circle"
            style={{ width: "48px", height: "48px" }}
            aria-label={`Dar match em ${candidato.nome}`}
            onClick={() => onAvaliar(candidato.id, "match")}
          >
            <span className="material-icons">favorite</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Descoberta() {
  // Candidatos a match como dado local do componente.
  const [candidatos, setCandidatos] = useState([
    { id: 1, nome: "Ana Beatriz", distanciaKm: 3.2, tipo: "Estrada", status: "pendente" },
    { id: 2, nome: "Bruno Costa", distanciaKm: 5.8, tipo: "Mountain bike", status: "pendente" },
    { id: 3, nome: "Camila Rocha", distanciaKm: 1.4, tipo: "Urbano", status: "pendente" },
  ]);

  const pendentes = candidatos.filter((c) => c.status === "pendente");

  function avaliar(id, status) {
    setCandidatos((atual) =>
      atual.map((candidato) => (candidato.id === id ? { ...candidato, status } : candidato))
    );
  }

  return (
    <main className="container py-4">
      <h1 className="h3">Dar Match</h1>
      <p>Encontre outros ciclistas e dê Match!</p>

      {pendentes.length === 0 ? (
        <p className="text-body-secondary">Sem novos ciclistas por perto no momento.</p>
      ) : (
        <>
          {/* Mobile: só o próximo candidato da fila — decide um de cada vez. */}
          <div className="d-lg-none mx-auto" style={{ maxWidth: "300px" }}>
            <CardCandidato candidato={pendentes[0]} onAvaliar={avaliar} />
          </div>

          {/* Desktop: todos os candidatos pendentes lado a lado. */}
          <div className="d-none d-lg-flex flex-wrap gap-3">
            {pendentes.map((candidato) => (
              <div key={candidato.id} style={{ width: "220px" }}>
                <CardCandidato candidato={candidato} onAvaliar={avaliar} />
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
