import type { Metadata } from "next";
import { IMAGE_PARTAGE, PHOTOS } from "@/lib/medias";
import { RUBRIQUES } from "@/lib/site";

export type TypeArticle = "comparatif" | "guide" | "avis" | "outil";

// Libellés affichés sur les cartes et les liens, selon le type d'article.
export const LIBELLES_TYPE: Record<TypeArticle, { nom: string; lire: string }> = {
  comparatif: { nom: "Comparatif", lire: "Lire le comparatif" },
  guide: { nom: "Guide", lire: "Lire le guide" },
  avis: { nom: "Avis", lire: "Lire l'avis" },
  outil: { nom: "Outil", lire: "Utiliser l'outil" },
};

// Bloc --- en tête de chaque article MDX (exporté sous le nom `frontmatter`).
export type Frontmatter = {
  title: string; // le H1, avec le mot-clé principal
  metaTitle?: string; // balise <title> (≤ 60 caractères), sinon le H1
  description: string; // ≤ 155 caractères
  slug: string;
  rubrique: string; // ex. "litieres"
  type: TypeArticle;
  photo?: keyof typeof PHOTOS; // grande photo en tête de l'article (nom dans src/lib/medias.ts)
  motSerif?: string; // mot du titre affiché en serif italique
  enBref?: string[]; // 3 ou 4 phrases courtes qui répondent directement à la question (encadré « En bref »)
  pilier?: string; // slug du comparatif pilier de la grappe (un comparatif indique son propre slug)
  pinTitre?: string; // titre court de l'image Pinterest, sinon la partie du titre avant « : » (scripts/pins.mjs)
  pinCadrage?: string; // point de la photo gardé dans l'image Pinterest (ex. "62% 50%"), sinon sa position
  updatedAt: string; // AAAA-MM-JJ
  publishedAt?: string; // AAAA-MM-JJ, sinon updatedAt
  products?: string[]; // ASIN classés, pour le schema ItemList des comparatifs
  noindex?: boolean; // true = page cachée aux moteurs (pages d'exemple)
  mainKeyword?: string;
  secondaryKeywords?: string[];
  relatedComparatif?: string;
  showcase3d?: string; // vitrine 3D prévue plus tard (étape 8)
};

export function cheminArticle(fm: Frontmatter) {
  return `/${fm.rubrique}/${fm.slug}/`;
}

// Image verticale 1000 × 1500 px pour Pinterest, fabriquée avant chaque build par scripts/pins.mjs.
export function pinArticle(fm: Frontmatter) {
  return `/pins/${fm.slug}.jpg`;
}

export function rubriqueArticle(fm: Frontmatter) {
  const href = `/${fm.rubrique}/`;
  const connue = RUBRIQUES.find((r) => r.href === href);
  return { href, label: connue?.label ?? fm.rubrique.charAt(0).toUpperCase() + fm.rubrique.slice(1) };
}

function photoPartage(fm: Frontmatter) {
  const p = fm.photo ? PHOTOS[fm.photo] : undefined;
  return p && p.width >= 1200 ? { url: p.src, width: p.width, height: p.height, alt: p.alt } : undefined;
}

export function articleMetadata(fm: Frontmatter): Metadata {
  const titre = fm.metaTitle ?? fm.title;
  return {
    // Titre complet sans le suffixe « | Moustache Malin » : le metaTitle est déjà calibré pour Google.
    title: { absolute: titre },
    description: fm.description,
    alternates: { canonical: cheminArticle(fm) },
    openGraph: {
      type: "article",
      title: titre,
      description: fm.description,
      url: cheminArticle(fm),
      publishedTime: fm.publishedAt ?? fm.updatedAt,
      modifiedTime: fm.updatedAt,
      // Le bloc openGraph d'une page remplace celui du layout : la photo d'en-tête de l'article (au moins 1200 px
      // de large, pour Google Discover), sinon l'image de partage du site. L'image verticale pour Pinterest est
      // signalée à part, dans la page (ArticleTemplate).
      images: [photoPartage(fm) ?? IMAGE_PARTAGE],
    },
    // Sans noindex, la clé reste absente : la page garde la balise robots du layout (grandes vignettes).
    ...(fm.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
