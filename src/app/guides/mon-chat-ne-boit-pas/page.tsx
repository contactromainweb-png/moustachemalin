import { ArticleTemplate } from "@/components/ArticleTemplate";
import { ListeSignes } from "@/components/ListeSignes";
import { articleMetadata } from "@/lib/articles";
import Contenu, { frontmatter } from "../../../../content/guides/mon-chat-ne-boit-pas.mdx";

export const metadata = articleMetadata(frontmatter);

export default function Page() {
  return (
    <ArticleTemplate frontmatter={frontmatter}>
      <Contenu components={{ ListeSignes }} />
    </ArticleTemplate>
  );
}
