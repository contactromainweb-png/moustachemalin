---
name: Moustache Malin
description: Le bon équipement pour un chat heureux, sans se tromper.
colors:
  paper: "#faf7f2"
  field: "#efe9e0"
  ink: "#14213d"
  ink-soft: "#5d5750"
  nuit: "#14213d"
  blanc: "#faf7f2"
  on-nuit: "#faf7f2"
  accent: "#ff7a1a"
  on-accent: "#14213d"
  lavande: "#b9a6ff"
  on-lavande: "#14213d"
  kira: "#ece6ff"
  relief-moustache: "#b9a6ff"
  relief-malin: "#b84a06"
typography:
  display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(3rem, 1.6rem + 6.4vw, 7.5rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.5rem + 3.2vw, 4rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.035em"
  accent-word:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontStyle: "italic"
    fontWeight: 400
    letterSpacing: "-0.01em"
  title:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.98rem + 0.1vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  none: "0px"
  photo: "1.25rem"
  card: "1.5rem"
  panel: "2rem"
  pill: "9999px"
spacing:
  gap: "12px"
  margin-mobile: "16px"
  pad-block: "20px"
  margin-desktop: "32px"
  section: "96px"
  section-lg: "128px"
  header: "64px"
  container: "90rem"
components:
  button-action:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    padding: "8px 8px 8px 24px"
    height: "52px"
  button-amazon:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
  header:
    backgroundColor: "{colors.nuit}"
    textColor: "{colors.on-nuit}"
    height: "64px"
  menu-button:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
  card-field:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "24px 32px"
  card-nuit:
    backgroundColor: "{colors.nuit}"
    textColor: "{colors.on-nuit}"
    rounded: "{rounded.none}"
    padding: "28px 32px"
  en-bref:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "24px 32px"
  kira-note:
    backgroundColor: "{colors.kira}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "24px 32px"
  photo:
    backgroundColor: "{colors.field}"
    rounded: "{rounded.photo}"
  stage-photo:
    backgroundColor: "{colors.lavande}"
    rounded: "{rounded.panel}"
---

# Design System: Moustache Malin

## Overview

**Creative North Star : « Un chat heureux tient à peu de choses »**

Un site lumineux, moderne et contrasté. Un fond blanc cassé porte la lecture. Le bleu nuit donne la structure : en-tête, titres, grandes sections pleines. L'orange vif sert à agir, et la lavande lumineuse apporte la douceur en grands aplats et en surlignage. Les titres sont dans une grotesque très grasse et un peu étroite (Bricolage Grotesque). Le mot qui compte passe en serif italique fine (Instrument Serif), et le texte courant est en DM Sans. Les photos de vrais chats sont les héroïnes des pages, avec Kira, la chatte de Romain, comme visage de la maison.

L'accueil est une vitrine qui se déroule en scènes, dont les fonds changent de couleur au fil du défilement (blanc cassé, orange, lavande, bleu nuit). Les articles restent sobres : lecture d'abord, aucune 3D.

Thème clair par défaut ; le mode sombre (fond bleu nuit, jamais brun) suit seulement le réglage de l'appareil.

**Key Characteristics :**
- Trois couleurs fortes sur blanc cassé : bleu nuit (structure), orange (action), lavande (douceur).
- Trois polices : grotesque 800 pour les titres, serif italique pour un mot mis en valeur, DM Sans pour lire.
- Cinq tailles de texte, rien sous 16 px.
- Formes douces : photos et encadrés arrondis, boutons d'action en pilule ; les aplats de lecture des articles restent à angles droits.
- Vraies photos de chats (Pexels et photos personnelles de Kira), crédits réunis sur `/credits-photos/`.

## Logo

- **Symbole :** tête de chat orange aux six moustaches, qui fait un clin d'œil. Fichiers dans `public/brand/` : `logo-mark.svg` (moustaches bleu nuit, pour fond clair) et `logo-mark-dark.svg` (moustaches crème, pour fond sombre).
- **Nom :** « Moustache » en Bricolage Grotesque 800, puis « malin » en Instrument Serif italique orange (#ff7a1a), 1,12 fois plus grand. Le nom est écrit en vrai texte HTML, avec les polices du site, jamais en image.
- **Relief :** une ombre pleine, sans flou, décalée vers le bas : lavande (#b9a6ff) sous « Moustache », orange brûlé (#b84a06) sous « malin ». 2 px dans le logo ; 0,035 em dans les grands titres « Moustache malin » (pied de page, fin de l'accueil).
- **Composant :** `Logo` (`src/components/Logo.tsx`). `fond="sombre"` dans l'en-tête, qui est toujours bleu nuit : symbole et « Moustache » en crème, quel que soit le thème. `fond="theme"` dans le pied de page : bleu nuit en clair, crème en sombre. `MotMalin` reprend le « malin » seul dans les grands titres.
- **Icônes :** `src/app/icon.svg`, `src/app/favicon.ico` (16 et 32 px), `src/app/apple-icon.png`, `public/brand/icon-192.png` et `icon-512.png` pour le manifeste (`src/app/manifest.ts`, thème #14213d, fond #faf7f2).
- **Image de partage :** `src/app/opengraph-image.tsx` (1200 × 630, fond blanc cassé, symbole à gauche, nom en relief et promesse à droite), fabriquée à la construction avec les polices TTF de `src/app/polices/og/`.

### Named Rules
**La règle du nom.** On écrit « Moustache Malin » dans le texte courant, mais le logo et les grands titres de marque mettent « malin » en minuscule, serif italique orange.

## Colors

### Primary
- **Bleu nuit** (ink / nuit, #14213d) : texte principal (14,9:1 sur blanc cassé, 13,2:1 sur champ), titres, en-tête, grandes sections pleines (encadrés renvoi et santé, choix n° 1 de `TopPicks`, en-tête du tableau, fin de l'accueil). Sur bleu nuit, le texte est blanc cassé (15:1).
- **Orange vif** (accent, #ff7a1a) : fond des boutons Amazon et des appels à l'action, bouton « Menu », puces de l'encadré « En bref », soulignement des liens, sélection de texte, mot en serif sur bleu nuit. Texte bleu nuit dessus (6,1:1). Jamais en texte sur blanc cassé (2,4:1).

### Secondary
- **Lavande lumineuse** (lavande, #b9a6ff) : grands aplats de l'accueil, contour de l'encadré « En bref », fond en attente des photos de scène, surlignage incliné sous le mot en serif sur fond clair, relief de « Moustache ». Texte bleu nuit dessus (7,6:1).
- **Lavande claire** (kira, #ece6ff) : fond de l'encadré « Le mot de Kira » (bleu nuit dessus, 13,2:1).

### Neutral
- **Blanc cassé** (paper, #faf7f2) : fond de toutes les pages.
- **Champ** (field, #efe9e0) : blocs secondaires (encadré méthode, cartes secondaires de `TopPicks`, entretien des fiches produit, lignes paires du tableau, pied de page).
- **Gris chaud** (ink-soft, #5d5750) : petits textes secondaires (dates, sources, mention Amazon, légendes). 6,7:1 sur blanc cassé, 5,9:1 sur champ.

### Mode sombre
Fond #0f1a31, champ #182641, texte #f4f1ec (15,4:1), gris #b9b4ac (8,4:1), liens et contour de focus en orange clair #ffb27a (9,8:1), aplats « nuit » des articles #1d2d4f, encadré Kira #1d2d4f. L'orange des boutons et son texte bleu nuit ne changent pas ; le surlignage lavande passe à 32 % d'opacité. L'en-tête, les sections pleines de l'accueil et le texte posé sur les photos gardent leurs couleurs fixes (`nuit`, `blanc`, `lavande`).

### Aplats de l'accueil
Chaque scène déclare son fond avec `data-fond` (`blanc`, `orange`, `lavande`, `nuit`, ou `page` pour suivre le thème) ; les couleurs du texte, du mot en serif, du soulignement et du bouton en découlent (`globals.css`). Bleu nuit sur orange et sur lavande ; blanc cassé et orange sur bleu nuit.

### Note sur les noms
Dans le code, les variables `caramel`, `caramel-field` et `on-caramel` sont des noms historiques : elles valent aujourd'hui le bleu nuit (orange clair et #1d2d4f en sombre). Il ne reste aucun brun ni caramel dans la palette.

### Named Rules
**La règle de l'orange.** L'orange signale l'action : Amazon dans les articles, un appel à l'action par écran sur l'accueil, le bouton « Menu ». Toujours en fond, avec du texte bleu nuit ; jamais en couleur de texte sur fond clair.

**La règle des couples fixés.** Chaque aplat a son couple de couleurs vérifié : bleu nuit sur blanc cassé, champ, orange, lavande ; blanc cassé ou orange sur bleu nuit.

## Typography

**Titres :** Bricolage Grotesque 800, largeur 88 %, auto-hébergée et réduite à cette seule variante (`src/app/polices/`, `scripts/police-titres.mjs`).
**Mot mis en valeur :** Instrument Serif italique 400 (next/font).
**Texte :** DM Sans 400 à 600, auto-hébergée (`scripts/police-texte.mjs`).

**Character :** une grotesque massive et serrée (interlignage 0,92, approche -0,035em) qui parle fort, un mot en serif italique fine qui apporte l'élégance, et une sans-serif ronde et nette pour lire longtemps sur téléphone.

### Hierarchy
- **Display** (800, 48 à 120 px fluide) : H1 de l'accueil et des pages institutionnelles (max 14ch). Les grands titres de l'accueil et du pied de page vont jusqu'à 13 à 15 rem.
- **Headline** (800, 36 à 64 px fluide) : H2 de section, titres des encadrés bleu nuit.
- **Mot en serif** (`.mot-serif`, `TitreSerif`) : un mot par titre, en Instrument Serif italique 400, bleu nuit sur fond clair avec surlignage lavande incliné, orange sur bleu nuit.
- **Title / Lead** (DM Sans, 20 à 26 px) : chapeaux (max 38ch), texte du mot de Kira (en serif italique), noms de produits ; demi-gras (600) pour les H3 des cartes.
- **Body** (DM Sans, 17 à 19 px, 1,55) : texte courant, colonne de 44rem, paragraphes de 55 à 70ch.
- **Label / Small** (DM Sans, 16 à 17 px) : dates, sources, mention Amazon, fil d'Ariane, navigation. Jamais plus petit.

### Named Rules
**La règle des cinq tailles.** small, body, lead, head, display ; les rares tailles propres à un composant (titres géants de l'accueil, nom de fin du pied de page) restent des titres en Bricolage Grotesque.

**La règle du 16 px.** Aucun texte sous 16 px, même les mentions légales.

## Layout

- **Conteneur :** 90rem au maximum, centré, marges de 16 px sur téléphone puis 32 px dès 640 px.
- **En-tête :** bandeau bleu nuit de 64 px (l'accueil retranche cette hauteur à son premier écran).
- **Accueil :** sept scènes plein écran (gros plan, désintégration en particules, petits soucis épinglés aux fonds changeants, pelote et cartes en verre dépoli, mur de photos, comparaison qui se construit), puis les blocs de confiance et une grande section de fin bleu nuit à bord supérieur arrondi.
- **Pages institutionnelles et rubriques (`StagePage`) :** sur ordinateur, colonne de lecture à gauche (11 fr) et photo arrondie qui reste en place à droite (9 fr). Sur téléphone, titre puis texte puis photo, pour que le titre reste l'élément LCP ; un portrait vient juste après l'introduction.
- **Articles :** fil d'Ariane, titre avec mot en serif, date, photo d'en-tête arrondie, puis « En bref », le mot de Kira et le corps limité à 44rem.
- **Rythme :** blocs empilés séparés de 12 px ; marge interne de 20 px (téléphone) et 32 px (ordinateur) ; pied de page détaché de 128 à 176 px, collé quand la page finit sur un aplat plein.
- **Points de rupture :** 640 px (marges), 768 px (fiches produit sur deux colonnes), 1024 px (mises en page ordinateur, menu en ligne), 1280 px (tableau comparatif réel).

## Elevation & Depth

Interface plate dans les articles : aucune ombre, la profondeur vient du contraste des aplats. Sur l'accueil seulement, quelques cartes portent une ombre douce bleu nuit (scène de comparaison) et les cartes de la scène « pelote » sont en verre dépoli lavande sur ordinateur. Le relief du logo est une ombre pleine sans flou, pas une élévation.

### Named Rules
**La règle du plat dans les articles.** Rien ne flotte dans un comparatif ou un guide. Au survol, un bouton ou un encadré-lien monte de 2 px, sans ombre.

## Shapes

- **Photos :** 1,25 rem d'arrondi (photo moyenne, galerie de Kira) ; 1,5 rem (photo d'en-tête et de scène sur téléphone) à 2 rem (sur ordinateur).
- **Encadrés doux :** 1,5 rem (« En bref », mot de Kira, cartes de rubrique, calculateur).
- **Pilules :** boutons d'action, bouton « Menu », portraits ronds de Kira, puces orange.
- **Angles droits :** bouton Amazon, aplats de lecture des articles (méthode, renvoi, santé, sélection, tableau, entretien), photos 3:2 du corps des articles.
- **Formats :** 3:2 dans les articles, 3:4 pour les photos moyennes verticales, 4:3 et 4:5 pour les photos de scène.

## Components

### Buttons
- **Appel à l'action (`BoutonAction`) :** pilule orange de 52 px, texte bleu nuit en DM Sans 500, flèche dans un rond bleu nuit à droite. Au survol (souris seulement), la flèche avance de 4 px ; à l'appui, le bouton s'enfonce (0,97). Sur un aplat orange ou lavande, la section fournit les couleurs (`--cta-*`).
- **Bouton Amazon (`AffiliateButton`) :** rectangle orange à angles droits, 48 px de haut, « Voir le prix sur Amazon », `rel="sponsored nofollow noopener"`, nouvel onglet ; monte de 2 px au survol. Variante d'exemple désactivée à 70 % d'opacité.
- **Lien d'avis (`LienAvisAmazon`) :** lien souligné d'orange sous chaque fiche produit.
- **Focus :** contour de 3 px décalé de 3 px, bleu nuit sur fond clair, orange sur bleu nuit et sur les photos.

### Cards / Containers
- **En bref (`EnBref`) :** contour lavande de 2 px, arrondi 1,5 rem, titre en grotesque, puces rondes orange.
- **Le mot de Kira (`KiraNote`) :** fond lavande claire, arrondi 1,5 rem, portrait rond de Kira, texte en serif italique. Un seul par article (charte dans CLAUDE.md, section 11).
- **Aplats bleu nuit :** renvoi vers un article (`CalloutLink`), encadré santé (`VetNotice`), choix n° 1 (`TopPicks`) ; texte blanc cassé, angles droits.
- **Aplats champ :** encadré méthode (`MethodNote`), choix secondaires, entretien et consommables (`ProductCard`).

### Navigation
- **En-tête :** logo à gauche ; sur ordinateur, rubriques en ligne en petit texte, soulignées d'orange au survol ; sur téléphone, pilule orange « Menu » (`<details>`, sans JavaScript) qui ouvre un panneau bleu nuit, rubriques en grotesque de 36 px.
- **Fil d'Ariane :** petit texte gris chaud, séparateur « / », cibles de 44 px.
- **Pied de page :** fond champ, petit logo, promesse en lead, mention Amazon, deux colonnes de liens, puis « Moustache malin » géant en relief, sauf quand la page finit déjà sur la section de fin.

### Tableau comparatif
Dès 1280 px : vrai tableau, en-tête bleu nuit, lignes paires sur champ, valeur absente « Non précisé ». En dessous : une carte par produit. Mention Amazon dessous.

### Photos (`Figure`, `PhotoMoyenne`, `KiraGalerie`)
Chargement différé, fond champ en attente. Photo moyenne verticale avec légende en gris chaud pour les photos personnelles (jamais en pleine largeur). Galerie de Kira sur la page À propos.

### Mention Amazon
Petit texte gris chaud, toujours à côté des boutons Amazon (`TopPicks`, `ComparisonTable`, `ProductCard`) et dans le pied de page.

## Do's and Don'ts

### Do:
- **Do** poser chaque texte sur un aplat avec son couple vérifié (bleu nuit sur clair, orange et lavande ; blanc cassé sur bleu nuit).
- **Do** mettre un seul mot par titre en serif italique, avec `TitreSerif` ou `.mot-serif`.
- **Do** utiliser le composant `Logo` pour le nom du site, jamais une image du nom.
- **Do** garder l'orange en fond de bouton, avec texte bleu nuit.
- **Do** animer les entrées par translation seule (`.reveal`, 20 px, liée au défilement, CSS pur) et réserver `.rise` et `.entree-flou` aux titres d'en-tête ; tout disparaît avec `prefers-reduced-motion`.
- **Do** charger vidéo, WebGL, GSAP et Lenis seulement sur l'accueil, après l'affichage, sur ordinateur capable (`src/lib/capacites.ts`).
- **Do** donner 44 px minimum à chaque cible tactile (48 px pour les boutons).

### Don't:
- **Don't** réintroduire de brun ou de caramel, ni un mode sombre brun.
- **Don't** écrire du texte orange ou lavande sur fond clair.
- **Don't** mettre plus d'un mot en serif dans un titre, ni de texte en capitales espacées (seule exception : l'étiquette « À boire chaque jour » du calculateur d'eau).
- **Don't** ajouter d'ombre portée ou de 3D dans un article (comparatif, guide ou avis).
- **Don't** inventer une phrase ou une habitude de Kira.
- **Don't** utiliser d'illustration dessinée, d'image Amazon ou de produit de marque identifiable pour en illustrer un autre.
- **Don't** descendre sous 16 px de texte.
