import Image from "next/image";
import type { ReactNode } from "react";
import { KIRA } from "@/lib/site";

// « Le mot de Kira » : un seul encadré par article, placé après l'introduction (charte dans CLAUDE.md, section 11).
// Kira ne dit que des choses vraies sur elle, ne donne aucun avis produit ni conseil de santé : le texte vient de Romain.
// Tant que Romain n'a pas fourni sa photo (KIRA.photo vide), un rond neutre avec son initiale la remplace.
export function KiraNote({ children }: { children: ReactNode }) {
  return (
    <aside
      aria-label="Le mot de Kira"
      className="reveal mb-12 flex max-w-[44rem] gap-4 rounded-[1.5rem] bg-kira px-5 py-6 sm:gap-6 sm:px-8"
    >
      <Portrait />
      <div className="min-w-0">
        <p className="font-medium">Le mot de Kira</p>
        <div className="mt-2 font-serif text-lead italic leading-snug [&_p]:mb-0 [&_p]:max-w-[52ch] [&_p+p]:mt-3">
          {children}
        </div>
      </div>
    </aside>
  );
}

export function Portrait({ taille = "size-14 sm:size-16" }: { taille?: string }) {
  if (KIRA.photo) {
    return (
      <Image
        src={KIRA.photo}
        alt="Kira, la chatte de Romain"
        width={128}
        height={128}
        quality={80}
        className={`${taille} shrink-0 rounded-full object-cover`}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`${taille} flex shrink-0 items-center justify-center rounded-full bg-lavande font-serif text-[1.75rem] italic text-nuit`}
    >
      K
    </span>
  );
}
