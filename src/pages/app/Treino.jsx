import { useSearchParams } from "react-router-dom";

// Página única de Treino: a escolha entre Individual e Equipe é uma aba
// dentro da própria página (era uma rota / menu separado antes).

// Sem backend — o envio do form só evita o reload da SPA (mesma simulação
// das demais telas do protótipo).
function previneEnvio(evento) {
  evento.preventDefault();
}

export default function Treino() {
  // O tipo fica na URL (?tipo=individual|equipe): sobrevive a F5, dá pra
  // compartilhar o link já com o tipo certo e as rotas antigas
  // (/app/treino-individual e /app/treino-equipe) redirecionam pra cá.
  const [searchParams, setSearchParams] = useSearchParams();
  const tipo = searchParams.get("tipo") === "equipe" ? "equipe" : "individual";

  // Dados locais do componente — nada de API/backend aqui.
  const equipes = ["Equipe 1", "Equipe 2"];

  function escolherTipo(novoTipo) {
    // replace: trocar de aba não enche o histórico do navegador.
    setSearchParams({ tipo: novoTipo }, { replace: true });
  }

  return (
    <main className="container py-4">
      <h1 className="h3">Treino</h1>

      <ul className="nav nav-pills gap-2 mb-4">
        <li className="nav-item">
          <button
            type="button"
            className={"nav-link" + (tipo === "individual" ? " active" : "")}
            aria-pressed={tipo === "individual"}
            onClick={() => escolherTipo("individual")}
          >
            Individual
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={"nav-link" + (tipo === "equipe" ? " active" : "")}
            aria-pressed={tipo === "equipe"}
            onClick={() => escolherTipo("equipe")}
          >
            Em equipe
          </button>
        </li>
      </ul>

      {tipo === "individual" ? (
        <section aria-labelledby="titulo-individual">
          <h2 id="titulo-individual" className="h5 mb-3">
            Marcar treino individual
          </h2>
          <form
            className="row g-2"
            style={{ maxWidth: "480px" }}
            onSubmit={previneEnvio}
          >
            <div className="col-auto">
              <label htmlFor="data" className="form-label">Data</label>
              <input type="date" id="data" name="data" className="form-control" />
            </div>
            <div className="col-auto">
              <label htmlFor="hora" className="form-label">Hora</label>
              <input type="time" id="hora" name="hora" className="form-control" />
            </div>
            <div className="col-auto d-flex align-items-end">
              <button type="submit" className="btn btn-primary">Agendar</button>
            </div>
          </form>
        </section>
      ) : (
        <section aria-labelledby="titulo-equipe">
          <h2 id="titulo-equipe" className="h5 mb-3">
            Marcar treino em equipe
          </h2>
          <form
            className="row g-2"
            style={{ maxWidth: "640px" }}
            onSubmit={previneEnvio}
          >
            <div className="col-auto">
              <label htmlFor="equipe" className="form-label">Selecione a equipe</label>
              <select id="equipe" name="equipe" className="form-select">
                {equipes.map((equipe) => (
                  <option key={equipe}>{equipe}</option>
                ))}
              </select>
            </div>
            <div className="col-auto">
              <label htmlFor="data-equipe" className="form-label">Data</label>
              <input type="date" id="data-equipe" name="data-equipe" className="form-control" />
            </div>
            <div className="col-auto">
              <label htmlFor="hora-equipe" className="form-label">Hora</label>
              <input type="time" id="hora-equipe" name="hora-equipe" className="form-control" />
            </div>
            <div className="col-auto d-flex align-items-end">
              <button type="submit" className="btn btn-primary">Agendar</button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}
