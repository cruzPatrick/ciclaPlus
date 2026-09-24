export default function Ranking() {
  const ciclistas = [
    { nome: "João Silva", pontuacao: 1500, melhorTempo: "00:45:30" },
    { nome: "Maria Oliveira", pontuacao: 1400, melhorTempo: "00:47:15" },
    { nome: "Carlos Santos", pontuacao: 1350, melhorTempo: "00:48:20" },
  ];

  // Melhor tempo por percurso (ciclovia) — dado local, viria do resultado
  // registrado em cada corrida no Cronômetro no futuro.
  const melhoresTemposPorPercurso = [
    { percurso: "Ciclovia da Orla", ciclista: "João Silva", tempo: "00:18:42", distanciaKm: 8.5 },
    { percurso: "Ciclovia da Orla", ciclista: "Carlos Santos", tempo: "00:19:10", distanciaKm: 8.5 },
    { percurso: "Ciclovia do Parque", ciclista: "Maria Oliveira", tempo: "00:12:05", distanciaKm: 5.2 },
  ];

  return (
    <main className="container py-4">
      <h1 className="h3">Ranking de Ciclistas</h1>

      <h2 className="h5 mt-4">Ranking geral</h2>
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
            <tr key={ciclista.nome}>
              <td>{ciclista.nome}</td>
              <td>{ciclista.pontuacao}</td>
              <td>{ciclista.melhorTempo}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="h5 mt-4">Melhores tempos por percurso</h2>
      <p className="small text-body-secondary">
        Validado pela localização registrada no Cronômetro.
      </p>
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
          {melhoresTemposPorPercurso.map((registro, indice) => (
            <tr key={indice}>
              <td>{registro.percurso}</td>
              <td>{registro.ciclista}</td>
              <td>{registro.tempo}</td>
              <td>{registro.distanciaKm} km</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
