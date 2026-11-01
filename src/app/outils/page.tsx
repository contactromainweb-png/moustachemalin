import type { Metadata } from "next";
import { RubriqueTemplate } from "@/components/RubriqueTemplate";
import { PHOTOS } from "@/lib/medias";
import { articlesDeRubrique } from "@/lib/rubriques";
import Texte from "../../../content/rubriques/outils.mdx";

export const metadata: Metadata = {
  title: "Outils pratiques pour votre chat",
  description:
    "Des calculateurs simples et gratuits pour répondre aux questions du quotidien : eau à boire, autonomie d'un distributeur, coût d'une litière, nombre de bacs.",
  alternates: { canonical: "/outils/" },
};

export default function Page() {
  return (
    <RubriqueTemplate
      chemin="/outils/"
      texte={<Texte />}
      titre="Outils"
      intro="Des calculateurs simples et gratuits, pour répondre en quelques secondes aux questions du quotidien. Ils donnent des repères, pas un diagnostic."
      articles={articlesDeRubrique("outils")}
      photo={PHOTOS.chatTigreBolEau}
      outils
    />
  );
}
