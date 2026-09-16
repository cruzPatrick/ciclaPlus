export default function TreinoEquipe() {
  const equipes = ["Equipe 1", "Equipe 2"];

  return (
    <main className="container py-4">
      <h1 className="h3">Marcar Treino em Equipe</h1>
      <form className="row g-2" style={{ maxWidth: "640px" }}>
        <div className="col-auto">
          <label htmlFor="equipe" className="form-label">Selecione a equipe</label>
          <select id="equipe" name="equipe" className="form-select">
            {equipes.map((equipe) => (
              <option key={equipe}>{equipe}</option>
            ))}
          </select>
        </div>
        <div className="col-auto">
          <label htmlFor="data-equipe" className="form-label">Data</label>
          <input type="date" id="data-equipe" name="data-equipe" className="form-control" />
        </div>
        <div className="col-auto">
          <label htmlFor="hora-equipe" className="form-label">Hora</label>
          <input type="time" id="hora-equipe" name="hora-equipe" className="form-control" />
        </div>
        <div className="col-auto d-flex align-items-end">
          <button type="submit" className="btn btn-primary">Agendar</button>
        </div>
      </form>
    </main>
  );
}
