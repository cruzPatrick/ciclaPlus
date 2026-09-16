export default function TreinoIndividual() {
  return (
    <main className="container py-4">
      <h1 className="h3">Marcar Treino Individual</h1>
      <form className="row g-2" style={{ maxWidth: "480px" }}>
        <div className="col-auto">
          <label htmlFor="data" className="form-label">Data</label>
          <input type="date" id="data" name="data" className="form-control" />
        </div>
        <div className="col-auto">
          <label htmlFor="hora" className="form-label">Hora</label>
          <input type="time" id="hora" name="hora" className="form-control" />
        </div>
        <div className="col-auto d-flex align-items-end">
          <button type="submit" className="btn btn-primary">Agendar</button>
        </div>
      </form>
    </main>
  );
}
