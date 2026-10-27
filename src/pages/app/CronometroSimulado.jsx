import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePercursos, useAdicionarTempo } from "../../hooks/useCiclaData.js";
import { formatarDuracao } from "../../utils/tempo.js";

const esquema = z
  .object({
    percursoId: z.string().min(1, "Selecione o percurso"),
    percursoPercorrido: z.string().min(1, "Informe o percurso percorrido na simulação"),
    minutos: z
      .number({ error: "Informe os minutos" })
      .int("Use um número inteiro")
      .min(0, "Mínimo 0")
      .max(599, "Máximo 599"),
    segundos: z
      .number({ error: "Informe os segundos" })
      .int("Use um número inteiro")
      .min(0, "Mínimo 0")
      .max(59, "Máximo 59"),
  })
  .refine((dados) => dados.minutos * 60 + dados.segundos > 0, {
    message: "O tempo precisa ser maior que zero",
    path: ["minutos"],
  });

// Modo padrão do cronômetro: sem GPS, sem sensor, sem serviço externo. O
// tempo é digitado (ou cronometrado no relógio da tela) e a verificação do
// percurso compara o percurso SELECIONADO com o percurso "percorrido" da
// simulação: se forem diferentes, o tempo é recusado.
export default function CronometroSimulado() {
  const { data: percursos = [], isLoading, isError } = usePercursos();
  const adicionarMutation = useAdicionarTempo();
  const [mensagem, setMensagem] = useState(null);
  const [rodando, setRodando] = useState(false);

  const intervaloRef = useRef(null);
  const inicioRef = useRef(0);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(esquema),
    defaultValues: { percursoId: "", percursoPercorrido: "", minutos: 0, segundos: 0 },
  });

  useEffect(() => () => clearInterval(intervaloRef.current), []);

  function alternarRelogio() {
    if (rodando) {
      clearInterval(intervaloRef.current);
      setRodando(false);
      return;
    }
    inicioRef.current = Date.now();
    setValue("minutos", 0);
    setValue("segundos", 0);
    intervaloRef.current = setInterval(() => {
      const total = Math.floor((Date.now() - inicioRef.current) / 1000);
      setValue("minutos", Math.floor(total / 60));
      setValue("segundos", total % 60);
    }, 1000);
    setRodando(true);
  }

  async function aoEnviar(dados) {
    setMensagem(null);
    const selecionado = percursos.find((p) => p.id === dados.percursoId);
    if (dados.percursoPercorrido !== dados.percursoId) {
      setMensagem({
        tipo: "erro",
        texto:
          "Percurso divergente: o trajeto simulado não corresponde ao percurso selecionado, " +
          "então o tempo não foi registrado. Escolha o mesmo percurso nos dois campos.",
      });
      return;
    }

    await adicionarMutation.mutateAsync({
      nome: selecionado.nome,
      percursoId: selecionado.id,
      origem: "simulado",
      tempo: formatarDuracao(dados.minutos * 60 + dados.segundos),
      distanciaKm: selecionado.distanciaKm,
    });
    setMensagem({
      tipo: "ok",
      texto: `Tempo registrado em ${selecionado.nome}. Veja em Gerenciar Tempos.`,
    });
    reset();
  }

  if (isLoading) return <p className="text-body-secondary">Carregando percursos...</p>;
  if (isError) {
    return (
      <aside className="bg-light border border-danger text-danger rounded p-2 small">
        Não foi possível carregar os percursos. O json-server está rodando? (npm run mock)
      </aside>
    );
  }

  return (
    <article className="card shadow-sm p-3 cicla-coluna">
      <header className="mb-2">
        <h2 className="h6 fw-bold m-0">Registrar tempo (simulado)</h2>
        <p className="small text-body-secondary m-0">
          Sem GPS: escolha o percurso, informe o tempo (ou use o relógio) e a verificação confere
          se o trajeto simulado bate com o percurso selecionado.
        </p>
      </header>

      <form onSubmit={handleSubmit(aoEnviar)} noValidate>
        <section className="mb-2">
          <label htmlFor="percursoId" className="form-label">Percurso selecionado</label>
          <select
            id="percursoId"
            className={"form-select" + (errors.percursoId ? " is-invalid" : "")}
            {...register("percursoId")}
          >
            <option value="" disabled>Escolha...</option>
            {percursos.map((percurso) => (
              <option key={percurso.id} value={percurso.id}>
                {percurso.nome} ({percurso.distanciaKm} km)
              </option>
            ))}
          </select>
          {errors.percursoId && (
            <p className="invalid-feedback d-block small mb-0">{errors.percursoId.message}</p>
          )}
        </section>

        <section className="mb-2">
          <label htmlFor="percursoPercorrido" className="form-label">
            Percurso percorrido (simulação)
          </label>
          <select
            id="percursoPercorrido"
            className={"form-select" + (errors.percursoPercorrido ? " is-invalid" : "")}
            {...register("percursoPercorrido")}
          >
            <option value="" disabled>Escolha...</option>
            {percursos.map((percurso) => (
              <option key={percurso.id} value={percurso.id}>{percurso.nome}</option>
            ))}
          </select>
          {errors.percursoPercorrido && (
            <p className="invalid-feedback d-block small mb-0">
              {errors.percursoPercorrido.message}
            </p>
          )}
        </section>

        <section className="row g-2 mb-3">
          <section className="col">
            <label htmlFor="minutos" className="form-label">Minutos</label>
            <input
              type="number"
              id="minutos"
              min="0"
              className={"form-control" + (errors.minutos ? " is-invalid" : "")}
              {...register("minutos", { valueAsNumber: true })}
            />
            {errors.minutos && (
              <p className="invalid-feedback d-block small mb-0">{errors.minutos.message}</p>
            )}
          </section>
          <section className="col">
            <label htmlFor="segundos" className="form-label">Segundos</label>
            <input
              type="number"
              id="segundos"
              min="0"
              max="59"
              className={"form-control" + (errors.segundos ? " is-invalid" : "")}
              {...register("segundos", { valueAsNumber: true })}
            />
            {errors.segundos && (
              <p className="invalid-feedback d-block small mb-0">{errors.segundos.message}</p>
            )}
          </section>
        </section>

        <nav className="d-flex gap-2">
          <button
            type="button"
            className={"btn " + (rodando ? "btn-danger" : "btn-outline-primary")}
            onClick={alternarRelogio}
          >
            <span className="material-icons align-middle me-1">
              {rodando ? "stop" : "play_arrow"}
            </span>
            {rodando ? "Parar relógio" : "Usar relógio"}
          </button>
          <button
            type="submit"
            className="btn btn-primary flex-grow-1"
            disabled={isSubmitting || rodando}
          >
            Registrar tempo
          </button>
        </nav>
      </form>

      {mensagem && (
        <aside
          className={
            "bg-light border rounded p-2 small mt-3 " +
            (mensagem.tipo === "erro"
              ? "border-danger text-danger"
              : "border-success text-success")
          }
        >
          {mensagem.texto}
        </aside>
      )}

      {adicionarMutation.isError && (
        <aside className="bg-light border border-danger text-danger rounded p-2 small mt-3">
          Não foi possível registrar o tempo. O json-server está rodando? (npm run mock)
        </aside>
      )}
    </article>
  );
}
