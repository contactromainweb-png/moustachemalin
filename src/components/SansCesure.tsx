import { Children, Fragment, type ReactNode } from "react";

// Noms de marques et de produits qui ne se coupent jamais avec un tiret, même quand la césure des titres s'active
// (texte agrandi, globals.css). La césure ne touche que les mots de 9 lettres ou plus : seuls ces noms-là sont
// listés (les plus courts, PETKIT, PETLIBRO, Neakasa, FUKUMARU…, sont déjà protégés par cette limite).
// « Moustache » : le nom du site (Moustache Malin) ; « Chichoune » : un chat de la famille (la bande de Kira).
// « Agglomérante » : dans le nom d'un produit (Ever Clean Extra Agglomérante).
// scripts/controle-titres.mjs vérifie qu'aucun nom de produit de 9 lettres ou plus ne manque à cette liste.
export const MARQUES_LONGUES = [
  "Agglomérante",
  "Chichoune",
  "Dockstream",
  "Eversweet",
  "Fantasreen",
  "FEELNEEDY",
  "Globlazer",
  "Moustache",
  "Vitakraft",
];

// Ponctuation double (: ; ? !), avec l'espace fine qui la précède. Cette espace est déjà insécable, mais le dernier
// recours du body (overflow-wrap: anywhere) peut couper n'importe où quand « mot : » ne tient pas sur sa ligne, y
// compris juste avant le « : ». La dernière lettre du mot, l'espace et la ponctuation forment donc un bloc
// insécable (.ponct-collee, white-space: nowrap, texte agrandi seulement). La césure du mot reste possible : le
// navigateur coupe le mot à travers la balise (« auto-nettoyante : »).
const PONCT = "[\\u00a0\\u202f]?[:;?!]+";
const MOTIF = new RegExp(`(${MARQUES_LONGUES.join("|")})(${PONCT})?|(\\S)(${PONCT})`, "g");

const colle = (k: number, texte: string) => (
  <span key={k} className="ponct-collee">
    {texte}
  </span>
);

function decouper(texte: string): ReactNode[] | null {
  const morceaux: ReactNode[] = [];
  let fin = 0;
  let k = 0;
  for (const m of texte.matchAll(MOTIF)) {
    const [tout, nom, ponctNom, lettre, ponct] = m;
    if (m.index > fin) morceaux.push(<Fragment key={k++}>{texte.slice(fin, m.index)}</Fragment>);
    morceaux.push(
      nom ? (
        <span key={k++} className="sans-cesure">
          {ponctNom ? [nom.slice(0, -1), colle(0, nom.slice(-1) + ponctNom)] : nom}
        </span>
      ) : (
        colle(k++, lettre + ponct)
      ),
    );
    fin = m.index + tout.length;
  }
  if (!morceaux.length) return null;
  if (fin < texte.length) morceaux.push(<Fragment key={k++}>{texte.slice(fin)}</Fragment>);
  return morceaux;
}

// Texte d'un titre : entoure chaque nom de la liste d'un <span class="sans-cesure"> (hyphens: manual) et colle la
// ponctuation double au mot qui la précède (.ponct-collee), sans rien changer d'autre : à taille normale, le rendu
// est identique. Accepte du texte ou des enfants React (seul le texte est traité).
export function sansCesure(enfants: ReactNode): ReactNode {
  return Children.map(enfants, (e) => {
    if (typeof e !== "string") return e;
    return decouper(e) ?? e;
  });
}
