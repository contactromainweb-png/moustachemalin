// Images Pinterest : une image verticale 1000 × 1500 px par article en ligne (comparatif, avis, guide, outil), plus ses 2 « épingles
// fraîches » (variantes question et à retenir, liste `epingles:` du frontmatter, voir plus bas et CLAUDE.md §11 ter),
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

// ── Épingles fraîches (CLAUDE.md §11 ter) : 2 visuels de plus par article, liste `epingles:` du frontmatter ──
// Variante « question » : une autre photo que celle d'en-tête, en grand, et une accroche (question ou problème).
// Variante « retenir » : fond crème ou lavande, petite photo, l'accroche en titre et 3 points courts.
// Les règles ci-dessous font échouer le build : un texte trop long ou une photo interdite ne part jamais sur Pinterest.
const CREME = "#FAF7F2";
const LAVANDE = "#B9A6FF";
const NUIT = "#14213D";
const ORANGE = "#FF7A1A";
const CREDITES = new Set(JSON.parse(fs.readFileSync(path.join(RACINE, "content/credits.json"), "utf8")).map((c) => c.fichier));
const FAMILLE = /^(kira|sucette|blackPearl|rebelle|imotep|chichoune|romain)/;
const INTERDITS = /€|\beuros?\b|\btest(é|ée|és|ées)\b|\/\s*(5|10|20)\b|étoiles?\b/i;
// Un « mot » contient au moins une lettre ou un chiffre : « ? », « : » ou « % » seuls ne comptent pas.
const mots = (texte) => texte.split(/\s+/).filter((m) => /[\p{L}\p{N}]/u.test(m)).length;
const phrases = (texte) => (texte.trim().match(/[.!?…](?=\s|$)/g) ?? []).length;

function verifierEpingles(articles) {
  const erreurs = [];
  const titres = new Map();
  for (const fm of articles) {
    const liste = fm.epingles ?? [];
    const err = (m) => erreurs.push(`${fm.rubrique}/${fm.slug} : ${m}`);
    if (liste.length !== 2) err(`il faut 2 épingles (epingles:), pas ${liste.length}`);
    if (new Set(liste.map((e) => e.variante)).size !== liste.length) err("les 2 épingles doivent être de variantes différentes");
    if (liste.length === 2 && liste[0].photo === liste[1].photo) err("les 2 épingles utilisent la même photo");
    if (liste.length === 2 && liste[0].titre === liste[1].titre) err("les 2 épingles ont le même titre");
    if (liste.length === 2 && liste[0].description === liste[1].description) err("les 2 épingles ont la même description");
    for (const e of liste) {
      const ici = `épingle « ${e.variante} »`;
      if (!["question", "retenir"].includes(e.variante)) err(`${ici} : variante inconnue`);
      if (!e.accroche || mots(e.accroche) > 12) err(`${ici} : accroche absente ou de plus de 12 mots`);
      if (e.motSerif && !e.accroche?.includes(e.motSerif)) err(`${ici} : motSerif absent de l'accroche`);
      if (e.variante === "retenir") {
        if (e.points?.length !== 3) err(`${ici} : il faut 3 points`);
        for (const p of e.points ?? []) if (mots(p) > 6) err(`${ici} : point de plus de 6 mots : « ${p} »`);
        if (!["creme", "lavande"].includes(e.fond)) err(`${ici} : fond creme ou lavande`);
      } else if (e.points) err(`${ici} : pas de points dans la variante question`);
      const photo = PHOTOS[e.photo];
      if (!photo) err(`${ici} : photo inconnue ${e.photo}`);
      else if (!CREDITES.has(`public${photo.src}`)) err(`${ici} : photo ${e.photo} absente de content/credits.json`);
      if (e.photo === fm.photo) err(`${ici} : c'est la photo d'en-tête de l'article`);
      if (FAMILLE.test(e.photo ?? "")) err(`${ici} : photo de la famille de Romain, réservée au tableau Kira`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(e.publication))) err(`${ici} : publication au format AAAA-MM-JJ`);
      if (!/^[a-z0-9-]+$/.test(e.ancre ?? "")) err(`${ici} : ancre absente ou invalide`);
      if (!e.titre || [fm.title, fm.metaTitle, fm.pinTitre].includes(e.titre)) err(`${ici} : titre absent ou identique à celui de l'article`);
      if (!e.description || e.description === fm.description) err(`${ici} : description absente ou identique à celle de l'article`);
      if (e.description && phrases(e.description) > 2) err(`${ici} : description de plus de 2 phrases`);
      for (const texte of [e.accroche, e.titre, e.description, ...(e.points ?? [])])
        if (texte && INTERDITS.test(texte)) err(`${ici} : prix, note ou « testé » interdit : « ${texte} »`);
      if (titres.has(e.titre)) err(`${ici} : titre déjà pris par ${titres.get(e.titre)}`);
      titres.set(e.titre, fm.slug);
    }
  }
  if (erreurs.length) throw new Error(`Épingles fraîches refusées :\n- ${erreurs.join("\n- ")}`);
}

// Recadrage à un format donné autour du point de cadrage, sans jamais agrandir la source au-delà de sa taille.
async function recadrage(photo, cadrage, largeurZone, hauteurZone) {
  const fichier = path.join(RACINE, "public", photo.src);
  const { width: w, height: h } = await sharp(fichier).metadata();
  const [px, py] = (cadrage ?? photo.position ?? "50% 50%").split(" ").map((v) => parseFloat(v) / 100);
  const largeur = Math.min(w, Math.round((h * largeurZone) / hauteurZone));
  const hauteur = Math.min(h, Math.round((largeur * hauteurZone) / largeurZone));
  if (largeur < largeurZone) throw new Error(`${photo.src} : trop petite pour ${largeurZone} × ${hauteurZone} px sans l'agrandir`);
  const tampon = await sharp(fichier)
    .extract({
      left: Math.round((w - largeur) * (Number.isNaN(px) ? 0.5 : px)),
      top: Math.round((h - hauteur) * (Number.isNaN(py) ? 0.5 : py)),
      width: largeur,
      height: hauteur,
    })
    .resize(largeurZone, hauteurZone)
    .jpeg({ quality: 90 })
    .toBuffer();
  return `data:image/jpeg;base64,${tampon.toString("base64")}`;
}

// Jamais de chiffre seul en début ou en fin de ligne : espace insécable entre un nombre et le mot qui le suit
// (« 3 repères », « 8 kg », « 2,4 GHz »), entre un nombre final et le mot d'avant, et dans « Pura Max 2 ».
// Les textes sont ensuite découpés aux seules espaces ordinaires.
const INSECABLE = " ";
function insecables(texte) {
  return texte
    .replace(/Pura Max 2/g, `Pura${INSECABLE}Max${INSECABLE}2`)
    // Après une espace ordinaire seulement : le « 2 » de « Pura Max 2 » ne s'accroche pas au mot suivant.
    .replace(/(^| )(\d[\d,.]*) (?=\S)/g, `$1$2${INSECABLE}`)
    .replace(/ (\d[\d,.]*)(?=(\s?[?!:;])?$)/, `${INSECABLE}$1`);
}

// L'accroche, mot par mot (le `motSerif` en serif italique orange). Une ponctuation détachée (« ? », « : ») reste
// collée au mot d'avant, pour ne jamais se retrouver seule en début de ligne.
function accrocheEnMots(accroche, motSerif, taille, couleur, couleurSerif) {
  const mots = [];
  for (const m of titreEnMots(insecables(accroche), motSerif && insecables(motSerif)))
    for (const mot of m.texte.trim().split(/ +/)) {
      // « ? », « ! », « : », « ; » prennent une espace insécable avant (typographie française) ; « , » et « . » se collent.
      if (!/[\p{L}\p{N}]/u.test(mot) && mots.length) mots[mots.length - 1].texte += /^[,.…]/.test(mot) ? mot : ` ${mot}`;
      else mots.push({ texte: mot, serif: m.serif });
    }
  // Un mot d'une ou deux lettres (« la », « de », « à ») reste avec le mot qui le suit (même style), jamais seul en fin de ligne.
  for (let i = mots.length - 2; i >= 0; i--)
    if (mots[i].serif === mots[i + 1].serif && mots[i].texte.replace(/[^\p{L}]/gu, "").length <= 2 && !/\d/.test(mots[i].texte))
      mots.splice(i, 2, { texte: `${mots[i].texte} ${mots[i + 1].texte}`, serif: mots[i].serif });
  // Pas de mot seul sur la dernière ligne : les deux derniers mots (même style) restent ensemble.
  const [avant, dernier] = mots.slice(-2);
  if (dernier && avant.serif === dernier.serif && avant.texte.length + dernier.texte.length <= 16) mots.splice(-2, 2, { texte: `${avant.texte} ${dernier.texte}`, serif: avant.serif });
  return mots.map((m) =>
    h(
      "span",
      {
        style: m.serif
          ? { fontFamily: "Instrument Serif", fontSize: taille * 1.12, color: couleurSerif, letterSpacing: "-0.01em", marginRight: "0.24em", whiteSpace: "nowrap" }
          : { fontFamily: "Bricolage Grotesque", color: couleur, marginRight: "0.24em", whiteSpace: "nowrap" },
      },
      // Chaque bloc ne se coupe jamais à l'intérieur (ni aux espaces insécables, ni au trait d'union de « convient-elle »).
      m.texte,
    ),
  );
}

const pied = (couleur) =>
  h(
    "div",
    { style: { display: "flex", alignItems: "center", gap: 18 } },
    h("img", { src: SYMBOLE, width: 62, height: 65 }),
    h("span", { style: { fontFamily: "Bricolage Grotesque", fontSize: 36, letterSpacing: "-0.02em", color: couleur } }, "moustachemalin.fr"),
  );

async function versJpeg(page, nom) {
  const png = Buffer.from(await new ImageResponse(page, { width: LARGEUR, height: HAUTEUR, fonts: POLICES }).arrayBuffer());
  const cible = path.join(SORTIE, `${nom}.jpg`);
  let qualite = 82;
  await sharp(png).jpeg({ quality: qualite, mozjpeg: true }).toFile(cible);
  while (fs.statSync(cible).size > POIDS_MAX && qualite > 60) {
    qualite -= 6;
    await sharp(png).jpeg({ quality: qualite, mozjpeg: true }).toFile(cible);
  }
  if (fs.statSync(cible).size > POIDS_MAX) throw new Error(`${nom}.jpg dépasse 300 Ko`);
  return { slug: nom, ko: Math.round(fs.statSync(cible).size / 1024), qualite };
}

// Variante A : la photo sur les deux tiers du haut, fondue dans le bleu nuit, puis l'accroche en très gros.
async function epingleQuestion(fm, e) {
  const n = e.accroche.length;
  const taille = n > 46 ? 86 : n > 34 ? 96 : n > 22 ? 110 : 124;
  const zone = 1000;
  const page = h(
    "div",
    { style: { width: "100%", height: "100%", display: "flex", position: "relative", background: NUIT } },
    h("img", { src: await recadrage(PHOTOS[e.photo], e.cadrage, LARGEUR, zone), width: LARGEUR, height: zone, style: { position: "absolute", top: 0, left: 0 } }),
    h("div", {
      style: {
        position: "absolute",
        top: zone - FONDU,
        left: 0,
        width: LARGEUR,
        height: FONDU,
        display: "flex",
        backgroundImage:
          "linear-gradient(to bottom, rgba(20,33,61,0) 0%, rgba(20,33,61,0.6) 45%, rgba(20,33,61,0.92) 75%, rgba(20,33,61,1) 100%)",
      },
    }),
    h(
      "div",
      { style: { position: "absolute", left: 72, right: 72, bottom: 64, display: "flex", flexDirection: "column", gap: 52 } },
      h(
        "div",
        { style: { display: "flex", flexWrap: "wrap", fontSize: taille, lineHeight: 0.98, letterSpacing: "-0.035em" } },
        ...accrocheEnMots(e.accroche, e.motSerif, taille, CREME, ORANGE),
      ),
      pied(CREME),
    ),
  );
  return versJpeg(page, `${fm.slug}-question`);
}

// Variante B : fond crème ou lavande, petite photo arrondie, l'accroche en titre et 3 points numérotés.
async function epingleRetenir(fm, e) {
  const fond = e.fond === "lavande" ? LAVANDE : CREME;
  const n = e.accroche.length;
  const taille = n > 46 ? 84 : n > 34 ? 96 : 112;
  const page = h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: fond,
        color: NUIT,
        padding: "72px 72px 64px",
      },
    },
    h(
      "div",
      { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between" } },
      h("img", { src: await recadrage(PHOTOS[e.photo], e.cadrage, 760, 760), width: 380, height: 380, style: { borderRadius: 48 } }),
      h(
        "div",
        {
          style: {
            display: "flex",
            fontFamily: "Bricolage Grotesque",
            fontSize: 34,
            letterSpacing: "-0.01em",
            color: CREME,
            background: NUIT,
            borderRadius: 999,
            padding: "12px 30px 16px",
          },
        },
        "À retenir",
      ),
    ),
    h(
      "div",
      { style: { display: "flex", flexWrap: "wrap", fontSize: taille, lineHeight: 0.98, letterSpacing: "-0.035em" } },
      ...accrocheEnMots(e.accroche, e.motSerif, taille, NUIT, e.fond === "lavande" ? NUIT : ORANGE),
    ),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: 34 } },
      ...e.points.map((point, i) =>
        h(
          "div",
          { style: { display: "flex", alignItems: "center", gap: 30 } },
          h(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                width: 84,
                height: 84,
                borderRadius: 999,
                background: e.fond === "lavande" ? NUIT : ORANGE,
                color: e.fond === "lavande" ? CREME : NUIT,
                fontFamily: "Bricolage Grotesque",
                fontSize: 46,
              },
            },
            String(i + 1),
          ),
          h("div", { style: { display: "flex", fontFamily: "DM Sans", fontSize: 58, lineHeight: 1.12 } }, insecables(point).replace(/ ([^ ]{1,8})$/," $1")),
        ),
      ),
    ),
    pied(NUIT),
  );
  return versJpeg(page, `${fm.slug}-retenir`);
}

fs.mkdirSync(SORTIE, { recursive: true });
const articles = articlesAEpingler();
verifierEpingles(articles);
const bande = EPINGLES_BANDE.map((e) => ({ slug: e.slug, photo: e.photo, court: e.titre, suite: e.texte, motSerif: e.motSerif }));
const fraiches = articles.flatMap((fm) =>
  (fm.epingles ?? []).map((e) => () => (e.variante === "question" ? epingleQuestion(fm, e) : epingleRetenir(fm, e))),
);
for (const travail of [...articles.map((fm) => () => epingleArticle(fm)), ...bande.map((e) => () => epingle(e)), ...fraiches]) {
  const { slug, ko, qualite } = await travail();
  console.log(`public/pins/${slug}.jpg : ${ko} Ko (qualité ${qualite})`);
}
console.log(
  `Images Pinterest : ${articles.length} articles, ${bande.length} pour « Kira et la bande », ${fraiches.length} épingles fraîches.`,
);
