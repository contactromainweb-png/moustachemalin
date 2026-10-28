// Photo du premier écran de l'accueil sur téléphone, encodée à l'avance (public/media/premier-ecran/).
// Pourquoi : c'est l'élément le plus grand affiché (LCP). Encodée par le service d'images de Netlify, elle pesait
// 229 Ko en WebP (et 359 Ko en AVIF) en 960 px ; ici, AVIF (couleurs 4:2:0) garde le grain du pelage au même
// niveau, pour environ 90 Ko. Un WebP qualité 80 sert de secours aux navigateurs sans AVIF.
// Jamais agrandie : la plus grande taille reste sous la largeur du fichier maître (1937 px).
// Lancement (après tout changement de la photo maître) : node scripts/photo-premier-ecran.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const MAITRE = "public/media/accueil-chat-blanc-telephone.jpg";
const DOSSIER = "public/media/premier-ecran";
// Qualité AVIF par largeur : plus l'image est petite, plus l'encodeur lisse le grain ; on remonte donc la qualité
// des petites tailles pour garder la même finesse de pelage partout (contrôlé à l'œil, recadrage 1:1 sur l'œil).
const TAILLES = { 640: 62, 828: 55, 960: 50, 1080: 50, 1280: 50, 1600: 50 };

fs.mkdirSync(DOSSIER, { recursive: true });
for (const [largeur, qualite] of Object.entries(TAILLES).map(([l, q]) => [Number(l), q])) {
  const image = sharp(MAITRE).resize(largeur);
  const avif = path.join(DOSSIER, `chat-blanc-${largeur}.avif`);
  const webp = path.join(DOSSIER, `chat-blanc-${largeur}.webp`);
  await image.clone().avif({ quality: qualite, effort: 6, chromaSubsampling: "4:2:0" }).toFile(avif);
  await image.clone().webp({ quality: 80, effort: 6 }).toFile(webp);
  const ko = (f) => Math.round(fs.statSync(f).size / 1024);
  console.log(`${largeur} px : AVIF ${ko(avif)} Ko, WebP ${ko(webp)} Ko`);
}
