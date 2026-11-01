// Contrôle des images en double, lancé après chaque construction (npm run build → postbuild).
// Lit les pages HTML produites dans .next/server/app et échoue si une même image apparaît deux fois sur une page
// (hors pied de page). Une image est reconnue par son fichier d'origine : /_next/image?url=/media/x.jpg&w=640 et
// /media/x.jpg comptent pour la même, comme les déclinaisons de la photo du premier écran (chat-blanc-640.avif…).
// La page est vue deux fois, comme sur un téléphone puis sur un ordinateur : un bloc réservé à l'ordinateur
// (classes max-lg:hidden, tactile:hidden) et sa variante pour téléphone (lg:hidden, hidden + tactile:block) ne
// s'affichent jamais ensemble, ils ne sont donc pas comparés entre eux.
import fs from "node:fs";
import path from "node:path";

const RACINE = path.join(process.cwd(), ".next", "server", "app");
const VIDES = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

function fichiersHtml(dossier) {
  return fs.readdirSync(dossier, { withFileTypes: true }).flatMap((d) => {
    const chemin = path.join(dossier, d.name);
    if (d.isDirectory()) return fichiersHtml(chemin);
    return d.name.endsWith(".html") ? [chemin] : [];
  });
}

function adresse(fichier) {
  const rel = path.relative(RACINE, fichier).replaceAll(path.sep, "/").replace(/\.html$/, "");
  return rel === "index" ? "/" : `/${rel}/`;
}

const attribut = (balise, nom) => balise.match(new RegExp(`\\s${nom}="([^"]*)"`, "i"))?.[1];

// Fichier d'origine d'une balise <img> : son src, ou à défaut la première adresse de son srcset.
function origine(balise) {
  let src = attribut(balise, "src") || attribut(balise, "srcset")?.split(/\s/)[0];
  if (!src) return null;
  src = src.replaceAll("&amp;", "&");
  if (src.includes("/_next/image")) src = decodeURIComponent(new URL(src, "https://x").searchParams.get("url") || src);
  return src.replace(/^https?:\/\/[^/]+/, "").replace(/-\d{3,4}\.(avif|webp)$/, "");
}

// Appareil sur lequel un élément s'affiche, d'après ses classes : "ordinateur", "telephone" ou rien (les deux).
function appareil(balise) {
  const classes = new Set((attribut(balise, "class") || "").split(/\s+/));
  if (classes.has("max-lg:hidden") || classes.has("tactile:hidden")) return "ordinateur";
  if (classes.has("lg:hidden") || (classes.has("hidden") && classes.has("tactile:block"))) return "telephone";
  return null;
}

// Toutes les images de la page, chacune avec l'appareil qui l'affiche (hérité du bloc le plus proche qui en dépend).
function images(html) {
  const pile = [];
  const trouvees = [];
  for (const [balise, fermante, nom] of html.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*>/g)) {
    const tag = nom.toLowerCase();
    if (fermante) {
      const i = pile.findLastIndex((e) => e.tag === tag);
      if (i >= 0) pile.length = i;
      continue;
    }
    const herite = pile.findLast((e) => e.appareil)?.appareil ?? null;
    const ici = appareil(balise) ?? herite;
    if (tag === "img") {
      const src = origine(balise);
      if (src) trouvees.push({ src, appareil: ici });
    }
    if (!VIDES.has(tag) && !balise.endsWith("/>")) pile.push({ tag, appareil: ici });
  }
  return trouvees;
}

const doublons = [];
let total = 0;
for (const f of fichiersHtml(RACINE)) {
  const url = adresse(f);
  if (url.startsWith("/_") || url === "/500/") continue;
  total++;
  const html = fs
    .readFileSync(f, "utf8")
    .replace(/<(script|style|template)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<footer\b[\s\S]*?<\/footer>/g, "");
  const liste = images(html);
  for (const vue of ["telephone", "ordinateur"]) {
    const vues = new Map();
    for (const { src } of liste.filter((i) => i.appareil === null || i.appareil === vue)) vues.set(src, (vues.get(src) || 0) + 1);
    for (const [src, n] of vues) if (n > 1) doublons.push(`${url} (${vue}) : ${src} (${n} fois)`);
  }
}

console.log(`Contrôle des images : ${total} pages lues, vues téléphone et ordinateur.`);
if (doublons.length) {
  console.error(`Images en double sur une même page :\n  ${doublons.join("\n  ")}`);
  process.exit(1);
}
console.log("Aucune image en double.\n");
