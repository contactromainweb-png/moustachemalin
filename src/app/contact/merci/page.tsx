import type { Metadata } from "next";
import Link from "next/link";
import { Portrait } from "@/components/KiraNote";
import { espacesFines } from "@/lib/typo";

// Confirmation après le formulaire de contact : Netlify y renvoie le visiteur (action du formulaire déclaré dans
// public/__forms.html). Cachée aux moteurs et absente du plan du site. Phrase de Kira écrite par Romain.
export const metadata: Metadata = {
  title: "Message envoyé",
  robots: { index: false, follow: false },
  alternates: { canonical: "/contact/merci/" },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 pb-24 pt-16 sm:px-8 sm:pt-28">
      <Portrait taille="size-20 sm:size-24" prioritaire />
      <h1 className="font-display mt-8 max-w-[16ch] text-display">
        Message <span className="mot-serif">reçu</span>
      </h1>
      <p className="mt-8 max-w-[52ch] text-lead">
        {espacesFines("Message bien reçu. Mon humain vous répond dès qu'il a fini de me lancer mes jouets.")}
      </p>
      <p className="mt-6 text-ink-soft">Kira</p>
      <Link
        href="/"
        className="mt-10 inline-flex min-h-12 items-center bg-caramel-field px-6 text-on-caramel transition-transform hover:-translate-y-0.5 active:translate-y-0"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
