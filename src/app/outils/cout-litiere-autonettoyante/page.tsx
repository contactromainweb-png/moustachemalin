import { ArticleTemplate } from "@/components/ArticleTemplate";
import { CalculCoutLitiere } from "@/components/outils/CalculCoutLitiere";
import { articleMetadata } from "@/lib/articles";
import Contenu, { frontmatter } from "../../../../content/outils/cout-litiere-autonettoyante.mdx";

export const metadata = articleMetadata(frontmatter);

// Le calculateur est passé à cette page seulement (pas dans mdx-components) : son JavaScript n'est chargé qu'ici.
export default function Page() {
  return (
    <ArticleTemplate frontmatter={frontmatter}>
      <Contenu components={{ CoutLitiere: CalculCoutLitiere }} />
    </ArticleTemplate>
  );
}
