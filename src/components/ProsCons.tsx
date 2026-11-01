import { espacesFines } from "@/lib/typo";

// Points forts et points faibles côte à côte (empilés sur téléphone).
// Les intitulés sont du texte en gras, pas des titres : une page qui compare 6 produits aurait sinon 6 titres
// « Points forts » identiques. La fiche est déjà annoncée par le titre qui porte le nom du produit.
export function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <p className="font-semibold">Points forts</p>
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
        <p className="font-semibold">Points faibles</p>
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
