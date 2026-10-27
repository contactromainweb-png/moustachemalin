---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

# Accueil (vitrine)

Scope: `/` (src/app/page.tsx), mode Experience au premier écran puis Persuade (mener vers un comparatif ou un guide). Visiteur : propriétaire de chat en appartement, sur téléphone, qui découvre le site. Action : ouvrir le comparatif des litières ou le guide « Mon chat ne boit pas ». Preuves : seulement les articles en ligne et les faits tirés des fiches techniques et du guide ; aucun avis, chiffre d'audience ni témoignage.

Contraintes : LCP mobile < 2,5 s (le titre reste le LCP), Lighthouse mobile ≥ 75 ; 3D et GSAP/Lenis chargés en différé, jamais sur téléphone faible, mouvement réduit ou économie de données ; vidéo seulement sur ordinateur ; liens vers les rubriques absentes masqués.

## Direction contract

THESIS: « À hauteur de moustaches ». L'appartement vu à 25 cm du sol, à la hauteur du chat ; les objets du quotidien du chat s'allument un par un et mènent à leur article. Refuse le héros centré + grille de cartes de catégories.

OWN-WORLD: crème chaud (papier), brun caramel en champs pleins, encre brun très foncé, safran réservé au bouton d'action. Instrument Serif en titres, Hanken Grotesk en texte. Angles droits, pas d'ombres, pas de filets ; la couleur vit en aplats par chapitre et dans les photos.

STORY: le visiteur voit un vrai chat chez lui, comprend que le site compare l'équipement à partir des fiches techniques, touche un objet de la scène, lit le fait concret qui le concerne (moustaches et bol large, eau qui bouge, bac vidé toutes les une à deux semaines) et ouvre l'article.

FIRST VIEWPORT: cadre papier de 10 px ; panneau vidéo (ordinateur) ou photo fixe (téléphone) sur les colonnes 1-10 ; titre en deux lignes dans le tiers haut du panneau ; bouton safran « Lire le comparatif des litières » en bas au centre ; colonne de 5 aplats (clair vers foncé) à droite, chacun un lien vers un chapitre ; sur téléphone panneau 64svh puis 5 barres.

FORM: code-led, direction Taste « place-carries-it » (1er choix). Signature : scène 3D à hauteur de chat où gamelle, fontaine, litière et arbre à chat s'éclairent au scroll et se touchent ; carte encre qui avance d'une colonne par chapitre. seed: none (unavailable)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
