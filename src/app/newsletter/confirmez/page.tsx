import type { Metadata } from "next";
import { espacesFines } from "@/lib/typo";

// Page d'arrivée après l'inscription, quand le formulaire part sans JavaScript (à indiquer dans Brevo).
// Cachée aux moteurs, hors du sitemap.
export const metadata: Metadata = {
  title: "Vérifiez votre boîte mail",
  robots: { index: false, follow: false },
  alternates: { canonical: "/newsletter/confirmez/" },
};

export default function Page() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 pb-24 pt-16 sm:px-8 sm:pt-28">
      <h1 className="font-display max-w-[16ch] text-display">
        Vérifiez votre boîte <span className="mot-serif">mail</span>
      </h1>
      <p className="mt-8 max-w-[52ch] text-lead">
        {espacesFines("Vérifiez votre boîte mail : un email de confirmation vient de partir. Pensez à regarder dans les indésirables.")}
      </p>
    </div>
  );
}
