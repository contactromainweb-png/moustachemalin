import { ArticleTemplate } from "@/components/ArticleTemplate";
import { articleMetadata } from "@/lib/articles";
import Contenu, { frontmatter } from "../../../../content/exemples/guide.mdx";

// Page d'exemple du modèle, cachée aux moteurs de recherche et absente du menu.
export const metadata = articleMetadata(frontmatter);

export default function Page() {
  return (
    <ArticleTemplate frontmatter={frontmatter}>
      <Contenu />
    </ArticleTemplate>
  );
}
