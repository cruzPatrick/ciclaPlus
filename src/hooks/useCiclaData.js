import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  usuariosApi,
  candidatosApi,
  matchesApi,
  mensagensApi,
  treinosApi,
  temposApi,
  confrontosApi,
  consultoriasApi,
  rankingApi,
} from "../api/ciclaApi.js";
import { usuarioLogadoId } from "../api/sessao.js";

// ===== Autenticação / usuário =============================================

export function useLogin() {
  return useMutation({
    mutationFn: ({ email, senha }) => usuariosApi.autenticar(email, senha),
  });
}

export function useCadastrar() {
  return useMutation({
    mutationFn: (dados) => usuariosApi.cadastrar(dados),
  });
}

export function usePerfilUsuario(usuarioId) {
  return useQuery({
    queryKey: ["usuario", usuarioId],
    queryFn: () => usuariosApi.buscarPorId(usuarioId),
    enabled: usuarioId != null,
  });
}

export function useAtualizarPerfil(usuarioId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dados) => usuariosApi.atualizar(usuarioId, dados),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuario", usuarioId] }),
  });
}

// ===== Descoberta (Dar Match) + Matches ===================================

export function useCandidatos() {
  const usuarioId = usuarioLogadoId();
  return useQuery({
    queryKey: ["candidatos", usuarioId],
    queryFn: () => candidatosApi.listarPorUsuario(usuarioId),
    enabled: usuarioId != null,
  });
}

export function useMatches() {
  // O id entra na queryKey: sem isso, a cache do Tanstack Query guardaria
  // os matches da conta anterior e mostraria eles pra conta seguinte
  // depois de trocar de login.
  const usuarioId = usuarioLogadoId();
  return useQuery({
    queryKey: ["matches", usuarioId],
    queryFn: () => matchesApi.listarPorUsuario(usuarioId),
    enabled: usuarioId != null,
  });
}

// Uma avaliação (match ou passar) sempre tira a pessoa do pool de
// candidatos; se foi match, ela também entra na lista real de matches —
// é o único caminho que alimenta o Chat e o Confronto.
export function useAvaliarCandidato() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ candidato, status }) => {
      if (status === "match") {
        await matchesApi.adicionar({
          id: candidato.id,
          nome: candidato.nome,
          distanciaKm: candidato.distanciaKm,
          usuarioId: usuarioLogadoId(),
        });
      }
      await candidatosApi.remover(candidato.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidatos"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });
}

// ===== Chat (mensagens por match) =========================================

export function useMensagens(matchId) {
  return useQuery({
    queryKey: ["mensagens", matchId],
    queryFn: () => mensagensApi.listarPorMatch(matchId),
    enabled: matchId != null,
  });
}

export function useEnviarMensagem(matchId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (texto) => mensagensApi.enviar({ matchId, autor: "Você", texto }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["mensagens", matchId] }),
  });
}

// ===== Treino ===============================================================

export function useTreinos() {
  const usuarioId = usuarioLogadoId();
  return useQuery({
    queryKey: ["treinos", usuarioId],
    queryFn: () => treinosApi.listarPorUsuario(usuarioId),
    enabled: usuarioId != null,
  });
}

export function useEquipes() {
  return useQuery({ queryKey: ["equipes"], queryFn: treinosApi.equipes });
}

export function useMarcarTreino() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (treino) =>
      treinosApi.marcar({ ...treino, usuarioId: usuarioLogadoId() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["treinos"] }),
  });
}

export function useAlternarTreinoFeito() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, feito }) => treinosApi.atualizar(id, { feito }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["treinos"] }),
  });
}

// ===== Tempos (só o Cronômetro guiado pelo mapa escreve aqui) =============

export function useTempos() {
  const usuarioId = usuarioLogadoId();
  return useQuery({
    queryKey: ["tempos", usuarioId],
    queryFn: () => temposApi.listarPorUsuario(usuarioId),
    enabled: usuarioId != null,
  });
}

export function useAdicionarTempo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tempo) =>
      temposApi.adicionar({ ...tempo, usuarioId: usuarioLogadoId() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tempos"] }),
  });
}

export function useExcluirTempo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => temposApi.remover(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tempos"] }),
  });
}

// ===== Confronto =============================================================

export function useConfrontos() {
  const usuarioId = usuarioLogadoId();
  return useQuery({
    queryKey: ["confrontos", usuarioId],
    queryFn: () => confrontosApi.listarPorUsuario(usuarioId),
    enabled: usuarioId != null,
  });
}

export function useMarcarConfronto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (adversario) =>
      confrontosApi.marcar({
        adversario,
        status: "pendente_aceite_adversario",
        resultado: null,
        usuarioId: usuarioLogadoId(),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["confrontos"] }),
  });
}

export function useAtualizarConfronto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dados }) => confrontosApi.atualizar(id, dados),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["confrontos"] }),
  });
}

// ===== Consultoria ============================================================

export function useConsultorias() {
  const usuarioId = usuarioLogadoId();
  return useQuery({
    queryKey: ["consultorias", usuarioId],
    queryFn: () => consultoriasApi.listarPorUsuario(usuarioId),
    enabled: usuarioId != null,
  });
}

export function useSolicitarConsultoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (consultoria) =>
      consultoriasApi.solicitar({
        ...consultoria,
        status: "pendente",
        usuarioId: usuarioLogadoId(),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["consultorias"] }),
  });
}

// ===== Ranking (somente leitura) ============================================

export function useRankingGeral() {
  return useQuery({ queryKey: ["ranking"], queryFn: rankingApi.geral });
}

export function useMelhoresTempos() {
  return useQuery({
    queryKey: ["melhoresTemposPorPercurso"],
    queryFn: rankingApi.melhoresTemposPorPercurso,
  });
}
