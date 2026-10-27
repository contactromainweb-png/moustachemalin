import type { Metadata } from "next";
import { StagePage } from "@/components/StagePage";
import { PHOTOS } from "@/lib/medias";
import Contenu from "../../../content/pages/a-propos.mdx";

export const metadata: Metadata = {
  title: "À propos",
  description: "Qui écrit Moustache Malin, pourquoi le site existe et comment il gagne sa vie, en toute transparence.",
  alternates: { canonical: "/a-propos/" },
};

export default function Page() {
  return (
    <StagePage
      title="Derrière les moustaches"
      lead="Un site qui lit les fiches techniques à votre place, pour que le bon équipement arrive du premier coup."
      stageWord="Bonjour"
      photo={PHOTOS.chatSoleil}
    >
      <Contenu />
    </StagePage>
  );
}
