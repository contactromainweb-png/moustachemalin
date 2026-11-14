// Contrôle du maillage interne, lancé après chaque construction (npm run build → postbuild).
// Lit les pages HTML produites dans .next/server/app, relève tous les liens internes, puis :
// - échoue si un lien pointe vers une page ou un fichier qui n'existe pas (lien cassé) ;
// - liste les pages orphelines : aucune autre page ne les cite (hors accueil et pages cachées aux moteurs) ;
// - échoue si un comparatif a une liste `plusLoin:` et qu'un de ses satellites, absent de cette liste, n'a aucun lien
//   dans le corps du comparatif (CLAUDE.md §11, maillage interne).
import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

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
// Comparatifs avec `plusLoin:` : chaque satellite en ligne (pilier ou autresPiliers) hors de la liste doit être cité
// dans le corps de la page, c'est-à-dire hors du bloc « Pour aller plus loin ».
const CONTENU = path.join(process.cwd(), "content");
const articles = fs
  .readdirSync(CONTENU, { recursive: true })
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => parse(fs.readFileSync(path.join(CONTENU, f), "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "") ?? {})
  .filter((fm) => fm.slug && fm.rubrique && !fm.noindex && pages.has(`/${fm.rubrique}/${fm.slug}/`));
const nonRelies = [];
for (const pilier of articles.filter((fm) => fm.type === "comparatif" && fm.plusLoin)) {
  const url = `/${pilier.rubrique}/${pilier.slug}/`;
  const corps = pages.get(url).replace(/<section[^>]*aria-labelledby="pour-aller-plus-loin"[\s\S]*?<\/section>/, "");
  for (const sat of articles) {
    if (sat.slug === pilier.slug || pilier.plusLoin.includes(sat.slug)) continue;
    if (sat.pilier !== pilier.slug && !sat.autresPiliers?.includes(pilier.slug)) continue;
    const cible = `/${sat.rubrique}/${sat.slug}/`;
    if (!new RegExp(`<a\\b[^>]*href="${cible}(#[^"]*)?"`).test(corps)) nonRelies.push(`${url} → ${cible}`);
  }
}
if (nonRelies.length) {
  console.error(
    `Satellites absents de « plusLoin » et sans lien dans le corps du comparatif :\n  ${nonRelies.join("\n  ")}`,
  );
  process.exit(1);
}

if (casses.length) {
  console.error(`Liens internes cassés :\n  ${[...new Set(casses)].join("\n  ")}`);
  process.exit(1);
}
console.log("Aucun lien interne cassé.\n");
