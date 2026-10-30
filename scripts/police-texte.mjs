// Police du texte (DM Sans, licence SIL Open Font License 1.1) réduite aux graisses utilisées par le site :
// 400 (texte), 500 (font-medium) et 600 (font-semibold), caractères latins. La version variable complète
// (graisses 100 à 1000) pesait 36 Ko ; celle-ci pèse environ 22 Ko. Mêmes largeurs de texte (aucune ligne ne bouge) ;
// au pixel près, seul le lissage des bords varie très légèrement en graisse 500, sans différence visible.
// Fichier produit : src/app/polices/dm-sans-400-600.woff2.
// Lancement (seulement si la police doit changer) : node scripts/police-texte.mjs
import fs from "node:fs";
import subsetFont from "subset-font";

const CSS = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@100..1000&display=swap";
const NAVIGATEUR = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0 Safari/537.36";

// Même plage de caractères que le sous-ensemble « latin » de Google Fonts (français compris).
const PLAGES = [
  [0x20, 0xff], [0x131, 0x131], [0x152, 0x153], [0x2bb, 0x2bc], [0x2c6, 0x2c6], [0x2da, 0x2da], [0x2dc, 0x2dc],
  [0x304, 0x304], [0x308, 0x308], [0x329, 0x329], [0x2000, 0x206f], [0x20ac, 0x20ac], [0x2122, 0x2122],
  [0x2191, 0x2191], [0x2193, 0x2193], [0x2212, 0x2212], [0x2215, 0x2215],
];
const texte = PLAGES.flatMap(([a, b]) => Array.from({ length: b - a + 1 }, (_, i) => String.fromCodePoint(a + i))).join("");

const css = await (await fetch(CSS, { headers: { "User-Agent": NAVIGATEUR } })).text();
const latin = css.split("/* latin */")[1];
const url = latin.match(/url\((https:[^)]+\.woff2)\)/)[1];
const source = Buffer.from(await (await fetch(url)).arrayBuffer());
console.log(`Source : ${source.length} octets`);

const police = await subsetFont(source, texte, { targetFormat: "woff2", variationAxes: { wght: { min: 400, max: 600 } } });
fs.writeFileSync("src/app/polices/dm-sans-400-600.woff2", police);
console.log(`src/app/polices/dm-sans-400-600.woff2 : ${Math.round(police.length / 1024)} Ko`);
