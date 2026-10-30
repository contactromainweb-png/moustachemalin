import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";
import { LEGAL } from "@/lib/site";
import Contenu from "../../../content/pages/mentions-legales.mdx";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Moustache Malin : éditeur, hébergeur, affiliation Amazon, origine des images.",
  alternates: { canonical: "/mentions-legales/" },
};

export default function Page() {
  return (
    <DocPage
      title="Mentions légales"
      lead="Qui édite le site, qui l'héberge, et d'où viennent ses images."
      updated={LEGAL.miseAJour}>
      <Contenu />
    </DocPage>
  );
}
