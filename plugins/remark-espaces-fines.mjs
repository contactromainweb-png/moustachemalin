// Typographie française : espace insécable fine avant « : ; ? ! » et à l'intérieur des guillemets,
// pour qu'un « : » ne se retrouve jamais seul en début de ligne. Ne touche qu'au texte affiché.
const FINE = " ";

function corriger(texte) {
  return texte
    .replace(/ ([:;?!»])/g, `${FINE}$1`)
    .replace(/« /g, `«${FINE}`);
}

function parcourir(noeud) {
  if (noeud.type === "text") noeud.value = corriger(noeud.value);
  if (noeud.children) noeud.children.forEach(parcourir);
}

export default function remarkEspacesFines() {
  return (arbre) => parcourir(arbre);
}
