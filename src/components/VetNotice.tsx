import type { ReactNode } from "react";

// Encadré santé des guides. Aucun conseil médical : on renvoie au vétérinaire.
export function VetNotice({ children }: { children?: ReactNode }) {
  return (
    <aside aria-label="Santé" className="reveal my-10 bg-caramel-field px-5 py-6 text-on-caramel sm:px-8">
      <p className="font-display text-head">En cas de doute, consultez votre vétérinaire</p>
      <p className="mt-3 max-w-[60ch]">
        {children ??
          "Un changement d'habitude (il boit moins, évite sa litière, mange moins) peut avoir une cause médicale. Cette page parle d'équipement et ne remplace pas un avis vétérinaire."}
      </p>
    </aside>
  );
}
