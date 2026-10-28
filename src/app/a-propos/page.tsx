import type { Metadata } from "next";
import { StagePage } from "@/components/StagePage";
import { formatDate } from "@/components/UpdatedDate";
import { PHOTOS } from "@/lib/medias";
import Contenu, { frontmatter } from "../../../content/pages/a-propos.mdx";

export const metadata: Metadata = {
  title: { absolute: frontmatter.metaTitle ?? frontmatter.title },
  description: frontmatter.description,
  alternates: { canonical: "/a-propos/" },
};

// Texte : content/pages/a-propos.mdx. Les passages « À VALIDER PAR ROMAIN » sont retirés à la construction
// (plugins/remark-a-valider.mjs) ; la photo de Romain prendra la place de la photo du chat quand il l'aura fournie.
export default function Page() {
  return (
    <StagePage
      title="Derrière les moustaches"
      lead="Un site qui lit les fiches techniques à votre place, pour que le bon équipement arrive du premier coup."
      stageWord="Bonjour"
      updated={formatDate(frontmatter.updatedAt)}
      photo={PHOTOS.chatSoleil}
    >
      <Contenu />
    </StagePage>
  );
}
