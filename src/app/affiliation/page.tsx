import type { Metadata } from "next";
import { StagePage } from "@/components/StagePage";
import { LEGAL } from "@/lib/site";
import Contenu from "../../../content/pages/affiliation.mdx";

export const metadata: Metadata = {
  title: "Affiliation Amazon",
  description: "Moustache Malin est Partenaire Amazon : ce que cela veut dire, ce que cela change (rien) pour le prix que vous payez.",
  alternates: { canonical: "/affiliation/" },
};

export default function Page() {
  return (
    <StagePage
      title="Nos liens Amazon, expliqués"
      lead="Le site est gratuit et sans publicité. Il vit des commissions versées par Amazon, et voici comment."
      updated={LEGAL.miseAJour}
      stageWord="Transparence"
    >
      <Contenu />
    </StagePage>
  );
}
