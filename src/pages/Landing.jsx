import { Link } from "react-router-dom";

export default function Landing() {
  // Blocos de destaque como variável local do componente.
  const destaques = [
    {
      titulo: "Descubra parceiros de pedal",
      texto: "Encontre ciclistas perto de você e combine seu próximo treino.",
    },
    {
      titulo: "Acompanhe seu desempenho",
      texto: "Cronometre treinos, registre tempos e veja sua evolução.",
    },
    {
      titulo: "Suba no ranking",
      texto: "Compare pontuação e tempos com outros ciclistas da comunidade.",
    },
  ];

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand">Cicla+</span>
          <div className="d-flex gap-2 ms-auto">
            <Link to="/login" className="btn btn-outline-light btn-sm">
              Fazer login
            </Link>
            <Link to="/cadastro" className="btn btn-light btn-sm">
              Inscreva-se
            </Link>
          </div>
        </div>
      </nav>

      <header className="bg-primary text-white text-center py-5">
        <div className="container">
          <h1 className="display-5 fw-bold">Motivação garantida pela comunidade</h1>
          <p className="lead">
            Encontre parceiros de pedal, acompanhe seu progresso e suba no
            ranking. É grátis.
          </p>
          <Link to="/cadastro" className="btn btn-light btn-lg mt-2">
            Junte-se a nós agora
          </Link>
        </div>
      </header>

      <main className="container py-5">
        <div className="row g-4">
          {destaques.map((destaque) => (
            <div className="col-md-4" key={destaque.titulo}>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h2 className="h5 text-primary">{destaque.titulo}</h2>
                  <p className="card-text">{destaque.texto}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-secondary text-white text-center py-3">
        <p className="m-0 small">&copy; 2026 Cicla+. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}
