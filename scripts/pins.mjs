// Images Pinterest : une image verticale 1000 × 1500 px par article en ligne (comparatif, avis, guide, outil),
// fabriquée avant chaque build (npm « prebuild ») dans public/pins/<slug>.jpg (dossier non suivi par git).
// - fond : la photo d'en-tête de l'article (déjà créditée), recadrée dans les deux tiers du haut, fondue en bas
//   dans le bleu nuit qui porte le texte ;
// - texte : le titre court en Bricolage Grotesque 800 crème, le `motSerif` en Instrument Serif italique orange,
//   puis la fin du titre en DM Sans ; en bas, le symbole du logo + « moustachemalin.fr ». Aucun prix, logo de
//   marque ni note.
// Titre court : la partie du titre avant « : » (ou jusqu'au « ? »), sauf si le frontmatter donne `pinTitre`.
// Cadrage : `pinCadrage` du frontmatter (ex. "62% 50%"), sinon la `position` de la photo, sinon le centre.
// Le texte est dessiné par next/og (mêmes polices TTF que l'image de partage), puis converti en JPEG par sharp.
// Lancement à la main : node --no-warnings scripts/pins.mjs
import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og.js";
import { createElement as h } from "react";
import sharp from "sharp";
import { parse } from "yaml";
import { EPINGLES_BANDE } from "../src/lib/bande.ts";
import { PHOTOS } from "../src/lib/medias.ts";

const RACINE = process.cwd();
const SORTIE = path.join(RACINE, "public/pins");
const LARGEUR = 1000;
const HAUTEUR = 1500;
const PHOTO = 1060; // hauteur de la photo, en haut ; le texte est dessous, sur le bleu nuit
const FONDU = 300; // hauteur du dégradé qui fond le bas de la photo dans le bleu nuit
const TYPES = new Set(["comparatif", "avis", "guide", "outil"]);
const POIDS_MAX = 300 * 1024;

const lirePolice = (nom) => fs.readFileSync(path.join(RACINE, "src/app/polices/og", nom));
const POLICES = [
  { name: "Bricolage Grotesque", data: lirePolice("bricolage-grotesque-800-88.ttf"), weight: 800, style: "normal" },
  { name: "Instrument Serif", data: lirePolice("instrument-serif-italique.ttf"), weight: 400, style: "italic" },
  { name: "DM Sans", data: lirePolice("dm-sans-400.ttf"), weight: 400, style: "normal" },
];
const SYMBOLE = `data:image/svg+xml;base64,${fs.readFileSync(path.join(RACINE, "public/brand/logo-mark.svg")).toString("base64")}`;

// Articles en ligne : un fichier content/<rubrique>/<slug>.mdx dont la page src/app/<rubrique>/<slug>/ existe.
function articlesAEpingler() {
  const articles = [];
  for (const dossier of fs.readdirSync(path.join(RACINE, "content"), { withFileTypes: true })) {
    if (!dossier.isDirectory()) continue;
    for (const fichier of fs.readdirSync(path.join(RACINE, "content", dossier.name))) {
      if (!fichier.endsWith(".mdx")) continue;
      const source = fs.readFileSync(path.join(RACINE, "content", dossier.name, fichier), "utf8");
      const bloc = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!bloc) continue;
      const fm = parse(bloc[1]);
      if (!TYPES.has(fm.type) || fm.noindex) continue;
      if (!fs.existsSync(path.join(RACINE, "src/app", fm.rubrique, fm.slug, "page.tsx"))) continue;
      articles.push(fm);
    }
  }
  return articles;
}

// « Chatière : notre comparatif 2026 » → ["Chatière", "notre comparatif 2026"] ;
// « Combien d'eau doit boire mon chat ? Le calculateur » → ["Combien d'eau doit boire mon chat ?", "Le calculateur"].
function decouperTitre(titre) {
  const deuxPoints = titre.indexOf(" : ");
  if (deuxPoints > 0) return [titre.slice(0, deuxPoints), titre.slice(deuxPoints + 3)];
  const question = titre.indexOf(" ? ");
  if (question > 0) return [titre.slice(0, question + 2), titre.slice(question + 3)];
  return [titre, ""];
}

// Le titre court, mot par mot : le `motSerif` (s'il y figure) passe en serif italique orange.
function titreEnMots(court, motSerif) {
  const i = motSerif ? court.indexOf(motSerif) : -1;
  if (i < 0) return [{ texte: court, serif: false }];
  return [
    { texte: court.slice(0, i), serif: false },
    { texte: motSerif, serif: true },
    { texte: court.slice(i + motSerif.length), serif: false },
  ].filter((m) => m.texte.trim());
}

// Recadrage de la photo au format de sa zone (1000 × 1060), centré sur le point de cadrage (pourcentages CSS object-position).
async function fond(photo, cadrage) {
  const fichier = path.join(RACINE, "public", photo.src);
  const { width: w, height: h } = await sharp(fichier).metadata();
  const [px, py] = (cadrage ?? photo.position ?? "50% 50%").split(" ").map((v) => parseFloat(v) / 100);
  const largeur = Math.min(w, Math.round((h * LARGEUR) / PHOTO));
  const hauteur = Math.min(h, Math.round((largeur * PHOTO) / LARGEUR));
  // Photo trop petite pour remplir la zone sans l'agrandir (Rebelle, 1341 × 746) : elle garde toute sa largeur, posée
  // sur sa propre version floutée, jamais agrandie au-delà de sa taille d'origine.
  if (largeur < LARGEUR) {
    const nette = await sharp(fichier).resize({ width: LARGEUR }).toBuffer({ resolveWithObject: true });
    const tampon = await sharp(fichier)
      .resize(LARGEUR, PHOTO, { fit: "cover" })
      .blur(30)
      .modulate({ brightness: 0.75 })
      .composite([{ input: nette.data, top: 0, left: 0 }])
      .jpeg({ quality: 90 })
      .toBuffer();
    return `data:image/jpeg;base64,${tampon.toString("base64")}`;
  }
  const tampon = await sharp(fichier)
    .extract({
      left: Math.round((w - largeur) * px),
      top: Math.round((h - hauteur) * (Number.isNaN(py) ? 0.5 : py)),
      width: largeur,
      height: hauteur,
    })
    .resize(LARGEUR, PHOTO)
    .jpeg({ quality: 90 })
    .toBuffer();
  return `data:image/jpeg;base64,${tampon.toString("base64")}`;
}

async function epingleArticle(fm) {
  const photo = PHOTOS[fm.photo];
  if (!photo) throw new Error(`${fm.slug} : pas de photo d'en-tête (champ photo du frontmatter)`);
  const [court, suite] = fm.pinTitre ? [fm.pinTitre, ""] : decouperTitre(fm.title);
  return epingle({ slug: fm.slug, photo, cadrage: fm.pinCadrage, court, suite, motSerif: fm.motSerif });
}

async function epingle({ slug, photo, cadrage, court, suite, motSerif }) {
  const taille = court.length > 34 ? 92 : court.length > 22 ? 108 : 124;

  const page = h(
    "div",
    { style: { width: "100%", height: "100%", display: "flex", position: "relative", background: "#14213D" } },
    h("img", { src: await fond(photo, cadrage), width: LARGEUR, height: PHOTO, style: { position: "absolute", top: 0, left: 0 } }),
    h("div", {
      style: {
        position: "absolute",
        top: PHOTO - FONDU,
        left: 0,
        width: LARGEUR,
        height: FONDU,
        display: "flex",
        backgroundImage:
          "linear-gradient(to bottom, rgba(20,33,61,0) 0%, rgba(20,33,61,0.55) 45%, rgba(20,33,61,0.9) 75%, rgba(20,33,61,1) 100%)",
      },
    }),
    h(
      "div",
      {
        style: {
          position: "absolute",
          left: 72,
          right: 72,
          bottom: 64,
          display: "flex",
          flexDirection: "column",
          color: "#FAF7F2",
        },
      },
      h(
        "div",
        { style: { display: "flex", flexWrap: "wrap", fontSize: taille, lineHeight: 0.95, letterSpacing: "-0.035em" } },
        ...titreEnMots(court, motSerif).flatMap((m) =>
          m.texte
            .trim()
            .split(/\s+/)
            .map((mot) =>
              h(
                "span",
                {
                  style: m.serif
                    ? { fontFamily: "Instrument Serif", fontSize: taille * 1.12, color: "#FF7A1A", letterSpacing: "-0.01em", marginRight: "0.24em" }
                    : { fontFamily: "Bricolage Grotesque", marginRight: "0.24em" },
                },
                mot,
              ),
            ),
        ),
      ),
      suite ? h("div", { style: { fontFamily: "DM Sans", fontSize: 40, marginTop: 30, lineHeight: 1.25 } }, suite) : null,
      h(
        "div",
        { style: { display: "flex", alignItems: "center", gap: 18, marginTop: 52 } },
        h("img", { src: SYMBOLE, width: 62, height: 65 }),
        h("span", { style: { fontFamily: "Bricolage Grotesque", fontSize: 36, letterSpacing: "-0.02em" } }, "moustachemalin.fr"),
      ),
    ),
  );

  const png = Buffer.from(await new ImageResponse(page, { width: LARGEUR, height: HAUTEUR, fonts: POLICES }).arrayBuffer());
  const cible = path.join(SORTIE, `${slug}.jpg`);
  let qualite = 82;
  await sharp(png).jpeg({ quality: qualite, mozjpeg: true }).toFile(cible);
  while (fs.statSync(cible).size > POIDS_MAX && qualite > 60) {
    qualite -= 6;
    await sharp(png).jpeg({ quality: qualite, mozjpeg: true }).toFile(cible);
  }
  return { slug, ko: Math.round(fs.statSync(cible).size / 1024), qualite };
}

fs.mkdirSync(SORTIE, { recursive: true });
const articles = articlesAEpingler();
const bande = EPINGLES_BANDE.map((e) => ({ slug: e.slug, photo: e.photo, court: e.titre, suite: e.texte, motSerif: e.motSerif }));
for (const travail of [...articles.map((fm) => () => epingleArticle(fm)), ...bande.map((e) => () => epingle(e))]) {
  const { slug, ko, qualite } = await travail();
  console.log(`public/pins/${slug}.jpg : ${ko} Ko (qualité ${qualite})`);
}
console.log(`Images Pinterest : ${articles.length} articles, ${bande.length} pour « Kira et la bande ».`);
