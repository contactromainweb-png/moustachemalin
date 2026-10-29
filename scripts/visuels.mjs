// Fabrique les visuels hors site, avec Chrome sans fenêtre (installé sur l'ordinateur) :
// - les images Pinterest 1000 × 1500 px de chaque article (public/media/pin/<slug>.jpg), photo déjà créditée
//   du site + titre court, aux couleurs de Moustache Malin ;
// - le PDF de la checklist offerte (content/lead-magnet/checklist-accueillir-un-chat.pdf, pas dans public/ :
//   il sera déposé chez l'outil de lettre d'information).
// Lancement : node scripts/visuels.mjs
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const RACINE = process.cwd();
const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].find((c) => fs.existsSync(c));
if (!CHROME) throw new Error("Chrome introuvable");

const TEMP = fs.mkdtempSync(path.join(os.tmpdir(), "mm-visuels-"));
const POLICES = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,800&family=DM+Sans:wght@400;600&family=Instrument+Serif:ital@1&display=block">`;
const STYLE = `
  :root { --nuit:#14213d; --blanc:#faf7f2; --orange:#ff7a1a; --lavande:#b9a6ff; --champ:#efe9e0; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:"DM Sans",sans-serif; color:var(--nuit); background:var(--blanc); }
  .titre { font-family:"Bricolage Grotesque",sans-serif; font-weight:800; font-stretch:88%; letter-spacing:-0.035em; line-height:0.92; }
  .serif { font-family:"Instrument Serif",Georgia,serif; font-style:italic; font-weight:400; letter-spacing:-0.01em; }
`;

function chrome(args) {
  execFileSync(CHROME, ["--headless=new", "--hide-scrollbars", "--disable-gpu", "--virtual-time-budget=8000", ...args], {
    stdio: "ignore",
  });
}

// --- Images Pinterest -------------------------------------------------------------------------------------------
const PINS = [
  { slug: "litiere-autonettoyante", photo: "litieres-chat-chaise.jpg", credit: "Natalia Rudomin, Unsplash", cadrage: "50% 40%",
    haut: "Litière", serif: "autonettoyante", bas: "notre comparatif 2026" },
  { slug: "fontaine-a-eau-chat", photo: "boire-chat-robinet.jpg", credit: "Sugarman Joe, Unsplash", cadrage: "40% 50%",
    haut: "Fontaine à", serif: "eau", bas: "pour chat : notre comparatif" },
  { slug: "mon-chat-ne-boit-pas", photo: "boire-chaton-bol.jpg", credit: "Carolien van Oijen, Unsplash", cadrage: "50% 50%",
    haut: "Mon chat ne", serif: "boit pas", bas: "pourquoi, et comment l'aider" },
  { slug: "combien-eau-chat", photo: "guide-chat-bol.jpg", credit: "Vlad Deep, Pexels", cadrage: "50% 50%",
    haut: "Combien d'eau", serif: "doit-il boire ?", bas: "le calculateur gratuit" },
  { slug: "distributeur-croquettes-chat", photo: "repas-chat-gamelle.jpg", credit: "roselino rocha, Pexels", cadrage: "30% 50%",
    haut: "Distributeur de", serif: "croquettes", bas: "pour chat : notre comparatif" },
  { slug: "litiere-autonettoyante-danger", photo: "litieres-chat-meuble.jpg", credit: "Helena Jankovičová Kováčová, Pexels",
    cadrage: "55% 50%", haut: "Litière autonettoyante :", serif: "dangereux ?", bas: "les vrais risques, les sécurités" },
  { slug: "petkit-pura-max-2-avis", photo: "litieres-chat-fenetre.jpg", credit: "大 董, Pexels", cadrage: "72% 50%",
    haut: "PETKIT Pura Max 2 :", serif: "notre avis", bas: "face à la Neakasa M1 Lite" },
];

fs.mkdirSync(path.join(RACINE, "public/media/pin"), { recursive: true });
for (const pin of PINS) {
  const photo = pathToFileURL(path.join(RACINE, "public/media", pin.photo)).href;
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8">${POLICES}<style>${STYLE}
    body { width:1000px; height:1500px; overflow:hidden; display:flex; flex-direction:column; background:var(--nuit); }
    .photo { flex:1; background:url("${photo}") ${pin.cadrage}/cover no-repeat; border-radius:0 0 64px 64px; }
    .texte { padding:64px 72px 56px; color:var(--blanc); }
    h1 { font-size:124px; }
    h1 .serif { color:var(--orange); display:block; }
    .bas { margin-top:28px; font-size:40px; }
    .pied { margin-top:44px; display:flex; justify-content:space-between; align-items:baseline; font-size:22px; opacity:.8; }
    .marque { font-size:34px; opacity:1; }
  </style></head><body>
    <div class="photo"></div>
    <div class="texte">
      <h1 class="titre">${pin.haut} <span class="serif">${pin.serif}</span></h1>
      <p class="bas">${pin.bas}</p>
      <div class="pied"><span class="titre marque">moustachemalin.fr</span><span>Photo : ${pin.credit}</span></div>
    </div>
  </body></html>`;
  const source = path.join(TEMP, `${pin.slug}.html`);
  const png = path.join(TEMP, `${pin.slug}.png`);
  fs.writeFileSync(source, html);
  chrome(["--allow-file-access-from-files", "--window-size=1000,1500", `--screenshot=${png}`, pathToFileURL(source).href]);
  await sharp(png).resize(1000, 1500).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(RACINE, `public/media/pin/${pin.slug}.jpg`));
  console.log(`public/media/pin/${pin.slug}.jpg`);
}

// --- PDF de la checklist ----------------------------------------------------------------------------------------
const md = fs.readFileSync(path.join(RACINE, "content/lead-magnet/checklist-accueillir-un-chat.md"), "utf8").replace(/\r\n/g, "\n");
const enLigne = (t) =>
  t
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/ ([:;?!»])/g, "\u202f$1");

const majuscule = (t) => t.charAt(0).toUpperCase() + t.slice(1);

let corps = "";
let liste = false;
for (const ligne of md.split("\n")) {
  if (ligne.startsWith("> ")) continue; // note de mise en page, pas du contenu
  const fermer = () => {
    if (liste) corps += "</ul></section>";
    liste = false;
  };
  if (ligne.startsWith("# ")) {
    const [debut, fin] = ligne.slice(2).split(" : ");
    corps += `<header><p class="marque titre">Moustache <span class="serif">Malin</span></p><h1 class="titre">${enLigne(majuscule(fin ?? debut))}</h1><p class="sous">${fin ? enLigne(debut) : ""}</p></header>`;
  } else if (ligne.startsWith("## ")) {
    fermer();
    corps += `<section><h2 class="titre">${enLigne(ligne.slice(3))}</h2><ul>`;
    liste = true;
  } else if (ligne.startsWith("- [ ] ")) {
    corps += `<li><span class="case"></span><span>${enLigne(ligne.slice(6))}</span></li>`;
  } else if (ligne.startsWith("---")) {
    fermer();
  } else if (ligne.trim()) {
    fermer();
    corps += `<p class="note">${enLigne(ligne)}</p>`;
  }
}

const htmlPdf = `<!doctype html><html lang="fr"><head><meta charset="utf-8">${POLICES}<style>${STYLE}
  @page { size:A4; margin:0; }
  body { width:210mm; padding:12mm 14mm 0; font-size:10pt; line-height:1.35; }
  header { background:var(--nuit); color:var(--blanc); border-radius:7mm; padding:7mm 10mm 6mm; margin-bottom:5mm; }
  .marque { font-size:13pt; }
  .marque .serif { color:var(--orange); }
  h1 { font-size:30pt; margin-top:4mm; }
  .sous { margin-top:3mm; font-size:12pt; opacity:.85; }
  .colonnes { columns:2; column-gap:8mm; }
  section { break-inside:avoid; margin-bottom:4mm; }
  h2 { font-size:15pt; margin-bottom:2mm; padding-bottom:1.5mm; border-bottom:1.2mm solid var(--lavande); }
  ul { list-style:none; }
  li { display:flex; gap:2.5mm; padding:.8mm 0; }
  .case { flex:none; width:4mm; height:4mm; margin-top:.5mm; border:.5mm solid var(--nuit); border-radius:1mm; }
  .note { margin-bottom:3mm; }
  .colonnes > .note:first-child { column-span:all; font-size:12pt; }
  .fin { margin-top:2mm; background:var(--orange); border-radius:5mm; padding:5mm 7mm; }
  .fin .note:last-child { margin:0; font-size:9pt; }
</style></head><body>${corps.replace(/(<\/header>)/, "$1<div class=\"colonnes\">").replace(/(<p class="note"><strong>Pour choisir)/, "</div><div class=\"fin\">$1")}</div></body></html>`;

const sourcePdf = path.join(TEMP, "checklist.html");
fs.writeFileSync(sourcePdf, htmlPdf);
const pdf = path.join(RACINE, "content/lead-magnet/checklist-accueillir-un-chat.pdf");
chrome(["--no-pdf-header-footer", `--print-to-pdf=${pdf}`, pathToFileURL(sourcePdf).href]);
console.log(path.relative(RACINE, pdf));
fs.rmSync(TEMP, { recursive: true, force: true });
