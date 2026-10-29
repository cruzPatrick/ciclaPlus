import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useMatches,
  useMensagens,
  useEnviarMensagem,
  useDesfazerMatch,
} from "../../hooks/useCiclaData.js";
import { ehMutuo } from "../../utils/match.js";

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
        <span className="material-icons">{ehMutuo(conversa) ? "account_circle" : "lock"}</span>
        <span>
          <span className="d-block">{conversa.nome}</span>
          <span className="d-block small opacity-75">
            {ehMutuo(conversa) ? `${conversa.distanciaKm} km` : "Aguardando retribuição"}
          </span>
        </span>
      </button>
    </li>
  );
}

const esquemaMensagem = z.object({
  texto: z.string().trim().min(1, "Escreva algo antes de enviar"),
});

const esquemaDesfazer = z.object({
  apagarMensagens: z.boolean(),
  apagarConfrontos: z.boolean(),
});

// Confirmação de "Desfazer match" com o que apagar junto (tudo desmarcado por
// padrão: apagar histórico é opção de quem desfaz, não o padrão).
function FormularioDesfazerMatch({ nome, enviando, onConfirmar, onCancelar }) {
  const idBase = useId();
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(esquemaDesfazer),
    defaultValues: { apagarMensagens: false, apagarConfrontos: false },
  });

  return (
    <form
      className="bg-light border border-danger rounded p-2 small mb-2"
      onSubmit={handleSubmit(onConfirmar)}
      noValidate
    >
      <p className="m-0 mb-2">
        O match com <strong>{nome}</strong> será desfeito e a pessoa volta pra fila do Dar
        Match. Marque o que mais deve ser apagado:
      </p>

      <section className="form-check mb-1">
        <input
          type="checkbox"
          className="form-check-input"
          id={`${idBase}-mensagens`}
          {...register("apagarMensagens")}
        />
        <label className="form-check-label" htmlFor={`${idBase}-mensagens`}>
          Apagar histórico de mensagens
        </label>
        <p className="form-text m-0">
          Se não marcar, a conversa volta caso vocês deem match de novo.
        </p>
      </section>

      <section className="form-check mb-2">
        <input
          type="checkbox"
          className="form-check-input"
          id={`${idBase}-confrontos`}
          {...register("apagarConfrontos")}
        />
        <label className="form-check-label" htmlFor={`${idBase}-confrontos`}>
          Apagar histórico de confrontos
        </label>
        <p className="form-text m-0">
          Se não marcar, o histórico continua na tela de Confrontos.
        </p>
      </section>

      <button type="submit" className="btn btn-danger btn-sm me-2" disabled={enviando}>
        Desfazer match
      </button>
      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onCancelar}>
        Cancelar
      </button>
    </form>
  );
}

// A conversa aberta: histórico de mensagens + formulário de envio.
function ThreadConversa({ conversa, aoDesfazer }) {
  const { data: mensagens = [], isLoading } = useMensagens(conversa.id);
  const enviarMutation = useEnviarMensagem(conversa.id);
  const desfazerMutation = useDesfazerMatch();
  // Confirmação inline (sem alert()): o clique em "Desfazer match" só abre o aviso.
  const [confirmando, setConfirmando] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(esquemaMensagem), defaultValues: { texto: "" } });

  const liberada = ehMutuo(conversa);

  function desfazer(opcoes) {
    desfazerMutation.mutate(
      { match: conversa, ...opcoes },
      {
        onSuccess: () => {
          setConfirmando(false);
          aoDesfazer?.();
        },
      }
    );
  }

  function aoEnviar(dados) {
    // Defesa dupla: mesmo se o campo for habilitado pelo DevTools, o envio
    // sem match recíproco não acontece.
    if (!liberada) return;
    enviarMutation.mutate(dados.texto.trim());
    reset();
  }

  return (
    <>
      <header className="d-flex align-items-center justify-content-between mb-2">
        <h2 className="h6 m-0">{conversa.nome}</h2>
        {!confirmando && (
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => setConfirmando(true)}
          >
            Desfazer match
          </button>
        )}
      </header>

      {confirmando && (
        <FormularioDesfazerMatch
          nome={conversa.nome}
          enviando={desfazerMutation.isPending}
          onConfirmar={desfazer}
          onCancelar={() => setConfirmando(false)}
        />
      )}

      {desfazerMutation.isError && (
        <aside className="bg-light border border-danger text-danger rounded p-2 small mb-2">
          Não foi possível desfazer o match. Confere se o json-server está rodando e tenta de novo.
        </aside>
      )}

      <section className="cicla-thread border rounded p-3 mb-2">
        {isLoading && <p className="text-body-secondary small m-0">Carregando conversa...</p>}
        {mensagens.map((mensagem) => (
          <p key={mensagem.id} className={"mb-2 " + (mensagem.autor === "Você" ? "text-end" : "")}>
            {/* "Você" nas minhas mensagens; nas do outro lado, o nome de quem enviou */}
            <small className="d-block text-body-secondary" style={{ fontSize: "0.75rem" }}>
              {mensagem.autor}
            </small>
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

      {!liberada && (
        <aside className="bg-light border border-warning text-warning-emphasis rounded p-2 small mb-2">
          O chat com {conversa.nome} só abre quando essa pessoa também der match em você. Vá em{" "}
          <strong>Dar Match</strong> e use "Aguardando retribuição" pra simular a resposta.
        </aside>
      )}

      <form className="d-flex gap-2" onSubmit={handleSubmit(aoEnviar)} noValidate>
        <section className="flex-grow-1">
          <input
            type="text"
            className={"form-control" + (errors.texto ? " is-invalid" : "")}
            placeholder={`Mensagem para ${conversa.nome}`}
            disabled={!liberada}
            {...register("texto")}
          />
        </section>
        <button type="submit" className="btn btn-primary" disabled={!liberada}>
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
            <ThreadConversa conversa={conversaAtiva} aoDesfazer={() => setTelaMobile("lista")} />
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
