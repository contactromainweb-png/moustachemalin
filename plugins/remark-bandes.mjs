// Bandes de fond des articles (pack 8a) : au build, chaque section « ## » (et les blocs qui affichent leur propre
// titre de niveau 2 : FAQ, Consommables) est rangée avec ce qui la suit, jusqu'au titre suivant, dans
// <Bande n="…" fond="a|b|c">. Les fonds alternent a, b, a, b… ; la section « Comment choisir… » (ancre
// comment-choisir-…) prend c, la lavande. Ce qui précède le premier titre (méthode, mention Amazon, En bref, Mot de
// Kira, sommaire) reste sans bande ; le formulaire de la lettre et les liens de fin (RelatedArticles) aussi.
// Les ancres des titres ne bougent pas : elles sont posées avant, par remark-sommaire.mjs (qui doit passer avant).
// Seulement dans les articles (frontmatter `type`) : pas dans les pages légales, /methode/, /affiliation/ ni les rubriques.
// Le plugin place aussi les petites Kira séparatrices entre deux bandes (voir kiraSeparateurs plus bas).
import { parse } from "yaml";

const TYPES = new Set(["comparatif", "guide", "avis", "duel", "outil"]);
const BLOCS_TITRES = new Set(["FAQ", "Consommables"]);
const FIN = new Set(["RelatedArticles", "NewsletterForm"]);

const estTitre = (n) => (n.type === "heading" && n.depth === 2) || (n.type === "mdxJsxFlowElement" && BLOCS_TITRES.has(n.name));
const ancreDe = (n) => n.data?.hProperties?.id ?? "";
const attribut = (name, value) => ({ type: "mdxJsxAttribute", name, value });

export default function remarkBandes() {
  return (arbre) => {
    const yaml = arbre.children.find((n) => n.type === "yaml");
    const fm = yaml ? parse(yaml.value) ?? {} : {};
    if (!TYPES.has(fm.type)) return;

    const avant = [];
    const bandes = [];
    const apres = [];
    let courante = null;
    let fini = false;
    for (const n of arbre.children) {
      // import / export MDX : toujours à la racine.
      if (n.type === "mdxjsEsm" || n.type === "yaml") {
        avant.push(n);
        continue;
      }
      if (fini || (n.type === "mdxJsxFlowElement" && FIN.has(n.name))) {
        fini = true;
        apres.push(n);
        continue;
      }
      if (estTitre(n)) {
        courante = [n];
        bandes.push(courante);
        continue;
      }
      (courante ?? avant).push(n);
    }
    if (!bandes.length) return;

    const noeuds = bandes.map((enfants, i) => {
      const c = ancreDe(enfants[0]).startsWith("comment-choisir-");
      const fond = c ? "c" : i % 2 === 0 ? "a" : "b";
      return {
        type: "mdxJsxFlowElement",
        name: "Bande",
        attributes: [attribut("n", String(i + 1)), attribut("fond", fond)],
        children: enfants,
      };
    });
    arbre.children = [...avant, ...intercaler(noeuds, kiraSeparateurs(bandes)), ...apres];
  };
}

// Petites Kira séparatrices (KiraSeparateur) : 2 au plus par article, entre deux bandes, de préférence après la 2e
// et la 4e. Jamais à côté d'un Mot de Kira, d'un encadré santé, d'une fiche ou d'un encadré produit, d'un bouton ou
// d'une mention Amazon, du tableau comparatif, d'un quiz ou d'un test : Kira ne doit jamais avoir l'air de
// recommander un produit. On regarde le dernier bloc de la bande d'avant et le premier bloc (après le titre) de la
// bande d'après ; un emplacement interdit passe au suivant, et deux Kira ne se suivent jamais.
const INTERDITS = new Set([
  "KiraNote", "VetNotice", "ProductCard", "ProductBox", "NotreChoix", "AffiliateButton", "AmazonDisclosure",
  "TopPicks", "ComparisonTable", "TableauDuel", "QuizComparatif", "TestGuide", "Consommables", "ListeSignes",
]);
const ELOGES = new Set(["ce-que-nous-aimons"]);
const SEPARATEURS_MAX = 2;
const PREFERES = [2, 4];

function interdit(n) {
  if (!n) return true;
  if (n.type === "table") return true;
  if ((n.type === "mdxJsxFlowElement" || n.type === "mdxJsxTextElement") && INTERDITS.has(n.name)) return true;
  return (n.children ?? []).some(interdit);
}

function kiraSeparateurs(bandes) {
  // Emplacement k : entre la bande k et la bande k + 1 (numérotées à partir de 1).
  const permis = (k) => {
    if (k < 1 || k >= bandes.length) return false;
    // Par prudence, toute la bande d'avant (une fiche suivie d'un seul paragraphe resterait « à côté »), et les deux
    // premiers blocs de la bande d'après (son titre, ou le bloc à titre FAQ / Consommables, compris).
    const avant = bandes[k - 1];
    const apres = bandes[k].slice(0, 3);
    // Les points forts d'un avis (« Ce que nous aimons ») parlent d'un seul produit : pas de Kira juste après.
    if (ELOGES.has(ancreDe(avant[0]))) return false;
    return !avant.some(interdit) && !apres.some(interdit);
  };
  const choisis = [];
  for (const prefere of PREFERES) {
    for (let k = prefere; k < bandes.length && choisis.length < SEPARATEURS_MAX; k++) {
      if (choisis.some((c) => Math.abs(c - k) < 2)) continue;
      if (permis(k)) {
        choisis.push(k);
        break;
      }
    }
  }
  return choisis.sort((a, b) => a - b);
}

function intercaler(noeuds, emplacements) {
  return noeuds.flatMap((n, i) =>
    emplacements.includes(i + 1) ? [n, { type: "mdxJsxFlowElement", name: "KiraSeparateur", attributes: [], children: [] }] : [n],
  );
}
