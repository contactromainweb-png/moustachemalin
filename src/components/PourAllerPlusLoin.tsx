import { RelatedArticles } from "@/components/RelatedArticles";
import { satellitesDe, voisinsDe } from "@/lib/rubriques";

// Fin d'un comparatif pilier : ses satellites (articles dont le frontmatter indique `pilier: <slug>`), puis ses
// voisins (frontmatter `voisins` du comparatif). 4 liens au plus : au-delà, le build échoue.
// Masquée tant qu'il n'y a aucun lien.
const MAXIMUM = 4;

export function PourAllerPlusLoin({ slug }: { slug: string }) {
  const liens = [...satellitesDe(slug), ...voisinsDe(slug)].filter(
    (l, i, tous) => tous.findIndex((m) => m.href === l.href) === i,
  );
  if (liens.length > MAXIMUM)
    throw new Error(
      `« Pour aller plus loin » de ${slug} : ${liens.length} liens, ${MAXIMUM} au plus (${liens.map((l) => l.href).join(", ")})`,
    );
  return (
    <RelatedArticles
      titre="Pour aller plus loin"
      id="pour-aller-plus-loin"
      links={liens.map((l) => ({ href: l.href, label: l.titre }))}
    />
  );
}
