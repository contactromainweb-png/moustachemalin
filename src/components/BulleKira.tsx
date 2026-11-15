import type { ReactNode } from "react";
import { KiraDessin } from "@/components/KiraDessin";

// Kira dessinée à gauche (96 px, 72 px sur téléphone) et sa bulle à droite : fond blanc, bord bleu nuit de 1,5 px,
// coins de 14 px, petite pointe vers Kira. `vivante` : le texte change (profil, quiz), il est annoncé aux lecteurs
// d'écran (aria-live). Kira ne dit que les textes fournis par Romain (charte, CLAUDE.md section 11).
export function BulleKira({ children, vivante = false, className = "" }: { children: ReactNode; vivante?: boolean; className?: string }) {
  return (
    <div className={`flex items-start gap-3 sm:gap-4 ${className}`}>
      <KiraDessin taille={96} className="size-[72px] sm:size-24" />
      <div
        aria-live={vivante ? "polite" : undefined}
        className="relative mt-2 min-w-0 flex-1 rounded-[14px] border-[1.5px] border-nuit bg-white px-4 py-3 text-nuit sm:mt-3 sm:px-5 sm:py-4"
      >
        <span
          aria-hidden="true"
          className="absolute -left-[7.5px] top-6 size-3 rotate-45 border-b-[1.5px] border-l-[1.5px] border-nuit bg-white"
        />
        <div className="relative [&_a]:font-medium [&_a]:underline [&_a]:decoration-accent [&_a]:decoration-2 [&_a]:underline-offset-4">
          {children}
        </div>
      </div>
    </div>
  );
}
