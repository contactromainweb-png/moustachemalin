import type { ReactNode } from "react";
import { KiraDessin } from "@/components/KiraDessin";

// Kira dessinée et sa bulle : fond blanc, bord bleu nuit de 1,5 px, coins de 14 px, petite pointe vers Kira.
// variante « ligne » (quiz, tests) : Kira à gauche, 72 px sur téléphone, 96 px dès 640 px ; la bulle à droite.
// variante « accueil » (carte « Ton chat ») : 96 px sur téléphone, bulle à droite ; sur ordinateur (≥ 1024 px),
// Kira en grand (160 px) et la bulle en dessous, pointe vers le haut.
// `vivante` : le texte change (profil, quiz), il est annoncé aux lecteurs d'écran (aria-live).
// Texte agrandi (200 %) : la bulle garde au moins 10 rem de large et passe sous Kira si la place manque.
// `clinSignal` : chaque nouvelle valeur fait cligner Kira. Kira ne dit que les textes validés (charte, CLAUDE.md § 11).
export function BulleKira({
  children,
  vivante = false,
  variante = "ligne",
  clinSignal,
  className = "",
  sansDessin = false,
}: {
  children: ReactNode;
  vivante?: boolean;
  variante?: "ligne" | "accueil";
  clinSignal?: number;
  className?: string;
  // Bulle seule, pointe vers le bas (mini-jeu de la balle, pack 9) : la Kira qui parle est dessinée juste dessous,
  // sur le terrain, pour ne jamais avoir deux Kira à l'écran.
  sansDessin?: boolean;
}) {
  if (sansDessin) {
    return (
      <div
        aria-live={vivante ? "polite" : undefined}
        className={`relative min-w-[10rem] rounded-[14px] border-[1.5px] border-nuit bg-white px-4 py-3 text-nuit sm:px-5 sm:py-4 ${className}`}
      >
        <span
          aria-hidden="true"
          className="absolute -bottom-[7.5px] left-[2.25rem] size-3 rotate-45 border-b-[1.5px] border-r-[1.5px] border-nuit bg-white sm:left-[4.5rem]"
        />
        <div className="relative">{children}</div>
      </div>
    );
  }
  const accueil = variante === "accueil";
  return (
    <div className={`flex flex-wrap items-start gap-3 sm:gap-4 ${accueil ? "lg:flex-col lg:gap-5" : ""} ${className}`}>
      <KiraDessin
        taille={accueil ? 160 : 96}
        clinSignal={clinSignal}
        className={accueil ? "size-24 lg:size-40" : "size-[72px] sm:size-24"}
      />
      <div
        aria-live={vivante ? "polite" : undefined}
        className={`relative mt-2 min-w-[10rem] flex-1 rounded-[14px] border-[1.5px] border-nuit bg-white px-4 py-3 text-nuit sm:mt-3 sm:px-5 sm:py-4 ${accueil ? "lg:mt-0 lg:w-full lg:flex-none" : ""}`}
      >
        <span
          aria-hidden="true"
          className={`absolute -left-[7.5px] top-6 size-3 rotate-45 border-b-[1.5px] border-l-[1.5px] border-nuit bg-white ${accueil ? "lg:-top-[7.5px] lg:left-[4.5rem] lg:border-b-0 lg:border-t-[1.5px]" : ""}`}
        />
        <div className="relative [&_a]:font-medium [&_a]:underline [&_a]:decoration-accent [&_a]:decoration-2 [&_a]:underline-offset-4">
          {children}
        </div>
      </div>
    </div>
  );
}
