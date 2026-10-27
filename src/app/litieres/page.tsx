import type { Metadata } from "next";
import { RubriqueTemplate } from "@/components/RubriqueTemplate";
import { PHOTOS } from "@/lib/medias";
import { articlesDeRubrique } from "@/lib/rubriques";

export const metadata: Metadata = {
  title: "Litières pour chat : comparatifs",
  description:
    "Litières autonettoyantes et bacs à litière : nos comparatifs fondés sur les fiches techniques des fabricants, pour choisir sans se tromper.",
  alternates: { canonical: "/litieres/" },
};

export default function Page() {
  return (
    <RubriqueTemplate
      titre="Litières"
      intro="Autonettoyante ou classique, ouverte ou fermée : de quoi choisir la litière qui convient à votre chat et à votre logement."
      articles={articlesDeRubrique("litieres")}
      photo={PHOTOS.chatFauteuil}
    />
  );
}
