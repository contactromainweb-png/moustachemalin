import type { Metadata } from "next";
import { RubriqueTemplate } from "@/components/RubriqueTemplate";
import { PHOTOS } from "@/lib/medias";
import { articlesDeRubrique } from "@/lib/rubriques";

export const metadata: Metadata = {
  title: "Griffer, grimper : arbres à chat et griffoirs",
  description:
    "Arbres à chat et griffoirs : nos comparatifs fondés sur les fiches techniques des fabricants, pour que votre chat grimpe et griffe ailleurs que sur le canapé.",
  alternates: { canonical: "/griffer-grimper/" },
};

export default function Page() {
  return (
    <RubriqueTemplate
      titre="Griffer, grimper"
      intro="Un chat a besoin de faire ses griffes, de grimper et d'observer la maison d'en haut. Griffoirs et arbres à chat : de quoi lui offrir tout ça, sans sacrifier le canapé."
      articles={articlesDeRubrique("griffer-grimper")}
      photo={PHOTOS.chatsPasserelles}
    />
  );
}
