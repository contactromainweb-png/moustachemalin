// Contrôle du maillage interne, lancé après chaque construction (npm run build → postbuild).
// Lit les pages HTML produites dans .next/server/app, relève tous les liens internes, puis :
// - échoue si un lien pointe vers une page ou un fichier qui n'existe pas (lien cassé) ;
// - liste les pages orphelines : aucune autre page ne les cite (hors accueil et pages cachées aux moteurs).
import fs from "node:fs";
import path from "node:path";

const RACINE = path.join(process.cwd(), ".next", "server", "app");
const PUBLIC = path.join(process.cwd(), "public");

function fichiersHtml(dossier) {
  return fs.readdirSync(dossier, { withFileTypes: true }).flatMap((d) => {
    const chemin = path.join(dossier, d.name);
    if (d.isDirectory()) return fichiersHtml(chemin);
    return d.name.endsWith(".html") ? [chemin] : [];
  });
}

// .next/server/app/litieres/litiere-autonettoyante.html → /litieres/litiere-autonettoyante/
function adresse(fichier) {
  const rel = path.relative(RACINE, fichier).replaceAll(path.sep, "/").replace(/\.html$/, "");
  return rel === "index" ? "/" : `/${rel}/`;
}

const pages = new Map();
for (const f of fichiersHtml(RACINE)) {
  const url = adresse(f);
  if (url.startsWith("/_") || url === "/404/" || url === "/500/") continue;
  pages.set(url, fs.readFileSync(f, "utf8"));
}

const cites = new Map([...pages.keys()].map((u) => [u, new Set()]));
const casses = [];
for (const [source, html] of pages) {
  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const cible = href.split(/[?#]/)[0] || source;
    if (cible.startsWith("/_next/")) continue;
    if (cites.has(cible)) {
      if (cible !== source) cites.get(cible).add(source);
    } else if (!fs.existsSync(path.join(PUBLIC, decodeURIComponent(cible)))) {
      casses.push(`${source} → ${href}`);
    }
  }
}

const cachee = (html) => /<meta name="robots" content="noindex/.test(html);
const orphelines = [...cites]
  .filter(([url, sources]) => url !== "/" && sources.size === 0 && !cachee(pages.get(url)))
  .map(([url]) => url);

console.log(`\nContrôle des liens internes : ${pages.size} pages lues.`);
console.log(orphelines.length ? `Pages orphelines (aucun lien vers elles) :\n  ${orphelines.join("\n  ")}` : "Aucune page orpheline.");
if (casses.length) {
  console.error(`Liens internes cassés :\n  ${[...new Set(casses)].join("\n  ")}`);
  process.exit(1);
}
console.log("Aucun lien interne cassé.\n");
