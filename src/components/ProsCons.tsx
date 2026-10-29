import { espacesFines } from "@/lib/typo";

// Points forts et points faibles côte à côte (empilés sur téléphone).
// `niveau` : niveau des intertitres (4 sous un titre ### de fiche, 3 quand la fiche suit directement un titre ##).
export function ProsCons({ pros, cons, niveau = 4 }: { pros: string[]; cons: string[]; niveau?: 3 | 4 }) {
  const Titre = niveau === 3 ? "h3" : "h4";
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <Titre className="font-semibold">Points forts</Titre>
        <ul className="mt-3 space-y-2">
          {pros.map((p) => (
            <li key={p} className="flex gap-3">
              <span aria-hidden="true" className="font-semibold text-caramel">+</span>
              <span>{espacesFines(p)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Titre className="font-semibold">Points faibles</Titre>
        <ul className="mt-3 space-y-2">
          {cons.map((c) => (
            <li key={c} className="flex gap-3">
              <span aria-hidden="true" className="font-semibold text-ink-soft">−</span>
              <span>{espacesFines(c)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
