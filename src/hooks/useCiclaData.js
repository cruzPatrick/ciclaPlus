import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  usuariosApi,
  candidatosApi,
  matchesApi,
  mensagensApi,
  treinosApi,
  passeiosApi,
  percursosApi,
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

// Também é o caminho do Boost: ativar/desativar é só um PATCH em `boostAte`.
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
// candidatos; se foi match, ela também entra na lista de matches — mas com
// `mutuo: false`: só vira recíproco quando a outra pessoa retribui
// (useRetribuirMatch). Chat e treino individual exigem o match recíproco.
export function useAvaliarCandidato() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ candidato, status }) => {
      if (status === "match") {
        await matchesApi.adicionar({
          id: candidato.id,
          nome: candidato.nome,
          distanciaKm: candidato.distanciaKm,
          mutuo: false,
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

// Simula a outra pessoa retribuindo o match (só existe uma conta logada por
// vez no mock, então a "outra parte" é acionada por um botão de simulação).
export function useRetribuirMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (matchId) => matchesApi.atualizar(matchId, { mutuo: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["matches"] }),
  });
}

// Desfazer match: remove o match e devolve a pessoa pra fila do Dar Match.
// Mensagens e confrontos com ela só são apagados se pedido; as mensagens
// guardadas voltam se vocês derem match de novo (o id do match é o mesmo).
export function useDesfazerMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ match, apagarMensagens, apagarConfrontos }) => {
      const usuarioId = usuarioLogadoId();
      if (apagarMensagens) await mensagensApi.removerPorMatch(match.id);
      if (apagarConfrontos) await confrontosApi.removerDoAdversario(usuarioId, match.nome);
      await matchesApi.remover(match.id);
      try {
        await candidatosApi.adicionar({
          id: match.id,
          nome: match.nome,
          tipo: "Ciclista",
          distanciaKm: match.distanciaKm,
          usuarioId,
        });
      } catch {
        // Já estava na fila: nada a fazer.
      }
    },
    onSuccess: (_dados, { match }) => {
      queryClient.removeQueries({ queryKey: ["mensagens", match.id] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["candidatos"] });
      queryClient.invalidateQueries({ queryKey: ["confrontos"] });
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

export function useExcluirTreino() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => treinosApi.remover(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["treinos"] }),
  });
}

// ===== Passeios (CRUD completo) =============================================

export function usePasseios() {
  const usuarioId = usuarioLogadoId();
  return useQuery({
    queryKey: ["passeios", usuarioId],
    queryFn: () => passeiosApi.listarPorUsuario(usuarioId),
    enabled: usuarioId != null,
  });
}

// Cria quando não há `id`; edita quando há.
export function useSalvarPasseio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dados }) =>
      id
        ? passeiosApi.atualizar(id, dados)
        : passeiosApi.criar({ ...dados, usuarioId: usuarioLogadoId() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["passeios"] }),
  });
}

export function useExcluirPasseio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => passeiosApi.remover(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["passeios"] }),
  });
}

// ===== Percursos e Tempos ===================================================

export function usePercursos() {
  return useQuery({ queryKey: ["percursos"], queryFn: percursosApi.listar });
}

export function useTempos() {
  const usuarioId = usuarioLogadoId();
  return useQuery({
    queryKey: ["tempos", usuarioId],
    queryFn: () => temposApi.listarPorUsuario(usuarioId),
    enabled: usuarioId != null,
  });
}

// Registrar um tempo de um percurso conhecido também atualiza a tabela de
// "melhores tempos por percurso" do Ranking.
export function useAdicionarTempo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tempo) => {
      const usuarioId = usuarioLogadoId();
      const salvo = await temposApi.adicionar({ ...tempo, usuarioId });
      if (tempo.percursoId) {
        const usuario = await usuariosApi.buscarPorId(usuarioId);
        await rankingApi.registrarTempo({
          percurso: tempo.nome,
          ciclista: usuario.nome,
          tempo: tempo.tempo,
          distanciaKm: tempo.distanciaKm,
        });
      }
      return salvo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tempos"] });
      queryClient.invalidateQueries({ queryKey: ["melhoresTemposPorPercurso"] });
    },
  });
}

export function useAtualizarTempo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dados }) => temposApi.atualizar(id, dados),
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
// Fluxo (cada seta que depende da outra parte é simulada por um botão):
// pendente_aceite_adversario -> confirmado -> resultado_registrado ->
// resultado_confirmado (pontua no Ranking) -> encerrado

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

// O resultado só pontua depois da confirmação da outra parte.
export function useConfirmarResultado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, resultado }) => {
      await confrontosApi.atualizar(id, { status: "resultado_confirmado" });
      await rankingApi.registrarResultado({ usuarioId: usuarioLogadoId(), resultado });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["confrontos"] });
      queryClient.invalidateQueries({ queryKey: ["ranking"] });
    },
  });
}

export function useCancelarConfronto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => confrontosApi.remover(id),
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

export function useCancelarConsultoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => consultoriasApi.remover(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["consultorias"] }),
  });
}

// ===== Ranking (somente leitura na tela; escrito por confronto e tempo) =====

export function useRankingGeral() {
  return useQuery({ queryKey: ["ranking"], queryFn: rankingApi.geral });
}

export function useMelhoresTempos() {
  return useQuery({
    queryKey: ["melhoresTemposPorPercurso"],
    queryFn: rankingApi.melhoresTemposPorPercurso,
  });
}
