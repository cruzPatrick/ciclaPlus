// Utilidades pra impedir data e hora no passado nos formulários (Treino,
// Consultoria...). Tudo no fuso local: toISOString() usa UTC e pode adiantar
// o dia perto da meia-noite no Brasil.

const dois = (n) => String(n).padStart(2, "0");

// Data de hoje em YYYY-MM-DD (formato do <input type="date">).
export function hoje() {
  const d = new Date();
  return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;
}

// Hora atual em HH:MM (formato do <input type="time">).
export function horaAgora() {
  const d = new Date();
  return `${dois(d.getHours())}:${dois(d.getMinutes())}`;
}

// Regras pra usar com .refine() do zod. Sempre consultam o relógio na hora da
// validação (não no carregamento do módulo), então não "envelhecem" com a aba aberta.
export const dataNaoPassou = ({ data }) => !data || data >= hoje();

export const horaNaoPassou = ({ data, hora }) =>
  !data || !hora || data !== hoje() || hora >= horaAgora();

export const MSG_DATA_PASSADA = {
  message: "Essa data já passou. Escolha hoje ou uma data futura.",
  path: ["data"],
};

export const MSG_HORA_PASSADA = {
  message: "Esse horário já passou. Escolha um horário a partir de agora.",
  path: ["hora"],
};
