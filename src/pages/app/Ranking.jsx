import { useRankingGeral, useMelhoresTempos } from "../../hooks/useCiclaData.js";
import { PONTOS_POR_RESULTADO } from "../../api/ciclaApi.js";
import { paraSegundos } from "../../utils/tempo.js";

export default function Ranking() {
  const { data: ciclistas = [], isLoading: carregandoRanking, error: erroRanking } =
    useRankingGeral();
  const {
    data: melhoresTemposPorPercurso = [],
    isLoading: carregandoTempos,
    isError: erroTempos,
  } = useMelhoresTempos();

  // O ranking geral já vem ordenado da API; dentro de um percurso, o menor
  // tempo vem antes.
  const ranking = ciclistas; // já vem ordenado e com posição da API
  const temposOrdenados = [...melhoresTemposPorPercurso].sort(
    (a, b) =>
      a.percurso.localeCompare(b.percurso) || paraSegundos(a.tempo) - paraSegundos(b.tempo)
  );

  return (
    <main className="container py-4">
      <h1 className="h3">Ranking de Ciclistas</h1>

      <h2 className="h5 mt-4">Ranking geral</h2>
      <p className="small text-body-secondary">
        A pontuação vem dos confrontos encerrados: vitória soma{" "}
        {PONTOS_POR_RESULTADO["Vitória"]} pontos e derrota soma {PONTOS_POR_RESULTADO["Derrota"]}.
      </p>
      {carregandoRanking && <p className="text-body-secondary">Carregando ranking...</p>}
      {erroRanking && (
        <aside className="bg-light border border-danger text-danger rounded p-2 small">
          {erroRanking.message}
        </aside>
      )}
      {!carregandoRanking && !erroRanking && ranking.length === 0 && (
        <p className="text-body-secondary">Ainda não há confrontos encerrados. Quando houver, a classificação aparece aqui.</p>
      )}
      {!carregandoRanking && !erroRanking && ranking.length > 0 && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Vitórias</th>
              <th>Derrotas</th>
              <th>Pontuação</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((ciclista) => (
              <tr key={ciclista.usuarioId} className={ciclista.souEu ? "table-primary fw-bold" : ""}>
                <td>{ciclista.posicao}</td>
                <td>{ciclista.nome}</td>
                <td>{ciclista.vitorias}</td>
                <td>{ciclista.derrotas}</td>
                <td>{ciclista.pontuacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="h5 mt-4">Melhores tempos por percurso</h2>
      <p className="small text-body-secondary">
        Atualizado a cada tempo registrado no Cronômetro com percurso verificado.
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
            {temposOrdenados.map((registro) => (
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
