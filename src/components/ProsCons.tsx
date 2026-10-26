import { espacesFines } from "@/lib/typo";

// Points forts et points faibles côte à côte (empilés sur téléphone).
export function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <h4 className="font-semibold">Points forts</h4>
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
        <h4 className="font-semibold">Points faibles</h4>
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
