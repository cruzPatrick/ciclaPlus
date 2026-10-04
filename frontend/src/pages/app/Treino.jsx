import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useTreinos,
  useEquipes,
  useMarcarTreino,
  useAlternarTreinoFeito,
} from "../../hooks/useCiclaData.js";

// Página única de Treino: a escolha entre Individual e Equipe é uma aba
// dentro da própria página (era uma rota / menu separado antes).

const RATULO_TIPO = { individual: "Individual", equipe: "Equipe" };

const esquemaIndividual = z.object({
  data: z.string().min(1, "Informe a data"),
  hora: z.string().min(1, "Informe a hora"),
});

const esquemaEquipe = z.object({
  equipe: z.string().min(1, "Selecione a equipe"),
  data: z.string().min(1, "Informe a data"),
  hora: z.string().min(1, "Informe a hora"),
});

function FormularioIndividual({ onAgendar }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(esquemaIndividual) });

  async function aoEnviar(dados) {
    await onAgendar({ ...dados, tipo: "individual", equipe: null, feito: false });
    reset();
  }

  return (
    <form onSubmit={handleSubmit(aoEnviar)} noValidate>
      <section className="mb-2">
        <label htmlFor="data" className="form-label">Data</label>
        <input
          type="date"
          id="data"
          className={"form-control" + (errors.data ? " is-invalid" : "")}
          {...register("data")}
        />
        {errors.data && <p className="invalid-feedback d-block small mb-0">{errors.data.message}</p>}
      </section>
      <section className="mb-3">
        <label htmlFor="hora" className="form-label">Hora</label>
        <input
          type="time"
          id="hora"
          className={"form-control" + (errors.hora ? " is-invalid" : "")}
          {...register("hora")}
        />
        {errors.hora && <p className="invalid-feedback d-block small mb-0">{errors.hora.message}</p>}
      </section>
      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        Agendar
      </button>
    </form>
  );
}

function FormularioEquipe({ equipes, onAgendar }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(esquemaEquipe) });

  async function aoEnviar(dados) {
    await onAgendar({ ...dados, tipo: "equipe", feito: false });
    reset();
  }

  return (
    <form onSubmit={handleSubmit(aoEnviar)} noValidate>
      <section className="mb-2">
        <label htmlFor="equipe" className="form-label">Selecione a equipe</label>
        <select
          id="equipe"
          className={"form-select" + (errors.equipe ? " is-invalid" : "")}
          defaultValue=""
          {...register("equipe")}
        >
          <option value="" disabled>Escolha...</option>
          {equipes.map((equipe) => (
            <option key={equipe.id} value={equipe.nome}>{equipe.nome}</option>
          ))}
        </select>
        {errors.equipe && <p className="invalid-feedback d-block small mb-0">{errors.equipe.message}</p>}
      </section>
      <section className="mb-2">
        <label htmlFor="data-equipe" className="form-label">Data</label>
        <input
          type="date"
          id="data-equipe"
          className={"form-control" + (errors.data ? " is-invalid" : "")}
          {...register("data")}
        />
        {errors.data && <p className="invalid-feedback d-block small mb-0">{errors.data.message}</p>}
      </section>
      <section className="mb-3">
        <label htmlFor="hora-equipe" className="form-label">Hora</label>
        <input
          type="time"
          id="hora-equipe"
          className={"form-control" + (errors.hora ? " is-invalid" : "")}
          {...register("hora")}
        />
        {errors.hora && <p className="invalid-feedback d-block small mb-0">{errors.hora.message}</p>}
      </section>
      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        Agendar
      </button>
    </form>
  );
}

export default function Treino() {
  // O tipo fica na URL (?tipo=individual|equipe): sobrevive a F5, dá pra
  // compartilhar o link já com o tipo certo e as rotas antigas
  // (/app/treino-individual e /app/treino-equipe) redirecionam pra cá.
  const [searchParams, setSearchParams] = useSearchParams();
  const tipo = searchParams.get("tipo") === "equipe" ? "equipe" : "individual";

  const { data: treinosMarcados = [], isLoading, isError } = useTreinos();
  const { data: equipes = [] } = useEquipes();
  const marcarMutation = useMarcarTreino();
  const alternarFeitoMutation = useAlternarTreinoFeito();

  function escolherTipo(novoTipo) {
    // replace: trocar de aba não enche o histórico do navegador.
    setSearchParams({ tipo: novoTipo }, { replace: true });
  }

  function alternarFeito(treino) {
    alternarFeitoMutation.mutate({ id: treino.id, feito: !treino.feito });
  }

  return (
    <main className="container py-4">
      <h1 className="h3">Treino</h1>

      <ul className="nav nav-pills gap-2 mb-4">
        <li className="nav-item">
          <button
            type="button"
            className={"nav-link" + (tipo === "individual" ? " active" : "")}
            aria-pressed={tipo === "individual"}
            onClick={() => escolherTipo("individual")}
          >
            Individual
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={"nav-link" + (tipo === "equipe" ? " active" : "")}
            aria-pressed={tipo === "equipe"}
            onClick={() => escolherTipo("equipe")}
          >
            Em equipe
          </button>
        </li>
      </ul>

      <div className="row g-4">
        <section className="col-lg-4">
          {tipo === "individual" ? (
            <FormularioIndividual onAgendar={(dados) => marcarMutation.mutateAsync(dados)} />
          ) : (
            <FormularioEquipe
              equipes={equipes}
              onAgendar={(dados) => marcarMutation.mutateAsync(dados)}
            />
          )}
          {marcarMutation.isError && (
            <aside className="bg-light border border-danger text-danger rounded p-2 small mt-2">
              Não foi possível agendar. O json-server está rodando? (npm run mock)
            </aside>
          )}
        </section>

        <section className="col-lg-8">
          <h2 className="h5 mb-3">Marcados</h2>

          {isLoading && <p className="text-body-secondary">Carregando treinos marcados...</p>}
          {isError && (
            <aside className="bg-light border border-danger text-danger rounded p-2 small">
              Não foi possível carregar os treinos. O json-server está rodando? (npm run mock)
            </aside>
          )}

          {!isLoading && !isError && (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Hora</th>
                  <th>Tipo</th>
                  <th>Feito</th>
                </tr>
              </thead>
              <tbody>
                {treinosMarcados.map((treino) => (
                  <tr key={treino.id}>
                    <td>{treino.data}</td>
                    <td>{treino.hora}</td>
                    <td>{RATULO_TIPO[treino.tipo]}</td>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={treino.feito}
                        onChange={() => alternarFeito(treino)}
                        aria-label={`Marcar treino de ${treino.data} como feito`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
}
