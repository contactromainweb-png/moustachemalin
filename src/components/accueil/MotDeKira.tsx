import { KiraNote } from "@/components/KiraNote";

// « Le mot de Kira » sur l'accueil, juste après les cartes « Mon problème, c'est… » (téléphone) ou après le premier
// écran (ordinateur). Texte écrit par Romain, à ne pas modifier sans lui (charte de Kira, CLAUDE.md section 11).
export function MotDeKira() {
  return (
    // Simple conteneur : l'encadré est déjà un repère « Le mot de Kira » (aside).
    <div data-fond="page" className="px-4 pt-6 sm:px-8 lg:pb-8 lg:pt-20">
      <div className="mx-auto max-w-[90rem]">
        <KiraNote>
          <p>
            Moi, c&apos;est Kira, la mascotte de la maison. Mon humain lit les fiches techniques, moi je rapporte mes
            jouets. Chacun son métier.
          </p>
        </KiraNote>
      </div>
    </div>
  );
}
