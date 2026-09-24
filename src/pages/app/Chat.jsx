import { useState } from "react";

export default function Chat() {
  // Conversas e mensagens como dado local do componente.
  const [conversas, setConversas] = useState([
    {
      id: 1,
      nome: "Ana Beatriz",
      mensagens: [
        { autor: "Ana Beatriz", texto: "Bora pedalar sábado?" },
        { autor: "Você", texto: "Bora! Que horas?" },
      ],
    },
    {
      id: 2,
      nome: "Bruno Costa",
      mensagens: [{ autor: "Bruno Costa", texto: "Valeu pelo treino de hoje!" }],
    },
  ]);

  const [conversaAtivaId, setConversaAtivaId] = useState(conversas[0].id);
  const [rascunho, setRascunho] = useState("");

  const conversaAtiva = conversas.find((c) => c.id === conversaAtivaId);

  function enviarMensagem(evento) {
    evento.preventDefault();
    const texto = rascunho.trim();
    if (!texto) return;

    setConversas((atual) =>
      atual.map((conversa) =>
        conversa.id === conversaAtivaId
          ? { ...conversa, mensagens: [...conversa.mensagens, { autor: "Você", texto }] }
          : conversa
      )
    );
    setRascunho("");
  }

  return (
    <main className="container py-4">
      <h1 className="h3">Chat</h1>

      <div className="row g-3">
        <div className="col-12 col-md-4">
          <ul className="list-group">
            {conversas.map((conversa) => (
              <li key={conversa.id} className="list-group-item p-0">
                <button
                  type="button"
                  className={
                    "btn w-100 text-start border-0 rounded-0" +
                    (conversa.id === conversaAtivaId ? " btn-primary" : "btn-light")
                  }
                  onClick={() => setConversaAtivaId(conversa.id)}
                >
                  {conversa.nome}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-12 col-md-8">
          <div className="border rounded p-3 mb-2" style={{ minHeight: "220px" }}>
            {conversaAtiva.mensagens.map((mensagem, indice) => (
              <p
                key={indice}
                className={"mb-2 " + (mensagem.autor === "Você" ? "text-end" : "")}
              >
                <span
                  className={
                    "d-inline-block px-2 py-1 rounded " +
                    (mensagem.autor === "Você" ? "bg-primary text-white" : "bg-ciclagrey")
                  }
                >
                  {mensagem.texto}
                </span>
              </p>
            ))}
          </div>

          <form className="d-flex gap-2" onSubmit={enviarMensagem}>
            <input
              type="text"
              className="form-control"
              placeholder={`Mensagem para ${conversaAtiva.nome}`}
              value={rascunho}
              onChange={(evento) => setRascunho(evento.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Enviar
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
