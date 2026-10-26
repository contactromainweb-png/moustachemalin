import type { Metadata } from "next";

// Informations en tête de chaque article MDX : `export const meta = { ... }`.
export type ArticleMeta = {
  type: "comparatif" | "guide";
  titre: string; // le H1, avec le mot-clé principal
  titreSeo?: string; // balise <title> si différente du H1 (≤ 60 caractères avec « | Moustache Malin »)
  description: string; // ≤ 155 caractères
  chemin: string; // ex. "/litieres/litiere-autonettoyante/"
  rubrique: { label: string; href: string };
  publie: string; // AAAA-MM-JJ
  misAJour: string; // AAAA-MM-JJ
  produits?: string[]; // ASIN classés, pour le schema ItemList des comparatifs
  index?: boolean; // false = page cachée aux moteurs (pages d'exemple)
};

export function articleMetadata(meta: ArticleMeta): Metadata {
  return {
    title: meta.titreSeo ?? meta.titre,
    description: meta.description,
    alternates: { canonical: meta.chemin },
    openGraph: {
      type: "article",
      title: meta.titreSeo ?? meta.titre,
      description: meta.description,
      url: meta.chemin,
      publishedTime: meta.publie,
      modifiedTime: meta.misAJour,
    },
    robots: meta.index === false ? { index: false, follow: false } : undefined,
  };
}
