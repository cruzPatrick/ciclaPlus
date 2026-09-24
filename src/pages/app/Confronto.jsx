import { useState } from "react";

// Rótulo e cor de cada status do confronto, seguindo o fluxo da Matriz CRUD:
// pendente -> confirmado -> resultado_registrado -> encerrado
const STATUS = {
  pendente: { rotulo: "Pendente", cor: "secondary" },
  confirmado: { rotulo: "Confirmado", cor: "primary" },
  resultado_registrado: { rotulo: "Resultado registrado", cor: "ciclagrey" },
  encerrado: { rotulo: "Encerrado", cor: "dark" },
};

export default function Confronto() {
  // Confrontos como dado local do componente.
  const [confrontos, setConfrontos] = useState([
    { id: 1, adversario: "Bruno Costa", status: "pendente", resultado: null },
    { id: 2, adversario: "Camila Rocha", status: "confirmado", resultado: null },
  ]);
  const [novoAdversario, setNovoAdversario] = useState("");

  function marcarConfronto(evento) {
    evento.preventDefault();
    const adversario = novoAdversario.trim();
    if (!adversario) return;

    setConfrontos((atual) => [
      ...atual,
      { id: Date.now(), adversario, status: "pendente", resultado: null },
    ]);
    setNovoAdversario("");
  }

  function confirmarConfronto(id) {
    setConfrontos((atual) =>
      atual.map((c) => (c.id === id ? { ...c, status: "confirmado" } : c))
    );
  }

  function registrarResultado(id, resultado) {
    setConfrontos((atual) =>
      atual.map((c) =>
        c.id === id ? { ...c, status: "resultado_registrado", resultado } : c
      )
    );
  }

  function confirmarEncerramento(id) {
    setConfrontos((atual) =>
      atual.map((c) => (c.id === id ? { ...c, status: "encerrado" } : c))
    );
  }

  return (
    <main className="container py-4">
      <h1 className="h3">Confrontos</h1>
      <p>Marque, confirme ou registre resultados de confrontos.</p>

      <form className="row g-2 mb-4" style={{ maxWidth: "480px" }} onSubmit={marcarConfronto}>
        <div className="col-auto flex-grow-1">
          <label htmlFor="adversario" className="form-label">Marcar confronto contra</label>
          <input
            type="text"
            id="adversario"
            className="form-control"
            placeholder="Nome do adversário"
            value={novoAdversario}
            onChange={(evento) => setNovoAdversario(evento.target.value)}
          />
        </div>
        <div className="col-auto d-flex align-items-end">
          <button type="submit" className="btn btn-primary">Marcar</button>
        </div>
      </form>

      <ul className="list-group">
        {confrontos.map((confronto) => (
          <li key={confronto.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <strong>vs. {confronto.adversario}</strong>{" "}
                <span className={`badge bg-${STATUS[confronto.status].cor}`}>
                  {STATUS[confronto.status].rotulo}
                </span>
                {confronto.resultado && (
                  <span className="ms-2 small text-body-secondary">
                    Resultado: {confronto.resultado}
                  </span>
                )}
              </div>

              <div className="d-flex gap-2">
                {confronto.status === "pendente" && (
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => confirmarConfronto(confronto.id)}
                  >
                    Confirmar Confronto
                  </button>
                )}

                {confronto.status === "confirmado" && (
                  <>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => registrarResultado(confronto.id, "Vitória")}
                    >
                      Registrar Vitória
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => registrarResultado(confronto.id, "Derrota")}
                    >
                      Registrar Derrota
                    </button>
                  </>
                )}

                {confronto.status === "resultado_registrado" && (
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => confirmarEncerramento(confronto.id)}
                  >
                    Confirmar Encerramento
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
