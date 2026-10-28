import { espacesFines } from "@/lib/typo";

// Titre dont un mot passe en serif italique (classe .mot-serif) : « Litière *autonettoyante* : notre comparatif ».
// Le mot est cherché tel quel dans le titre ; s'il n'y est pas, le titre reste entièrement en grotesque.
export function TitreSerif({ titre, mot }: { titre: string; mot?: string }) {
  const texte = espacesFines(titre);
  const i = mot ? texte.indexOf(mot) : -1;
  if (!mot || i < 0) return <>{texte}</>;
  // La ponctuation qui suit le mot (« : », « ? »…) reste collée à lui, sans passer seule à la ligne.
  const suite = texte.slice(i + mot.length);
  const colle = /^[\u00a0\u202f]?[:;?!,.]/.exec(suite)?.[0] ?? "";
  return (
    <>
      {texte.slice(0, i)}
      <span className="whitespace-nowrap">
        <span className="mot-serif">{mot}</span>
        {colle}
      </span>
      {suite.slice(colle.length)}
    </>
  );
}
