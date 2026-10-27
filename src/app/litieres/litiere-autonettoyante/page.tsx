import { ArticleTemplate } from "@/components/ArticleTemplate";
import { articleMetadata } from "@/lib/articles";
import { PHOTOS } from "@/lib/medias";
import Contenu, { frontmatter } from "../../../../content/litieres/litiere-autonettoyante.mdx";

export const metadata = articleMetadata(frontmatter);

export default function Page() {
  return (
    <ArticleTemplate frontmatter={frontmatter} photo={PHOTOS.chatFauteuil}>
      <Contenu />
    </ArticleTemplate>
  );
}
