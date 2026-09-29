import { useState } from "react";

// Estados do confronto com fluxo de dupla confirmação:
// pendente_aceite_adversario -> aguarda o outro aceitar
// pendente_meu_aceite -> aguarda a sua aceitação
// confirmado -> ambos aceitaram (autorizado para disputar)
// resultado_registrado -> tempo/resultado enviado
// encerrado -> confronto concluído
const STATUS = {
  pendente_aceite_adversario: { rotulo: "Aguardando adversário", cor: "secondary" },
  pendente_meu_aceite: { rotulo: "Aguardando seu aceite", cor: "warning" },
  confirmado: { rotulo: "Confronto Autorizado", cor: "primary" },
  resultado_registrado: { rotulo: "Resultado registrado", cor: "ciclagrey" },
  encerrado: { rotulo: "Encerrado", cor: "dark" },
};

export default function Confronto() {
  // Lista simulada de utilizadores com quem deu MATCH na aba "Dar Match"
  const [minhosMatches] = useState([
    { id: 101, nome: "Ana Beatriz" },
    { id: 102, nome: "Bruno Costa" },
    { id: 103, nome: "Camila Rocha" },
  ]);

  // Lista local de confrontos
  const [confrontos, setConfrontos] = useState([
    { id: 1, adversario: "Ana Beatriz", status: "confirmado", resultado: null },
    { id: 2, adversario: "Bruno Costa", status: "pendente_meu_aceite", resultado: null },
    { id: 3, adversario: "Camila Rocha", status: "pendente_aceite_adversario", resultado: null },
  ]);

  const [adversarioSelecionado, setAdversarioSelecionado] = useState("");

  function marcarConfronto(evento) {
    evento.preventDefault();
    if (!adversarioSelecionado) return;

    setConfrontos((atual) => [
      ...atual,
      {
        id: Date.now(),
        adversario: adversarioSelecionado,
        status: "pendente_aceite_adversario",
        resultado: null,
      },
    ]);
    setAdversarioSelecionado("");
  }

  function aceitarDesafio(id) {
    setConfrontos((atual) =>
      atual.map((c) => (c.id === id ? { ...c, status: "confirmado" } : c))
    );
  }

  function registrarResultado(id, resultado) {
    setConfrontos((atual) =>
      atual.map((c) =>
        c.id === id ? { ...c, status: "resultado_registrado", resultado } : c
      )
    );
  }

  function confirmarEncerramento(id) {
    setConfrontos((atual) =>
      atual.map((c) => (c.id === id ? { ...c, status: "encerrado" } : c))
    );
  }

  return (
    <main className="container py-4 d-flex flex-column align-items-center">
      <section className="w-100" style={{ maxWidth: "720px" }}>
        <header className="mb-4">
          <h1 className="h3 text-center text-lg-start">Confrontos</h1>
          <p className="text-body-secondary m-0">
            Marque desafios com os seus matches. Ambas as partes precisam de aceitar para autorizar o confronto!
          </p>
        </header>

        {/* Formulário alimentado APENAS pelos ciclistas com quem deu MATCH */}
        <article className="card shadow-sm p-3 mb-4">
          <header className="mb-2">
            <h2 className="h6 fw-bold m-0">Desafiar um Match</h2>
          </header>
          <form className="row g-2" onSubmit={marcarConfronto}>
            <section className="col-auto flex-grow-1">
              <label htmlFor="select-match" className="visually-hidden">
                Escolha o parceiro de match
              </label>
              <select
                id="select-match"
                className="form-select"
                value={adversarioSelecionado}
                onChange={(e) => setAdversarioSelecionado(e.target.value)}
                required
              >
                <option value="">Selecione um ciclista que deu match...</option>
                {minhosMatches.map((match) => (
                  <option key={match.id} value={match.nome}>
                    {match.nome}
                  </option>
                ))}
              </select>
            </section>
            <section className="col-auto">
              <button type="submit" className="btn btn-primary w-100">
                Enviar Desafio
              </button>
            </section>
          </form>
        </article>

        {/* Lista dos Confrontos */}
        <section className="d-flex flex-column gap-3">
          {confrontos.map((confronto) => (
            <article
              key={confronto.id}
              className="card shadow-sm p-3 d-flex flex-row flex-wrap align-items-center justify-content-between gap-2"
            >
              <section>
                <header>
                  <h2 className="h6 fw-bold m-0 d-inline-block me-2">
                    vs. {confronto.adversario}
                  </h2>
                  <span className={`badge bg-${STATUS[confronto.status].cor}`}>
                    {STATUS[confronto.status].rotulo}
                  </span>
                </header>
                {confronto.resultado && (
                  <p className="small text-body-secondary m-0 mt-1">
                    Resultado: {confronto.resultado}
                  </p>
                )}
              </section>

              <nav className="d-flex gap-2">
                {/* Se o adversário me desafiou, exibe o botão para eu aceitar */}
                {confronto.status === "pendente_meu_aceite" && (
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={() => aceitarDesafio(confronto.id)}
                  >
                    Aceitar Confronto
                  </button>
                )}

                {/* Apenas quando AMBOS aceitam (status: confirmado) permite registar o resultado */}
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
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => confirmarEncerramento(confronto.id)}
                  >
                    Encerrar
                  </button>
                )}
              </nav>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}