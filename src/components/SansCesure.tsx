import { Children, Fragment, type ReactNode } from "react";

// Noms de marques et de produits qui ne se coupent jamais avec un tiret, même quand la césure des titres s'active
// (texte agrandi, globals.css). La césure ne touche que les mots de 10 lettres ou plus : seuls ces noms-là sont
// listés (les plus courts, PETKIT, PETLIBRO, Neakasa, FUKUMARU…, sont déjà protégés par cette limite).
// « Agglomérante » : dans le nom d'un produit (Ever Clean Extra Agglomérante).
// scripts/controle-titres.mjs vérifie qu'aucun nom de produit de 10 lettres ou plus ne manque à cette liste.
export const MARQUES_LONGUES = ["Agglomérante", "Dockstream", "Fantasreen"];

const MOTIF = new RegExp(`(${MARQUES_LONGUES.join("|")})`, "g");

// Entoure chaque nom de la liste d'un <span class="sans-cesure"> (hyphens: manual), sans rien changer d'autre :
// à taille normale, le rendu est identique. Accepte du texte ou des enfants React (seul le texte est traité).
export function sansCesure(enfants: ReactNode): ReactNode {
  return Children.map(enfants, (e) => {
    if (typeof e !== "string" || !MOTIF.test(e)) return e;
    MOTIF.lastIndex = 0;
    return e.split(MOTIF).map((morceau, i) =>
      i % 2 === 1 ? (
        <span key={i} className="sans-cesure">
          {morceau}
        </span>
      ) : (
        <Fragment key={i}>{morceau}</Fragment>
      ),
    );
  });
}
