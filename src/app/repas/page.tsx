import type { Metadata } from "next";
import { RubriqueTemplate } from "@/components/RubriqueTemplate";
import { PHOTOS } from "@/lib/medias";
import { articlesDeRubrique } from "@/lib/rubriques";

export const metadata: Metadata = {
  title: "Repas du chat : comparatifs",
  description:
    "Distributeurs de croquettes automatiques, connectés ou à bouton : nos comparatifs fondés sur les fiches techniques des fabricants.",
  alternates: { canonical: "/repas/" },
};

export default function Page() {
  return (
    <RubriqueTemplate
      titre="Repas"
      intro="Repas à heure fixe, portions réglées, absence d'un week-end : de quoi choisir le distributeur qui convient à votre chat et à votre rythme."
      articles={articlesDeRubrique("repas")}
      photo={PHOTOS.chatGamelle}
    />
  );
}
