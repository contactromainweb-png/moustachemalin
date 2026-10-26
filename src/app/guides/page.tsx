import type { Metadata } from "next";
import { RubriqueTemplate } from "@/components/RubriqueTemplate";
import { articlesDeRubrique } from "@/lib/rubriques";

export const metadata: Metadata = {
  title: "Guides pratiques pour chat",
  description:
    "Votre chat boit peu, boude sa litière, s'ennuie ? Nos guides répondent aux questions du quotidien, sans remplacer l'avis d'un vétérinaire.",
  alternates: { canonical: "/guides/" },
};

export default function Page() {
  return (
    <RubriqueTemplate
      titre="Guides"
      intro="Les questions qu'on se pose tous avec un chat, et des réponses simples. Pour tout souci de santé, votre vétérinaire reste la bonne adresse."
      articles={articlesDeRubrique("guides")}
    />
  );
}
