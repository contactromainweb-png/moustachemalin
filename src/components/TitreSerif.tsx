import { espacesFines, nomsInsecables } from "@/lib/typo";

// Titre dont un mot passe en serif italique (classe .mot-serif) : « Litière *autonettoyante* : notre comparatif ».
// Le mot est cherché tel quel dans le titre ; s'il n'y est pas, le titre reste entièrement en grotesque.
export function TitreSerif({ titre, mot: motBrut }: { titre: string; mot?: string }) {
  const texte = nomsInsecables(espacesFines(titre));
  const mot = motBrut && nomsInsecables(motBrut);
  const i = mot ? texte.indexOf(mot) : -1;
  if (!mot || i < 0) return <>{texte}</>;
  // La ponctuation qui suit le mot (« : », « ? »…) reste collée à lui sans nowrap : l'espace qui la précède est
  // insécable (espacesFines) et le navigateur ne coupe jamais juste avant une ponctuation. Sans nowrap, un mot trop
  // long pour l'écran (texte agrandi à 200 %) passe à la ligne au lieu de déborder (overflow-wrap: anywhere du body, globals.css).
  return (
    <>
      {texte.slice(0, i)}
      <span className="mot-serif">{mot}</span>
      {texte.slice(i + mot.length)}
    </>
  );
}
