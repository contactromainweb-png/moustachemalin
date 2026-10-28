"use client";

import { useId, useState } from "react";
import { eauABoire } from "@/lib/eau";

// Calculateur « Combien d'eau doit boire mon chat ? » : poids, pâtée et croquettes du jour, résultat mis à jour
// à chaque saisie, sans rechargement. Le calcul vit dans src/lib/eau.ts (testé). Sans JavaScript, la page affiche
// le résultat pour un chat de 4 kg et le texte de l'article explique la règle.
const lire = (valeur: string, min: number, max: number) => {
  const n = Number(valeur.replace(",", "."));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
};

const formatKg = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });

export function WaterCalculator() {
  const id = useId();
  const [poids, setPoids] = useState("4");
  const [patee, setPatee] = useState("0");
  const [croquettes, setCroquettes] = useState("0");

  const kg = lire(poids, 1, 12);
  const { min, max } = eauABoire({ poids: kg, patee: lire(patee, 0, 2000), croquettes: lire(croquettes, 0, 1000) });

  const champ = "min-h-12 w-full rounded-xl border-2 border-ink/25 bg-paper px-4 text-lead tabular-nums focus:border-ink";

  return (
    <section
      aria-labelledby={`${id}-titre`}
      className="my-12 grid gap-8 rounded-[1.5rem] bg-field p-5 sm:p-8 lg:grid-cols-[1fr_minmax(18rem,24rem)] lg:gap-12"
    >
      <form onSubmit={(e) => e.preventDefault()} className="space-y-7">
        <h2 id={`${id}-titre`} className="font-display text-head">
          Votre chat
        </h2>

        <div>
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor={`${id}-poids`} className="font-medium">
              Son poids
            </label>
            <output htmlFor={`${id}-poids`} className="font-display text-[1.75rem] tabular-nums">
              {formatKg.format(kg)} kg
            </output>
          </div>
          <input
            id={`${id}-poids`}
            type="range"
            min={1}
            max={12}
            step={0.1}
            value={kg}
            onChange={(e) => setPoids(e.target.value)}
            className="mt-3 h-11 w-full cursor-pointer accent-[var(--accent)]"
          />
          <div aria-hidden="true" className="flex justify-between text-small text-ink-soft">
            <span>1 kg</span>
            <span>12 kg</span>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-patee`} className="font-medium">
              Pâtée <span className="font-normal text-ink-soft">(grammes par jour)</span>
            </label>
            <input
              id={`${id}-patee`}
              type="number"
              inputMode="numeric"
              min={0}
              max={2000}
              step={5}
              value={patee}
              onChange={(e) => setPatee(e.target.value)}
              className={`mt-2 ${champ}`}
            />
          </div>
          <div>
            <label htmlFor={`${id}-croquettes`} className="font-medium">
              Croquettes <span className="font-normal text-ink-soft">(grammes par jour)</span>
            </label>
            <input
              id={`${id}-croquettes`}
              type="number"
              inputMode="numeric"
              min={0}
              max={1000}
              step={5}
              value={croquettes}
              onChange={(e) => setCroquettes(e.target.value)}
              className={`mt-2 ${champ}`}
            />
          </div>
        </div>
        <p className="text-small text-ink-soft">Laissez 0 s&apos;il ne mange pas de pâtée ou pas de croquettes.</p>
      </form>

      <div
        aria-live="polite"
        className="flex flex-col justify-center rounded-[1.25rem] bg-caramel-field px-6 py-8 text-on-caramel"
      >
        {max === 0 ? (
          <p className="font-display text-[1.75rem] leading-tight">
            Sa nourriture couvre l&apos;essentiel de ses besoins&nbsp;: il est normal qu&apos;il boive peu.
          </p>
        ) : (
          <>
            <p className="text-small uppercase tracking-[0.12em] opacity-80">À boire chaque jour</p>
            <p className="mt-2 font-display text-[clamp(2.25rem,1.6rem+2.4vw,3.25rem)] leading-none tabular-nums">
              {min === max ? `${max} ml` : `${min} à ${max} ml`}
            </p>
            <p className="mt-4">
              Environ {min === max ? max : `${min} à ${max}`} ml à boire par jour, au bol ou à la fontaine, en plus de
              l&apos;eau de sa nourriture.
            </p>
          </>
        )}
        <p className="mt-6 text-small opacity-80">Estimation&nbsp;: les besoins varient selon l&apos;âge, l&apos;activité et la chaleur.</p>
      </div>
    </section>
  );
}
