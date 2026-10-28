import type { Metadata } from "next";
import { RubriqueTemplate } from "@/components/RubriqueTemplate";
import { PHOTOS } from "@/lib/medias";
import { articlesDeRubrique } from "@/lib/rubriques";

export const metadata: Metadata = {
  title: "Fontaines à eau pour chat : comparatifs",
  description:
    "Fontaines à eau pour chat, branchées ou sans fil, en plastique ou en inox : nos comparatifs fondés sur les fiches techniques des fabricants.",
  alternates: { canonical: "/fontaines/" },
};

export default function Page() {
  return (
    <RubriqueTemplate
      titre="Fontaines"
      intro="Beaucoup de chats préfèrent l'eau qui coule. De quoi choisir une fontaine silencieuse, facile à nettoyer et adaptée à votre logement."
      articles={articlesDeRubrique("fontaines")}
      photo={PHOTOS.chatRobinet}
    />
  );
}
