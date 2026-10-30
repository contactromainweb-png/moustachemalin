import type { Metadata } from "next";
import { DocPage } from "@/components/DocPage";
import { LEGAL } from "@/lib/site";
import Contenu from "../../../content/pages/confidentialite.mdx";

export const metadata: Metadata = {
  title: "Confidentialité et cookies",
  description: "Moustache Malin ne dépose aucun cookie. Quelles données sont traitées, par qui, et comment exercer vos droits.",
  alternates: { canonical: "/confidentialite/" },
};

export default function Page() {
  return (
    <DocPage
      title="Confidentialité"
      lead="Aucun cookie, aucun compte, aucune publicité. Le détail ci-dessous."
      updated={LEGAL.miseAJourMentions}>
      <Contenu />
    </DocPage>
  );
}
