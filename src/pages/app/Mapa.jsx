import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconeMarcador from "leaflet/dist/images/marker-icon.png";
import iconeMarcador2x from "leaflet/dist/images/marker-icon-2x.png";
import iconeSombra from "leaflet/dist/images/marker-shadow.png";

// Vite não resolve os ícones padrão do Leaflet sozinho — sem isso o
// marcador do mapa aparece quebrado (ícone 404).
L.Icon.Default.mergeOptions({
  iconUrl: iconeMarcador,
  iconRetinaUrl: iconeMarcador2x,
  shadowUrl: iconeSombra,
});

// Distância em metros entre dois pontos (fórmula de Haversine) — usada só
// pra somar o percurso registrado, sem nenhuma lib extra.
function distanciaMetros(a, b) {
  const R = 6371000;
  const toRad = (graus) => (graus * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function formatarTempo(ms) {
  const totalSegundos = Math.floor(ms / 1000);
  const minutos = String(Math.floor(totalSegundos / 60)).padStart(2, "0");
  const segundos = String(totalSegundos % 60).padStart(2, "0");
  return `${minutos}:${segundos}`;
}

export default function Mapa() {
  // "pendente" | "concedido" | "negado" — controla qual tela aparece.
  const [consentimento, setConsentimento] = useState("pendente");
  const [erro, setErro] = useState("");
  const [rastreando, setRastreando] = useState(false);
  const [tempoMs, setTempoMs] = useState(0);
  const [distanciaM, setDistanciaM] = useState(0);
  const [precisaoM, setPrecisaoM] = useState(null); // raio de incerteza do fix

  const mapaRef = useRef(null); // <div> do mapa
  const mapaInstanciaRef = useRef(null); // instância do Leaflet
  const posicaoInicialRef = useRef(null); // primeira posição, guardada até o <div> existir
  const posicaoAtualRef = useRef(null);
  const precisaoAnteriorRef = useRef(null); // melhor precisão já vista
  const rastreandoRef = useRef(false); // espelho síncrono de `rastreando`
  const marcadorRef = useRef(null);
  const circuloRef = useRef(null); // círculo de precisão ao redor do marcador
  const linhaRef = useRef(null);
  const trajetoRef = useRef([]); // pontos do percurso — não precisa re-render a cada ponto
  const watchIdRef = useRef(null);
  const inicioRef = useRef(null);
  const intervaloRef = useRef(null);

  // Some com o mapa e os listeners do navegador se a pessoa sair da tela.
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (intervaloRef.current) clearInterval(intervaloRef.current);
      if (mapaInstanciaRef.current) mapaInstanciaRef.current.remove();
    };
  }, []);

  // Inicializa o mapa só DEPOIS que o React commitou o <div> (useEffect roda
  // após o DOM existir — um setTimeout(0) aqui era uma condição de corrida:
  // o timeout podia disparar antes do render e o Leaflet quebrava com
  // "Map container not found"). O guarda evita dupla inicialização.
  //
  // O watchPosition também começa AQUI (e não só ao apertar "Iniciar"): a
  // primeira posição costuma vir "grosseira" (estimada por IP/cache do
  // navegador, caindo longe — ex.: centro do Rio) e só um fix posterior,
  // mais preciso, coloca o marcador no lugar certo.
  useEffect(() => {
    if (consentimento !== "concedido") return;
    if (mapaInstanciaRef.current || !mapaRef.current) return;
    if (!posicaoInicialRef.current) return;

    iniciarMapa(posicaoInicialRef.current);

    watchIdRef.current = navigator.geolocation.watchPosition(
      atualizarPosicao,
      () => setErro("Perdemos o sinal de localização."),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consentimento]);

  function iniciarMapa(posicaoInicial) {
    const { latitude, longitude, accuracy } = posicaoInicial.coords;

    mapaInstanciaRef.current = L.map(mapaRef.current).setView(
      [latitude, longitude],
      16
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; colaboradores do OpenStreetMap",
    }).addTo(mapaInstanciaRef.current);

    marcadorRef.current = L.marker([latitude, longitude]).addTo(
      mapaInstanciaRef.current
    );
    // Mostra o raio de incerteza do GPS: quanto maior o círculo, menos
    // certeza temos do ponto real.
    circuloRef.current = L.circle([latitude, longitude], {
      radius: accuracy || 0,
      color: "#357266",
      weight: 1,
      fillColor: "#357266",
      fillOpacity: 0.12,
    }).addTo(mapaInstanciaRef.current);
    linhaRef.current = L.polyline([[latitude, longitude]], {
      color: "#357266",
    }).addTo(mapaInstanciaRef.current);

    posicaoAtualRef.current = { lat: latitude, lng: longitude };
    precisaoAnteriorRef.current = accuracy ?? null;
    setPrecisaoM(accuracy ?? null);
    trajetoRef.current = [{ lat: latitude, lng: longitude }];
  }

  // Chamado a cada nova posição (watchPosition). Move marcador/círculo;
  // só soma distância e desenha trajeto quando o cronômetro está rodando.
  function atualizarPosicao(posicao) {
    if (!mapaInstanciaRef.current) return;
    const { latitude, longitude, accuracy } = posicao.coords;
    const novoPonto = { lat: latitude, lng: longitude };
    const anterior = precisaoAnteriorRef.current;
    const melhorou = anterior == null || (accuracy != null && accuracy < anterior);

    posicaoAtualRef.current = novoPonto;
    marcadorRef.current.setLatLng(novoPonto);
    if (accuracy != null) {
      circuloRef.current.setLatLng(novoPonto).setRadius(accuracy);
      precisaoAnteriorRef.current = accuracy;
    }
    setPrecisaoM(accuracy ?? anterior);

    if (rastreandoRef.current) {
      const ultimoPonto =
        trajetoRef.current[trajetoRef.current.length - 1];
      if (ultimoPonto) {
        setDistanciaM((atual) => atual + distanciaMetros(ultimoPonto, novoPonto));
        trajetoRef.current = [...trajetoRef.current, novoPonto];
        linhaRef.current.setLatLngs(trajetoRef.current);
      }
      mapaInstanciaRef.current.panTo(novoPonto);
    } else if (melhorou) {
      // Fix mais preciso chegou (ex.: saiu da estimativa por IP pro GPS de
      // verdade): recentraliza no ponto novo sem bagunçar a rolagem do
      // usuário enquanto ele explora o mapa.
      mapaInstanciaRef.current.panTo(novoPonto);
    }
  }

  function pedirLocalizacao() {
    setErro("");
    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        // Guarda a posição e deixa o useEffect (que roda após o render do
        // <div> do mapa) criar o mapa — ver comentário no useEffect.
        // maximumAge: 0 proíbe posição em cache (que pode estar errada).
        posicaoInicialRef.current = posicao;
        setConsentimento("concedido");
      },
      (erroGeo) => {
        setConsentimento("negado");
        setErro(
          erroGeo.code === erroGeo.PERMISSION_DENIED
            ? "Você negou a permissão de localização. Sem ela, não dá pra validar o percurso na ciclovia."
            : "Não consegui obter sua localização. Verifique se o GPS/localização está ativado."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  function iniciarCronometro() {
    rastreandoRef.current = true;
    setRastreando(true);
    setTempoMs(0);
    setDistanciaM(0);
    inicioRef.current = Date.now();

    intervaloRef.current = setInterval(() => {
      setTempoMs(Date.now() - inicioRef.current);
    }, 1000);

    // Zera o trajeto desenhado de uma sessão anterior.
    if (posicaoAtualRef.current) {
      trajetoRef.current = [posicaoAtualRef.current];
      linhaRef.current.setLatLngs(trajetoRef.current);
    }
  }

  function pararCronometro() {
    rastreandoRef.current = false;
    setRastreando(false);
    // O watch continua ligado (só o marcador/precisão seguem atualizando);
    // ele é removido ao sair da página, no cleanup do useEffect.
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
  }

  if (consentimento === "pendente" || consentimento === "negado") {
    return (
      <main className="container py-4" style={{ maxWidth: "520px" }}>
        <h1 className="h3">Mapa</h1>
        <p>
          Pra cronometrar seu treino e confirmar que ele foi feito numa
          ciclovia (importante pra validar confrontos), precisamos da sua
          localização durante o percurso.
        </p>
        <p className="small text-body-secondary">
          Isso fica só no seu navegador enquanto a página está aberta — não
          enviamos sua localização pra nenhum servidor.
        </p>

        {erro && (
          <div className="alert alert-danger py-2 small" role="alert">
            {erro}
          </div>
        )}

        <button type="button" className="btn btn-primary" onClick={pedirLocalizacao}>
          Permitir localização e continuar
        </button>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <h1 className="h3">Mapa</h1>

      <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
        <span className="fs-4 fw-bold">{formatarTempo(tempoMs)}</span>
        <span className="text-body-secondary">
          {(distanciaM / 1000).toFixed(2)} km percorridos
        </span>
        {precisaoM != null && (
          <span className="text-body-secondary small">
            Precisão: ±
            {precisaoM >= 1000
              ? `${(precisaoM / 1000).toFixed(1)} km`
              : `${Math.round(precisaoM)} m`}
          </span>
        )}

        {!rastreando ? (
          <button type="button" className="btn btn-primary" onClick={iniciarCronometro}>
            Iniciar Cronômetro
          </button>
        ) : (
          <button type="button" className="btn btn-outline-danger" onClick={pararCronometro}>
            Parar Cronômetro
          </button>
        )}
      </div>

      {precisaoM != null && precisaoM > 1000 && (
        <div className="alert alert-warning py-2 small" role="alert">
          Localização imprecisa (mais de 1 km de margem): o navegador está
          estimando a posição sem GPS. Ative a localização do dispositivo
          (Windows: Configurações → Privacidade → Localização) e recarregue
          a página.
        </div>
      )}

      {erro && (
        <div className="alert alert-warning py-2 small" role="alert">
          {erro}
        </div>
      )}

      <div ref={mapaRef} style={{ height: "360px", borderRadius: "0.5rem" }} />
    </main>
  );
}
