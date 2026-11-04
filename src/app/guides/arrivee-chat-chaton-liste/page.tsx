import { ArticleTemplate } from "@/components/ArticleTemplate";
import { ListeSignes } from "@/components/ListeSignes";
import { articleMetadata } from "@/lib/articles";
import Contenu, { frontmatter } from "../../../../content/guides/arrivee-chat-chaton-liste.mdx";

export const metadata = articleMetadata(frontmatter);

export default function Page() {
  return (
    <ArticleTemplate frontmatter={frontmatter}>
      <Contenu components={{ ListeSignes }} />
    </ArticleTemplate>
  );
}
