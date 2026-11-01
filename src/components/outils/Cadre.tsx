import type { ReactNode } from "react";

// Mise en page commune des calculateurs (même dessin que WaterCalculator) : les champs à gauche, le résultat dans
// un panneau bleu nuit à droite (dessous sur téléphone), annoncé aux lecteurs d'écran à chaque changement.
export const CHAMP =
  "min-h-12 w-full rounded-xl border-2 border-ink/25 bg-paper px-4 text-lead tabular-nums focus:border-ink";

export function Cadre({
  id,
  titre,
  champs,
  resultat,
}: {
  id: string;
  titre: string;
  champs: ReactNode;
  resultat: ReactNode;
}) {
  return (
    <section
      aria-labelledby={`${id}-titre`}
      className="my-12 grid gap-8 rounded-[1.5rem] bg-field p-5 sm:p-8 lg:grid-cols-[1fr_minmax(18rem,24rem)] lg:gap-12"
    >
      <form onSubmit={(e) => e.preventDefault()} className="space-y-7">
        <h2 id={`${id}-titre`} className="font-display text-head">
          {titre}
        </h2>
        {champs}
      </form>
      <div
        aria-live="polite"
        className="flex flex-col justify-center rounded-[1.25rem] bg-caramel-field px-6 py-8 text-on-caramel"
      >
        {resultat}
      </div>
    </section>
  );
}

// Grand chiffre du résultat, avec son intitulé au-dessus.
export function Chiffre({ intitule, children }: { intitule: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-small uppercase tracking-[0.12em] opacity-80">{intitule}</p>
      <p className="mt-2 font-display text-[clamp(2.25rem,1.6rem+2.4vw,3.25rem)] leading-none tabular-nums">
        {children}
      </p>
    </div>
  );
}

// Le calcul détaillé, sous le résultat : l'outil montre toujours comment il arrive au chiffre.
export function Formule({ children }: { children: ReactNode }) {
  return <p className="mt-6 border-t border-on-caramel/25 pt-4 text-small tabular-nums opacity-90">{children}</p>;
}

// Lit un nombre saisi (virgule acceptée) ; vide ou invalide = NaN.
export function nombre(valeur: string) {
  return valeur.trim() === "" ? Number.NaN : Number(valeur.replace(",", ".").replace(/\s/g, ""));
}

export const formatNombre = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });
export const formatEuros = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
