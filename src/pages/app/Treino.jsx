import { useState } from "react";
import { useSearchParams } from "react-router-dom";

// Página única de Treino: a escolha entre Individual e Equipe é uma aba
// dentro da própria página (era uma rota / menu separado antes).

const RATULO_TIPO = { individual: "Individual", equipe: "Equipe" };

export default function Treino() {
  // O tipo fica na URL (?tipo=individual|equipe): sobrevive a F5, dá pra
  // compartilhar o link já com o tipo certo e as rotas antigas
  // (/app/treino-individual e /app/treino-equipe) redirecionam pra cá.
  const [searchParams, setSearchParams] = useSearchParams();
  const tipo = searchParams.get("tipo") === "equipe" ? "equipe" : "individual";

  // Dados locais do componente — nada de API/backend aqui.
  const equipes = ["Equipe 1", "Equipe 2"];
  const [treinosMarcados, setTreinosMarcados] = useState([
    { id: 1, data: "2026-09-30", hora: "20:00", tipo: "individual", feito: false },
  ]);

  function escolherTipo(novoTipo) {
    // replace: trocar de aba não enche o histórico do navegador.
    setSearchParams({ tipo: novoTipo }, { replace: true });
  }

  function marcarTreino(evento) {
    evento.preventDefault();
    const dados = new FormData(evento.target);
    const novoTreino = {
      id: Date.now(),
      data: dados.get("data"),
      hora: dados.get("hora"),
      tipo,
      feito: false,
    };
    setTreinosMarcados((atual) => [...atual, novoTreino]);
    evento.target.reset();
  }

  function alternarFeito(id) {
    setTreinosMarcados((atual) =>
      atual.map((treino) => (treino.id === id ? { ...treino, feito: !treino.feito } : treino))
    );
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

      <div className="row g-4">
        <div className="col-lg-4">
          {tipo === "individual" ? (
            <form onSubmit={marcarTreino}>
              <div className="mb-2">
                <label htmlFor="data" className="form-label">Data</label>
                <input type="date" id="data" name="data" className="form-control" required />
              </div>
              <div className="mb-3">
                <label htmlFor="hora" className="form-label">Hora</label>
                <input type="time" id="hora" name="hora" className="form-control" required />
              </div>
              <button type="submit" className="btn btn-primary">Agendar</button>
            </form>
          ) : (
            <form onSubmit={marcarTreino}>
              <div className="mb-2">
                <label htmlFor="equipe" className="form-label">Selecione a equipe</label>
                <select id="equipe" name="equipe" className="form-select">
                  {equipes.map((equipe) => (
                    <option key={equipe}>{equipe}</option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label htmlFor="data-equipe" className="form-label">Data</label>
                <input type="date" id="data-equipe" name="data" className="form-control" required />
              </div>
              <div className="mb-3">
                <label htmlFor="hora-equipe" className="form-label">Hora</label>
                <input type="time" id="hora-equipe" name="hora" className="form-control" required />
              </div>
              <button type="submit" className="btn btn-primary">Agendar</button>
            </form>
          )}
        </div>

        <div className="col-lg-8">
          <h2 className="h5 mb-3">Marcados</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Data</th>
                <th>Hora</th>
                <th>Tipo</th>
                <th>Feito</th>
              </tr>
            </thead>
            <tbody>
              {treinosMarcados.map((treino) => (
                <tr key={treino.id}>
                  <td>{treino.data}</td>
                  <td>{treino.hora}</td>
                  <td>{RATULO_TIPO[treino.tipo]}</td>
                  <td>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={treino.feito}
                      onChange={() => alternarFeito(treino.id)}
                      aria-label={`Marcar treino de ${treino.data} como feito`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
