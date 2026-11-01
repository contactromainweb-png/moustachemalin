// Contrôle des titres, lancé après chaque construction (npm run build → postbuild), après celui des liens.
// Lit les pages HTML produites dans .next/server/app et échoue si un même titre H2 apparaît deux fois sur une
// page (ex. « À lire aussi » écrit dans l'article ET affiché par le composant RelatedArticles), si un titre (H1 à H6)
// répète son propre texte (ex. une copie pour lecteurs d'écran + une copie visible), si une page affiche à la fois
// « À lire aussi » et « Pour aller plus loin », ou si une page avis dit « ce comparatif repose sur ». Signale aussi,
// sans bloquer, les titres et descriptions trop longs.
import fs from "node:fs";
import path from "node:path";

const RACINE = path.join(process.cwd(), ".next", "server", "app");

function fichiersHtml(dossier) {
  return fs.readdirSync(dossier, { withFileTypes: true }).flatMap((d) => {
    const chemin = path.join(dossier, d.name);
    if (d.isDirectory()) return fichiersHtml(chemin);
    return d.name.endsWith(".html") ? [chemin] : [];
  });
}

// Texte d'un titre : balises retirées, entités et espaces (fines comprises) ramenés à une forme simple.
const texte = (html) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;|&#160;|&#8239;|[  \s]+/g, " ")
    .trim()
    .toLowerCase();

let lues = 0;
const doublons = [];
const erreurs = [];
const longs = [];
// Texte qui n'est qu'une même suite répétée (« abcabc ») : (s + s).indexOf(s, 1) tombe avant la fin de s.
const seRepete = (t) => {
  const s = t.replace(/\s/g, "");
  return s.length >= 6 && (s + s).indexOf(s, 1) < s.length;
};
for (const f of fichiersHtml(RACINE)) {
  const rel = path.relative(RACINE, f).replaceAll(path.sep, "/").replace(/\.html$/, "");
  if (rel.startsWith("_")) continue;
  lues++;
  const url = rel === "index" ? "/" : `/${rel}/`;
  const html = fs.readFileSync(f, "utf8");
  const vus = new Map();
  for (const [, contenu] of html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)) {
    const t = texte(contenu);
    vus.set(t, (vus.get(t) ?? 0) + 1);
  }
  for (const [t, n] of vus) if (n > 1) doublons.push(`${url} : « ${t} » × ${n}`);
  for (const [, , contenu] of html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)) {
    const t = texte(contenu);
    if (seRepete(t)) erreurs.push(`${url} : titre dont le texte se répète « ${t} »`);
  }
  if (html.includes('id="a-lire-aussi"') && html.includes('id="pour-aller-plus-loin"'))
    erreurs.push(`${url} : « À lire aussi » et « Pour aller plus loin » sur la même page (garder le second)`);
  // « Pour aller plus loin » hors des litières : jamais le comparatif litières par défaut (CLAUDE.md §11).
  const plusLoin = html.match(/id="pour-aller-plus-loin"[\s\S]*?<\/section>/)?.[0] ?? "";
  if (!url.startsWith("/litieres/") && plusLoin.includes('href="/litieres/litiere-autonettoyante/"'))
    erreurs.push(`${url} : « Pour aller plus loin » renvoie au comparatif litières hors de sa rubrique`);
  // React sépare un texte variable du texte fixe par <!-- --> : retirés avant de chercher la phrase.
  if (/-avis\/$/.test(url) && html.replaceAll("<!-- -->", "").includes("ce comparatif repose sur"))
    erreurs.push(`${url} : page avis, la méthode doit dire « cet avis repose sur » (<MethodNote avis />)`);
  // Longueurs conseillées pour Google (CLAUDE.md §7) : signalées sans bloquer le build.
  const titre = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (titre && [...texte(titre)].length > 60) longs.push(`${url} : titre de ${[...texte(titre)].length} caractères`);
  if (description && [...texte(description)].length > 155)
    longs.push(`${url} : description de ${[...texte(description)].length} caractères`);
}

console.log(`Contrôle des titres : ${lues} pages lues.`);
if (longs.length) console.log(`À raccourcir (titre ≤ 60, description ≤ 155) :\n  ${longs.join("\n  ")}`);
if (doublons.length) console.error(`Titres H2 en double sur une même page :\n  ${doublons.join("\n  ")}`);
if (erreurs.length) console.error(`À corriger :\n  ${erreurs.join("\n  ")}`);
if (doublons.length || erreurs.length) process.exit(1);
console.log("Aucun titre H2 en double ni titre répété ; un seul bloc de liens en bas ; méthode des avis correcte.\n");
