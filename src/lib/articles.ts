import type { Metadata } from "next";
import { IMAGE_PARTAGE, PHOTOS } from "@/lib/medias";
import { RUBRIQUES } from "@/lib/site";

// Bloc --- en tête de chaque article MDX (exporté sous le nom `frontmatter`).
export type Frontmatter = {
  title: string; // le H1, avec le mot-clé principal
  metaTitle?: string; // balise <title> (≤ 60 caractères), sinon le H1
  description: string; // ≤ 155 caractères
  slug: string;
  rubrique: string; // ex. "litieres"
  type: "comparatif" | "guide";
  photo?: keyof typeof PHOTOS; // grande photo en tête de l'article (nom dans src/lib/medias.ts)
  motSerif?: string; // mot du titre affiché en serif italique
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

export function rubriqueArticle(fm: Frontmatter) {
  const href = `/${fm.rubrique}/`;
  const connue = RUBRIQUES.find((r) => r.href === href);
  return { href, label: connue?.label ?? fm.rubrique.charAt(0).toUpperCase() + fm.rubrique.slice(1) };
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
      // Le bloc openGraph d'une page remplace celui du layout : on redonne l'image de partage.
      images: [IMAGE_PARTAGE],
    },
    robots: fm.noindex ? { index: false, follow: false } : undefined,
  };
}
