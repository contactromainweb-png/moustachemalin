# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Propriétaires de chat en France, 25-45 ans, souvent en appartement, qui lisent majoritairement sur téléphone. Ils arrivent avec une question d'achat (quelle litière autonettoyante, quelle fontaine) ou un souci du quotidien (mon chat ne boit pas) et veulent une réponse claire sans se tromper.

## Product Purpose

Moustache Malin est un site éditorial d'affiliation sur l'équipement pour chat : comparatifs (litières autonettoyantes, fontaines, distributeurs, arbres à chat, griffoirs, chatières, gamelles) et guides pratiques. Revenus : liens Amazon Partenaires (amazon.fr), puis programmes directs de marques. Succès : le lecteur choisit l'équipement adapté à son chat et à son logement, et clique vers Amazon depuis un comparatif.

Promesse : « Le bon équipement pour un chat heureux, sans se tromper. »

## Positioning

Les avis sont basés sur la recherche, principalement les fiches techniques des fabricants ; le site le dit en haut de chaque comparatif. Les retours d'acheteurs ne sont mentionnés que là où ils ont réellement été analysés. Aucun test physique n'est revendiqué.

## Operating Context

Lecture sur mobile, souvent dans un appartement. Le guide « Mon chat ne boit pas » et le comparatif « Litière autonettoyante » sont les deux premiers articles en ligne ; les rubriques apparaissent au fur et à mesure que leurs articles sont écrits.

## Capabilities and Constraints

- Next.js (App Router) + TypeScript + Tailwind + MDX, pages statiques, hébergement Netlify (déploiement depuis GitHub). Budget 0 € hors nom de domaine.
- Liens affiliés `rel="sponsored nofollow noopener"`, `target="_blank"`, tag dans `NEXT_PUBLIC_AMAZON_TAG` (pas encore de tag : inscription prévue vers 15 articles).
- Jamais de prix écrit en dur ; jamais d'image Amazon hébergée ; API Creators d'Amazon prévue plus tard, désactivée.
- Liens vers des pages pas encore écrites : masqués automatiquement.
- Core Web Vitals mobile : LCP < 2,5 s, INP < 200 ms, CLS < 0,1. Lighthouse mobile ≥ 90 sur les articles, ≥ 75 sur les vitrines 3D.
- 3D (Three.js / React Three Fiber / drei) et GSAP + ScrollTrigger + Lenis réservés aux 4 vitrines (accueil, litière, fontaine, quiz) ; jamais dans les articles ; chargement différé, versions allégées mobile et mouvement réduit.

## Brand Commitments

- Nom : Moustache Malin ; domaine moustachemalin.fr.
- Ton chaleureux, rassurant, simple ; tutoiement exclu (vouvoiement).
- Thème clair crème par défaut ; mode sombre selon le réglage de l'appareil.
- Photos et vidéos réelles de chats, uniquement Pexels, Unsplash ou Pixabay, chacune créditée dans `content/credits.json` ; pas d'illustrations dessinées.
- Modèles 3D génériques et originaux, jamais la reproduction d'un produit de marque.

## Evidence on Hand

- Textes : `content/litieres/litiere-autonettoyante.mdx`, `content/guides/mon-chat-ne-boit-pas.mdx`, pages `content/pages/*.mdx`.
- Produits : `content/products/*.json` (6 litières, données issues des fiches techniques).
- Photos et vidéo Pexels dans `public/media/` (liste et crédits dans `src/lib/medias.ts` et `content/credits.json`), choisies à la main sur pexels.com.
- Aucun témoignage, avis client, chiffre d'audience ou mention presse : ne jamais en inventer.

## Product Principles

1. L'honnêteté avant la conversion : dire d'où vient chaque information, ne jamais simuler un test.
2. Répondre vite à la question du lecteur, sur téléphone d'abord.
3. Le chat est le héros des images ; le produit n'est jamais montré sous une fausse identité.
4. La performance mobile n'est pas négociable : l'effet ne passe jamais avant le texte.

## Accessibility & Inclusion

Contrastes WCAG AA, navigation au clavier, textes d'au moins 16 px, version sans animation lourde pour `prefers-reduced-motion`.
