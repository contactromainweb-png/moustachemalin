// Les passages « [À VALIDER PAR ROMAIN : …] » des textes ne sont jamais publiés (CLAUDE.md, section 11) :
// ce plugin les retire à la construction du site, qu'ils soient en gras ou dans le texte, puis supprime
// les paragraphes devenus vides. Le fichier source garde le passage, pour que Romain le valide.
const MARQUE = /\s*\[À VALIDER[^\]]*\]/g;

function texte(noeud) {
  if (noeud.type === "text") return noeud.value;
  return (noeud.children ?? []).map(texte).join("");
}

function nettoyer(noeud) {
  if (!noeud.children) return;
  noeud.children = noeud.children.filter((enfant) => {
    if ((enfant.type === "strong" || enfant.type === "emphasis") && /^\s*\[À VALIDER/.test(texte(enfant))) return false;
    if (enfant.type === "text") enfant.value = enfant.value.replace(MARQUE, "");
    nettoyer(enfant);
    return !(enfant.type === "paragraph" && texte(enfant).trim() === "" && !enfant.children.some((e) => e.type !== "text"));
  });
}

export default function remarkAValider() {
  return (arbre) => nettoyer(arbre);
}
