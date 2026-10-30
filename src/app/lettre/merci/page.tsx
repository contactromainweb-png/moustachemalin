import type { Metadata } from "next";
import Link from "next/link";
import { Portrait } from "@/components/KiraNote";
import { espacesFines } from "@/lib/typo";

// Confirmation d'inscription à la lettre d'information : adresse à indiquer comme « page de remerciement » dans
// l'outil d'envoi (Brevo ou autre), qui y renvoie le visiteur après le formulaire. Cachée aux moteurs.
export const metadata: Metadata = {
  title: "Inscription confirmée",
  robots: { index: false, follow: false },
  alternates: { canonical: "/lettre/merci/" },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 pb-24 pt-16 sm:px-8 sm:pt-28">
      <Portrait taille="size-20 sm:size-24" prioritaire />
      <h1 className="font-display mt-8 max-w-[16ch] text-display">
        C&apos;est <span className="mot-serif">noté</span>
      </h1>
      <p className="mt-8 max-w-[52ch] text-lead">
        {espacesFines("C'est noté ! Votre checklist arrive dans votre boîte mail. Kira, elle, attend surtout son prochain jouet.")}
      </p>
      <p className="mt-6 text-ink-soft">Romain et Kira</p>
      <Link
        href="/"
        className="mt-10 inline-flex min-h-12 items-center bg-caramel-field px-6 text-on-caramel transition-transform hover:-translate-y-0.5 active:translate-y-0"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
