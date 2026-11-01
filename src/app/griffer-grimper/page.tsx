import type { Metadata } from "next";
import { fluxDansHead } from "@/lib/flux";
import { RubriqueTemplate } from "@/components/RubriqueTemplate";
import { PHOTOS } from "@/lib/medias";
import { articlesDeRubrique } from "@/lib/rubriques";
import Texte from "../../../content/rubriques/griffer-grimper.mdx";

export const metadata: Metadata = {
  title: "Griffer, grimper : arbre à chat, griffoir",
  description:
    "Arbres à chat et griffoirs : nos comparatifs fondés sur les fiches techniques des fabricants, pour que votre chat griffe ailleurs que sur le canapé.",
  alternates: { canonical: "/griffer-grimper/", types: fluxDansHead("griffer-grimper") },
};

export default function Page() {
  return (
    <RubriqueTemplate
      chemin="/griffer-grimper/"
      texte={<Texte />}
      titre="Griffer, grimper"
      intro="Un chat a besoin de faire ses griffes, de grimper et d'observer la maison d'en haut. Griffoirs et arbres à chat : de quoi lui offrir tout ça, sans sacrifier le canapé."
      articles={articlesDeRubrique("griffer-grimper")}
      photo={PHOTOS.kiraDebout}
    />
  );
}
