"use client";

import { useState } from "react";
import type { FiltreCalcule } from "@/lib/filtres";
import { espacesFines } from "@/lib/typo";

// Pastilles « Je cherche… » du tableau comparatif (règles : src/lib/filtres.ts, calculées au build).
// Une seule pastille active à la fois ; un nouvel appui la désactive. Le tri se fait en CSS : une règle masque
// les lignes et les cartes `[data-asin]` du tableau qui ne sont pas retenues ; le tableau reste rendu côté serveur.
// Sans JavaScript, les pastilles restent sans effet et le tableau reste complet. Une pastille qui ne retient
// aucun modèle de la sélection est grisée.
export function FiltresTableau({ filtres, cible }: { filtres: FiltreCalcule[]; cible: string }) {
  const [actif, setActif] = useState<string | null>(null);
  const filtre = filtres.find((f) => f.id === actif);
  const css = filtre
    ? `#${cible} [data-asin]${filtre.asins.map((a) => `:not([data-asin="${a}"])`).join("")}{display:none}`
    : "";

  return (
    <div className="mb-6">
      <p id={`${cible}-filtres`} className="mb-3 font-semibold">
        Je cherche…
      </p>
      <div role="group" aria-labelledby={`${cible}-filtres`} className="flex flex-wrap gap-2">
        {filtres.map((f) => {
          const vide = f.asins.length === 0;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={f.id === actif}
              disabled={vide}
              onClick={() => setActif(f.id === actif ? null : f.id)}
              className="min-h-11 rounded-full border border-ink/25 px-4 text-small font-medium transition-colors duration-150 hover:border-ink disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-ink/25 aria-pressed:border-ink aria-pressed:bg-caramel-field aria-pressed:text-on-caramel"
            >
              {f.label} <span className="opacity-70">({f.asins.length})</span>
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="mt-3 min-h-[1.5em] text-small text-ink-soft">
        {filtre
          ? espacesFines(
              `${filtre.asins.length} modèle${filtre.asins.length > 1 ? "s retenus" : " retenu"} : ${filtre.critere.charAt(0).toLowerCase()}${filtre.critere.slice(1)}`,
            )
          : ""}
      </p>
      {css && <style>{css}</style>}
    </div>
  );
}
