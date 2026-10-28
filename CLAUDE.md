# Moustache Malin — cahier des charges du site

> Fichier de référence pour Claude Code. À placer à la racine du projet sous le nom `CLAUDE.md`.
> Claude Code le lit automatiquement à chaque session : toutes les décisions ci-dessous s'appliquent par défaut.

---

## 1. Le projet en bref

- **Nom** : Moustache Malin — **domaine** : moustachemalin.fr
- **Quoi** : site éditorial français d'affiliation sur l'équipement pour chat (litières autonettoyantes, fontaines, distributeurs, arbres à chat, griffoirs, chatières, gamelles).
- **Promesse** : « Le bon équipement pour un chat heureux, sans se tromper. »
- **Cible** : propriétaires de chat en France, 25-45 ans, souvent en appartement, majoritairement sur mobile.
- **Revenus** : liens affiliés Amazon Partenaires (amazon.fr), puis programmes directs de marques.
- **Propriétaire** : débutant en code. Explique chaque étape simplement, donne les commandes exactes à taper, et vérifie toi-même que tout fonctionne avant de dire que c'est fini.

## 2. Règles non négociables

### Honnêteté et conformité
- Les avis sont **basés sur la recherche**, principalement les fiches techniques des fabricants. Chaque comparatif l’annonce en haut : “Nous n’avons pas testé physiquement ces produits : ce comparatif repose sur les fiches techniques des fabricants.” Les retours d’acheteurs ne sont mentionnés que dans un comparatif où ils ont réellement été analysés.
- **Jamais** de faux témoignages, faux avis clients, fausses notes ou faux « testé par notre équipe ».
- **Jamais** de copie d'avis clients Amazon, même reformulés.
- **Pas de schema.org `Review` / `AggregateRating`** avec des notes inventées.
- **Mention Amazon obligatoire** sur chaque page qui contient un lien affilié, près des liens : « En tant que Partenaire Amazon, Moustache Malin réalise un bénéfice sur les achats remplissant les conditions requises. » Elle figure aussi dans le footer.
- **Prix** : ne jamais écrire un prix Amazon en dur dans une page. Bouton « Voir le prix sur Amazon ». Les prix et images dynamiques viendront plus tard via l'API Creators d'Amazon (accessible après 10 ventes en 30 jours) : prévoir un composant prêt à être branché, mais désactivé par défaut.
- **Images produits** : ne pas télécharger ni héberger les images d'Amazon. En attendant l'API, les fiches produit affichent une photo d'ambiance libre de droits ou un visuel neutre, avec le nom du produit.
- **Liens affiliés** : attribut `rel="sponsored nofollow noopener"` et `target="_blank"`.

### Photos et vidéos
- Uniquement des sources libres pour usage commercial : **Pexels, Unsplash, Pixabay**.
- Chaque média utilisé est listé dans `content/credits.json` (fichier, auteur, source, URL, licence).
- Pas de visuel montrant un produit de marque identifiable pour illustrer un autre produit.
- Style recherché : **photos et vidéos réelles, vivantes, chaleureuses** (chats qui jouent, boivent, sautent). Pas d'illustrations dessinées.
- **Niveau luxe, net partout** (tout le site : accueil, rubriques, articles, guides) :
  - Toujours télécharger la **taille originale** (« Original » sur Pexels, « Full size » sur Unsplash), jamais les aperçus. Privilégier Unsplash et Pexels.
  - **Photos : 3 000 px de large minimum à la source** (4 000 px et plus pour le plein écran et les gros plans). **Vidéos : 4K à la source** si possible, 1920 px minimum.
  - **Rejeter** : flou de bougé, mise au point ratée (sur un gros plan, l'œil parfaitement net), bruit visible, surexposition, filigrane, marque visible, rendu « IA », photo sombre ou terne, cadrage banal de banque d'images.
  - **Contrôle à 100 %** de chaque fichier avant de le garder : si les poils et les moustaches ne sont pas nets, on jette.
  - Ambiance commune : lumière naturelle, tons lumineux et chauds, couleurs qui vont avec le bleu nuit, l'orange et la lavande. Légère correction d'exposition ou de balance des blancs si besoin, sans filtre lourd.
  - **Ne jamais agrandir** une image au-delà de sa taille d'origine. Plusieurs tailles par image via `next/image` (640 à 3840 px) avec des `sizes` corrects ; AVIF/WebP, **qualité 80** (pas moins sur les poils).
  - Vidéos : H.264 (WebM si utile) en 1920 et 2560 px, débit suffisant pour un pelage net ; le téléphone garde une image fixe.
  - Chats détourés : détourage propre autour des poils et des moustaches, sinon on change de photo.
  - Dans le rapport de chaque lot : chaque média avec sa résolution source, sa résolution affichée maximale et son poids final ; signaler toute image affichée plus grand que sa source.

### Performance (Google et mobile d'abord)
- Objectifs Core Web Vitals sur mobile : **LCP < 2,5 s, INP < 200 ms, CLS < 0,1**.
- Toutes les pages sont générées statiquement (SSG).
- La vidéo et les animations ne bloquent **jamais** l'affichage du texte : chargement différé (lazy) après le contenu principal, et uniquement quand la section entre dans l'écran.
- Respect de `prefers-reduced-motion` : version sans animation lourde.
- Mobile et appareils faibles : version allégée automatique (DPR plafonné, moins de particules, vidéo remplacée par une image si besoin).
- Pas de modèles 3D (pas d'objets modélisés). WebGL (Three.js) est autorisé **uniquement sur l'accueil et les vitrines**, pour des effets appliqués à de **vraies photos** : photo qui se désintègre en particules, transition en mosaïque de pixels, déformation au scroll, formes abstraites en particules. Chargement après l'affichage du texte, uniquement quand la section approche. Les articles n'embarquent jamais WebGL.
- Les animations au scroll (GSAP) sont chargées uniquement sur l'accueil et les pages vitrines ; les articles n'ont que des apparitions légères en CSS.

## 3. Stack technique

- **Next.js** (dernière version stable, App Router) + **TypeScript**
- **Tailwind CSS**
- **MDX** pour les articles (contenu dans `content/`)
- **WebGL** : Three.js, uniquement sur l'accueil et les vitrines, pour des effets sur de vraies photos (particules, mosaïque, déformation) ; jamais de modèles 3D ni dans les articles
- **Animations au scroll** : **GSAP** + ScrollTrigger, **Lenis** pour le scroll fluide (vitrines uniquement), aussi sur mobile en version allégée
- **Images** : `next/image` (formats AVIF/WebP, tailles responsives)
- **Hébergement** : **Netlify** (compte existant du propriétaire, à côté de ses projets clients), déploiement automatique depuis **GitHub**. Utiliser l'adaptateur officiel Next.js de Netlify.
- **Analyse** : Google Search Console ; statistiques sans cookie à choisir plus tard (outil gratuit), pour éviter un bandeau cookies lourd
- Budget : 0 € hors nom de domaine. Ne propose aucun service payant sans le signaler clairement.

## 4. Structure du site

```
/                                   Accueil (vitrine animée)
/litieres/                          Rubrique
/litieres/litiere-autonettoyante/   Comparatif pilier
/fontaines/
/fontaines/fontaine-a-eau-chat/
/repas/
/repas/distributeur-croquettes-chat/
/griffer-grimper/
/griffer-grimper/arbre-a-chat/
/sorties/
/sorties/chatiere/
/guides/                            Guides problème (ex. /guides/mon-chat-ne-boit-pas/)
/quiz/                              Quiz « Quel équipement pour mon chat ? »
/a-propos/                          Qui sommes-nous + méthode de sélection
/methode/                           Comment nous comparons (transparence)
/mentions-legales/
/confidentialite/
/affiliation/                       Explication de l'affiliation Amazon
```

URLs en français, minuscules, avec tirets, sans accents.

## 5. Types de pages

### Comparatif (modèle principal — c'est lui qui rapporte)
1. Titre H1 avec le mot-clé principal + date de mise à jour visible
2. Encadré « Notre méthode » (avis basé sur la recherche) + mention Amazon
3. **Résumé rapide** : 3 choix maximum (« Le meilleur globalement », « Le meilleur petit budget », « Pour plusieurs chats ») avec bouton Amazon
4. **Tableau comparatif** (responsive, lisible sur mobile : cartes empilées)
5. Fiche détaillée par produit : pour qui, points forts, points faibles, entretien, consommables à racheter, bouton Amazon
6. **Guide d'achat** : critères de choix, erreurs à éviter
7. **FAQ** (schema.org `FAQPage`)
8. Liens vers les guides et comparatifs liés (maillage interne)

### Guide problème
- Répond à une question (« Mon chat ne boit pas »), structure claire, ton rassurant.
- Pour tout sujet de santé : encadré « En cas de doute, consultez votre vétérinaire ». Aucun conseil médical.
- Renvoie vers le comparatif adapté avec un encadré produit.

### Rubrique
- Introduction courte, cartes vers les articles, photo ou vidéo d'ambiance.

### Vitrines animées (4 pages seulement)
- **Vitrines animées (photos et vidéos réelles, pas de modèles 3D)** : accueil, vitrine litière, vitrine fontaine, quiz. Les effets reposent sur de vraies photos et vidéos de chats : zoom au scroll, particules et mosaïques WebGL tirées des photos, révélations par masque, galeries horizontales, vidéo qui avance avec le défilement.
- **Quiz** : 5 questions animées, résultat avec 2 ou 3 recommandations.
- Aucun visuel (photo, effet, illustration) ne reproduit un produit de marque.

## 6. Composants à créer

- `AffiliateButton` : lien Amazon formaté (tag partenaire dans une variable d'environnement `NEXT_PUBLIC_AMAZON_TAG`), `rel` correct, suivi des clics.
- `AmazonDisclosure` : la mention obligatoire.
- `MethodNote` : l'encadré « avis basé sur la recherche ».
- `ProductCard`, `TopPicks`, `ComparisonTable`, `ProsCons`, `FAQ` (avec schema), `VetNotice`, `RelatedArticles`, `Breadcrumbs` (avec schema), `UpdatedDate`, `CalloutLink` (encadré qui renvoie d'un guide vers un comparatif : `href`, `title`, `text`).
- Liens internes vers des pages pas encore écrites : ne pas casser le build ; les masquer tant que la page cible n'existe pas.
- `ProductData` : les produits sont décrits dans `content/products/*.json` (nom, ASIN, catégorie, caractéristiques, points forts/faibles, consommables). Les articles MDX les appellent par ASIN, pour pouvoir changer un lien partout en une fois.
- `NewsletterForm` : prêt à brancher sur un outil gratuit (à choisir plus tard), désactivé par défaut.

## 7. SEO

- `metadata` Next.js sur chaque page (title ≤ 60 caractères, description ≤ 155), Open Graph.
- `sitemap.xml` et `robots.txt` générés automatiquement.
- schema.org : `Organization`, `WebSite`, `Article`, `BreadcrumbList`, `FAQPage`, `ItemList` sur les comparatifs.
- Un seul H1 par page, hiérarchie H2/H3 propre, textes alternatifs sur toutes les images.
- Maillage interne : chaque guide renvoie vers au moins un comparatif ; chaque comparatif vers ses consommables et 2 articles liés.

## 8. Design

- Ambiance : lumineuse, moderne, énergique, très contrastée. Les photos de vrais chats sont les héroïnes, en grand format. Référence d'esprit : romainweb.fr (grande photo plein écran, titres très gras, fond clair, une couleur forte, un accent vif, sections qui se construisent au scroll), sans copier ses couleurs ni sa police.
- Palette : fond blanc cassé (environ #FAF7F2), couleur forte **bleu nuit** (environ #14213D) pour les titres, le header et les grandes sections pleines, accent **orange vif** (environ #FF7A1A) pour les boutons Amazon et les appels à l'action, avec texte bleu nuit sur l'orange (vérifier le contraste). Un gris chaud pour le texte secondaire. Plus de brun ni de caramel.
- Troisième couleur : **lavande lumineuse** (environ #B9A6FF), en grands aplats de fond pour certaines sections, en cartes en verre dépoli et en surlignage. Sur l'accueil, les fonds de section **changent de couleur au fil du scroll** (blanc cassé → orange → lavande → bleu nuit), avec des transitions douces. Toujours vérifier les contrastes (texte bleu nuit sur orange et sur lavande).
- Typographie : titres dans une grotesque très grasse et expressive (proposition : Bricolage Grotesque, Google Fonts), texte dans une sans-serif très lisible (proposition : DM Sans). Titres de l'accueil énormes (jusqu'à 7 à 9 rem sur ordinateur). Les mots mis en valeur dans les titres passent en **serif italique élégante** (proposition : Instrument Serif italique, Google Fonts), souvent en orange ou en lavande. Exemple : « Un chat *heureux* tient à peu de choses ».
- Thème clair par défaut. Le mode sombre reste possible mais secondaire (fond bleu nuit, pas brun).
- Mascotte possible plus tard : « Moustache », utilisée dans les vidéos courtes.
- Accessibilité : contrastes suffisants, navigation au clavier, tailles de texte ≥ 16 px.

### Skills et outils installés : quand les utiliser

Utilise-les systématiquement aux moments indiqués. Ils améliorent la qualité, mais **ne remplacent jamais les règles de ce fichier** : thème clair par défaut, photos réelles de chats, performance mobile, pas de modèles 3D (WebGL seulement sur l'accueil et les vitrines).

| Outil | Rôle | Quand |
| --- | --- | --- |
| **Taste** (`design-taste-frontend`, `high-end-visual-design`) | Direction visuelle haut de gamme, anti « look IA » | Au début de chaque nouveau type de page (accueil, rubrique, comparatif, guide). Viser une ambiance lumineuse, moderne et contrastée (bleu nuit et orange vif sur blanc cassé) : pas de style brutaliste ni sombre par défaut. |
| **Impeccable** (`/impeccable shape`, `craft`, `typeset`, `colorize`, `polish`, `audit`, `critique`) | Structurer, construire puis peaufiner l'interface | `shape` avant de coder une page, `craft` pour la construire, `polish` à la fin de chaque étape, `audit` avant chaque mise en ligne. |
| **Emil Kowalski** (`emil-design-eng`) | Qualité des animations et micro-interactions (timing, easing, retours au survol et au clic) | Pour toutes les animations : boutons, cartes, apparitions au scroll, et le rythme des vitrines animées (étape 5). Toujours avec une version `prefers-reduced-motion`. |
| **Playwright** (MCP) | Ouvrir le site dans un vrai navigateur, faire des captures, tester en taille mobile (390 px) et ordinateur | À la fin de chaque étape : captures mobile et ordinateur, vérification des liens, de la mention Amazon et de l'absence d'erreurs dans la console. Montre-moi les captures. |

## 9. Ordre de construction

Travaille étape par étape. À la fin de chaque étape : lance le site en local, vérifie qu'il n'y a pas d'erreur, puis explique-moi en quelques phrases ce qui a été fait et comment le voir.

1. **Initialisation** : projet Next.js + TypeScript + Tailwind + MDX, dépôt GitHub, premier déploiement sur Netlify (nouveau site distinct des projets clients).
2. **Socle** : layout, header, footer (mention Amazon), pages légales, `/a-propos`, `/methode`, `/affiliation`.
3. **Modèles** : comparatif, guide, rubrique + tous les composants de la section 6, avec un faux produit d'exemple.
4. **Premier vrai contenu** : le comparatif « litière autonettoyante » et le guide « mon chat ne boit pas » (textes fournis séparément).
5. **Accueil vitrine** : photos et vidéos de chats animées au scroll (GSAP), versions allégées mobile et mouvement réduit.
6. **SEO technique** : sitemap, robots, schemas, metadata ; contrôle Lighthouse mobile.
7. **Mise en ligne** : branchement du domaine moustachemalin.fr sur Netlify, déclaration dans Google Search Console.
8. Plus tard : vitrines litière et fontaine, quiz, API Amazon, newsletter.

## 10. Définition de « terminé »

- Le site se lance sans erreur et la commande de build passe.
- Score Lighthouse mobile ≥ 90 en performance sur les articles (≥ 75 sur les vitrines animées).
- Mention Amazon présente sur toutes les pages avec liens affiliés.
- Aucun prix en dur, aucune image Amazon hébergée, aucun faux avis.
- Chaque média a sa ligne dans `content/credits.json`.
