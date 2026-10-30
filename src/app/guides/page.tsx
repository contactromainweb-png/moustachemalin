import type { Metadata } from "next";
import { RubriqueTemplate } from "@/components/RubriqueTemplate";
import { PHOTOS } from "@/lib/medias";
import { articlesParType } from "@/lib/rubriques";

export const metadata: Metadata = {
  title: "Tous nos guides et avis",
  description:
    "Nos guides pratiques, nos avis détaillés, nos outils et un comparatif par rubrique, réunis sur une seule page pour bien équiper votre chat.",
  alternates: { canonical: "/guides/" },
};

// Toutes rubriques confondues, rangés par type d'après le frontmatter : un nouveau guide, avis ou outil apparaît ici
// tout seul (voir articlesParType). Le lien « Guides » du menu et le bouton de l'accueil mènent ici.
export default function Page() {
  return (
    <RubriqueTemplate
      titre="Tous nos guides et avis"
      intro="Les questions qu'on se pose tous avec un chat, nos avis détaillés sur un appareil, nos outils et un comparatif par rubrique. Pour tout souci de santé, votre vétérinaire reste la bonne adresse."
      groupes={articlesParType()}
      photo={PHOTOS.chatSoleil}
    />
  );
}
