import type { Metadata } from "next";
import { RubriqueTemplate } from "@/components/RubriqueTemplate";
import { PHOTOS } from "@/lib/medias";
import { articlesDeRubrique } from "@/lib/rubriques";
import Texte from "../../../content/rubriques/sorties.mdx";

export const metadata: Metadata = {
  title: "Sorties : chatières manuelles et à puce",
  description:
    "Chatières manuelles ou à puce : notre comparatif fondé sur les fiches des fabricants, pour laisser sortir votre chat sans ouvrir à tout le monde.",
  alternates: { canonical: "/sorties/" },
};

export default function Page() {
  return (
    <RubriqueTemplate
      chemin="/sorties/"
      texte={<Texte />}
      titre="Sorties"
      intro="Votre chat aime le jardin ? Une bonne chatière lui laisse sa liberté, sans laisser entrer le chat du voisin ni les courants d'air."
      articles={articlesDeRubrique("sorties")}
      photo={PHOTOS.sucetteJardin}
    />
  );
}
