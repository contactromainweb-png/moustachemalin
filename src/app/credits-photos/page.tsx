import type { Metadata } from "next";
import { Credits } from "@/components/Credits";

export const metadata: Metadata = {
  title: "Crédits photos",
  description: "Les photographes dont les images illustrent Moustache Malin, avec la source et la licence de chaque photo.",
  alternates: { canonical: "/credits-photos/" },
};

// Page générée depuis content/credits.json : une nouvelle ligne dans ce fichier ajoute la photo ici.
export default function Page() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 pb-24 pt-10 sm:px-8 lg:pt-20">
      <h1 className="font-display rise max-w-[16ch] text-display">
        Crédits <span className="mot-serif">photos</span>
      </h1>
      <p className="rise mt-6 max-w-[48ch] text-lead" style={{ "--i": 1 } as React.CSSProperties}>
        Merci aux photographes dont les images illustrent le site. Elles viennent de banques d&apos;images libres pour un
        usage commercial (Pexels, Unsplash), sauf le portrait de Romain&#8239;; aucune n&apos;est reprise d&apos;Amazon
        ou d&apos;un fabricant.
      </p>
      <div className="mt-16">
        <Credits />
      </div>
    </div>
  );
}
