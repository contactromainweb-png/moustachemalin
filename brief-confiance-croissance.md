# Moustache Malin : confiance et croissance (avant la mise en ligne)

> Brief pour Claude Code. À faire **après** les corrections du lot 2 et la fusion sur `main`, sur une nouvelle branche `confiance` avec sa prévisualisation Netlify. Ne fusionne qu'avec l'accord du propriétaire.
> Les textes à intégrer sont dans ce dossier (`content/…`). Les passages marqués **[À VALIDER PAR ROMAIN]** ne doivent pas être publiés tels quels : affiche-les à Romain dans ton rapport pour qu'il les complète.

---

## 1. Mettre à jour CLAUDE.md

Ajoute une section **« 11. Confiance, maillage et SEO »** avec ces règles :

**Auteur et confiance (E-E-A-T)**
- Chaque article affiche **« Par Romain »** (lien vers `/a-propos/`) et **« Mis à jour le … »** sous le titre.
- Données structurées : `Person` pour l'auteur (nom, page, `sameAs` vers ses profils publics quand il les donnera), reliée à `Article` et à `Organization`.
- Jamais de faux témoignage, de note inventée, de badge de confiance ni de logo « Vu dans… ».

**Encadré « En bref »**
- En haut de chaque article (après le titre et la méthode), un encadré de 3 à 4 phrases courtes qui répondent directement à la question. Champ `enBref` dans le frontmatter MDX. Il sert aux lecteurs pressés et aux résumés des moteurs IA.

**Maillage interne (grappes)**
- Chaque comparatif est le **pilier** d'une grappe. Chaque article satellite (guide, « X ou Y », avis produit, consommables) contient au moins un lien vers son pilier, avec un texte de lien descriptif (ex. « notre comparatif des litières autonettoyantes »), jamais « cliquez ici ».
- Chaque pilier liste tous ses satellites dans une section « Pour aller plus loin ».
- Aucune page sans lien entrant. Ajoute un contrôle automatique au build qui liste les pages orphelines et les liens internes cassés.
- Le frontmatter de chaque article indique `pilier:` (le slug de son comparatif) pour générer ces liens automatiquement.

**Fraîcheur**
- Chaque comparatif est revérifié une fois par mois (produits toujours en vente, références, caractéristiques). La date « Mis à jour le » ne change que si le contenu a réellement été vérifié ou modifié.

**Pinterest (préparation)**
- Chaque article a une image verticale 1000 × 1500 px (photo + titre court), déclarée dans le frontmatter (`pinImage`), servie dans les métadonnées pour le partage.

---

## 2. Accueil : 5 blocs à ajouter

Garde toutes les scènes existantes. Ajoute ces blocs entre la scène 6 (« Nous comparons… ») et la scène 7 (la fin), dans la même direction artistique, **sans WebGL** (apparitions légères seulement).

**A. « Selon mon chat »** : une rangée de grandes cartes cliquables (photo + mot), qui mènent vers les articles existants. N'affiche que les profils qui ont une destination :
- *En appartement* → comparatif litière autonettoyante
- *Plusieurs chats* → comparatif litière autonettoyante, section Neakasa M1 Lite (ancre)
- *Je pars le week-end* → comparatif litière autonettoyante + comparatif fontaines
- *Il boit peu* → guide « Mon chat ne boit pas »
- *Chaton*, *Chat âgé* : masqués tant qu'aucun article ne leur correspond (prévois la donnée, cachée).

**B. « Derniers articles et mises à jour »** : les 3 articles les plus récemment mis à jour, avec leur date, générés automatiquement depuis le frontmatter.

**C. « Qui écrit ici »** : photo de Romain + texte du fichier `content/pages/qui-ecrit-ici.md` + lien « En savoir plus » vers `/a-propos/`. Tant que Romain n'a pas fourni sa photo, utilise un emplacement neutre et **signale-le** dans le rapport.

**D. « Comment on gagne notre vie »** : 2 phrases (texte dans `content/pages/qui-ecrit-ici.md`, section transparence) + lien vers `/affiliation/`.

**E. Newsletter + checklist offerte** : « Recevez gratuitement la checklist : tout ce qu'il faut pour accueillir un chat » + champ e-mail. Le contenu de la checklist est dans `content/lead-magnet/checklist-accueillir-un-chat.md` : génère-en un **PDF soigné** aux couleurs du site.
- Outil d'envoi : propose à Romain **2 outils gratuits** conformes au RGPD (vérifie leurs offres gratuites actuelles), c'est lui qui crée le compte. **Le formulaire reste masqué tant qu'il n'est pas branché** et testé (inscription réelle, e-mail de bienvenue avec le PDF).
- Case de consentement claire, mention dans `/confidentialite/`.

---

## 3. Page « À propos » refaite

Remplace le contenu de `/a-propos/` par `content/pages/a-propos.mdx`. Garde le lien vers `/methode/` et `/affiliation/`.

---

## 4. Articles : signature, « En bref », grappes

- Ajoute la signature « Par Romain · Mis à jour le … » sur les 3 articles existants.
- Ajoute les encadrés « En bref » ci-dessous dans leur frontmatter :

**litiere-autonettoyante.mdx**
```yaml
enBref:
  - "Pour la plupart des appartements, la PETKIT Pura Max 2 est notre choix : fermée, très sécurisée, suivie dans l'application."
  - "Petit budget : la JUMMICO ouverte 12 L garde l'essentiel (grand bac, capteurs, application)."
  - "Plusieurs chats ou chat de plus de 8 kg : la Neakasa M1 Lite, ouverte et acceptant jusqu'à 15 kg."
  - "Vérifiez toujours le poids minimum accepté (souvent 1,5 kg) : ces appareils ne conviennent pas aux jeunes chatons."
pilier: litiere-autonettoyante
```

**fontaine-a-eau-chat.mdx**
```yaml
enBref:
  - "Notre choix global : la Catit Pixi 2,5 L, avec un filtre triple qui adoucit l'eau du robinet."
  - "Petit budget : la GIOTOHUN 2 L. Plusieurs chats : l'APAUK inox 3,2 L."
  - "Pour une chambre ou un studio, visez une fontaine annoncée très silencieuse, comme la PETLIBRO Dockstream (23 dB annoncés)."
  - "Pensez au prix des filtres de rechange : c'est la vraie dépense sur la durée."
pilier: fontaine-a-eau-chat
```

**mon-chat-ne-boit-pas.mdx**
```yaml
enBref:
  - "Un chat boit naturellement peu, surtout s'il mange de la pâtée, qui contient beaucoup d'eau."
  - "Les repères habituels : environ 50 à 60 ml d'eau par kilo et par jour, nourriture comprise."
  - "Pli de peau lent, gencives sèches, fatigue : consultez votre vétérinaire."
  - "Pour l'aider : eau fraîche changée chaque jour, loin de la gamelle et de la litière, plusieurs points d'eau, ou une fontaine."
pilier: fontaine-a-eau-chat
```

- Le guide « Mon chat ne boit pas » est un satellite des fontaines : vérifie le lien vers le pilier, et ajoute un lien vers le **calculateur d'eau** (section 5).
- Les comparatifs reçoivent une section « Pour aller plus loin » qui listera leurs satellites (vide = masquée pour l'instant, sauf fontaines → guide boire + calculateur).

---

## 5. Premier outil : « Combien d'eau doit boire mon chat ? »

Page `/outils/combien-eau-chat/`, texte dans `content/outils/combien-eau-chat.mdx`. Composant interactif léger (pas de WebGL), qui fonctionne sans recharger la page et reste utilisable au clavier.

**Champs**
- Poids du chat (kg), de 1 à 12, pas de 0,1.
- Pâtée par jour (g), 0 par défaut.
- Croquettes par jour (g), 0 par défaut.

**Calcul** (afficher des fourchettes, jamais une valeur précise au millilitre)
- Besoin total : `poids × 50` à `poids × 60` ml.
- Eau apportée par la nourriture : `pâtée × 0,75` + `croquettes × 0,10` (ml, en considérant 1 g d'eau = 1 ml).
- Eau à boire estimée : besoin total − eau de la nourriture, arrondi à 10 ml près, minimum 0.
- Si le résultat est 0 : « Sa nourriture couvre l'essentiel de ses besoins : il est normal qu'il boive peu. »

**Affichage** : grand résultat (« Environ 120 à 170 ml à boire par jour »), une phrase d'explication, l'encadré vétérinaire, les sources, et un lien vers le comparatif des fontaines et le guide.

**Tests** : écris des tests unitaires sur la fonction de calcul (cas : 4 kg sans nourriture → 200 à 240 ml ; 4 kg avec 100 g de pâtée → 130 à 170 ml ; 2 kg avec 200 g de pâtée → 0).

Ajoute l'outil au menu (« Outils ») et au sitemap. Données structurées : `WebApplication` n'est pas utile, garde `Article` + `FAQPage` du texte.

---

## 6. Mesure des clics

- Mets en place un outil de statistiques **gratuit, sans cookies**, qui ne demande pas de bandeau de consentement (propose 2 options à Romain, vérifie les offres gratuites actuelles ; c'est lui qui crée le compte).
- Enregistre un événement à chaque clic sur `AffiliateButton` : page, produit (ASIN), emplacement (résumé, tableau, fiche).
- Mets à jour `/confidentialite/`.

---

## 7. Livraison

Prévisualisation, captures ordinateur et téléphone des nouveaux blocs et de l'outil, Lighthouse, résultat du contrôle des pages orphelines, et la **liste de ce que Romain doit fournir** (photo, validation des textes, compte newsletter, compte statistiques).
