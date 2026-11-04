import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import type { ArticleLien } from "@/components/RubriqueTemplate";
import { cheminArticle, type Frontmatter, type TypeArticle } from "@/lib/articles";
import { PHOTOS } from "@/lib/medias";
import { pageEnLigne, RUBRIQUES } from "@/lib/site";

// Articles d'une rubrique, lus dans content/<rubrique>/*.mdx (bloc --- en tête de fichier).
// Seuls ceux dont la page existe sont listés : un nouvel article apparaît dans sa rubrique
// dès que son dossier src/app/<rubrique>/<slug>/ est créé. Comparatifs d'abord, puis du plus récent au plus ancien.
export function articlesDeRubrique(rubrique: string): ArticleLien[] {
  return frontmattersEnLigne(rubrique).map(lien);
}

function lien(fm: Frontmatter): ArticleLien {
  return {
    href: cheminArticle(fm),
    titre: fm.title,
    description: fm.description,
    type: fm.type,
    photo: fm.photo,
    photos: PHOTOS_ARTICLE.get(fm),
    motSerif: fm.motSerif,
    updatedAt: fm.updatedAt,
  };
}

// Toutes les photos d'un article, dans l'ordre : photo d'en-tête puis photos du texte (<PhotoMoyenne nom="…">,
// <Photo nom="…">). Les cartes s'en servent pour ne pas répéter une image déjà sur la page (src/lib/cartes.ts).
// Les photos de la famille de Romain (Kira et ses cousins) n'illustrent jamais une carte d'article.
const PHOTOS_ARTICLE = new WeakMap<Frontmatter, (keyof typeof PHOTOS)[]>();
const FAMILLE = /^(kira|sucette|blackPearl|rebelle|imotep|chichoune|romain)/;
function photosDe(fm: Frontmatter, source: string): (keyof typeof PHOTOS)[] {
  const noms = [fm.photo, ...[...source.matchAll(/<(?:PhotoMoyenne|Photo)\s+nom="([A-Za-z]+)"/g)].map((m) => m[1])];
  return [...new Set(noms)].filter((n): n is keyof typeof PHOTOS => !!n && n in PHOTOS && !FAMILLE.test(n));
}

function tousLesFrontmatters() {
  return RUBRIQUES.flatMap((r) => frontmattersEnLigne(r.href.replaceAll("/", "")));
}

// Satellites d'un comparatif pilier : les articles en ligne dont le frontmatter indique `pilier: <slug>`
// (guides, outils…), pour la section « Pour aller plus loin ». Vide = section masquée.
export function satellitesDe(slug: string): ArticleLien[] {
  return tousLesFrontmatters()
    .filter((fm) => (fm.pilier === slug || fm.autresPiliers?.includes(slug)) && fm.slug !== slug)
    .map(lien);
}

// L'article a-t-il son propre bloc « À lire aussi » dans son MDX ? Le formulaire de la lettre se place alors juste avant.
export function aBlocDeLiens(fm: Frontmatter) {
  const fichier = path.join(process.cwd(), "content", fm.rubrique, `${fm.slug}.mdx`);
  return fs.existsSync(fichier) && fs.readFileSync(fichier, "utf8").includes("<RelatedArticles");
}

// Voisins d'un comparatif (frontmatter `voisins`), dans l'ordre indiqué : seuls ceux en ligne sont renvoyés.
export function voisinsDe(slug: string): ArticleLien[] {
  const tous = tousLesFrontmatters();
  const voisins = tous.find((fm) => fm.slug === slug)?.voisins ?? [];
  return voisins.flatMap((v) => tous.filter((fm) => fm.slug === v)).map(lien);
}

// Les articles les plus récemment mis à jour (accueil, « Derniers articles et mises à jour »).
export function derniersArticles(nombre: number): ArticleLien[] {
  return tousLesFrontmatters()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, nombre)
    .map(lien);
}

// Fil RSS (/feed.xml) : tous les articles en ligne, du plus récemment mis à jour au plus ancien.
export function articlesDuFlux(): Frontmatter[] {
  return tousLesFrontmatters().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

// Tous les articles en ligne, rubrique par rubrique (comparatifs d'abord dans chacune).
export function tousLesArticles(): ArticleLien[] {
  return tousLesFrontmatters().map(lien);
}

// Page /guides/ : tous les articles en ligne qui ne sont pas des comparatifs, regroupés selon le `type` de leur
// frontmatter (un nouveau guide, avis ou outil y apparaît de lui-même, quelle que soit sa rubrique), puis tous les
// comparatifs, rubrique par rubrique. Un groupe vide n'est pas renvoyé.
// Le guide « Arrivée d'un chat » passe en tête : c'est la porte d'entrée vers tous les comparatifs.
const GUIDE_EN_TETE = "/guides/arrivee-chat-chaton-liste/";

export function articlesParType() {
  const articles = tousLesArticles();
  const groupes: { type: TypeArticle; articles: ArticleLien[] }[] = [
    {
      type: "guide",
      articles: articles
        .filter((a) => a.type === "guide")
        .sort((a, b) => Number(b.href === GUIDE_EN_TETE) - Number(a.href === GUIDE_EN_TETE)),
    },
    { type: "avis", articles: articles.filter((a) => a.type === "avis") },
    { type: "outil", articles: articles.filter((a) => a.type === "outil") },
    { type: "comparatif", articles: articles.filter((a) => a.type === "comparatif") },
  ];
  return groupes.filter((g) => g.articles.length > 0);
}

// Nombre d'appareils réellement passés en revue dans les comparatifs en ligne (sans doublon) : le compteur de
// l'accueil ne peut afficher que ce chiffre-là.
export function appareilsCompares() {
  const asins = tousLesFrontmatters()
    .filter((fm) => fm.type === "comparatif")
    .flatMap((fm) => fm.products ?? []);
  return new Set(asins).size;
}

function frontmattersEnLigne(rubrique: string): Frontmatter[] {
  const dossier = path.join(process.cwd(), "content", rubrique);
  if (!fs.existsSync(dossier)) return [];

  return fs
    .readdirSync(dossier)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const source = fs.readFileSync(path.join(dossier, f), "utf8");
      const bloc = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!bloc) throw new Error(`Bloc --- manquant en tête de content/${rubrique}/${f}`);
      const fm = parse(bloc[1]) as Frontmatter;
      PHOTOS_ARTICLE.set(fm, photosDe(fm, source));
      return fm;
    })
    .filter((fm) => !fm.noindex && pageEnLigne(cheminArticle(fm)))
    .sort((a, b) =>
      a.type === b.type ? b.updatedAt.localeCompare(a.updatedAt) : a.type === "comparatif" ? -1 : 1,
    );
}
