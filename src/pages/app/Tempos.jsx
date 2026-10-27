import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useTempos,
  useExcluirTempo,
  useAtualizarTempo,
} from "../../hooks/useCiclaData.js";
import { normalizarTempo } from "../../utils/tempo.js";

// Aceita "MM:SS" ou "HH:MM:SS".
const esquemaEdicao = z.object({
  nome: z.string().trim().min(2, "Informe o nome do trajeto"),
  tempo: z
    .string()
    .trim()
    .regex(/^(\d{1,2}:)?[0-5]?\d:[0-5]\d$/, "Use o formato MM:SS ou HH:MM:SS"),
});

function EditarTempo({ item, onFechar }) {
  const atualizarMutation = useAtualizarTempo();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(esquemaEdicao),
    defaultValues: { nome: item.nome, tempo: item.tempo },
  });

  async function salvar(dados) {
    await atualizarMutation.mutateAsync({
      id: item.id,
      dados: { nome: dados.nome, tempo: normalizarTempo(dados.tempo) },
    });
    onFechar();
  }

  return (
    <form className="row g-2 w-100" onSubmit={handleSubmit(salvar)} noValidate>
      <section className="col-12 col-md-6">
        <label htmlFor={`nome-${item.id}`} className="visually-hidden">Nome do trajeto</label>
        <input
          id={`nome-${item.id}`}
          type="text"
          className={"form-control form-control-sm" + (errors.nome ? " is-invalid" : "")}
          {...register("nome")}
        />
        {errors.nome && <p className="invalid-feedback d-block small mb-0">{errors.nome.message}</p>}
      </section>
      <section className="col-6 col-md-3">
        <label htmlFor={`tempo-${item.id}`} className="visually-hidden">Tempo</label>
        <input
          id={`tempo-${item.id}`}
          type="text"
          className={"form-control form-control-sm" + (errors.tempo ? " is-invalid" : "")}
          placeholder="MM:SS"
          {...register("tempo")}
        />
        {errors.tempo && <p className="invalid-feedback d-block small mb-0">{errors.tempo.message}</p>}
      </section>
      <nav className="col-6 col-md-3 d-flex gap-1">
        <button type="submit" className="btn btn-primary btn-sm flex-grow-1" disabled={isSubmitting}>
          Salvar
        </button>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onFechar}>
          Cancelar
        </button>
      </nav>
    </form>
  );
}

export default function Tempos() {
  // Os tempos vêm do json-server. Um tempo novo só nasce no Cronômetro
  // (simulado ou GPS), com percurso verificado — não existe um formulário
  // aqui pra criar tempo do zero. Aqui dá pra listar, buscar, editar e
  // excluir.
  const { data: trajetos = [], isLoading, isError } = useTempos();
  const excluirMutation = useExcluirTempo();

  const [pesquisa, setPesquisa] = useState("");
  const [modoEdicao, setModoEdicao] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const trajetosFiltrados = trajetos.filter((t) =>
    t.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  function alternarModoEdicao() {
    setModoEdicao((prev) => !prev);
    setEditandoId(null);
  }

  if (isLoading) {
    return (
      <main className="container py-4">
        <h1 className="h3">Gerenciar Tempo</h1>
        <p className="text-body-secondary">Carregando tempos registrados...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="container py-4">
        <h1 className="h3">Gerenciar Tempo</h1>
        <aside className="bg-light border border-danger text-danger rounded p-2 small">
          Não foi possível carregar os tempos. O json-server está rodando? (npm run mock)
        </aside>
      </main>
    );
  }

  const botaoModoEdicao = (
    <>
      <span className="material-icons">{modoEdicao ? "check" : "edit"}</span>
      {modoEdicao ? "Concluir" : "Editar"}
    </>
  );

  return (
    <main className="container py-4 d-flex flex-column align-items-center">
      <section className="cicla-coluna">
        <header className="mb-4">
          <h1 className="h3 text-center text-lg-start">Gerenciar Tempo</h1>
        </header>

        <nav className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
          <form
            className="d-flex gap-2 flex-grow-1 cicla-busca"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="search"
              className="form-control"
              placeholder="Pesquisar..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              aria-label="Pesquisar trajeto"
            />
            <button
              type="submit"
              className="btn btn-outline-primary d-flex align-items-center justify-content-center px-3"
              aria-label="Buscar"
            >
              <span className="material-icons">search</span>
            </button>
          </form>

          <button
            type="button"
            className={
              "btn d-none d-lg-inline-flex align-items-center gap-1 " +
              (modoEdicao ? "btn-primary" : "btn-outline-primary")
            }
            onClick={alternarModoEdicao}
          >
            {botaoModoEdicao}
          </button>
        </nav>

        {trajetosFiltrados.length === 0 ? (
          <aside className="bg-light border text-center text-body-secondary rounded p-4">
            Nenhum trajeto encontrado.
          </aside>
        ) : (
          <section className="d-flex flex-column gap-3 mb-4">
            {trajetosFiltrados.map((item) => (
              <article
                key={item.id}
                className="card shadow-sm border p-3 d-flex flex-row flex-wrap align-items-center justify-content-between gap-2"
              >
                {editandoId === item.id ? (
                  <EditarTempo item={item} onFechar={() => setEditandoId(null)} />
                ) : (
                  <>
                    <header className="me-3">
                      <h2 className="h6 m-0 fw-bold">{item.nome}</h2>
                      <p className="small text-body-secondary m-0">
                        {item.origem === "gps" ? "GPS" : "Simulado"}
                      </p>
                    </header>

                    <section className="d-flex align-items-center gap-2">
                      <p className="m-0 text-end text-body-secondary fs-6 fw-medium">
                        {item.tempo} / {item.distanciaKm} km
                      </p>

                      {modoEdicao && (
                        <>
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm p-1 d-flex align-items-center justify-content-center"
                            aria-label={`Editar trajeto ${item.nome}`}
                            onClick={() => setEditandoId(item.id)}
                          >
                            <span className="material-icons">edit</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm p-1 d-flex align-items-center justify-content-center"
                            aria-label={`Excluir trajeto ${item.nome}`}
                            onClick={() => excluirMutation.mutate(item.id)}
                          >
                            <span className="material-icons">delete</span>
                          </button>
                        </>
                      )}
                    </section>
                  </>
                )}
              </article>
            ))}
          </section>
        )}

        <footer className="d-flex justify-content-end d-lg-none mt-3">
          <button
            type="button"
            className={
              "btn d-inline-flex align-items-center gap-1 shadow-sm " +
              (modoEdicao ? "btn-primary" : "btn-outline-primary")
            }
            onClick={alternarModoEdicao}
          >
            {botaoModoEdicao}
          </button>
        </footer>
      </section>
    </main>
  );
}
