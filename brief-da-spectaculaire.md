# Moustache Malin : direction artistique « spectaculaire »

> Brief pour Claude Code. Il **remplace les sections 3 à 5 de `refonte-design.md`** (les sections 1, 2 et 4 de ce fichier sont faites). Le fond du site ne change pas : articles, règles Amazon, SEO, performance, accessibilité.
> Branche `etape-5`, Deploy Preview Netlify. **Ne fusionne rien sur `main`** sans l'accord du propriétaire.

---

## 0. Avant de commencer : point d'avancement

Réponds d'abord par une liste à cocher, sans rien coder :

1. Étapes 1 à 4 du CLAUDE.md : faites ?
2. Comparatif fontaines + rubrique `/fontaines/` en ligne sur la prévisualisation ? (contrôle externe : oui, 21 liens Amazon, FAQ, encadré du guide actif)
3. Refonte phase 1 (palette bleu nuit et orange, polices, premier écran, section « petits soucis ») : faite ?
4. Les deux corrections demandées (fondu enchaîné du texte en section 2, nouvelle vidéo nette) : faites ou pas ?
5. Détail du quiz et règle « aucun visuel ne reproduit un produit de marque » remis dans CLAUDE.md ?
6. `.env.local` dans `.gitignore`, `credits.json` complet ?

Termine ce qui manque dans cette liste, puis passe à la suite.

---

## 1. Mettre à jour CLAUDE.md

Modifie-le directement :

**Section 8, Palette** : ajoute une troisième couleur, **lavande lumineuse (environ #B9A6FF)**, en grands aplats de fond pour certaines sections, en cartes en verre dépoli et en surlignage. Les fonds de section **changent de couleur au fil du scroll** (blanc cassé → orange → lavande → bleu nuit), avec des transitions douces. Toujours vérifier les contrastes (texte bleu nuit sur orange et sur lavande).

**Section 8, Typographie** : ajoute une **serif italique élégante** pour les mots mis en valeur dans les titres (proposition : Instrument Serif, italique, Google Fonts). On mélange : grotesque très grasse (Bricolage Grotesque) + un mot en serif italique, souvent en orange ou en lavande. Exemple : « Un chat *heureux* tient à peu de choses ».

**Section 2 et 3, 3D et WebGL** : remplace la règle « aucune 3D » par :
« Pas de modèles 3D (pas d'objets modélisés). WebGL (Three.js) est autorisé **uniquement sur l'accueil et les vitrines**, pour des effets appliqués à de **vraies photos** : photo qui se désintègre en particules, transition en mosaïque de pixels, déformation au scroll, formes abstraites en particules. Chargement après l'affichage du texte, uniquement quand la section approche. Les articles n'embarquent jamais WebGL. »

---

## 2. La grammaire visuelle (tirée des références du propriétaire)

Le propriétaire a fourni 4 vidéos de sites « immersifs ». Ce qui les rend spectaculaires, et ce qu'on reprend :

1. **Une phrase qui se raconte au scroll** : les mots apparaissent un par un, sortant d'un flou. Un mot-clé change de police (serif italique) et de couleur.
2. **Une image qui se désintègre** en milliers de particules qui tourbillonnent, puis se reforment en autre chose.
3. **Des transitions en mosaïque** : l'image se décompose en carrés qui disparaissent pour révéler la scène suivante.
4. **Un décor persistant** au fond (une forme en particules qui tourne doucement, avec un cœur lumineux), pendant que des **cartes en verre dépoli** défilent par-dessus.
5. **Des chapitres en aplats de couleur** avec un **mot géant**, et un sujet qui traverse l'écran.
6. **Un zoom arrière vers une mosaïque** de photos, puis un **compteur géant**.
7. **Des mots qui défilent** à la place d'un autre (« Sécurité → Bruit → Entretien → Coût »).

Notre matière, ce sont **de vraies photos et vidéos de chats**, jamais des objets modélisés ni des produits de marque.

---

## 3. Le scénario de l'accueil, scène par scène

**Scène 1 : Macro.** Plein écran sur un **très gros plan d'œil de chat et de moustaches** (photo ou vidéo nette, source ≥ 1920 px). Le titre arrive mot par mot depuis le flou : « Bien équiper son chat, *sans se tromper* » (« sans se tromper » en serif italique orange). Bouton orange vers le comparatif litière. Au scroll, zoom arrière jusqu'au chat entier.

**Scène 2 : Désintégration.** La photo du chat se **désintègre en particules** (les pixels de la photo) qui tourbillonnent puis se reforment en une autre photo (un chat qui boit). Pendant ce temps, une phrase se raconte mot par mot : « Un chat *heureux* tient à peu de choses. »

**Scène 3 : Les petits soucis** (la section épinglée existante, améliorée). Chaque souci a sa couleur de fond qui change au scroll (orange, lavande, bleu nuit, blanc cassé), un **mot géant** (« Zéro corvée », « Eau fraîche », « Bien manger », « Griffes libres ») et un **chat détouré** (vraie photo, fond retiré) qui traverse l'écran en pivotant légèrement. Le passage d'un souci à l'autre se fait par **transition en mosaïque**. Le texte ne disparaît jamais complètement : fondu enchaîné. Mêmes liens qu'aujourd'hui.

**Scène 4 : La pelote.** Au fond, une **pelote de laine en particules** (forme abstraite, fils lumineux, cœur orange) qui tourne doucement et reste fixe. Par-dessus défilent des **cartes en verre dépoli lavande** : une par article en ligne (comparatif litière, comparatif fontaines, guide boire), avec grande photo et titre.

**Scène 5 : La mosaïque.** Zoom arrière vers un **mur de photos de chats** (au moins 24), puis un **compteur géant** sur nos vrais chiffres uniquement : « 12 appareils passés au crible ». Aucun chiffre inventé.

**Scène 6 : Comment nous comparons.** Le comparatif qui se construit sous les yeux (fiche technique → tableau → badge « Notre choix »), avec un mot qui défile : « Sécurité → Bruit → Entretien → Coût ».

**Scène 7 : Fin.** Grande section bleu nuit, la page se courbe légèrement en arrivant. « Moustache *Malin* » en très grand, bouton orange vers les comparatifs.

**Photos à prévoir** (Pexels, Pixabay, Unsplash, crédits dans `credits.json`) : gros plan d'œil de chat, 3 ou 4 chats faciles à détourer (fond retiré avec un outil local gratuit, par exemple `rembg`), au moins 24 photos variées pour la mosaïque, et des photos lumineuses et nettes partout.

---

## 3 bis. Qualité des photos et vidéos : niveau luxe

Le propriétaire veut un rendu **haut de gamme, net partout**. C'est une règle pour tout le site (accueil, rubriques, articles, guides), à ajouter aussi dans CLAUDE.md, section « Photos et vidéos ».

**Choix des sources**
- Télécharger toujours la **taille originale** (bouton « Original » sur Pexels, « Full size » sur Unsplash, plus grande taille sur Pixabay). Jamais les aperçus.
- **Photos : 3 000 px de large minimum à la source** (4 000 px et plus pour le plein écran et les gros plans). **Vidéos : 4K à la source** si possible, 1920 px minimum.
- Privilégier Unsplash et Pexels, dont les photos sont souvent de meilleure qualité que Pixabay.
- **Rejeter** : flou de bougé, mise au point ratée (sur un gros plan, l'œil doit être parfaitement net), bruit numérique visible, surexposition, filigrane, marque visible, rendu « IA », photo sombre ou terne, cadrage banal de banque d'images.
- **Contrôle à 100 %** : ouvrir chaque fichier en taille réelle avant de le garder. Si les poils et les moustaches ne sont pas nets, on jette.

**Cohérence**
- Une même ambiance sur tout le site : lumière naturelle, tons lumineux et chauds, couleurs franches qui vont avec le bleu nuit, l'orange et la lavande. Corriger légèrement l'exposition et la balance des blancs si besoin pour harmoniser (sans filtre lourd).

**Préparation technique (net ET rapide)**
- **Ne jamais agrandir** une image au-delà de sa taille d'origine.
- Générer plusieurs tailles par image (par exemple 640, 1080, 1600, 2560 et 3840 px pour le plein écran) via `next/image`, avec des `sizes` corrects : le téléphone télécharge une petite version, l'écran Retina une version 2x nette.
- Formats AVIF et WebP, qualité autour de 80 (pas plus bas sur les photos de chats : les poils se dégradent vite).
- Vidéos : encodage H.264 (et WebM si utile) en 1920 et 2560 px, débit suffisant pour que le pelage reste net (pas de compression excessive). Le téléphone garde une image fixe.
- Les chats détourés : détourage propre autour des poils et des moustaches, sinon on change de photo.

**Livraison** : dans le rapport de chaque lot, liste chaque média avec sa résolution source, sa résolution affichée maximale et son poids final. Signale toute image qui s'affiche plus grand que sa source.

---

## 4. Téléphone, accessibilité, performance

- **Téléphone** : on garde le spectacle, en version allégée. Moins de particules (environ 1/4), mosaïque de 4 × 4 carrés, épinglages plus courts, photos au lieu des vidéos. Rien ne doit saccader sur un téléphone moyen.
- **Animations réduites** : aucune particule ni mouvement ; les scènes deviennent des sections simples, lisibles et cliquables.
- **Texte** : toujours dans le HTML (lisible par Google et sans JavaScript). Aucun texte coupé ou hors écran pendant une animation.
- **Scroll** : ne jamais bloquer ni ralentir le défilement naturel (pas de scroll-jacking agressif).
- **Objectifs** : Lighthouse mobile ≥ 75 sur l'accueil, ≥ 90 sur les articles. Le texte du premier écran s'affiche avant tout effet.
- **Skills** : Taste pour la direction, `/impeccable shape` avant de coder, Emil Kowalski pour le timing et les courbes de toutes les animations, `/impeccable polish` et `/impeccable audit` à la fin, Playwright pour les captures.

---

## 5. Articles et rubriques

Même identité (palette, polices, mot en serif italique dans les titres, grande photo en tête), mais **calmes et rapides** : apparitions légères en CSS, aucun WebGL. Les tableaux comparatifs, boutons Amazon et encadrés gardent leur clarté. C'est là que se font les clics.

---

## 6. Méthode et livraison

1. **Lot 1** : scènes 1, 2 et 3. Mets à jour la prévisualisation, envoie les captures ordinateur (1440 px) et téléphone (390 px) et une courte vidéo ou des captures en plusieurs étapes du scroll, ainsi que les scores Lighthouse. **Attends l'accord** avant le lot 2.
2. **Lot 2** : scènes 4 à 7, puis restyle des articles et rubriques.
3. À la fin : audit complet, captures, Lighthouse, adresse de prévisualisation.

**Pas maintenant, mais avant la vraie mise en ligne** : les mentions légales affichent encore « À COMPLÉTER ». Le propriétaire les remplira lui-même.
