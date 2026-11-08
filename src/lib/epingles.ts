import { cheminArticle, type EpingleFraiche, type Frontmatter } from "@/lib/articles";

// Épingles « fraîches » (CLAUDE.md §11 ter) : 2 visuels Pinterest de plus par article, déclarés dans la liste
// `epingles:` du frontmatter. Chacune entre dans le flux RSS de sa rubrique le jour de sa `publication`, avec un
// lien vers une ancre de l'article (guid unique). Le site est statique : un build par jour (GitHub Action
// .github/workflows/build-quotidien.yml → crochet de build Netlify) fait entrer les épingles du jour.

export type EpingleArticle = EpingleFraiche & { fm: Frontmatter; image: string; lien: string };

export const imageEpingle = (fm: Frontmatter, e: EpingleFraiche) => `/pins/${fm.slug}-${e.variante}.jpg`;

export function epinglesDe(fm: Frontmatter): EpingleArticle[] {
  return (fm.epingles ?? []).map((e) => ({ ...e, fm, image: imageEpingle(fm, e), lien: `${cheminArticle(fm)}#${e.ancre}` }));
}

// Date du build à Paris (AAAA-MM-JJ), figée dans next.config.ts (pas de new Date() pendant le pré-rendu avec
// cacheComponents). EPINGLES_AUJOURDHUI=AAAA-MM-JJ au build simule une autre date.
export function aujourdhui() {
  const jour = process.env.EPINGLES_AUJOURDHUI;
  if (!jour) throw new Error("EPINGLES_AUJOURDHUI manquant : il est calculé dans next.config.ts");
  return jour;
}

export const estPubliee = (e: EpingleFraiche) => e.publication <= aujourdhui();
