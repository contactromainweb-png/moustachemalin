import type { ReactNode } from "react";

// Une section d'article (titre « ## » et ce qui le suit), sur un fond qui s'étend sur toute la largeur de l'écran
// pendant que le texte garde sa colonne. Placée au build par plugins/remark-bandes.mjs. Fonds définis dans
// globals.css (--bande-a, --bande-b, --bande-c), en clair et en sombre. Aucune animation.
export function Bande({ n, fond, children }: { n?: string; fond?: "a" | "b" | "c"; children: ReactNode }) {
  return (
    <div className="bande" data-bande={fond ?? "a"} data-n={n}>
      {children}
    </div>
  );
}
