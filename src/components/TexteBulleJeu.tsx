import { TEXTES_JEU_BALLE } from "@/lib/jeu-balle";
import { espacesFines } from "@/lib/typo";

// Texte de la bulle du mini-jeu de la balle : tous les textes possibles sont empilés dans la même case, invisibles,
// pour que la bulle ait toujours la hauteur du plus long. Quand Kira change de phrase, rien ne bouge en dessous
// (pas de décalage de la page). Seul le texte affiché est lu par les lecteurs d'écran.
export function TexteBulleJeu({ texte }: { texte: string }) {
  return (
    <div className="grid">
      {TEXTES_JEU_BALLE.map((t) => (
        <p key={t} aria-hidden="true" className="invisible col-start-1 row-start-1">
          {espacesFines(t)}
        </p>
      ))}
      <p className="col-start-1 row-start-1">{espacesFines(texte)}</p>
    </div>
  );
}
