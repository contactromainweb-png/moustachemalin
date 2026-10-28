import { RelatedArticles } from "@/components/RelatedArticles";
import { satellitesDe } from "@/lib/rubriques";

// Fin d'un comparatif pilier : tous ses satellites (articles dont le frontmatter indique `pilier: <slug>`).
// Masquée tant qu'il n'en a aucun.
export function PourAllerPlusLoin({ slug }: { slug: string }) {
  const satellites = satellitesDe(slug);
  return (
    <RelatedArticles
      titre="Pour aller plus loin"
      id="pour-aller-plus-loin"
      links={satellites.map((s) => ({ href: s.href, label: s.titre }))}
    />
  );
}
