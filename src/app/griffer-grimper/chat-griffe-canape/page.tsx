import { ArticleTemplate } from "@/components/ArticleTemplate";
import { PlanGuide } from "@/components/PlanGuide";
import { articleMetadata } from "@/lib/articles";
import Contenu, { frontmatter } from "../../../../content/griffer-grimper/chat-griffe-canape.mdx";

export const metadata = articleMetadata(frontmatter);

export default function Page() {
  return (
    <ArticleTemplate frontmatter={frontmatter}>
      <Contenu components={{ PlanGuide }} />
    </ArticleTemplate>
  );
}
