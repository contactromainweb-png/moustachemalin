import type { Metadata } from "next";
import Link from "next/link";
import { BoutonAction } from "@/components/BoutonAction";
import { KiraNote } from "@/components/KiraNote";
import { tousLesArticles } from "@/lib/rubriques";
import { espacesFines } from "@/lib/typo";

// Page d'arrivée après la confirmation de l'e-mail (à indiquer dans Brevo). Cachée aux moteurs, hors du sitemap.
export const metadata: Metadata = {
  title: "Bienvenue dans la bande",
  robots: { index: false, follow: false },
  alternates: { canonical: "/newsletter/merci/" },
};

export default function Page() {
  const comparatifs = tousLesArticles().filter((a) => a.type === "comparatif");
  return (
    <div className="mx-auto max-w-[90rem] px-4 pb-24 pt-16 sm:px-8 sm:pt-28">
      <h1 className="font-display max-w-[16ch] text-display">
        Bienvenue dans la <span className="mot-serif">bande</span>&nbsp;!
      </h1>
      <BoutonAction href="/cadeaux/checklist-arrivee-chat.pdf" fichier className="mt-10">
        Télécharger la checklist (PDF)
      </BoutonAction>
      <div className="mt-12">
        <KiraNote>
          <p>{espacesFines("Moi, j'ai coché la case jouets en premier.")}</p>
        </KiraNote>
      </div>
      <h2 className="font-display text-head">
        Nos <span className="mot-serif">comparatifs</span>
      </h2>
      <ul className="mt-6">
        {comparatifs.map((a) => (
          <li key={a.href}>
            <Link
              href={a.href}
              className="inline-flex min-h-11 items-center py-1 font-medium underline decoration-accent decoration-2 underline-offset-[6px]"
            >
              {espacesFines(a.titre)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
