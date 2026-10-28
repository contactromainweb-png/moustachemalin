---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

# Accueil (vitrine)

Scope: `/` (src/app/page.tsx), mode Experience au premier écran puis Persuade (mener vers un comparatif ou un guide). Visiteur : propriétaire de chat en appartement, sur téléphone, qui découvre le site. Action : ouvrir le comparatif des litières ou le guide « Mon chat ne boit pas ». Preuves : seulement les articles en ligne et les faits tirés des fiches techniques et du guide ; aucun avis, chiffre d'audience ni témoignage.

Contraintes : LCP mobile < 2,5 s (le titre reste le LCP), Lighthouse mobile ≥ 75 ; aucune 3D ; GSAP/Lenis chargés après l’affichage, sur ordinateur et téléphone, jamais en mouvement réduit ou économie de données ; vidéo seulement sur ordinateur ; liens vers les rubriques absentes masqués.

## Direction contract

THESIS: « Grande photo, titre énorme, le reste se construit au scroll ». Un vrai chat en plein écran porte le titre ; au défilement, l’image recule en carte et la page raconte les petits soucis du quotidien, un par écran, chacun menant à son article. Refuse le héros centré + grille de cartes de catégories.

OWN-WORLD: blanc cassé #FAF7F2, bleu nuit #14213D (header, titres, grandes sections pleines), orange vif #FF7A1A réservé aux appels à l’action (texte bleu nuit dessus, 6,1:1). Bricolage Grotesque très grasse et serrée en titres, DM Sans en texte. Coins très arrondis sur les photos, boutons pilule avec flèche dans son rond ; pas d’ombres ni de filets.

STORY: le visiteur voit un chat chez lui sous un titre énorme, comprend que le site compare l’équipement à partir des fiches techniques, fait défiler : litière qui sent, chat qui boit peu, repas, griffes ; chaque souci donne un fait concret et un bouton vers l’article.

FIRST VIEWPORT: header bleu nuit de 4 rem ; vidéo (ordinateur) ou photo AVIF recadrée verticale (téléphone) sur toute la hauteur restante ; voile bleu nuit en bas ; titre jusqu’à 9 rem sur 13 caractères de large en bas à gauche, phrase d’accroche, bouton orange « Lire le comparatif des litières ».

FORM: code-led, direction imposée par refonte-design.md (pas de tirage). Signature : section 2 épinglée, une étape par écran, texte qui sort vers le haut puis entre par le bas, photo suivante dévoilée par masque depuis le bas avec léger zoom arrière, jauge orange. seed: none (unavailable)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
