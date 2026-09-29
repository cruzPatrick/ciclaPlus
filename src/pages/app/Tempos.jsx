import { useState } from "react";

export default function Tempos() {
  // Lista de tempos/trajetos em memória local
  const [trajetos, setTrajetos] = useState([
    { id: 1, nome: "Ciclovia da Orla", tempo: "00:18:42", distanciaKm: 8.5 },
    { id: 2, nome: "Volta do Parque Central", tempo: "00:12:05", distanciaKm: 5.2 },
    { id: 3, nome: "Trilha da Montanha", tempo: "00:45:30", distanciaKm: 14.1 },
    { id: 4, nome: "Percurso Urbano Centro", tempo: "00:22:15", distanciaKm: 9.0 },
  ]);

  const [pesquisa, setPesquisa] = useState("");
  const [modoEdicao, setModoEdicao] = useState(false);

  // Filtra trajetos pelo nome digitado
  const trajetosFiltrados = trajetos.filter((t) =>
    t.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  function excluirTrajeto(id) {
    setTrajetos((atual) => atual.filter((item) => item.id !== id));
  }

  return (
    <main className="container py-4 d-flex flex-column align-items-center">
      <section className="w-100" style={{ maxWidth: "720px" }}>
        <header className="mb-4">
          <h1 className="h3 text-center text-lg-start">Gerenciar Tempo</h1>
        </header>

        {/* Controles do topo: Pesquisa e Botão Editar (no Desktop) */}
        <nav className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
          <form
            className="d-flex gap-2 flex-grow-1"
            style={{ maxWidth: "420px" }}
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

          {/* Botão Editar visível no Desktop à direita */}
          <button
            type="button"
            className={
              "btn d-none d-lg-inline-flex align-items-center gap-1 " +
              (modoEdicao ? "btn-primary" : "btn-outline-primary")
            }
            onClick={() => setModoEdicao((prev) => !prev)}
          >
            <span className="material-icons" style={{ fontSize: "20px" }}>
              {modoEdicao ? "check" : "edit"}
            </span>
            {modoEdicao ? "Concluir" : "Editar"}
          </button>
        </nav>

        {/* Lista de Trajetos */}
        {trajetosFiltrados.length === 0 ? (
          <aside className="bg-light border text-center text-body-secondary rounded p-4">
            Nenhum trajeto encontrado.
          </aside>
        ) : (
          <section className="d-flex flex-column gap-3 mb-4">
            {trajetosFiltrados.map((item) => (
              <article
                key={item.id}
                className="card shadow-sm border p-3 d-flex flex-row align-items-center justify-content-between"
              >
                <header className="me-3">
                  <h2 className="h6 m-0 fw-bold">{item.nome}</h2>
                </header>

                <section className="d-flex align-items-center gap-3">
                  <p className="m-0 text-end text-body-secondary fs-6 fw-medium">
                    {item.tempo} / {item.distanciaKm} km
                  </p>

                  {modoEdicao && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm p-1 d-flex align-items-center justify-content-center"
                      aria-label={`Excluir trajeto ${item.nome}`}
                      onClick={() => excluirTrajeto(item.id)}
                    >
                      <span className="material-icons" style={{ fontSize: "18px" }}>
                        delete
                      </span>
                    </button>
                  )}
                </section>
              </article>
            ))}
          </section>
        )}

        {/* Botão Editar visível no Mobile na parte inferior à direita */}
        <footer className="d-flex justify-content-end d-lg-none mt-3">
          <button
            type="button"
            className={
              "btn d-inline-flex align-items-center gap-1 shadow-sm " +
              (modoEdicao ? "btn-primary" : "btn-outline-primary")
            }
            onClick={() => setModoEdicao((prev) => !prev)}
          >
            <span className="material-icons" style={{ fontSize: "20px" }}>
              {modoEdicao ? "check" : "edit"}
            </span>
            {modoEdicao ? "Concluir" : "Editar"}
          </button>
        </footer>
      </section>
    </main>
  );
}