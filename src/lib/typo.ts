// Typographie française pour les textes passés en props (titres, FAQ…) : même règle que
// plugins/remark-espaces-fines.mjs, qui s'occupe du texte des articles.
const FINE = " ";

export function espacesFines(texte: string) {
  return texte.replace(/ ([:;?!»])/g, `${FINE}$1`).replace(/« /g, `«${FINE}`);
}
