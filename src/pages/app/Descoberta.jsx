import { useState } from "react";

export default function Descoberta() {
  // Candidatos a match como dado local do componente.
  const [candidatos, setCandidatos] = useState([
    { id: 1, nome: "Ana Beatriz", distanciaKm: 3.2, estiloPedal: "Estrada", deuMatch: false },
    { id: 2, nome: "Bruno Costa", distanciaKm: 5.8, estiloPedal: "Mountain bike", deuMatch: false },
    { id: 3, nome: "Camila Rocha", distanciaKm: 1.4, estiloPedal: "Urbano", deuMatch: false },
  ]);

  function darMatch(id) {
    setCandidatos((atual) =>
      atual.map((candidato) =>
        candidato.id === id ? { ...candidato, deuMatch: true } : candidato
      )
    );
  }

  return (
    <main className="container py-4">
      <h1 className="h3">Descobrir Ciclistas</h1>
      <p>Encontre outros ciclistas e dê Match!</p>

      <div className="row g-3">
        {candidatos.map((candidato) => (
          <div className="col-12 col-md-6 col-lg-4" key={candidato.id}>
            <div className="card h-100">
              <div className="card-body">
                <h2 className="h5">{candidato.nome}</h2>
                <p className="card-text small text-body-secondary mb-1">
                  {candidato.estiloPedal} · {candidato.distanciaKm} km de você
                </p>

                {candidato.deuMatch ? (
                  <span className="badge bg-ciclagrey">Match dado ✓</span>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => darMatch(candidato.id)}
                  >
                    Dar Match
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
