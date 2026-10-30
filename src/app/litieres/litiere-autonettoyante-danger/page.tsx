import { ArticleTemplate } from "@/components/ArticleTemplate";
import { articleMetadata } from "@/lib/articles";
import Contenu, { frontmatter } from "../../../../content/litieres/litiere-autonettoyante-danger.mdx";

export const metadata = articleMetadata(frontmatter);

export default function Page() {
  return (
    <ArticleTemplate frontmatter={frontmatter}>
      <Contenu />
    </ArticleTemplate>
  );
}
