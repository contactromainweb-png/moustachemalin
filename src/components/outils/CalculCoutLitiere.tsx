"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { CHAMP, Cadre, Chiffre, Formule, formatEuros, nombre } from "@/components/outils/Cadre";
import { coutLitiere } from "@/lib/outils-calculs";

// Calculateur « Coût réel d'une litière autonettoyante » (calcul : src/lib/outils-calculs.ts). Tous les champs
// partent vides : aucun prix n'est écrit sur le site, le lecteur saisit ceux qu'il a relevés.
const CHAMPS = [
  { cle: "appareil", label: "Prix de l'appareil", unite: "€, une fois" },
  { cle: "sacs", label: "Sacs pour le bac à déchets", unite: "€ par mois" },
  { cle: "litiere", label: "Litière", unite: "€ par mois" },
  { cle: "autres", label: "Désodorisant et autres", unite: "€ par mois" },
] as const;

type Cle = (typeof CHAMPS)[number]["cle"];

export function CalculCoutLitiere() {
  const id = useId();
  const [valeurs, setValeurs] = useState<Record<Cle, string>>({ appareil: "", sacs: "", litiere: "", autres: "" });
  const n = (cle: Cle) => nombre(valeurs[cle]);
  const resultat = coutLitiere({ appareil: n("appareil"), sacs: n("sacs"), litiere: n("litiere"), autres: n("autres") });
  const appareil = n("appareil") > 0 ? n("appareil") : 0;

  return (
    <Cadre
      id={id}
      titre="Vos dépenses"
      champs={
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            {CHAMPS.map((c) => (
              <div key={c.cle}>
                <label htmlFor={`${id}-${c.cle}`} className="font-medium">
                  {c.label} <span className="font-normal text-ink-soft">({c.unite})</span>
                </label>
                <input
                  id={`${id}-${c.cle}`}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={valeurs[c.cle]}
                  onChange={(e) => setValeurs((v) => ({ ...v, [c.cle]: e.target.value }))}
                  className={`mt-2 ${CHAMP}`}
                />
              </div>
            ))}
          </div>
          <p className="text-small text-ink-soft">
            Pour un consommable, divisez le prix d&apos;un paquet par le nombre de mois qu&apos;il vous dure. Les prix
            changent souvent : relevez-les au moment de votre achat. Un champ laissé vide compte pour 0.
          </p>
          <p className="text-small">
            Pour savoir quels consommables prévoir, voyez la liste de chaque modèle dans{" "}
            <Link href="/litieres/litiere-autonettoyante/#consommables" className="underline underline-offset-4">
              les consommables de notre comparatif
            </Link>
            .
          </p>
        </>
      }
      resultat={
        resultat ? (
          <>
            <Chiffre intitule="Sur 3 ans">{formatEuros.format(resultat.troisAns)}</Chiffre>
            <dl className="mt-5 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 tabular-nums">
              <dt className="opacity-80">Sur 1 an</dt>
              <dd className="font-semibold">{formatEuros.format(resultat.unAn)}</dd>
              <dt className="opacity-80">Par mois, sur 3 ans</dt>
              <dd className="font-semibold">{formatEuros.format(resultat.parMoisSurTroisAns)}</dd>
              <dt className="opacity-80">Consommables par mois</dt>
              <dd className="font-semibold">{formatEuros.format(resultat.parMoisConsommables)}</dd>
            </dl>
            <Formule>
              Calcul&nbsp;: {formatEuros.format(appareil)} + {formatEuros.format(resultat.parMoisConsommables)} × 12 mois
              (1 an) ou × 36 mois (3 ans). Par mois&nbsp;: le coût sur 3 ans divisé par 36.
            </Formule>
          </>
        ) : (
          <p className="font-display text-[1.75rem] leading-tight">
            Saisissez le prix de l&apos;appareil et de ses consommables pour voir ce qu&apos;il coûte vraiment.
          </p>
        )
      }
    />
  );
}
