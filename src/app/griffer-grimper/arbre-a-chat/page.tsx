import { ArticleTemplate } from "@/components/ArticleTemplate";
import { QuizComparatif } from "@/components/QuizComparatif";
import { articleMetadata } from "@/lib/articles";
import Contenu, { frontmatter } from "../../../../content/griffer-grimper/arbre-a-chat.mdx";

export const metadata = articleMetadata(frontmatter);

export default function Page() {
  return (
    <ArticleTemplate frontmatter={frontmatter}>
      <Contenu components={{ QuizComparatif }} />
    </ArticleTemplate>
  );
}
