// Typographie française pour les textes passés en props (titres, FAQ…) : même règle que
// plugins/remark-espaces-fines.mjs, qui s'occupe du texte des articles.
const FINE = " ";

export function espacesFines(texte: string) {
  return texte.replace(/ ([:;?!»])/g, `${FINE}$1`).replace(/« /g, `«${FINE}`);
}

// Noms de modèles qui ne se coupent jamais (titres H1 et fil d'Ariane) : « Pura Max 2 » ne passe pas à la ligne
// avant le « 2 ». Deux règles :
// - les noms connus du site restent entiers ;
// - un nombre court (1 ou 2 chiffres) qui suit un mot à majuscule (« Max 2 », « Pixi 2 ») s'accroche à ce mot.
// Seule l'espace AVANT le nombre devient insécable : « 6 litières » peut toujours se couper après le « 6 ».
const INSECABLE = " ";
const NOMS_CONNUS = ["Pura Max 2", "M1 Lite", "Max Pro 2"];

export function nomsInsecables(texte: string) {
  let t = texte;
  for (const nom of NOMS_CONNUS) t = t.replaceAll(nom, nom.replaceAll(" ", INSECABLE));
  return t.replace(
    /(\p{Lu}[\p{L}\p{N}-]*) (\d{1,2})(?=$|[\s  ?!:;,.)»])/gu,
    `$1${INSECABLE}$2`,
  );
}
