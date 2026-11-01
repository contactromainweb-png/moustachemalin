import { ArticleTemplate } from "@/components/ArticleTemplate";
import { AutonomieDistributeur } from "@/components/outils/AutonomieDistributeur";
import { articleMetadata } from "@/lib/articles";
import Contenu, { frontmatter } from "../../../../content/outils/autonomie-distributeur-croquettes.mdx";

export const metadata = articleMetadata(frontmatter);

// Le calculateur est passé à cette page seulement (pas dans mdx-components) : son JavaScript n'est chargé qu'ici.
export default function Page() {
  return (
    <ArticleTemplate frontmatter={frontmatter}>
      <Contenu components={{ AutonomieDistributeur }} />
    </ArticleTemplate>
  );
}
