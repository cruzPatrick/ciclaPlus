import { useState, useRef, useEffect } from "react";

function CardCandidato({ candidato, onAvaliar, isMobile }) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const touchStartRef = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e) => {
    if (!isMobile) return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !isMobile) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = () => {
    if (!isDragging || !isMobile) return;
    setIsDragging(false);

    const threshold = 100;

    if (dragOffset.x > threshold) {
      onAvaliar(candidato.id, "match");
    } else if (dragOffset.x < -threshold) {
      onAvaliar(candidato.id, "passou");
    }

    setDragOffset({ x: 0, y: 0 });
  };

  const rotation = isMobile ? dragOffset.x * 0.1 : 0;
  const opacityMatch = isMobile ? Math.min(dragOffset.x / 100, 1) : 0;
  const opacityPass = isMobile ? Math.min(-dragOffset.x / 100, 1) : 0;

  return (
    <article
      className="card h-100 shadow-sm position-relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: isMobile
          ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotation}deg)`
          : "none",
        transition: isDragging ? "none" : "transform 0.3s ease",
        cursor: isMobile ? "grab" : "default",
        userSelect: "none",
        touchAction: "pan-y",
      }}
    >
      {isMobile && opacityMatch > 0 && (
        <aside
          className="position-absolute top-0 start-0 m-3 px-3 py-1 border border-success text-success fw-bold rounded"
          style={{
            opacity: opacityMatch,
            transform: "rotate(-15deg)",
            zIndex: 10,
            borderWidth: "3px",
          }}
        >
          MATCH
        </aside>
      )}

      {isMobile && opacityPass > 0 && (
        <aside
          className="position-absolute top-0 end-0 m-3 px-3 py-1 border border-danger text-danger fw-bold rounded"
          style={{
            opacity: opacityPass,
            transform: "rotate(15deg)",
            zIndex: 10,
            borderWidth: "3px",
          }}
        >
          PASSAR
        </aside>
      )}

      <section className="card-body text-center">
        <figure
          className="rounded-circle bg-ciclagrey d-flex align-items-center justify-content-center mx-auto mb-2"
          style={{ width: "72px", height: "72px" }}
        >
          <span className="material-icons" style={{ fontSize: "36px" }}>
            person
          </span>
        </figure>
        <header>
          <h2 className="h5 mb-1">{candidato.nome}</h2>
          <p className="small text-body-secondary mb-3">
            {candidato.tipo} · {candidato.distanciaKm} km
          </p>
        </header>

        <nav className="d-flex justify-content-center gap-3">
          <button
            type="button"
            className="btn btn-outline-secondary rounded-circle"
            style={{ width: "48px", height: "48px" }}
            aria-label={`Passar de ${candidato.nome}`}
            onClick={() => onAvaliar(candidato.id, "passou")}
          >
            <span className="material-icons">close</span>
          </button>
          <button
            type="button"
            className="btn btn-primary rounded-circle"
            style={{ width: "48px", height: "48px" }}
            aria-label={`Dar match em ${candidato.nome}`}
            onClick={() => onAvaliar(candidato.id, "match")}
          >
            <span className="material-icons">favorite</span>
          </button>
        </nav>
      </section>
    </article>
  );
}

export default function Descoberta() {
  const [candidatos, setCandidatos] = useState([
    { id: 1, nome: "Ana Beatriz", distanciaKm: 3.2, tipo: "Estrada", status: "pendente" },
    { id: 2, nome: "Bruno Costa", distanciaKm: 5.8, tipo: "Mountain bike", status: "pendente" },
    { id: 3, nome: "Camila Rocha", distanciaKm: 1.4, tipo: "Urbano", status: "pendente" },
  ]);

  const [mostrarInstrucao, setMostrarInstrucao] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMostrarInstrucao(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const pendentes = candidatos.filter((c) => c.status === "pendente");

  function avaliar(id, status) {
    setCandidatos((atual) =>
      atual.map((candidato) => (candidato.id === id ? { ...candidato, status } : candidato))
    );
  }

  return (
    <main className="container py-4">
      <header>
        <h1 className="h3">Dar Match</h1>
        <p>Encontre outros ciclistas e dê Match!</p>
      </header>

      {pendentes.length === 0 ? (
        <aside className="text-body-secondary">Sem novos ciclistas por perto no momento.</aside>
      ) : (
        <section>
          <section className="d-lg-none mx-auto" style={{ maxWidth: "300px" }}>
            <CardCandidato candidato={pendentes[0]} onAvaliar={avaliar} isMobile={true} />
            
            {mostrarInstrucao && (
              <aside className="text-center text-body-secondary small mt-3">
                👈 Arraste para passar | Arraste para dar match 👉
              </aside>
            )}
          </section>

          <section className="d-none d-lg-flex flex-wrap gap-3">
            {pendentes.map((candidato) => (
              <section key={candidato.id} style={{ width: "220px" }}>
                <CardCandidato candidato={candidato} onAvaliar={avaliar} isMobile={false} />
              </section>
            ))}
          </section>
        </section>
      )}
    </main>
  );
}