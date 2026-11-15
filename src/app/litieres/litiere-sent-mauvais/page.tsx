import { ArticleTemplate } from "@/components/ArticleTemplate";
import { TestGuide } from "@/components/TestGuide";
import { articleMetadata } from "@/lib/articles";
import Contenu, { frontmatter } from "../../../../content/litieres/litiere-sent-mauvais.mdx";

export const metadata = articleMetadata(frontmatter);

export default function Page() {
  return (
    <ArticleTemplate frontmatter={frontmatter}>
      <Contenu components={{ TestGuide }} />
    </ArticleTemplate>
  );
}
