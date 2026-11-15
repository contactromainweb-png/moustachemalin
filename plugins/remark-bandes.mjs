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
    arbre.children = [...avant, ...noeuds, ...apres];
  };
}
