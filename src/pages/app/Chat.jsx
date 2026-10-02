import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMatches, useMensagens, useEnviarMensagem } from "../../hooks/useCiclaData.js";

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

const esquemaMensagem = z.object({
  texto: z.string().trim().min(1, "Escreva algo antes de enviar"),
});

// A conversa aberta: histórico de mensagens + formulário de envio.
function ThreadConversa({ conversa }) {
  const { data: mensagens = [], isLoading } = useMensagens(conversa.id);
  const enviarMutation = useEnviarMensagem(conversa.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(esquemaMensagem), defaultValues: { texto: "" } });

  function aoEnviar(dados) {
    enviarMutation.mutate(dados.texto.trim());
    reset();
  }

  return (
    <>
      <section className="border rounded p-3 mb-2" style={{ minHeight: "220px" }}>
        {isLoading && <p className="text-body-secondary small m-0">Carregando conversa...</p>}
        {mensagens.map((mensagem) => (
          <p key={mensagem.id} className={"mb-2 " + (mensagem.autor === "Você" ? "text-end" : "")}>
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
      </section>

      <form className="d-flex gap-2" onSubmit={handleSubmit(aoEnviar)} noValidate>
        <section className="flex-grow-1">
          <input
            type="text"
            className={"form-control" + (errors.texto ? " is-invalid" : "")}
            placeholder={`Mensagem para ${conversa.nome}`}
            {...register("texto")}
          />
        </section>
        <button type="submit" className="btn btn-primary">
          Enviar
        </button>
      </form>
    </>
  );
}

export default function Chat() {
  // Conversas não são mais dado próprio do Chat — vêm de quem é match de
  // verdade (Dar Match), buscado no json-server.
  const { data: matches = [], isLoading, isError } = useMatches();
  const [conversaAtivaId, setConversaAtivaId] = useState(null);
  // Só importa no mobile: lá a lista e a conversa aberta nunca aparecem
  // juntas, uma tela troca pela outra.
  const [telaMobile, setTelaMobile] = useState("lista");

  // Se o id guardado deixou de ser um match (ainda não há nenhum, ou era o
  // único e ele saiu da lista), cai pro primeiro match disponível —
  // derivado no render, sem precisar de um effect só pra sincronizar state.
  const idAtivo = matches.some((m) => m.id === conversaAtivaId)
    ? conversaAtivaId
    : matches[0]?.id ?? null;
  const conversaAtiva = matches.find((m) => m.id === idAtivo);

  function abrirConversa(id) {
    setConversaAtivaId(id);
    setTelaMobile("thread");
  }

  if (isLoading) {
    return (
      <main className="container py-4">
        <h1 className="h3">Chat</h1>
        <p className="text-body-secondary">Carregando seus matches...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="container py-4">
        <h1 className="h3">Chat</h1>
        <aside className="bg-light border border-danger text-danger rounded p-2 small">
          Não foi possível carregar seus matches. O json-server está rodando? (npm run mock)
        </aside>
      </main>
    );
  }

  // Sem match, sem chat — é literalmente a regra pedida.
  if (matches.length === 0) {
    return (
      <main className="container py-4">
        <h1 className="h3">Chat</h1>
        <aside className="text-body-secondary">
          Você ainda não deu match com ninguém. Vá em <strong>Dar Match</strong> pra
          começar uma conversa por aqui.
        </aside>
      </main>
    );
  }

  return (
    <main className="container py-4">
      {/* Mobile: lista OU conversa aberta, nunca as duas ao mesmo tempo. */}
      <div className="d-lg-none">
        {telaMobile === "lista" ? (
          <>
            <h1 className="h3">Chat</h1>
            <ul className="list-group">
              {matches.map((match) => (
                <ItemConversa
                  key={match.id}
                  conversa={match}
                  ativa={match.id === idAtivo}
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
            <ThreadConversa conversa={conversaAtiva} />
          </>
        )}
      </div>

      {/* Desktop: lista e conversa aberta lado a lado. */}
      <div className="d-none d-lg-block">
        <h1 className="h3">Chat</h1>
        <div className="row g-3">
          <section className="col-lg-4">
            <ul className="list-group">
              {matches.map((match) => (
                <ItemConversa
                  key={match.id}
                  conversa={match}
                  ativa={match.id === idAtivo}
                  onSelecionar={setConversaAtivaId}
                />
              ))}
            </ul>
          </section>
          <section className="col-lg-8">
            <ThreadConversa conversa={conversaAtiva} />
          </section>
        </div>
      </div>
    </main>
  );
}
