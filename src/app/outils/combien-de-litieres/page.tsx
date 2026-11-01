import { ArticleTemplate } from "@/components/ArticleTemplate";
import { CalculLitieres } from "@/components/outils/CalculLitieres";
import { articleMetadata } from "@/lib/articles";
import Contenu, { frontmatter } from "../../../../content/outils/combien-de-litieres.mdx";

export const metadata = articleMetadata(frontmatter);

// Le calculateur est passé à cette page seulement (pas dans mdx-components) : son JavaScript n'est chargé qu'ici.
export default function Page() {
  return (
    <ArticleTemplate frontmatter={frontmatter}>
      <Contenu components={{ NombreLitieres: CalculLitieres }} />
    </ArticleTemplate>
  );
}
