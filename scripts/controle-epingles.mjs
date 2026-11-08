// Contrôle des épingles fraîches (CLAUDE.md §11 ter), lancé après chaque construction (postbuild).
// Échoue si :
// - l'ancre d'une épingle n'existe pas sur la page construite de l'article (id="…") ;
// - son image /pins/<slug>-<variante>.jpg manque ou dépasse 300 Ko ;
// - un même guid apparaît deux fois dans les flux de rubrique.
import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

const RACINE = process.cwd();
const APP = path.join(RACINE, ".next", "server", "app");
const erreurs = [];
let total = 0;

for (const fichier of fs.readdirSync(path.join(RACINE, "content"), { recursive: true })) {
  if (!fichier.endsWith(".mdx")) continue;
  const source = fs.readFileSync(path.join(RACINE, "content", fichier), "utf8");
  const fm = parse(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "");
  if (!fm?.epingles?.length || fm.noindex) continue;
  if (!fs.existsSync(path.join(RACINE, "src/app", fm.rubrique, fm.slug, "page.tsx"))) continue;
  const page = path.join(APP, fm.rubrique, `${fm.slug}.html`);
  const html = fs.existsSync(page) ? fs.readFileSync(page, "utf8") : "";
  if (!html) erreurs.push(`${fm.rubrique}/${fm.slug} : page construite introuvable`);
  for (const e of fm.epingles) {
    total++;
    if (html && !html.includes(` id="${e.ancre}"`)) erreurs.push(`/${fm.rubrique}/${fm.slug}/#${e.ancre} : ancre absente de la page`);
    const image = path.join(RACINE, "public", "pins", `${fm.slug}-${e.variante}.jpg`);
    if (!fs.existsSync(image)) erreurs.push(`${image} : image manquante`);
    else if (fs.statSync(image).size > 300 * 1024) erreurs.push(`${image} : plus de 300 Ko`);
  }
}

const guids = new Map();
for (const flux of ["litieres", "fontaines", "repas", "griffer-grimper", "conseils"]) {
  const corps = path.join(APP, flux, "feed.xml.body");
  if (!fs.existsSync(corps)) continue;
  for (const [, guid] of fs.readFileSync(corps, "utf8").matchAll(/<guid[^>]*>([^<]+)<\/guid>/g)) {
    if (guids.has(guid)) erreurs.push(`guid en double : ${guid} (${guids.get(guid)} et ${flux})`);
    guids.set(guid, flux);
  }
}

console.log(`\nContrôle des épingles fraîches : ${total} épingles, ${guids.size} éléments dans les flux de rubrique.`);
if (erreurs.length) {
  console.error(`✗ ${erreurs.length} problème(s) :\n- ${erreurs.join("\n- ")}`);
  process.exit(1);
}
console.log("Ancres, images et guid corrects.");
