export default function Chat() {
  const conversas = [
    { id: 1, nome: "Conversa 1" },
    { id: 2, nome: "Conversa 2" },
  ];

  return (
    <main className="container py-4">
      <h1 className="h3">Chat</h1>
      <p>Lista de conversas:</p>
      <ul className="list-group mb-2" style={{ maxWidth: "320px" }}>
        {conversas.map((conversa) => (
          <li key={conversa.id} className="list-group-item">
            <a href="#" className="text-decoration-none">
              {conversa.nome}
            </a>
          </li>
        ))}
      </ul>
      <p className="small text-body-secondary">
        Selecione uma conversa para continuar.
      </p>
    </main>
  );
}
