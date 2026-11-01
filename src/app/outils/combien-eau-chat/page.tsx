import { ArticleTemplate } from "@/components/ArticleTemplate";
import { WaterCalculator } from "@/components/WaterCalculator";
import { articleMetadata } from "@/lib/articles";
import Contenu, { frontmatter } from "../../../../content/outils/combien-eau-chat.mdx";

export const metadata = articleMetadata(frontmatter);

export default function Page() {
  return (
    <ArticleTemplate frontmatter={frontmatter}>
      <Contenu components={{ WaterCalculator }} />
    </ArticleTemplate>
  );
}
