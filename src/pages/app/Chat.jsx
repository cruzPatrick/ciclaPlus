import { useState } from "react";

// Um item da lista de conversas — mesmo componente usado na lista mobile
// (tela cheia) e na lista lateral do desktop.
function ItemConversa({ conversa, ativa, onSelecionar }) {
  return (
    <li className="list-group-item p-0">
      <button
        type="button"
        className={
          "btn w-100 d-flex align-items-center gap-2 text-start border-0 rounded-0 py-2" +
          (ativa ? " btn-primary" : " btn-light")
        }
        onClick={() => onSelecionar(conversa.id)}
      >
        <span className="material-icons">account_circle</span>
        <span>
          <span className="d-block">{conversa.nome}</span>
          <span className="d-block small" style={{ opacity: 0.75 }}>
            {conversa.distanciaKm} km
          </span>
        </span>
      </button>
    </li>
  );
}

// A conversa aberta: histórico de mensagens + formulário de envio.
function ThreadConversa({ conversa, rascunho, onMudarRascunho, onEnviar }) {
  return (
    <>
      <div className="border rounded p-3 mb-2" style={{ minHeight: "220px" }}>
        {conversa.mensagens.map((mensagem, indice) => (
          <p key={indice} className={"mb-2 " + (mensagem.autor === "Você" ? "text-end" : "")}>
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

      <form className="d-flex gap-2" onSubmit={onEnviar}>
        <input
          type="text"
          className="form-control"
          placeholder={`Mensagem para ${conversa.nome}`}
          value={rascunho}
          onChange={(evento) => onMudarRascunho(evento.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Enviar
        </button>
      </form>
    </>
  );
}

export default function Chat() {
  // Conversas e mensagens como dado local do componente.
  const [conversas, setConversas] = useState([
    {
      id: 1,
      nome: "Ana Beatriz",
      distanciaKm: 3.2,
      mensagens: [
        { autor: "Ana Beatriz", texto: "Bora pedalar sábado?" },
        { autor: "Você", texto: "Bora! Que horas?" },
      ],
    },
    {
      id: 2,
      nome: "Bruno Costa",
      distanciaKm: 5.8,
      mensagens: [{ autor: "Bruno Costa", texto: "Valeu pelo treino de hoje!" }],
    },
  ]);

  const [conversaAtivaId, setConversaAtivaId] = useState(conversas[0].id);
  const [rascunho, setRascunho] = useState("");
  // Só importa no mobile: lá a lista e a conversa aberta nunca aparecem
  // juntas, uma tela troca pela outra.
  const [telaMobile, setTelaMobile] = useState("lista");

  const conversaAtiva = conversas.find((c) => c.id === conversaAtivaId);

  function abrirConversa(id) {
    setConversaAtivaId(id);
    setTelaMobile("thread");
  }

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
      {/* Mobile: lista OU conversa aberta, nunca as duas ao mesmo tempo. */}
      <div className="d-lg-none">
        {telaMobile === "lista" ? (
          <>
            <h1 className="h3">Chat</h1>
            <ul className="list-group">
              {conversas.map((conversa) => (
                <ItemConversa
                  key={conversa.id}
                  conversa={conversa}
                  ativa={conversa.id === conversaAtivaId}
                  onSelecionar={abrirConversa}
                />
              ))}
            </ul>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-link px-0 mb-2 text-decoration-none"
              onClick={() => setTelaMobile("lista")}
            >
              <span className="material-icons align-middle">arrow_back</span> Voltar
            </button>
            <ThreadConversa
              conversa={conversaAtiva}
              rascunho={rascunho}
              onMudarRascunho={setRascunho}
              onEnviar={enviarMensagem}
            />
          </>
        )}
      </div>

      {/* Desktop: lista e conversa aberta lado a lado. */}
      <div className="d-none d-lg-block">
        <h1 className="h3">Chat</h1>
        <div className="row g-3">
          <div className="col-lg-4">
            <ul className="list-group">
              {conversas.map((conversa) => (
                <ItemConversa
                  key={conversa.id}
                  conversa={conversa}
                  ativa={conversa.id === conversaAtivaId}
                  onSelecionar={setConversaAtivaId}
                />
              ))}
            </ul>
          </div>
          <div className="col-lg-8">
            <ThreadConversa
              conversa={conversaAtiva}
              rascunho={rascunho}
              onMudarRascunho={setRascunho}
              onEnviar={enviarMensagem}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
