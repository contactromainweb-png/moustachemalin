import { ArticleTemplate } from "@/components/ArticleTemplate";
import { articleMetadata } from "@/lib/articles";
import Contenu, { frontmatter } from "../../../../content/fontaines/fontaine-a-eau-chat.mdx";

export const metadata = articleMetadata(frontmatter);

export default function Page() {
  return (
    <ArticleTemplate frontmatter={frontmatter}>
      <Contenu />
    </ArticleTemplate>
  );
}
