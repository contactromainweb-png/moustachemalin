import type { Metadata } from "next";
import { RubriqueTemplate } from "@/components/RubriqueTemplate";
import { PHOTOS } from "@/lib/medias";
import { articlesDeRubrique } from "@/lib/rubriques";

export const metadata: Metadata = {
  title: "Outils pratiques pour votre chat",
  description:
    "Des calculateurs simples et gratuits pour répondre aux questions du quotidien : combien d'eau doit boire votre chat, et bientôt d'autres.",
  alternates: { canonical: "/outils/" },
};

export default function Page() {
  return (
    <RubriqueTemplate
      titre="Outils"
      intro="Des calculateurs simples et gratuits, pour répondre en quelques secondes aux questions du quotidien. Ils donnent des repères, pas un diagnostic."
      articles={articlesDeRubrique("outils")}
      photo={PHOTOS.chatBol}
    />
  );
}
