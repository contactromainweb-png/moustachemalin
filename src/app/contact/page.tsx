import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { StagePage } from "@/components/StagePage";
import { PHOTOS } from "@/lib/medias";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Une question sur un produit, une idée d'article, une erreur repérée ? Écrivez à Moustache Malin : Romain lit tous les messages.",
  alternates: { canonical: "/contact/" },
};

export default function Page() {
  return (
    <StagePage
      title="Nous écrire"
      lead="Une question sur un produit, une idée d'article, une erreur repérée : Romain lit tous les messages."
      photo={PHOTOS.romain}
      portrait
      stageWord="Contact"
    >
      <ContactForm />
      <p className="mt-12 text-ink-soft">
        Vous préférez l&apos;e-mail ? Écrivez à{" "}
        <a href={`mailto:${SITE.email}`} className="underline underline-offset-4">
          {SITE.email}
        </a>
        .
      </p>
    </StagePage>
  );
}
