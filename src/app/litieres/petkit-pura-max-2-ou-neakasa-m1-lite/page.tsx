import { ArticleTemplate } from "@/components/ArticleTemplate";
import { COMPOSANTS_DUEL } from "@/components/TableauDuel";
import { articleMetadata } from "@/lib/articles";
import Contenu, { frontmatter } from "../../../../content/litieres/petkit-pura-max-2-ou-neakasa-m1-lite.mdx";

export const metadata = articleMetadata(frontmatter);

// Duel : le tableau Markdown passe en cartes sur téléphone et chaque titre « ## » a son ancre (COMPOSANTS_DUEL).
export default function Page() {
  return (
    <ArticleTemplate frontmatter={frontmatter}>
      <Contenu components={COMPOSANTS_DUEL} />
    </ArticleTemplate>
  );
}
