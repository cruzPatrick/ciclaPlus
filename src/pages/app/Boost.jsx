import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePerfilUsuario, useAtualizarPerfil } from "../../hooks/useCiclaData.js";
import { usuarioLogadoId } from "../../api/sessao.js";

const DURACOES = [
  { valor: "1", rotulo: "1 hora" },
  { valor: "24", rotulo: "24 horas" },
  { valor: "168", rotulo: "7 dias" },
];

const esquemaBoost = z.object({
  horas: z.enum(["1", "24", "168"], { error: "Escolha por quanto tempo" }),
});

// Fora do componente: é chamado só no clique, nunca durante a renderização.
function daquiAHoras(horas) {
  return new Date(Date.now() + horas * 3600 * 1000).toISOString();
}

function boostAtivo(conta) {
  return Boolean(conta?.boostAte) && new Date(conta.boostAte) > new Date();
}

// Boost: destaca o seu perfil na fila de sugestões dos outros ciclistas.
// Demonstração: não existe cobrança nem pagamento real.
export default function Boost() {
  const usuarioId = usuarioLogadoId();
  const { data: conta, isLoading, isError } = usePerfilUsuario(usuarioId);
  const atualizarMutation = useAtualizarPerfil(usuarioId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(esquemaBoost), defaultValues: { horas: "24" } });

  async function ativar({ horas }) {
    await atualizarMutation.mutateAsync({ boostAte: daquiAHoras(Number(horas)) });
  }

  function desativar() {
    atualizarMutation.mutate({ boostAte: null });
  }

  if (isLoading) {
    return (
      <main className="container py-4">
        <h1 className="h3">Boost</h1>
        <p className="text-body-secondary">Carregando...</p>
      </main>
    );
  }

  if (isError || !conta) {
    return (
      <main className="container py-4">
        <h1 className="h3">Boost</h1>
        <aside className="bg-light border border-danger text-danger rounded p-2 small">
          Não foi possível carregar seu perfil. O json-server está rodando? (npm run mock)
        </aside>
      </main>
    );
  }

  const ativo = boostAtivo(conta);

  return (
    <main className="container py-4">
      <h1 className="h3">Boost</h1>
      <p className="text-body-secondary">
        Dê um empurrão no seu perfil: com o Boost ligado, você aparece na frente da fila de
        sugestões. É só uma demonstração — nenhuma cobrança é feita.
      </p>

      <div className="row g-4">
        <section className="col-lg-5">
          <article className="card shadow-sm p-3">
            <header className="d-flex justify-content-between align-items-center mb-2">
              <h2 className="h6 fw-bold m-0">Seu Boost</h2>
              <span className={"badge " + (ativo ? "bg-primary" : "bg-secondary")}>
                {ativo ? "Ativo" : "Desligado"}
              </span>
            </header>

            {ativo ? (
              <>
                <p className="small text-body-secondary">
                  Ativo até {new Date(conta.boostAte).toLocaleString("pt-BR")}.
                </p>
                <button
                  type="button"
                  className="btn btn-outline-danger w-100"
                  disabled={atualizarMutation.isPending}
                  onClick={desativar}
                >
                  Desligar Boost
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit(ativar)} noValidate>
                <section className="mb-3">
                  <label htmlFor="horas" className="form-label">Duração</label>
                  <select
                    id="horas"
                    className={"form-select" + (errors.horas ? " is-invalid" : "")}
                    {...register("horas")}
                  >
                    {DURACOES.map((duracao) => (
                      <option key={duracao.valor} value={duracao.valor}>
                        {duracao.rotulo}
                      </option>
                    ))}
                  </select>
                  {errors.horas && (
                    <p className="invalid-feedback d-block small mb-0">{errors.horas.message}</p>
                  )}
                </section>
                <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                  Ativar Boost (grátis)
                </button>
              </form>
            )}

            {atualizarMutation.isError && (
              <aside className="bg-light border border-danger text-danger rounded p-2 small mt-2">
                Não foi possível atualizar o Boost. O json-server está rodando? (npm run mock)
              </aside>
            )}
          </article>
        </section>

        <section className="col-lg-7">
          <h2 className="h6 fw-bold">Como os outros te veem</h2>
          <article className="card shadow-sm p-3 text-center">
            <figure className="rounded-circle bg-ciclagrey d-flex align-items-center justify-content-center mx-auto mb-2 cicla-avatar">
              <span className="material-icons">person</span>
            </figure>
            {ativo && <span className="badge bg-primary mx-auto mb-1">Destaque (Boost)</span>}
            <h3 className="h5 mb-1">{conta.nome}</h3>
            <p className="small text-body-secondary m-0">
              {ativo
                ? "Seu perfil entra na frente da fila de sugestões."
                : "Seu perfil aparece na ordem normal da fila."}
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
