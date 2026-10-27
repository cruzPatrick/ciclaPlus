import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  usePasseios,
  useSalvarPasseio,
  useExcluirPasseio,
} from "../../hooks/useCiclaData.js";

const esquemaPasseio = z.object({
  titulo: z.string().trim().min(3, "Dê um nome ao passeio"),
  data: z.string().min(1, "Informe a data"),
  hora: z.string().min(1, "Informe a hora"),
  local: z.string().trim().min(3, "Informe o ponto de encontro"),
});

const VAZIO = { titulo: "", data: "", hora: "", local: "" };

// Manter Passeio: listar, criar, editar e excluir.
export default function Passeios() {
  const { data: passeios = [], isLoading, isError } = usePasseios();
  const salvarMutation = useSalvarPasseio();
  const excluirMutation = useExcluirPasseio();

  // null = criando um passeio novo; id = editando aquele passeio.
  const [editandoId, setEditandoId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(esquemaPasseio), defaultValues: VAZIO });

  async function aoEnviar(dados) {
    await salvarMutation.mutateAsync({ id: editandoId, dados });
    setEditandoId(null);
    reset(VAZIO);
  }

  function iniciarEdicao(passeio) {
    setEditandoId(passeio.id);
    reset({
      titulo: passeio.titulo,
      data: passeio.data,
      hora: passeio.hora,
      local: passeio.local,
    });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    reset(VAZIO);
  }

  function excluir(id) {
    if (id === editandoId) cancelarEdicao();
    excluirMutation.mutate(id);
  }

  return (
    <main className="container py-4">
      <h1 className="h3">Passeios</h1>
      <p className="text-body-secondary">Organize passeios e convide a galera pra pedalar junto.</p>

      <div className="row g-4">
        <section className="col-lg-5">
          <article className="card shadow-sm p-3">
            <h2 className="h6 fw-bold">{editandoId ? "Editar passeio" : "Novo passeio"}</h2>
            <form onSubmit={handleSubmit(aoEnviar)} noValidate>
              <section className="mb-2">
                <label htmlFor="titulo" className="form-label">Nome do passeio</label>
                <input
                  type="text"
                  id="titulo"
                  className={"form-control" + (errors.titulo ? " is-invalid" : "")}
                  placeholder="Ex.: Passeio na orla"
                  {...register("titulo")}
                />
                {errors.titulo && (
                  <p className="invalid-feedback d-block small mb-0">{errors.titulo.message}</p>
                )}
              </section>

              <section className="mb-2">
                <label htmlFor="data-passeio" className="form-label">Data</label>
                <input
                  type="date"
                  id="data-passeio"
                  className={"form-control" + (errors.data ? " is-invalid" : "")}
                  {...register("data")}
                />
                {errors.data && (
                  <p className="invalid-feedback d-block small mb-0">{errors.data.message}</p>
                )}
              </section>

              <section className="mb-2">
                <label htmlFor="hora-passeio" className="form-label">Hora</label>
                <input
                  type="time"
                  id="hora-passeio"
                  className={"form-control" + (errors.hora ? " is-invalid" : "")}
                  {...register("hora")}
                />
                {errors.hora && (
                  <p className="invalid-feedback d-block small mb-0">{errors.hora.message}</p>
                )}
              </section>

              <section className="mb-3">
                <label htmlFor="local" className="form-label">Ponto de encontro</label>
                <input
                  type="text"
                  id="local"
                  className={"form-control" + (errors.local ? " is-invalid" : "")}
                  placeholder="Ex.: Posto 6, Copacabana"
                  {...register("local")}
                />
                {errors.local && (
                  <p className="invalid-feedback d-block small mb-0">{errors.local.message}</p>
                )}
              </section>

              <button type="submit" className="btn btn-primary w-100 mb-2" disabled={isSubmitting}>
                {editandoId ? "Salvar alterações" : "Criar passeio"}
              </button>
              {editandoId && (
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100"
                  onClick={cancelarEdicao}
                >
                  Cancelar edição
                </button>
              )}

              {salvarMutation.isError && (
                <aside className="bg-light border border-danger text-danger rounded p-2 small mt-2">
                  Não foi possível salvar o passeio. O json-server está rodando? (npm run mock)
                </aside>
              )}
            </form>
          </article>
        </section>

        <section className="col-lg-7">
          <h2 className="h6 fw-bold">Meus passeios</h2>

          {isLoading && <p className="text-body-secondary">Carregando passeios...</p>}
          {isError && (
            <aside className="bg-light border border-danger text-danger rounded p-2 small">
              Não foi possível carregar os passeios. O json-server está rodando? (npm run mock)
            </aside>
          )}
          {!isLoading && !isError && passeios.length === 0 && (
            <aside className="text-body-secondary">Nenhum passeio marcado ainda.</aside>
          )}

          <section className="d-flex flex-column gap-2">
            {passeios.map((passeio) => (
              <article
                key={passeio.id}
                className="card shadow-sm p-3 d-flex flex-row align-items-center justify-content-between gap-2"
              >
                <section>
                  <h3 className="h6 fw-bold m-0">{passeio.titulo}</h3>
                  <p className="small text-body-secondary m-0">
                    {passeio.data} às {passeio.hora} · {passeio.local}
                  </p>
                </section>
                <nav className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    aria-label={`Editar passeio ${passeio.titulo}`}
                    onClick={() => iniciarEdicao(passeio)}
                  >
                    <span className="material-icons align-middle">edit</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    aria-label={`Excluir passeio ${passeio.titulo}`}
                    onClick={() => excluir(passeio.id)}
                  >
                    <span className="material-icons align-middle">delete</span>
                  </button>
                </nav>
              </article>
            ))}
          </section>
        </section>
      </div>
    </main>
  );
}
