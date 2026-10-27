import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useMatches,
  useConfrontos,
  useMarcarConfronto,
  useAtualizarConfronto,
  useConfirmarResultado,
  useCancelarConfronto,
} from "../../hooks/useCiclaData.js";
import { PONTOS_POR_RESULTADO } from "../../api/ciclaApi.js";
import { ehMutuo } from "../../utils/match.js";

// Fluxo com confirmação bilateral. Como só existe uma conta logada por vez,
// os passos que dependem da OUTRA parte têm um botão "Simular: ...".
//
// pendente_aceite_adversario -> a outra pessoa precisa aceitar o convite
// confirmado                 -> ambos aceitaram: já pode registrar o resultado
// resultado_registrado       -> você registrou; a outra pessoa precisa confirmar
// resultado_confirmado       -> as duas partes confirmaram (pontua no Ranking)
// encerrado                  -> confronto concluído
const STATUS = {
  pendente_aceite_adversario: { rotulo: "Aguardando aceite do adversário", cor: "secondary" },
  confirmado: { rotulo: "Confronto autorizado", cor: "primary" },
  resultado_registrado: { rotulo: "Aguardando confirmação do resultado", cor: "warning" },
  resultado_confirmado: { rotulo: "Resultado confirmado", cor: "ciclagrey" },
  encerrado: { rotulo: "Encerrado", cor: "dark" },
};

const esquemaDesafio = z.object({
  adversario: z.string().min(1, "Selecione um ciclista que retribuiu o match"),
});

export default function Confronto() {
  // Só quem retribuiu o match pode ser desafiado.
  const { data: matches = [] } = useMatches();
  const adversarios = matches.filter(ehMutuo);
  const { data: confrontos = [], isLoading, isError } = useConfrontos();
  const marcarMutation = useMarcarConfronto();
  const atualizarMutation = useAtualizarConfronto();
  const confirmarResultadoMutation = useConfirmarResultado();
  const cancelarMutation = useCancelarConfronto();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(esquemaDesafio) });

  async function aoEnviar(dados) {
    await marcarMutation.mutateAsync(dados.adversario);
    reset();
  }

  function simularAceiteDoAdversario(id) {
    atualizarMutation.mutate({ id, dados: { status: "confirmado" } });
  }

  function registrarResultado(id, resultado) {
    atualizarMutation.mutate({ id, dados: { status: "resultado_registrado", resultado } });
  }

  function simularConfirmacaoDoAdversario(confronto) {
    confirmarResultadoMutation.mutate({ id: confronto.id, resultado: confronto.resultado });
  }

  function encerrar(id) {
    atualizarMutation.mutate({ id, dados: { status: "encerrado" } });
  }

  return (
    <main className="container py-4 d-flex flex-column align-items-center">
      <section className="cicla-coluna">
        <header className="mb-4">
          <h1 className="h3 text-center text-lg-start">Confrontos</h1>
          <p className="text-body-secondary m-0">
            Marque desafios com quem retribuiu seu match. Convite e resultado precisam da
            confirmação das duas partes; o resultado confirmado pontua no Ranking (vitória{" "}
            {PONTOS_POR_RESULTADO["Vitória"]}, derrota {PONTOS_POR_RESULTADO["Derrota"]}).
          </p>
        </header>

        <article className="card shadow-sm p-3 mb-4">
          <header className="mb-2">
            <h2 className="h6 fw-bold m-0">Desafiar um match</h2>
          </header>
          <form className="row g-2" onSubmit={handleSubmit(aoEnviar)} noValidate>
            <section className="col-auto flex-grow-1">
              <label htmlFor="select-match" className="visually-hidden">
                Escolha o parceiro de match
              </label>
              <select
                id="select-match"
                className={"form-select" + (errors.adversario ? " is-invalid" : "")}
                defaultValue=""
                {...register("adversario")}
              >
                <option value="">Selecione um ciclista que retribuiu o match...</option>
                {adversarios.map((match) => (
                  <option key={match.id} value={match.nome}>
                    {match.nome}
                  </option>
                ))}
              </select>
              {errors.adversario && (
                <p className="invalid-feedback d-block small mb-0">{errors.adversario.message}</p>
              )}
              {adversarios.length === 0 && (
                <p className="form-text m-0">Ninguém retribuiu seu match ainda.</p>
              )}
            </section>
            <section className="col-auto">
              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                Enviar desafio
              </button>
            </section>
          </form>
        </article>

        {isLoading && <p className="text-body-secondary">Carregando confrontos...</p>}
        {isError && (
          <aside className="bg-light border border-danger text-danger rounded p-2 small">
            Não foi possível carregar os confrontos. O json-server está rodando? (npm run mock)
          </aside>
        )}

        <section className="d-flex flex-column gap-3">
          {confrontos.map((confronto) => {
            const status = STATUS[confronto.status] ?? STATUS.pendente_aceite_adversario;
            return (
              <article
                key={confronto.id}
                className="card shadow-sm p-3 d-flex flex-row flex-wrap align-items-center justify-content-between gap-2"
              >
                <section>
                  <header>
                    <h2 className="h6 fw-bold m-0 d-inline-block me-2">
                      vs. {confronto.adversario}
                    </h2>
                    <span className={`badge bg-${status.cor}`}>{status.rotulo}</span>
                  </header>
                  {confronto.resultado && (
                    <p className="small text-body-secondary m-0 mt-1">
                      Resultado: {confronto.resultado}
                    </p>
                  )}
                </section>

                <nav className="d-flex flex-wrap gap-2">
                  {confronto.status === "pendente_aceite_adversario" && (
                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm"
                      onClick={() => simularAceiteDoAdversario(confronto.id)}
                    >
                      Simular: adversário aceitou
                    </button>
                  )}

                  {confronto.status === "confirmado" && (
                    <>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => registrarResultado(confronto.id, "Vitória")}
                      >
                        Vitória
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => registrarResultado(confronto.id, "Derrota")}
                      >
                        Derrota
                      </button>
                    </>
                  )}

                  {confronto.status === "resultado_registrado" && (
                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm"
                      disabled={confirmarResultadoMutation.isPending}
                      onClick={() => simularConfirmacaoDoAdversario(confronto)}
                    >
                      Simular: adversário confirmou o resultado
                    </button>
                  )}

                  {confronto.status === "resultado_confirmado" && (
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => encerrar(confronto.id)}
                    >
                      Encerrar
                    </button>
                  )}

                  {(confronto.status === "pendente_aceite_adversario" ||
                    confronto.status === "confirmado") && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => cancelarMutation.mutate(confronto.id)}
                    >
                      Cancelar
                    </button>
                  )}
                </nav>
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
}
