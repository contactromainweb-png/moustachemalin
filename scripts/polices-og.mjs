// Polices de l'image de partage (src/app/opengraph-image.tsx, fabriquée par next/og) : next/og ne lit pas le WOFF2
// des pages, il lui faut du TTF. Mêmes polices que le site (licence SIL Open Font License 1.1), caractères latins :
// Bricolage Grotesque 800 largeur 88 %, Instrument Serif italique, DM Sans 400.
// Fichiers produits : src/app/polices/og/*.ttf. Lancement (seulement si une police doit changer) : node scripts/polices-og.mjs
import fs from "node:fs";
import subsetFont from "subset-font";

// Même plage de caractères que le sous-ensemble « latin » de Google Fonts (français compris).
const PLAGES = [
  [0x20, 0xff], [0x131, 0x131], [0x152, 0x153], [0x2bb, 0x2bc], [0x2c6, 0x2c6], [0x2da, 0x2da], [0x2dc, 0x2dc],
  [0x304, 0x304], [0x308, 0x308], [0x329, 0x329], [0x2000, 0x206f], [0x20ac, 0x20ac], [0x2122, 0x2122],
  [0x2191, 0x2191], [0x2193, 0x2193], [0x2212, 0x2212], [0x2215, 0x2215],
];
const texte = PLAGES.flatMap(([a, b]) => Array.from({ length: b - a + 1 }, (_, i) => String.fromCodePoint(a + i))).join("");

const POLICES = [
  {
    css: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wdth,wght@88,800",
    fichier: "bricolage-grotesque-800-88.ttf",
  },
  { css: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1", fichier: "instrument-serif-italique.ttf" },
  { css: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400", fichier: "dm-sans-400.ttf" },
];

fs.mkdirSync("src/app/polices/og", { recursive: true });
for (const p of POLICES) {
  // Sans en-tête de navigateur, Google Fonts répond avec des fichiers TTF figés à la variante demandée.
  const css = await (await fetch(p.css)).text();
  const url = css.match(/url\((https:[^)]+)\)/)[1];
  const source = Buffer.from(await (await fetch(url)).arrayBuffer());
  const police = await subsetFont(source, texte, { targetFormat: "truetype" });
  fs.writeFileSync(`src/app/polices/og/${p.fichier}`, police);
  console.log(`src/app/polices/og/${p.fichier} : ${Math.round(police.length / 1024)} Ko`);
}
