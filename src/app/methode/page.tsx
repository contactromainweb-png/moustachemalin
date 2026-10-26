import type { Metadata } from "next";
import { StagePage } from "@/components/StagePage";
import { LEGAL } from "@/lib/site";
import Contenu from "../../../content/pages/methode.mdx";

export const metadata: Metadata = {
  title: "Notre méthode de comparaison",
  description: "Comment Moustache Malin compare l'équipement pour chat : sources, critères, indépendance et mises à jour.",
  alternates: { canonical: "/methode/" },
};

export default function Page() {
  return (
    <StagePage
      title="Comment nous comparons"
      lead="Pas de test en laboratoire, pas de note inventée : une lecture attentive de tout ce qui compte avant d’acheter."
      updated={LEGAL.miseAJour}
      stageWord="Méthode"
    >
      <Contenu />
    </StagePage>
  );
}
