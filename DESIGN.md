---
name: Moustache Malin
description: Le bon équipement pour un chat heureux, sans se tromper.
colors:
  paper: "#f6efe4"
  field: "#ece1cf"
  ink: "#22170e"
  ink-soft: "#5a4838"
  caramel: "#84501f"
  caramel-field: "#6b4019"
  on-caramel: "#f6efe4"
  accent: "#f2a20c"
  on-accent: "#22170e"
  ch-gamelle: "#e9dcc6"
  ch-fontaine: "#d8bf98"
  ch-litiere: "#c49a68"
  ch-arbre: "#a97a4b"
  ch-articles: "#6b4019"
  ch-methode: "#22170e"
  ch-encre: "#22170e"
  ch-creme: "#f6efe4"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(3rem, 1.6rem + 6.4vw, 7.5rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(2.25rem, 1.5rem + 3.2vw, 4rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.98rem + 0.1vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  none: "0px"
spacing:
  frame: "10px"
  gap: "12px"
  margin-mobile: "16px"
  pad-block: "20px"
  margin-desktop: "32px"
  section: "96px"
  section-lg: "128px"
  container: "90rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
  button-on-dark:
    backgroundColor: "{colors.ch-creme}"
    textColor: "{colors.ch-encre}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
  card-field:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "24px 32px"
  card-field-hover:
    backgroundColor: "{colors.caramel-field}"
    textColor: "{colors.on-caramel}"
  card-caramel:
    backgroundColor: "{colors.caramel-field}"
    textColor: "{colors.on-caramel}"
    rounded: "{rounded.none}"
    padding: "28px 32px"
  chapter-card:
    backgroundColor: "{colors.ch-encre}"
    textColor: "{colors.ch-creme}"
    rounded: "{rounded.none}"
    padding: "28px"
  input-text:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "48px"
---

# Design System: Moustache Malin

## Overview

**Creative North Star: "À hauteur de moustaches"**

L'appartement vu à 25 cm du sol. Un papier crème chaud porte tout ; le brun caramel et l'encre brun très foncé arrivent en aplats pleins, jamais en dégradés ni en ombres. La couleur vit dans ces aplats et dans les photos de vrais chats, qui sont les héroïnes des pages. Instrument Serif donne la voix (grands titres serrés), Hanken Grotesk porte la lecture.

Les surfaces sont plates et à angles droits. La hiérarchie se fait par la taille du texte, le changement d'aplat et l'espace, pas par des filets, des ombres ou des étiquettes au-dessus des titres. Une seule couleur vive, le safran, est réservée à l'action principale.

Thème clair crème par défaut ; le mode sombre suit uniquement le réglage de l'appareil.

**Key Characteristics:**
- Aplats pleins, angles droits, aucune ombre au repos.
- Deux polices, cinq tailles de texte, rien sous 16 px.
- Safran pour l'action principale (Amazon, premier bouton de l'accueil) et rien d'autre.
- Photos réelles de chats (Pexels), toujours créditées sous l'image.
- Mouvement léger en CSS partout ; vidéo, 3D, GSAP et Lenis seulement sur les vitrines et sur ordinateur capable.

## Colors

Une gamme chaude tirée des photos : crème, caramel, encre brune, et un safran vif pour agir.

### Primary
- **Safran** (accent) : fond du bouton Amazon (`AffiliateButton`) et du bouton principal du premier écran ; aussi la sélection de texte. Texte posé dessus : encre (on-accent), contraste 8,3:1. Jamais utilisé comme couleur de texte sur papier (1,85:1).

### Secondary
- **Caramel** (caramel) : liens en ligne dans les encadrés (`MethodNote`), signe « + » des points forts, nom géant du pied de page, contour de focus. Sur papier 5,8:1, sur champ 5,2:1.
- **Caramel plein** (caramel-field) : grands aplats sombres (choix n° 1 de `TopPicks`, `CalloutLink`, `VetNotice`, `ProductVisual`, menu mobile, fond de `MethodSlip`). Texte crème (on-caramel) 7,75:1.

### Neutral
- **Papier** (paper) : fond de toutes les pages et des pastilles de texte posées sur les photos.
- **Champ** (field) : fond des blocs secondaires (cartes d'articles, FAQ, tableau mobile, entretien, pied de page).
- **Encre** (ink) : texte principal (15,4:1 sur papier, 13,6:1 sur champ), en-tête du tableau, bouton « Menu ».
- **Encre douce** (ink-soft) : petits textes secondaires (crédits, dates, mention Amazon, fil d'Ariane). 7,6:1 sur papier, 6,7:1 sur champ.

### Aplats des chapitres (accueil)
Du plus clair au plus foncé : gamelle, fontaine, litière, arbre, articles (= caramel plein), méthode (= encre). Identiques en clair et en sombre ; leur texte est fixé : encre sur gamelle/fontaine/litière/arbre (13,0 / 9,9 / 6,8 / 4,7:1), crème sur articles et méthode. Le crème à 80 % d'opacité (textes secondaires) reste à 5,6:1 sur articles et 10,2:1 sur méthode.

### Mode sombre
Papier #16100b, champ #231a12, encre #f3eadc, encre douce #c7b6a3, caramel #e3bd84, caramel plein #4a2c11 ; le safran et son texte ne changent pas. Toutes ces paires dépassent 8,6:1.

### Named Rules
**La règle du safran.** Le safran signale l'action qui compte : Amazon dans les articles, un seul bouton sur le premier écran de l'accueil. Une action secondaire prend l'encre (`button-ink`) ou le crème sur fond sombre (`button-on-dark`).

**La règle des aplats.** La couleur arrive en champs pleins de bord à bord, avec le texte fixé pour chaque champ. Pas de dégradé, pas de transparence décorative sur les fonds.

## Typography

**Display Font:** Instrument Serif 400 (repli Georgia, serif), auto-hébergée via next/font
**Body Font:** Hanken Grotesk (repli system-ui, sans-serif), auto-hébergée via next/font

**Character:** un sérif de titrage étroit et serré (interlignage 0,95, approche -0,02em) face à une grotesque claire et généreuse pour lire sur téléphone.

### Hierarchy
- **Display** (400, 48 à 120 px fluide, 0,95) : H1 des pages institutionnelles et de l'accueil. Le H1 d'article utilise sa propre échelle (40 à 96 px, max 22ch).
- **Headline** (400, 36 à 64 px fluide, 0,95) : H2 de section, titres des encadrés caramel et des cartes d'articles.
- **Title / Lead** (Hanken, 20 à 26 px) : chapeaux (max 38ch), questions de FAQ, noms de produits ; en gras demi (600) pour les H3 des cartes.
- **Body** (Hanken, 17 à 19 px, 1,55) : texte courant, colonnes de 44rem, paragraphes 55 à 70ch.
- **Label / Small** (Hanken, 16 à 17 px) : crédits, dates, mention Amazon, fil d'Ariane, navigation. Jamais plus petit.

### Named Rules
**La règle des cinq tailles.** small, body, lead, head, display, et rien d'autre ; les rares tailles en clamp() propres à un composant (nom du pied de page, H1 d'article, titres de chapitres) restent des titres en Instrument Serif.

**La règle du 16 px.** Aucun texte sous 16 px, même les mentions légales.

## Layout

- **Conteneur :** 90rem de large au maximum, centré, marges latérales 16 px (téléphone) puis 32 px (dès 640 px).
- **Accueil :** cadre papier de 10 px autour du premier écran et gouttière de 10 px entre les cases ; grille de 12 colonnes sur ordinateur (panneau photo/vidéo sur 10, colonne de 5 aplats sur 2) ; sur téléphone panneau de 64svh puis les 5 barres. Chapitres en plein écran (100svh), grille de 4 colonnes où la carte encre avance d'une colonne par objet. Sections pleines espacées de 96 px (128 px sur ordinateur).
- **Pages institutionnelles et rubriques (`StagePage`) :** ordinateur, colonne de lecture à gauche (11 fr) et photo collée en haut d'écran à droite (9 fr) ; téléphone, titre puis texte puis photo, pour que le titre reste l'élément LCP.
- **Articles :** fil d'Ariane, H1, date, puis corps limité à 64rem ; photo d'en-tête uniquement sur ordinateur.
- **Rythme :** blocs empilés séparés de 12 px ; marge interne des blocs 20 px (téléphone) / 32 px (ordinateur) ; pied de page détaché de 128 à 176 px, collé quand la page finit sur un aplat.
- **Points de rupture :** 640 px (marges), 768 px (tableau réel), 1024 px (mises en page ordinateur).

## Elevation & Depth

Système entièrement plat. Aucune ombre portée dans l'interface. La profondeur vient du contraste entre aplats (papier, champ, caramel plein, encre), des pastilles de papier posées sur les photos et, sur l'accueil, de la scène 3D (dont les ombres appartiennent au rendu WebGL, pas à l'interface).

### Named Rules
**La règle du plat au repos.** Rien ne flotte. Au survol, un bouton ou un encadré-lien monte de 2 px (translation), sans ombre.

## Shapes

Angles droits partout (0 px) : boutons, cartes, photos, champs de saisie. Les seuls tracés sont des marqueurs fonctionnels : contour de 2 px du champ e-mail, chevron de la FAQ, pointillés de `MethodSlip`. Photos recadrées en 3:2 dans les articles, 4:3 pour les visuels neutres et la scène des pages, 3:4, 1:1, 16:10 et 4:5 sur l'accueil. Une seule découpe signée : le bord dentelé en ticket de caisse de `MethodSlip`.

## Components

### Buttons
- **Shape :** angles droits (0 px), hauteur minimale 48 px (44 px dans le tableau), padding horizontal 24 px, Hanken 500.
- **Primary (safran) :** `AffiliateButton` (« Voir le prix sur Amazon », `rel="sponsored nofollow noopener"`, nouvel onglet) et le bouton principal du premier écran. Variante d'exemple désactivée à 70 % d'opacité.
- **Hover / Focus :** montée de 2 px en 200 ms ease-out, retour au clic avec léger écrasement (0,98) ; focus visible : contour caramel 3 px décalé de 3 px, crème sur les aplats foncés (cartes encre, « Déjà comparé », méthode) ; dans le nuancier de l'accueil, contour de la couleur du texte, à l'intérieur du bloc.
- **Encre :** bouton « Menu » et bouton d'envoi de la newsletter.
- **Crème sur fond sombre :** liens d'action des cartes de chapitres et « Lire notre méthode complète ».

### Cards / Containers
- **Corner Style :** 0 px.
- **Background :** champ (cartes d'articles, FAQ, tableau mobile, bloc entretien, newsletter) ou caramel plein (choix principal, renvoi vers un article, encadré vétérinaire).
- **Shadow Strategy :** aucune (voir Elevation & Depth).
- **Border :** aucune.
- **Internal Padding :** 20 px / 24 px sur téléphone, 32 px sur ordinateur.
- **Comportement :** une carte-lien sur champ passe au caramel plein avec texte crème au survol ; un encadré caramel monte de 2 px.

### Inputs / Fields
- **Style :** fond papier, contour encre 2 px, angles droits, hauteur 48 px, texte en taille body.
- **Focus :** contour caramel global de 3 px.

### Navigation
- **En-tête :** nom du site en Instrument Serif (28 à 32 px) à gauche ; ordinateur, rubriques en ligne en petit texte, soulignées en caramel 2 px au survol ; téléphone, bouton encre « Menu » (`<details>`, sans JavaScript) qui ouvre un panneau caramel plein avec les rubriques en Instrument Serif 32 px.
- **Fil d'Ariane :** petit texte encre douce, séparateur « / », cibles de 44 px.
- **Pied de page :** fond champ, devise en lead, mention Amazon, deux colonnes de liens, puis le nom du site en très grand caramel pour fermer la page.

### Tableau comparatif
Ordinateur : vrai tableau, en-tête encre, lignes paires sur champ, bouton safran compact par ligne. Téléphone (sous 768 px) : une carte champ par produit avec liste de caractéristiques et bouton safran pleine largeur. Mention Amazon dessous.

### Mention Amazon
Petit texte encre douce, toujours à côté des boutons Amazon (`TopPicks`, `ComparisonTable`, `ProductCard`) et dans le pied de page.

### Photo créditée (`Figure`)
Photo réelle (Pexels), chargement différé, fond champ en attente ; crédit « auteur, Pexels » en petit texte encre douce juste dessous (ou en pastille papier en bas de la photo de `StagePage`).

### Nuancier de l'accueil
Colonne de cinq aplats (gamelle à méthode), chacun un lien vers son chapitre, de 52 px minimum, texte fixé par aplat.

### Carte de chapitre
Carte encre, texte crème, titre Instrument Serif, fait concret, détail et crédit en crème à 80 %, bouton crème vers l'article (masqué si la page n'existe pas).

### Ticket de méthode (`MethodSlip`)
Ticket papier au bord dentelé sur un fond caramel plein, lignes reliées à leur source par des pointillés, bandeau encre de conclusion.

## Do's and Don'ts

### Do:
- **Do** poser chaque texte sur un aplat plein avec son couple fixé (encre sur papier/champ/aplats clairs, crème sur caramel plein et encre).
- **Do** garder le safran pour Amazon et pour une seule action principale par écran, avec le texte encre dessus.
- **Do** utiliser de vraies photos de chats libres de droits (Pexels, Unsplash, Pixabay), listées dans `content/credits.json` et créditées sous l'image.
- **Do** animer les entrées par translation seule (`.reveal` : 20 px, liée au défilement, CSS pur) et réserver `.rise` (fondu + 24 px, 700 ms, cascade de 80 ms) aux titres et chapeaux d'en-tête ; les deux disparaissent avec `prefers-reduced-motion`.
- **Do** charger vidéo, Three.js, GSAP et Lenis seulement sur les vitrines, après l'affichage, et seulement sur ordinateur (≥ 1024 px, pointeur fin) sans mouvement réduit ni économie de données ; la 3D exige en plus 4 cœurs, 4 Go et WebGL2 (`src/lib/capacites.ts`).
- **Do** donner 44 px minimum à chaque cible tactile (48 px pour les boutons).

### Don't:
- **Don't** arrondir un angle ni ajouter une ombre portée à un élément d'interface.
- **Don't** séparer des blocs avec des filets ou des bordures ; utiliser l'aplat et l'espace.
- **Don't** placer une étiquette ou un sur-titre au-dessus d'un titre, ni de texte en capitales espacées.
- **Don't** écrire du texte en safran ou en caramel clair sur papier.
- **Don't** mettre de 3D, de GSAP ou de Lenis dans un article (comparatif ou guide).
- **Don't** utiliser d'illustration dessinée, d'image Amazon ou de produit de marque identifiable pour en illustrer un autre.
- **Don't** descendre sous 16 px de texte.
