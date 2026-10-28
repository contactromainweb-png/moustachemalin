# Refonte du design de Moustache Malin

> Brief pour Claude Code. Le propriétaire trouve la direction actuelle trop sombre et terne, et la 3D trop « dessin animé ». On change d'habillage, **pas de fond** : articles, règles Amazon, SEO, performance et accessibilité restent identiques.
> Travaille sur la branche `etape-5` (elle contient déjà les photos et les corrections de chargement). **Ne fusionne pas sur main** avant l'accord du propriétaire.

---

## 1. D'abord, mettre à jour CLAUDE.md

Modifie directement CLAUDE.md (ne le recrée pas) :

**Section 2, Performance** : remplace « Les articles (comparatifs et guides) n'embarquent pas Three.js » par « Le site n'utilise pas de 3D (pas de Three.js). Les animations au scroll (GSAP) sont chargées uniquement sur l'accueil et les pages vitrines ; les articles n'ont que des apparitions légères en CSS. »

**Section 3, Stack** : supprime la ligne « 3D : Three.js via React Three Fiber + @react-three/drei ». GSAP + ScrollTrigger et Lenis servent aussi sur mobile (version allégée).

**Section 5, Vitrines** : remplace le bloc « Vitrines 3D » par :
- **Vitrines animées (photos et vidéos réelles, aucune 3D)** : accueil, vitrine litière, vitrine fontaine, quiz. Les effets reposent sur de vraies photos et vidéos de chats : zoom au scroll, découpe en morceaux qui s'éclatent, révélations par masque, galeries horizontales, vidéo qui avance avec le défilement.

**Section 8, Design** : remplace les puces « Ambiance » et « Palette » et « Typographie » par :
- Ambiance : lumineuse, moderne, énergique, très contrastée. Les photos de vrais chats sont les héroïnes, en grand format. Référence d'esprit : romainweb.fr (grande photo plein écran, titres très gras, fond clair, une couleur forte, un accent vif, sections qui se construisent au scroll), sans copier ses couleurs ni sa police.
- Palette : fond blanc cassé (environ #FAF7F2), couleur forte **bleu nuit** (environ #14213D) pour les titres, le header et les grandes sections pleines, accent **orange vif** (environ #FF7A1A) pour les boutons Amazon et les appels à l'action, avec texte bleu nuit sur l'orange (vérifier le contraste). Un gris chaud pour le texte secondaire. Plus de brun ni de caramel.
- Typographie : titres dans une grotesque très grasse et expressive (proposition : Bricolage Grotesque, Google Fonts), texte dans une sans-serif très lisible (proposition : DM Sans). Titres de l'accueil énormes (jusqu'à 7 à 9 rem sur ordinateur).
- Thème clair par défaut. Le mode sombre reste possible mais secondaire (fond bleu nuit, pas brun).

**Tableau des skills** : dans la ligne Taste, remplace « Garder l'ambiance chaleureuse et lumineuse » par « Viser une ambiance lumineuse, moderne et contrastée (bleu nuit et orange vif sur blanc cassé) ». Supprime le paragraphe qui parle de Three.js sous le tableau.

**Section 9, étape 5** : « Accueil vitrine : photos et vidéos de chats animées au scroll (GSAP), versions allégées mobile et mouvement réduit. »

---

## 2. Retirer la 3D

- Supprime la scène 3D de l'accueil, ses composants et les dépendances `three`, `@react-three/fiber`, `@react-three/drei`.
- Garde toutes les photos et vidéos déjà choisies et leur `credits.json`. Ajoute-en si une section en manque (Pexels, Pixabay, Unsplash, crédits obligatoires).
- Vidéo du premier écran : version nette 1920 px pour les grands écrans uniquement ; le téléphone garde une image légère.

---

## 3. Nouvelle page d'accueil, section par section

1. **Premier écran** : vidéo (ordinateur) ou photo (téléphone) d'un chat en plein écran, titre énorme et gras en surimpression (ex. « Bien équiper son chat, sans se tromper »), bouton orange vers le comparatif litière. Au scroll, la vidéo se rétrécit dans une carte aux coins arrondis (zoom arrière + arrondi), et la section suivante glisse dessous.
2. **« Les petits soucis du quotidien »** (section épinglée) : à gauche un grand titre qui change, à droite une grande photo qui change à chaque étape du scroll avec une révélation par masque (clip-path). 4 étapes : la litière qui sent (photo de chat détendu), le chat qui boit peu (chat au robinet), les repas (chat à la gamelle), les griffes (chat sur un arbre à chat). Chaque étape a son lien vers l'article ou la rubrique existante ; les étapes sans page restent sans bouton.
3. **Transition « éclatée »** : une grande photo de chat se découpe en grille de morceaux (6 à 12 sur ordinateur, 4 sur téléphone) qui s'écartent et s'envolent au scroll pour révéler la section suivante.
4. **« Déjà comparé »** : galerie horizontale qui défile au scroll (ordinateur), en balayage tactile sur téléphone. Grandes cartes photo pour chaque article en ligne (comparatif litière, comparatif fontaines, guide boire), avec le titre en gros.
5. **« Comment nous comparons »** : comme la maquette qui se construit sur romainweb.fr, un comparatif se monte sous les yeux en 3 temps : la fiche technique apparaît, puis le tableau se remplit, puis le badge « Notre choix » se pose. Textes courts à gauche qui s'allument au fil du scroll.
6. **Dernier écran** : grande section bleu nuit, photo de chat, titre énorme, bouton orange vers les comparatifs.

**Animations** : utilise le skill Emil Kowalski pour le timing et les courbes. Rien ne doit être saccadé, et aucun texte ne doit apparaître coupé ou hors de l'écran pendant une animation. Tout doit rester lisible et cliquable sans JavaScript.

**Téléphone** : les mêmes sections, en plus court et plus léger (épinglages courts, moins de morceaux, pas de vidéo). Avec « animations réduites » : simples apparitions, sans mouvement.

**Pages articles et rubriques** : elles prennent la nouvelle palette et la nouvelle typographie, avec une grande photo en tête. Pas d'animation lourde.

---

## 4. Aussi sur cette branche

- **Comparatif des fontaines** : le texte est dans `content/fontaines/fontaine-a-eau-chat.mdx`, les 6 fiches dans `content/products/`. Crée la rubrique `/fontaines/` et le comparatif. L'encadré du guide « Mon chat ne boit pas » doit s'afficher, et le lien Fontaines doit apparaître dans le menu.

---

## 5. Méthode de travail

1. Lance `/impeccable shape` sur l'accueil et utilise Taste (`high-end-visual-design`).
2. **Construis d'abord seulement le premier écran et la section 2**, mets à jour la prévisualisation Netlify, et montre-moi des captures ordinateur et téléphone. **Attends mon accord sur la direction avant de construire le reste.**
3. Puis le reste de l'accueil, puis les articles et rubriques.
4. À la fin : `/impeccable polish` et `/impeccable audit`, captures Playwright (390 px et 1440 px), Lighthouse mobile (objectifs inchangés : ≥ 90 pour les articles, ≥ 75 pour l'accueil, LCP visé < 2,5 s). Donne-moi l'adresse de la prévisualisation.
