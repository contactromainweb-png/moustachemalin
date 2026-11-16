import { sansCesure } from "@/components/SansCesure";
import { espacesFines, nomsInsecables } from "@/lib/typo";

// Titre dont un mot passe en serif italique (classe .mot-serif) : « Litière *autonettoyante* : notre comparatif ».
// Le mot est cherché tel quel dans le titre ; s'il n'y est pas, le titre reste entièrement en grotesque.
export function TitreSerif({ titre, mot: motBrut }: { titre: string; mot?: string }) {
  const texte = nomsInsecables(espacesFines(titre));
  const mot = motBrut && nomsInsecables(motBrut);
  const i = mot ? texte.indexOf(mot) : -1;
  if (!mot || i < 0) return <>{sansCesure(texte)}</>;
  // La ponctuation qui suit le mot (« : », « ? »…) reste collée à lui : les deux forment un bloc (.mot-colle,
  // globals.css) qui passe à la ligne d'un seul tenant, et ne se coupe à l'intérieur que s'il est plus large que
  // sa colonne (texte agrandi à 200 %), au lieu de déborder.
  const suite = texte.slice(i + mot.length);
  const colle = /^[  ]?[:;?!,.…]/.exec(suite)?.[0] ?? "";
  if (!colle)
    return (
      <>
        {sansCesure(texte.slice(0, i))}
        <span className="mot-serif">{sansCesure(mot)}</span>
        {sansCesure(suite)}
      </>
    );
  return (
    <>
      {sansCesure(texte.slice(0, i))}
      <span className="mot-colle">
        <span className="mot-serif">{sansCesure(mot)}</span>
        {colle}
      </span>
      {sansCesure(suite.slice(colle.length))}
    </>
  );
}
