import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePerfilUsuario, useAtualizarPerfil } from "../../hooks/useCiclaData.js";
import { usuarioLogadoId, limparSessao } from "../../api/sessao.js";

const esquemaConta = z.object({
  nome: z.string().min(2, "Informe o nome"),
  telefone: z.string().min(8, "Informe um telefone válido"),
});

export default function Perfil() {
  const navigate = useNavigate();
  const usuarioId = usuarioLogadoId();
  const { data: conta, isLoading, isError } = usePerfilUsuario(usuarioId);
  const atualizarMutation = useAtualizarPerfil(usuarioId);

  const [editando, setEditando] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(esquemaConta),
    values: conta ? { nome: conta.nome, telefone: conta.telefone } : undefined,
  });

  async function salvarConta(dados) {
    await atualizarMutation.mutateAsync(dados);
    setEditando(false);
  }

  // Alterna entre os dois perfis que a Matriz Perfil x Funcionalidade prevê
  // (Ciclista / Equipe). As telas ainda não têm interface diferenciada por
  // perfil — ver mudancas/backlog.md — mas a troca em si já é real e
  // persiste no json-server.
  function mudarPerfil() {
    if (!conta) return;
    const novoPerfil = conta.perfil === "equipe" ? "ciclista" : "equipe";
    atualizarMutation.mutate({ perfil: novoPerfil });
  }

  function sair() {
    limparSessao();
    navigate("/login");
  }

  if (isLoading) {
    return (
      <main className="container py-4">
        <p className="text-body-secondary">Carregando perfil...</p>
      </main>
    );
  }

  if (isError || !conta) {
    return (
      <main className="container py-4">
        <aside className="bg-light border border-danger text-danger rounded p-2 small">
          Não foi possível carregar o perfil. O json-server está rodando? (npm run mock)
        </aside>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <article className="perfil-card bg-white">
        {/* Mesma foto do topo do card de login. */}
        <figure className="perfil-banner m-0" />

        <section className="p-3">
          <h1 className="h4 text-center mb-1">Perfil</h1>
          <p className="small text-body-secondary text-center mb-1">{conta.email}</p>
          <p className="small text-center text-body-secondary mb-3">
            Perfil atual: <strong>{conta.perfil === "equipe" ? "Equipe" : "Ciclista"}</strong>
          </p>

          {editando ? (
            <form onSubmit={handleSubmit(salvarConta)} noValidate>
              <section className="mb-2">
                <label htmlFor="nome" className="form-label">Nome</label>
                <input
                  type="text"
                  id="nome"
                  className={"form-control" + (errors.nome ? " is-invalid" : "")}
                  {...register("nome")}
                />
                {errors.nome && <p className="invalid-feedback d-block small mb-0">{errors.nome.message}</p>}
              </section>
              <section className="mb-3">
                <label htmlFor="telefone" className="form-label">Telefone</label>
                <input
                  type="tel"
                  id="telefone"
                  className={"form-control" + (errors.telefone ? " is-invalid" : "")}
                  {...register("telefone")}
                />
                {errors.telefone && (
                  <p className="invalid-feedback d-block small mb-0">{errors.telefone.message}</p>
                )}
              </section>
              <button type="submit" className="btn btn-primary w-100 mb-2" disabled={isSubmitting}>
                Salvar
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary w-100 mb-2"
                onClick={() => setEditando(false)}
              >
                Cancelar
              </button>
            </form>
          ) : (
            <button
              type="button"
              className="btn btn-outline-primary w-100 mb-2"
              onClick={() => setEditando(true)}
            >
              Editar conta
              <span className="material-icons align-middle ms-1">edit</span>
            </button>
          )}

          <button type="button" className="btn btn-outline-primary w-100 mb-2" onClick={mudarPerfil}>
            Mudar perfil ({conta.perfil === "equipe" ? "virar Ciclista" : "virar Equipe"})
            <span className="material-icons align-middle ms-1">swap_horiz</span>
          </button>

          <button type="button" className="btn btn-outline-danger w-100" onClick={sair}>
            Sair
            <span className="material-icons align-middle ms-1">logout</span>
          </button>
        </section>
      </article>
    </main>
  );
}
