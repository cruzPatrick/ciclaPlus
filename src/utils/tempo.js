// Tempos trafegam como texto "HH:MM:SS" (mesmo formato do db.json). Estes
// helpers convertem de/para segundos pra comparar e normalizar entradas
// como "18:42" (MM:SS) ou "00:18:42".

export function paraSegundos(texto) {
  const partes = String(texto).split(":").map(Number);
  while (partes.length < 3) partes.unshift(0);
  const [horas, minutos, segundos] = partes;
  return horas * 3600 + minutos * 60 + segundos;
}

export function formatarDuracao(totalSegundos) {
  const dois = (n) => String(n).padStart(2, "0");
  const horas = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = Math.floor(totalSegundos % 60);
  return `${dois(horas)}:${dois(minutos)}:${dois(segundos)}`;
}

export function normalizarTempo(texto) {
  return formatarDuracao(paraSegundos(texto));
}
