import { TexteBulleJeu } from "@/components/TexteBulleJeu";
import { DEPART_JEU_BALLE } from "@/lib/jeu-balle";
import { espacesFines } from "@/lib/typo";

// Boîte de remplacement du mini-jeu de la balle (aucun état, aucun effet) : même hauteur que le jeu
// (bulle de départ, terrain, bouton), le temps que le jeu se charge. Cachée aux lecteurs d'écran (le vrai jeu la
// remplace).
export function JeuBalleAttente() {
  return (
    <div aria-hidden="true" className="w-full">
      <div className="relative mb-5 min-w-[10rem] max-w-[30rem] rounded-[14px] border-[1.5px] border-nuit bg-white px-4 py-3 text-nuit sm:px-5 sm:py-4">
        <TexteBulleJeu texte={DEPART_JEU_BALLE} />
      </div>
      <div className="h-56 w-full rounded-[1.5rem] bg-field sm:h-64" />
      <div className="mt-5 flex flex-col items-start gap-x-6 gap-y-3 sm:flex-row sm:flex-wrap sm:items-center">
        <span className="inline-flex min-h-12 items-center rounded-full bg-accent px-7 font-semibold text-on-accent opacity-70">
          Lancer la balle
        </span>
        <p className="tabular-nums">
          {espacesFines("Balles rapportées : ")}
          <span className="inline-block min-w-[3ch]">0</span>
        </p>
      </div>
    </div>
  );
}
