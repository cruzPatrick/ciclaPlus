import { useRankingGeral, useMelhoresTempos } from "../../hooks/useCiclaData.js";

export default function Ranking() {
  const { data: ciclistas = [], isLoading: carregandoRanking, isError: erroRanking } =
    useRankingGeral();
  const {
    data: melhoresTemposPorPercurso = [],
    isLoading: carregandoTempos,
    isError: erroTempos,
  } = useMelhoresTempos();

  return (
    <main className="container py-4">
      <h1 className="h3">Ranking de Ciclistas</h1>

      <h2 className="h5 mt-4">Ranking geral</h2>
      {carregandoRanking && <p className="text-body-secondary">Carregando ranking...</p>}
      {erroRanking && (
        <aside className="bg-light border border-danger text-danger rounded p-2 small">
          Não foi possível carregar o ranking. O json-server está rodando? (npm run mock)
        </aside>
      )}
      {!carregandoRanking && !erroRanking && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Pontuação</th>
              <th>Melhor Tempo</th>
            </tr>
          </thead>
          <tbody>
            {ciclistas.map((ciclista) => (
              <tr key={ciclista.id}>
                <td>{ciclista.nome}</td>
                <td>{ciclista.pontuacao}</td>
                <td>{ciclista.melhorTempo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="h5 mt-4">Melhores tempos por percurso</h2>
      <p className="small text-body-secondary">
        Validado pela localização registrada no Cronômetro.
      </p>
      {carregandoTempos && <p className="text-body-secondary">Carregando...</p>}
      {erroTempos && (
        <aside className="bg-light border border-danger text-danger rounded p-2 small">
          Não foi possível carregar os tempos. O json-server está rodando? (npm run mock)
        </aside>
      )}
      {!carregandoTempos && !erroTempos && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Percurso</th>
              <th>Ciclista</th>
              <th>Tempo</th>
              <th>Distância</th>
            </tr>
          </thead>
          <tbody>
            {melhoresTemposPorPercurso.map((registro) => (
              <tr key={registro.id}>
                <td>{registro.percurso}</td>
                <td>{registro.ciclista}</td>
                <td>{registro.tempo}</td>
                <td>{registro.distanciaKm} km</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
