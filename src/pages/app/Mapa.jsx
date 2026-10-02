import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { useAdicionarTempo } from "../../hooks/useCiclaData.js";
import "leaflet/dist/leaflet.css";
import iconeMarcador from "leaflet/dist/images/marker-icon.png";
import iconeMarcador2x from "leaflet/dist/images/marker-icon-2x.png";
import iconeSombra from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: iconeMarcador,
  iconRetinaUrl: iconeMarcador2x,
  shadowUrl: iconeSombra,
});

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
  const adicionarTempoMutation = useAdicionarTempo();
  const [consentimento, setConsentimento] = useState("pendente");
  const [erro, setErro] = useState("");
  const [rastreando, setRastreando] = useState(false);
  const [tempoMs, setTempoMs] = useState(0);
  const [distanciaM, setDistanciaM] = useState(0);
  const [precisaoM, setPrecisaoM] = useState(null);

  const mapaRef = useRef(null);
  const mapaInstanciaRef = useRef(null);
  const posicaoInicialRef = useRef(null);
  const posicaoAtualRef = useRef(null);
  const precisaoAnteriorRef = useRef(null);
  const rastreandoRef = useRef(false);
  const marcadorRef = useRef(null);
  const circuloRef = useRef(null);
  const linhaRef = useRef(null);
  const trajetoRef = useRef([]);
  const watchIdRef = useRef(null);
  const inicioRef = useRef(null);
  const intervaloRef = useRef(null);

  // Declaradas ANTES do useEffect que as usa: sem isso o lint acusa
  // "acesso durante a própria inicialização" (a ordem antiga era segura
  // só por hoisting).
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
      const ultimoPonto = trajetoRef.current[trajetoRef.current.length - 1];
      if (ultimoPonto) {
        setDistanciaM((atual) => atual + distanciaMetros(ultimoPonto, novoPonto));
        trajetoRef.current = [...trajetoRef.current, novoPonto];
        linhaRef.current.setLatLngs(trajetoRef.current);
      }
      mapaInstanciaRef.current.panTo(novoPonto);
    } else if (melhorou) {
      mapaInstanciaRef.current.panTo(novoPonto);
    }
  }

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (intervaloRef.current) clearInterval(intervaloRef.current);
      if (mapaInstanciaRef.current) mapaInstanciaRef.current.remove();
    };
  }, []);

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
  }, [consentimento]);

  function pedirLocalizacao() {
    setErro("");
    navigator.geolocation.getCurrentPosition(
      (posicao) => {
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

    // Retoma de onde parou: tempoMs só é zerado depois que o percurso é
    // finalizado e salvo (finalizarCronometro). Parar e apertar play de
    // novo NÃO perde o tempo/distância/trajeto já percorridos.
    inicioRef.current = Date.now() - tempoMs;
    intervaloRef.current = setInterval(() => {
      setTempoMs(Date.now() - inicioRef.current);
    }, 1000);

    // O ponto inicial da trilha só é definido na primeira vez que o
    // cronômetro roda; ao retomar, a linha já desenhada continua de onde
    // parou em vez de ser reiniciada no ponto atual.
    if (trajetoRef.current.length === 0 && posicaoAtualRef.current) {
      trajetoRef.current = [posicaoAtualRef.current];
      linhaRef.current.setLatLngs(trajetoRef.current);
    }
  }

  function pararCronometro() {
    rastreandoRef.current = false;
    setRastreando(false);
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
  }

  // Só ponto de entrada pra registrar um tempo em "Gerenciar Tempos": exige
  // ter percorrido alguma distância real rastreada pelo mapa (não só o
  // relógio rodando parado) — é o que garante que um tempo só existe se
  // veio de um percurso guiado pelo mapa de verdade.
  function finalizarCronometro() {
    pararCronometro();
    if (tempoMs === 0 || distanciaM === 0) return;

    adicionarTempoMutation.mutate({
      nome: `Percurso ${new Date().toLocaleDateString("pt-BR")}`,
      tempo: formatarTempo(tempoMs),
      distanciaKm: Number((distanciaM / 1000).toFixed(2)),
    });

    // Reseta só agora, depois de salvo, pra deixar pronto pro próximo percurso.
    setTempoMs(0);
    setDistanciaM(0);
    trajetoRef.current = [];
    if (linhaRef.current) linhaRef.current.setLatLngs([]);
  }

  if (consentimento === "pendente" || consentimento === "negado") {
    return (
      <main className="container py-4 d-flex flex-column align-items-center justify-content-center min-vh-100">
        <article className="card shadow-sm p-4 text-center" style={{ maxWidth: "480px", width: "100%" }}>
          <header>
            <h1 className="h3 mb-3">Cronometrar percurso</h1>
          </header>
          <p className="text-body-secondary mb-3">
            Para cronometrar seu treino e validar o percurso na ciclovia, precisamos do acesso à sua localização.
          </p>
          <p className="small text-body-secondary mb-4">
            A sua localização fica gravada somente na memória local do navegador durante o uso.
          </p>

          {erro && (
            <aside className="bg-light border border-danger text-danger rounded p-2 small mb-3">
              {erro}
            </aside>
          )}

          <button type="button" className="btn btn-primary w-100" onClick={pedirLocalizacao}>
            Permitir localização e continuar
          </button>
        </article>
      </main>
    );
  }

  return (
    <main className="container py-4 d-flex flex-column align-items-center">
      <section className="w-100" style={{ maxWidth: "720px" }}>
        <header>
          <h1 className="h3 mb-4 text-center text-lg-start">Cronometrar percurso</h1>
        </header>

        <nav className="d-flex align-items-center justify-content-end gap-3 mb-3">
          {!rastreando ? (
            <button
              type="button"
              className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm"
              style={{ width: "44px", height: "44px" }}
              aria-label="Iniciar cronômetro"
              onClick={iniciarCronometro}
            >
              <span className="material-icons">play_arrow</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-danger rounded-circle d-flex align-items-center justify-content-center shadow-sm"
              style={{ width: "44px", height: "44px" }}
              aria-label="Parar cronômetro"
              onClick={pararCronometro}
            >
              <span className="material-icons">stop</span>
            </button>
          )}

          <article className="border rounded px-3 py-2 bg-white shadow-sm d-flex gap-4 align-items-center">
            <section>
              <span className="d-block small text-body-secondary fw-semibold">Timer</span>
              <span className="fs-5 fw-bold">{formatarTempo(tempoMs)}</span>
            </section>
            <section className="border-start ps-3">
              <span className="d-block small text-body-secondary fw-semibold">Distância</span>
              <span className="fs-5 fw-bold">{(distanciaM / 1000).toFixed(2)} km</span>
            </section>
          </article>

          {tempoMs > 0 && (
            <button
              type="button"
              className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm"
              style={{ width: "44px", height: "44px" }}
              aria-label="Finalizar e salvar tempo"
              title="Finalizar e salvar tempo"
              disabled={distanciaM === 0}
              onClick={finalizarCronometro}
            >
              <span className="material-icons">check</span>
            </button>
          )}
        </nav>

        {tempoMs > 0 && distanciaM === 0 && (
          <aside className="bg-light border border-warning text-warning-emphasis rounded p-2 small text-center mb-3">
            Continue pedalando com a localização ativa pra poder salvar o tempo —
            só é possível registrar um percurso que realmente foi percorrido no mapa.
          </aside>
        )}

        {precisaoM != null && precisaoM > 1000 && (
          <aside className="bg-light border border-warning text-warning-emphasis rounded p-2 small text-center mb-3">
            Localização imprecisa (mais de 1 km de margem). Verifique o GPS do dispositivo.
          </aside>
        )}

        {erro && (
          <aside className="bg-light border border-warning text-warning-emphasis rounded p-2 small text-center mb-3">
            {erro}
          </aside>
        )}

        <figure
          ref={mapaRef}
          className="shadow-sm border border-2 border-primary-subtle m-0"
          style={{
            height: "450px",
            width: "100%",
            borderRadius: "1rem",
            overflow: "hidden",
          }}
        />
      </section>
    </main>
  );
}