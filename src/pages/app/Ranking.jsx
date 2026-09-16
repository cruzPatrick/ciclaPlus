export default function Ranking() {
  const ciclistas = [
    { nome: "João Silva", pontuacao: 1500, melhorTempo: "00:45:30" },
    { nome: "Maria Oliveira", pontuacao: 1400, melhorTempo: "00:47:15" },
    { nome: "Carlos Santos", pontuacao: 1350, melhorTempo: "00:48:20" },
  ];

  return (
    <main className="container py-4">
      <h1 className="h3">Ranking de Ciclistas</h1>
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
    </main>
  );
}
