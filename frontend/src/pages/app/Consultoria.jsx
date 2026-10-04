import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useConsultorias, useSolicitarConsultoria } from "../../hooks/useCiclaData.js";

// Especialistas disponíveis pra consultoria — opção de referência, não é
// uma entidade com CRUD próprio (diferente de confrontos, tempos etc.).
const ESPECIALISTAS = [
  "Treinador Marcos Lima",
  "Nutricionista Fernanda Alves",
  "Fisioterapeuta Renato Souza",
];

const ROTULO_STATUS = {
  pendente: { texto: "Aguardando confirmação", cor: "warning" },
  confirmada: { texto: "Confirmada", cor: "primary" },
  concluida: { texto: "Concluída", cor: "dark" },
};

const esquemaConsultoria = z.object({
  especialista: z.string().min(1, "Selecione um especialista"),
  assunto: z.string().min(3, "Descreva brevemente o assunto"),
  data: z.string().min(1, "Escolha uma data"),
});

export default function Consultoria() {
  const { data: consultorias = [], isLoading, isError } = useConsultorias();
  const solicitarMutation = useSolicitarConsultoria();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(esquemaConsultoria) });

  async function aoEnviar(dados) {
    await solicitarMutation.mutateAsync(dados);
    reset();
  }

  return (
    <main className="container py-4">
      <h1 className="h3">Solicitar Consultoria</h1>
      <p className="text-body-secondary">Agende uma consultoria com especialistas.</p>

      <div className="row g-4">
        <section className="col-lg-5">
          <article className="card shadow-sm p-3">
            <h2 className="h6 fw-bold">Nova solicitação</h2>
            <form onSubmit={handleSubmit(aoEnviar)} noValidate>
              <section className="mb-2">
                <label htmlFor="especialista" className="form-label">Especialista</label>
                <select
                  id="especialista"
                  className={"form-select" + (errors.especialista ? " is-invalid" : "")}
                  defaultValue=""
                  {...register("especialista")}
                >
                  <option value="" disabled>Escolha...</option>
                  {ESPECIALISTAS.map((nome) => (
                    <option key={nome} value={nome}>{nome}</option>
                  ))}
                </select>
                {errors.especialista && (
                  <p className="invalid-feedback d-block small mb-0">{errors.especialista.message}</p>
                )}
              </section>

              <section className="mb-2">
                <label htmlFor="assunto" className="form-label">Assunto</label>
                <input
                  type="text"
                  id="assunto"
                  className={"form-control" + (errors.assunto ? " is-invalid" : "")}
                  placeholder="Ex.: melhorar cadência em subidas"
                  {...register("assunto")}
                />
                {errors.assunto && (
                  <p className="invalid-feedback d-block small mb-0">{errors.assunto.message}</p>
                )}
              </section>

              <section className="mb-3">
                <label htmlFor="data-consultoria" className="form-label">Data desejada</label>
                <input
                  type="date"
                  id="data-consultoria"
                  className={"form-control" + (errors.data ? " is-invalid" : "")}
                  {...register("data")}
                />
                {errors.data && (
                  <p className="invalid-feedback d-block small mb-0">{errors.data.message}</p>
                )}
              </section>

              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                Solicitar
              </button>

              {solicitarMutation.isError && (
                <aside className="bg-light border border-danger text-danger rounded p-2 small mt-2">
                  Não foi possível enviar a solicitação. O json-server está rodando? (npm run mock)
                </aside>
              )}
            </form>
          </article>
        </section>

        <section className="col-lg-7">
          <h2 className="h6 fw-bold">Minhas consultorias</h2>

          {isLoading && <p className="text-body-secondary">Carregando...</p>}
          {isError && (
            <aside className="bg-light border border-danger text-danger rounded p-2 small">
              Não foi possível carregar as consultorias. O json-server está rodando? (npm run mock)
            </aside>
          )}

          {!isLoading && !isError && consultorias.length === 0 && (
            <aside className="text-body-secondary">Nenhuma consultoria solicitada ainda.</aside>
          )}

          <section className="d-flex flex-column gap-2">
            {consultorias.map((consultoria) => (
              <article key={consultoria.id} className="card shadow-sm p-3">
                <header className="d-flex justify-content-between align-items-start gap-2">
                  <h3 className="h6 fw-bold m-0">{consultoria.especialista}</h3>
                  <span className={`badge bg-${ROTULO_STATUS[consultoria.status].cor}`}>
                    {ROTULO_STATUS[consultoria.status].texto}
                  </span>
                </header>
                <p className="small text-body-secondary m-0">{consultoria.assunto}</p>
                <p className="small text-body-secondary m-0">Data desejada: {consultoria.data}</p>
              </article>
            ))}
          </section>
        </section>
      </div>
    </main>
  );
}
