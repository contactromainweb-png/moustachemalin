// Sommaire des longs articles (plus de 1 500 mots affichés) : donne une ancre (id) à chaque titre « ## », repère les
// blocs qui portent leur propre titre (consommables, FAQ), puis place <Sommaire titres='[…]' /> juste avant le
// premier titre de l'article. Calculé à la construction : le sommaire est dans le HTML dès le départ (aucun saut de
// mise en page quand la page s'affiche).
// Mots comptés : le texte de l'article + celui des fiches produits qu'il présente (content/products/*.json).
import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

const SEUIL = 1500;
const PRODUITS = path.join(process.cwd(), "content", "products");

// Blocs MDX qui affichent un titre de niveau 2, avec l'ancre qu'ils portent (voir leurs composants).
const BLOCS = {
  Consommables: () => ({ id: "consommables", titre: "Consommables à prévoir" }),
  FAQ: (attributs) => ({ id: "faq", titre: attributs.titre ?? "Questions fréquentes" }),
};

const texte = (noeud) =>
  noeud.type === "text" || noeud.type === "inlineCode" ? noeud.value : (noeud.children ?? []).map(texte).join("");

const mots = (s) => s.split(/\s+/).filter((m) => /[\p{L}\p{N}]/u.test(m)).length;

export function ancre(titre) {
  return titre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Toutes les chaînes d'une fiche produit (nom, points forts, points faibles, consommables…).
function chaines(valeur) {
  if (typeof valeur === "string") return [valeur];
  if (Array.isArray(valeur)) return valeur.flatMap(chaines);
  if (valeur && typeof valeur === "object") return Object.values(valeur).flatMap(chaines);
  return [];
}

function motsDesProduits(asins) {
  if (!asins?.length || !fs.existsSync(PRODUITS)) return 0;
  const voulus = new Set(asins);
  return fs
    .readdirSync(PRODUITS)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(PRODUITS, f), "utf8")))
    .filter((p) => voulus.has(p.asin))
    .reduce((total, p) => total + mots(chaines(p).join(" ")), 0);
}

export default function remarkSommaire() {
  return (arbre) => {
    const yaml = arbre.children.find((n) => n.type === "yaml");
    const fm = yaml ? parse(yaml.value) : {};
    const total = mots(texte(arbre)) + motsDesProduits(fm.products);
    if (total < SEUIL) return;

    const titres = [];
    const pris = new Set();
    let premier = -1;
    arbre.children.forEach((noeud, i) => {
      let entree = null;
      if (noeud.type === "heading" && noeud.depth === 2) {
        const titre = texte(noeud).replace(/\s+/g, " ").trim();
        let id = ancre(titre);
        while (pris.has(id)) id += "-2";
        noeud.data = { ...noeud.data, hProperties: { ...noeud.data?.hProperties, id } };
        entree = { id, titre };
      } else if (noeud.type === "mdxJsxFlowElement" && BLOCS[noeud.name]) {
        const attributs = Object.fromEntries(
          noeud.attributes.filter((a) => typeof a.value === "string").map((a) => [a.name, a.value]),
        );
        entree = BLOCS[noeud.name](attributs);
      }
      if (!entree) return;
      pris.add(entree.id);
      titres.push(entree);
      if (premier < 0) premier = i;
    });
    if (titres.length < 3 || premier < 0) return;

    arbre.children.splice(premier, 0, {
      type: "mdxJsxFlowElement",
      name: "Sommaire",
      attributes: [{ type: "mdxJsxAttribute", name: "titres", value: JSON.stringify(titres) }],
      children: [],
    });
  };
}
