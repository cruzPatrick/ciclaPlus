import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  usePerfilUsuario,
  useAtualizarPerfil,
  useTrocarSenha,
  useExcluirConta,
} from "../../hooks/useCiclaData.js";
import { usuarioLogadoId, limparSessao, salvarToken } from "../../api/sessao.js";

const esquemaConta = z.object({
  nome: z.string().min(2, "Informe o nome"),
  telefone: z.string().min(8, "Informe um telefone válido"),
  tipoBike: z.string().max(60, "No máximo 60 caracteres"),
  foto: z
    .string()
    .max(500, "URL longa demais")
    .refine((v) => v === "" || /^https:\/\//i.test(v), "Use um link que comece com https://"),
});

const esquemaSenha = z
  .object({
    senhaAtual: z.string().min(1, "Informe a senha atual"),
    novaSenha: z
      .string()
      .min(8, "A nova senha precisa ter pelo menos 8 caracteres")
      .max(72, "A senha pode ter no máximo 72 caracteres"),
    confirmar: z.string().min(1, "Confirme a nova senha"),
  })
  .refine((d) => d.novaSenha === d.confirmar, {
    message: "As senhas não coincidem",
    path: ["confirmar"],
  });

const esquemaExcluir = z.object({ senha: z.string().min(1, "Informe a senha para confirmar") });

function Erro({ erro }) {
  return erro ? <p className="invalid-feedback d-block small mb-0">{erro.message}</p> : null;
}

function Alerta({ children }) {
  return (
    <aside role="alert" className="bg-light border border-danger text-danger rounded p-2 small mb-2">
      {children}
    </aside>
  );
}

function TrocarSenha() {
  const [aberto, setAberto] = useState(false);
  const [ok, setOk] = useState(false);
  const mutation = useTrocarSenha();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(esquemaSenha) });

  async function enviar({ senhaAtual, novaSenha }) {
    try {
      const { token } = await mutation.mutateAsync({ senhaAtual, novaSenha });
      salvarToken(token); // o token antigo deixa de valer na troca de senha
      reset();
      setAberto(false);
      setOk(true);
    } catch (erro) {
      setError("root", {
        message: erro.status === 403 ? "Senha atual incorreta." : erro.message,
      });
    }
  }

  if (!aberto) {
    return (
      <>
        {ok && <p className="small text-success text-center mb-2">Senha alterada com sucesso.</p>}
        <button
          type="button"
          className="btn btn-outline-primary w-100 mb-2"
          onClick={() => {
            setOk(false);
            setAberto(true);
          }}
        >
          Trocar senha
          <span className="material-icons align-middle ms-1">vpn_key</span>
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit(enviar)} noValidate className="mb-2">
      {errors.root && <Alerta>{errors.root.message}</Alerta>}
      {[
        ["senhaAtual", "Senha atual", "current-password"],
        ["novaSenha", "Nova senha", "new-password"],
        ["confirmar", "Confirme a nova senha", "new-password"],
      ].map(([campo, rotulo, auto]) => (
        <section className="mb-2" key={campo}>
          <label htmlFor={campo} className="form-label">{rotulo}</label>
          <input
            type="password"
            id={campo}
            autoComplete={auto}
            className={"form-control" + (errors[campo] ? " is-invalid" : "")}
            {...register(campo)}
          />
          <Erro erro={errors[campo]} />
        </section>
      ))}
      <button type="submit" className="btn btn-primary w-100 mb-2" disabled={isSubmitting}>
        Salvar nova senha
      </button>
      <button type="button" className="btn btn-outline-secondary w-100" onClick={() => setAberto(false)}>
        Cancelar
      </button>
    </form>
  );
}

function ExcluirConta({ aoExcluir }) {
  const [aberto, setAberto] = useState(false);
  const mutation = useExcluirConta();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(esquemaExcluir) });

  async function enviar({ senha }) {
    try {
      await mutation.mutateAsync(senha);
      aoExcluir();
    } catch (erro) {
      setError("root", {
        message: erro.status === 403 ? "Senha incorreta." : erro.message,
      });
    }
  }

  if (!aberto) {
    return (
      <button type="button" className="btn btn-link text-danger w-100 mt-2" onClick={() => setAberto(true)}>
        Excluir minha conta
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit(enviar)} noValidate className="border border-danger rounded p-2 mt-2">
      <p className="small mb-2">
        <strong>Isso é definitivo.</strong> Seus dados, matches, mensagens, confrontos e boost
        serão apagados. Confrontos já encerrados também deixam de contar pontos para o
        adversário. Digite sua senha para confirmar.
      </p>
      {errors.root && <Alerta>{errors.root.message}</Alerta>}
      <label htmlFor="senhaExcluir" className="form-label">Senha</label>
      <input
        type="password"
        id="senhaExcluir"
        autoComplete="current-password"
        className={"form-control mb-2" + (errors.senha ? " is-invalid" : "")}
        {...register("senha")}
      />
      <Erro erro={errors.senha} />
      <button type="submit" className="btn btn-danger w-100 mb-2" disabled={isSubmitting}>
        Excluir conta definitivamente
      </button>
      <button type="button" className="btn btn-outline-secondary w-100" onClick={() => setAberto(false)}>
        Cancelar
      </button>
    </form>
  );
}

export default function Perfil() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const usuarioId = usuarioLogadoId();
  const { data: conta, isLoading, isError, error } = usePerfilUsuario(usuarioId);
  const atualizarMutation = useAtualizarPerfil(usuarioId);

  const [editando, setEditando] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(esquemaConta),
    values: conta
      ? {
          nome: conta.nome,
          telefone: conta.telefone ?? "",
          tipoBike: conta.tipoBike ?? "",
          foto: conta.foto ?? "",
        }
      : undefined,
  });

  async function salvarConta(dados) {
    try {
      await atualizarMutation.mutateAsync(dados);
      setEditando(false);
    } catch (erro) {
      setError("root", { message: erro.message });
    }
  }

  // Alterna entre os dois perfis que a Matriz Perfil x Funcionalidade prevê
  // (Ciclista / Equipe). A troca persiste na API e o AppLayout refaz o menu
  // (e Treino mostra só a aba de equipe) a partir dela.
  function mudarPerfil() {
    if (!conta) return;
    const novoPerfil = conta.perfil === "equipe" ? "ciclista" : "equipe";
    atualizarMutation.mutate({ perfil: novoPerfil });
  }

  function encerrarSessao() {
    limparSessao();
    queryClient.clear(); // não deixar dados da conta anterior em cache
  }

  function sair() {
    encerrarSessao();
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
          {error?.message ?? "Não foi possível carregar o perfil."}
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
          {conta.foto && (
            <img
              src={conta.foto}
              alt={`Foto de ${conta.nome}`}
              className="rounded-circle d-block mx-auto mb-2"
              style={{ width: 96, height: 96, objectFit: "cover" }}
              referrerPolicy="no-referrer"
            />
          )}
          <p className="small text-body-secondary text-center mb-1">{conta.email}</p>
          <p className="small text-center text-body-secondary mb-1">
            Perfil atual: <strong>{conta.perfil === "equipe" ? "Equipe" : "Ciclista"}</strong>
          </p>
          {conta.tipoBike && (
            <p className="small text-center text-body-secondary mb-3">
              Bike: <strong>{conta.tipoBike}</strong>
            </p>
          )}

          {atualizarMutation.isError && !editando && (
            <Alerta>{atualizarMutation.error.message}</Alerta>
          )}

          {editando ? (
            <form onSubmit={handleSubmit(salvarConta)} noValidate>
              {errors.root && <Alerta>{errors.root.message}</Alerta>}
              <section className="mb-2">
                <label htmlFor="nome" className="form-label">Nome</label>
                <input
                  type="text"
                  id="nome"
                  className={"form-control" + (errors.nome ? " is-invalid" : "")}
                  {...register("nome")}
                />
                <Erro erro={errors.nome} />
              </section>
              <section className="mb-2">
                <label htmlFor="telefone" className="form-label">Telefone</label>
                <input
                  type="tel"
                  id="telefone"
                  className={"form-control" + (errors.telefone ? " is-invalid" : "")}
                  {...register("telefone")}
                />
                <Erro erro={errors.telefone} />
              </section>
              <section className="mb-2">
                <label htmlFor="tipoBike" className="form-label">Tipo de bike</label>
                <input
                  type="text"
                  id="tipoBike"
                  placeholder="Ex.: Speed, MTB, Gravel"
                  className={"form-control" + (errors.tipoBike ? " is-invalid" : "")}
                  {...register("tipoBike")}
                />
                <Erro erro={errors.tipoBike} />
              </section>
              <section className="mb-3">
                <label htmlFor="foto" className="form-label">Foto (link https)</label>
                <input
                  type="url"
                  id="foto"
                  placeholder="https://..."
                  className={"form-control" + (errors.foto ? " is-invalid" : "")}
                  {...register("foto")}
                />
                <Erro erro={errors.foto} />
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

          <TrocarSenha />

          <button type="button" className="btn btn-outline-primary w-100 mb-2" onClick={mudarPerfil}>
            Mudar perfil ({conta.perfil === "equipe" ? "virar Ciclista" : "virar Equipe"})
            <span className="material-icons align-middle ms-1">swap_horiz</span>
          </button>

          <button type="button" className="btn btn-outline-danger w-100" onClick={sair}>
            Sair
            <span className="material-icons align-middle ms-1">logout</span>
          </button>

          <ExcluirConta
            aoExcluir={() => {
              encerrarSessao();
              navigate("/");
            }}
          />
        </section>
      </article>
    </main>
  );
}
