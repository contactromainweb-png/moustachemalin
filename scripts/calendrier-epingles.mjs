// Calendrier des épingles fraîches (CLAUDE.md §11 ter) : réécrit le champ `publication` de chaque épingle de la liste
// `epingles:` des articles en ligne, à partir d'une date de départ (le lendemain de la fusion).
// - 2 épingles un jour, 1 le lendemain, et ainsi de suite (36 épingles → 24 jours) ;
// - les comparatifs d'abord, puis les avis, guides et outils ;
// - jamais deux épingles de suite pour le même tableau Pinterest quand c'est possible, en puisant d'abord dans le
//   tableau qui en a le plus en réserve ;
// - la variante « question » d'un article passe avant sa variante « retenir », au moins 4 épingles plus tôt.
// Lancement : node scripts/calendrier-epingles.mjs 2026-11-10   (sans date : affiche le calendrier actuel)
import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

const RACINE = process.cwd();
const TABLEAUX = {
  litieres: "Litières pour chat",
  fontaines: "Fontaines à eau pour chat",
  repas: "Distributeurs de croquettes pour chat",
  "griffer-grimper": "Arbres à chat et griffoirs",
  guides: "Conseils pour chat",
  outils: "Conseils pour chat",
  sorties: "Conseils pour chat",
};
const ORDRE_TYPES = ["comparatif", "avis", "guide", "outil"];

const articles = [];
for (const fichier of fs.readdirSync(path.join(RACINE, "content"), { recursive: true })) {
  if (!fichier.endsWith(".mdx")) continue;
  const chemin = path.join(RACINE, "content", fichier);
  const source = fs.readFileSync(chemin, "utf8");
  const fm = parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "");
  if (!fm?.epingles?.length || fm.noindex) continue;
  if (!fs.existsSync(path.join(RACINE, "src/app", fm.rubrique, fm.slug, "page.tsx"))) continue;
  articles.push({ fm, chemin });
}
articles.sort(
  (a, b) =>
    ORDRE_TYPES.indexOf(a.fm.type) - ORDRE_TYPES.indexOf(b.fm.type) ||
    (a.fm.publishedAt ?? a.fm.updatedAt).localeCompare(b.fm.publishedAt ?? b.fm.updatedAt) ||
    a.fm.slug.localeCompare(b.fm.slug),
);

const debut = process.argv[2];
if (!debut) {
  const toutes = articles.flatMap(({ fm }) => fm.epingles.map((e) => ({ fm, e })));
  toutes.sort((a, b) => a.e.publication.localeCompare(b.e.publication));
  for (const { fm, e } of toutes) console.log(`${e.publication}  ${TABLEAUX[fm.rubrique].padEnd(38)} ${fm.slug} (${e.variante})`);
  process.exit(0);
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(debut)) throw new Error("Date de départ attendue au format AAAA-MM-JJ");

const reste = articles.flatMap(({ fm, chemin }) =>
  fm.epingles.map((e, i) => ({
    fm,
    chemin,
    i,
    variante: e.variante,
    tableau: TABLEAUX[fm.rubrique],
    groupe: fm.type === "comparatif" ? 0 : 1,
  })),
);
const suite = [];
const enReserve = (tableau, groupe) => reste.filter((p) => p.tableau === tableau && p.groupe === groupe).length;
while (reste.length) {
  const groupe = Math.min(...reste.map((p) => p.groupe));
  const precedent = suite.at(-1)?.tableau;
  const pret = (p) => {
    if (p.groupe !== groupe) return false;
    if (p.variante === "question") return true;
    const question = suite.findIndex((s) => s.fm.slug === p.fm.slug && s.variante === "question");
    const resteQuestion = reste.some((s) => s.fm.slug === p.fm.slug && s.variante === "question");
    return !resteQuestion && (question < 0 || suite.length - question >= 4);
  };
  let candidats = reste.filter((p) => pret(p) && p.tableau !== precedent);
  if (!candidats.length) candidats = reste.filter(pret);
  if (!candidats.length) candidats = reste.filter((p) => p.groupe === groupe);
  candidats.sort((a, b) => enReserve(b.tableau, groupe) - enReserve(a.tableau, groupe) || reste.indexOf(a) - reste.indexOf(b));
  const choisi = candidats[0];
  reste.splice(reste.indexOf(choisi), 1);
  suite.push(choisi);
}

// 2 épingles le premier jour, 1 le suivant, et ainsi de suite.
const jour = (n) => {
  const d = new Date(`${debut}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
let n = 0;
let dansLeJour = 0;
for (const p of suite) {
  p.date = jour(n);
  dansLeJour++;
  if (dansLeJour === (n % 2 === 0 ? 2 : 1)) {
    n++;
    dansLeJour = 0;
  }
}

// Réécriture : la n-ième ligne `publication:` de la liste `epingles:` de chaque fichier.
for (const { chemin } of articles) {
  const dates = suite.filter((p) => p.chemin === chemin).sort((a, b) => a.i - b.i).map((p) => p.date);
  let source = fs.readFileSync(chemin, "utf8");
  const debutListe = source.indexOf("\nepingles:");
  let k = 0;
  const avant = source.slice(0, debutListe);
  const apres = source.slice(debutListe).replace(/^( {4}publication: )"?[\d-]+"?$/gm, (ligne, prefixe) => `${prefixe}"${dates[k++] ?? ligne}"`);
  source = avant + apres;
  if (k !== dates.length) throw new Error(`${chemin} : ${dates.length} dates attendues, ${k} lignes publication trouvées`);
  fs.writeFileSync(chemin, source);
}
for (const p of suite) console.log(`${p.date}  ${p.tableau.padEnd(38)} ${p.fm.slug} (${p.variante})`);
console.log(`${suite.length} épingles, du ${suite[0]?.date} au ${suite.at(-1)?.date}.`);
