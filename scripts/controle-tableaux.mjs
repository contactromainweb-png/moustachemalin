// Contrôle des tableaux comparatifs, lancé après chaque construction (npm run build → postbuild).
// Pour chaque <ComparisonTable> des articles, compte les cases « Non précisé » (spec absente du JSON produit).
// Signale, sans bloquer : un tableau de plus de 3 cases « Non précisé », et une colonne vide pour plus d'un tiers
// des produits (elle sort du tableau principal et reste dans les fiches détaillées, CLAUDE.md §5).
import fs from "node:fs";
import path from "node:path";

const RACINE = process.cwd();
const produits = new Map();
for (const f of fs.readdirSync(path.join(RACINE, "content", "products"))) {
  if (!f.endsWith(".json")) continue;
  const p = JSON.parse(fs.readFileSync(path.join(RACINE, "content", "products", f), "utf8"));
  produits.set(p.asin, p);
}

const avertissements = [];
let tableaux = 0;
for (const rubrique of fs.readdirSync(path.join(RACINE, "content"), { withFileTypes: true })) {
  if (!rubrique.isDirectory() || ["products", "exemples"].includes(rubrique.name)) continue;
  for (const f of fs.readdirSync(path.join(RACINE, "content", rubrique.name))) {
    if (!f.endsWith(".mdx")) continue;
    const source = fs.readFileSync(path.join(RACINE, "content", rubrique.name, f), "utf8");
    for (const [bloc] of source.matchAll(/<ComparisonTable[\s\S]*?\/>/g)) {
      tableaux++;
      const liste = (cle) => [...(bloc.match(new RegExp(`${cle}=\\{\\[([^\\]]*)\\]`))?.[1] ?? "").matchAll(/"([^"]+)"/g)].map((m) => m[1]);
      const asins = liste("asins");
      const colonnes = liste("columns");
      const page = `/${rubrique.name}/${f.replace(/\.mdx$/, "")}/`;
      let vides = 0;
      for (const c of colonnes) {
        const manque = asins.filter((a) => !produits.get(a)?.specs?.[c]).length;
        vides += manque;
        if (manque * 3 > asins.length)
          avertissements.push(`${page} : colonne « ${c} » vide pour ${manque} produits sur ${asins.length} (plus d'un tiers)`);
      }
      if (vides > 3) avertissements.push(`${page} : ${vides} cases « Non précisé » dans le tableau (3 au plus conseillé)`);
    }
  }
}

console.log(`Contrôle des tableaux : ${tableaux} tableaux lus.`);
if (avertissements.length) console.log(`À compléter :\n  ${avertissements.join("\n  ")}\n`);
else console.log("Aucun tableau avec plus de 3 « Non précisé ».\n");
