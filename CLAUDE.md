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
- Les avis sont **basés sur la recherche** (fiches techniques, prix, entretien, synthèse des retours acheteurs). Chaque comparatif l'annonce clairement en haut : « Nous n'avons pas testé physiquement ces produits : cette sélection repose principalement sur les fiches techniques des fabricants et, quand nous les avons analysés, sur les retours d'acheteurs. »
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

### Performance (Google et mobile d'abord)
- Objectifs Core Web Vitals sur mobile : **LCP < 2,5 s, INP < 200 ms, CLS < 0,1**.
- Toutes les pages sont générées statiquement (SSG).
- La 3D et la vidéo ne bloquent **jamais** l'affichage du texte : chargement différé (lazy) après le contenu principal, et uniquement quand la section entre dans l'écran.
- Respect de `prefers-reduced-motion` : version sans animation lourde.
- Mobile et appareils faibles : version allégée automatique (DPR plafonné, moins de particules, vidéo remplacée par une image si besoin).
- Les articles (comparatifs et guides) n'embarquent **pas** Three.js.

## 3. Stack technique

- **Next.js** (dernière version stable, App Router) + **TypeScript**
- **Tailwind CSS**
- **MDX** pour les articles (contenu dans `content/`)
- **3D** : Three.js via **React Three Fiber** + **@react-three/drei**
- **Animations au scroll** : **GSAP** + ScrollTrigger, **Lenis** pour le scroll fluide (vitrines uniquement)
- **Images** : `next/image` (formats AVIF/WebP, tailles responsives)
- **Hébergement** : **Netlify** (compte existant du propriétaire, à côté de ses projets clients), déploiement automatique depuis **GitHub**. Utiliser l'adaptateur officiel Next.js de Netlify.
- **Analyse** : Google Search Console ; statistiques sans cookie à choisir plus tard (outil gratuit), pour éviter un bandeau cookies lourd
- Budget : 0 € hors nom de domaine. Ne propose aucun service payant sans le signaler clairement.

## 4. Structure du site

```
/                                   Accueil (vitrine 3D)
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

### Vitrines 3D (4 pages seulement)
- **Accueil** : vidéo plein écran d'un chat (Pexels/Unsplash) qui avance au rythme du scroll, puis une scène 3D stylisée d'appartement : litière, fontaine, gamelle, arbre à chat s'éclairent tour à tour et mènent vers leur rubrique.
- **Vitrine litière autonettoyante** (en tête du comparatif pilier) : vue éclatée au scroll d'une litière générique (tambour qui tourne, tamis, tiroir).
- **Vitrine fontaine** : circuit de l'eau animé (pompe, filtre, cascade).
- **Quiz** : 5 questions animées, résultat avec 2 ou 3 recommandations.
- Modèles 3D **génériques et originaux**, jamais la reproduction d'un produit de marque.

## 6. Composants à créer

- `AffiliateButton` : lien Amazon formaté (tag partenaire dans une variable d'environnement `NEXT_PUBLIC_AMAZON_TAG`), `rel` correct, suivi des clics.
- `AmazonDisclosure` : la mention obligatoire.
- `MethodNote` : l'encadré « avis basé sur la recherche ».
- `ProductCard`, `TopPicks`, `ComparisonTable`, `ProsCons`, `FAQ` (avec schema), `VetNotice`, `RelatedArticles`, `Breadcrumbs` (avec schema), `UpdatedDate`.
- `ProductData` : les produits sont décrits dans `content/products/*.json` (nom, ASIN, catégorie, caractéristiques, points forts/faibles, consommables). Les articles MDX les appellent par ASIN, pour pouvoir changer un lien partout en une fois.
- `NewsletterForm` : prêt à brancher sur un outil gratuit (à choisir plus tard), désactivé par défaut.

## 7. SEO

- `metadata` Next.js sur chaque page (title ≤ 60 caractères, description ≤ 155), Open Graph.
- `sitemap.xml` et `robots.txt` générés automatiquement.
- schema.org : `Organization`, `WebSite`, `Article`, `BreadcrumbList`, `FAQPage`, `ItemList` sur les comparatifs.
- Un seul H1 par page, hiérarchie H2/H3 propre, textes alternatifs sur toutes les images.
- Maillage interne : chaque guide renvoie vers au moins un comparatif ; chaque comparatif vers ses consommables et 2 articles liés.

## 8. Design

- Ambiance : chaleureuse, premium, lumineuse ; les photos et vidéos de chats sont les héroïnes.
- Palette de départ : crème chaud, brun caramel, une couleur d'accent vive pour les boutons Amazon ; mode sombre supporté.
- Typographie : une police de titres avec du caractère, une police de texte très lisible (Google Fonts).
- Mascotte possible plus tard : « Moustache », utilisée dans les vidéos courtes.
- Accessibilité : contrastes suffisants, navigation au clavier, tailles de texte ≥ 16 px.

## 9. Ordre de construction

Travaille étape par étape. À la fin de chaque étape : lance le site en local, vérifie qu'il n'y a pas d'erreur, puis explique-moi en quelques phrases ce qui a été fait et comment le voir.

1. **Initialisation** : projet Next.js + TypeScript + Tailwind + MDX, dépôt GitHub, premier déploiement sur Netlify (nouveau site distinct des projets clients).
2. **Socle** : layout, header, footer (mention Amazon), pages légales, `/a-propos`, `/methode`, `/affiliation`.
3. **Modèles** : comparatif, guide, rubrique + tous les composants de la section 6, avec un faux produit d'exemple.
4. **Premier vrai contenu** : le comparatif « litière autonettoyante » et le guide « mon chat ne boit pas » (textes fournis séparément).
5. **Accueil vitrine** : vidéo au scroll + scène 3D, avec versions allégées mobile et mouvement réduit.
6. **SEO technique** : sitemap, robots, schemas, metadata ; contrôle Lighthouse mobile.
7. **Mise en ligne** : branchement du domaine moustachemalin.fr sur Netlify, déclaration dans Google Search Console.
8. Plus tard : vitrines litière et fontaine, quiz, API Amazon, newsletter.

## 10. Définition de « terminé »

- Le site se lance sans erreur et la commande de build passe.
- Score Lighthouse mobile ≥ 90 en performance sur les articles (≥ 75 sur les vitrines 3D).
- Mention Amazon présente sur toutes les pages avec liens affiliés.
- Aucun prix en dur, aucune image Amazon hébergée, aucun faux avis.
- Chaque média a sa ligne dans `content/credits.json`.
