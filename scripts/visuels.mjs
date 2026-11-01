// Fabrique le PDF de la checklist offerte avec Chrome sans fenêtre (installé sur l'ordinateur) :
// content/lead-magnet/checklist-accueillir-un-chat.pdf, pas dans public/ : il sera déposé chez l'outil de lettre
// d'information. Les images Pinterest sont fabriquées au build par scripts/pins.mjs.
// Lancement : node scripts/visuels.mjs
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

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
