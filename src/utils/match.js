// Match recíproco: o match nasce com `mutuo: false` quando a pessoa logada dá
// match, e só vira `true` quando a outra pessoa retribui. Registros antigos
// (sem o campo) contam como recíprocos pra não quebrar dados já gravados.
export function ehMutuo(match) {
  return match.mutuo !== false;
}
