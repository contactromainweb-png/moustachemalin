"use client";

import { useId, useState } from "react";
import { CHAMP, Cadre, Chiffre, Formule, formatNombre, nombre } from "@/components/outils/Cadre";
import { GRAMMES_PAR_LITRE, autonomieDistributeur } from "@/lib/outils-calculs";

// Calculateur « Combien de jours tient un distributeur de croquettes ? » (calcul : src/lib/outils-calculs.ts).
// La contenance se saisit, ou se remplit en choisissant un des distributeurs de notre comparatif (liste lue dans
// content/products/ par AutonomieDistributeur). Aucune ration proposée : c'est au paquet ou au vétérinaire de la donner.
export type Distributeur = { asin: string; nom: string; litres: number };

export function CalculAutonomie({ distributeurs }: { distributeurs: Distributeur[] }) {
  const id = useId();
  const [modele, setModele] = useState("");
  const [litres, setLitres] = useState("");
  const [ration, setRation] = useState("");

  const choisir = (asin: string) => {
    setModele(asin);
    const d = distributeurs.find((x) => x.asin === asin);
    if (d) setLitres(String(d.litres).replace(".", ","));
  };

  const l = nombre(litres);
  const g = nombre(ration);
  const resultat = autonomieDistributeur(l, g);

  return (
    <Cadre
      id={id}
      titre="Votre distributeur"
      champs={
        <>
          <div>
            <label htmlFor={`${id}-modele`} className="font-medium">
              Un modèle de notre comparatif <span className="font-normal text-ink-soft">(facultatif)</span>
            </label>
            <select
              id={`${id}-modele`}
              value={modele}
              onChange={(e) => choisir(e.target.value)}
              className={`mt-2 ${CHAMP} cursor-pointer text-base`}
            >
              <option value="">Je saisis la contenance moi-même</option>
              {distributeurs.map((d) => (
                <option key={d.asin} value={d.asin}>
                  {d.nom} ({formatNombre.format(d.litres)} L)
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-litres`} className="font-medium">
                Contenance <span className="font-normal text-ink-soft">(litres)</span>
              </label>
              <input
                id={`${id}-litres`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={litres}
                onChange={(e) => {
                  setLitres(e.target.value);
                  setModele("");
                }}
                className={`mt-2 ${CHAMP}`}
              />
            </div>
            <div>
              <label htmlFor={`${id}-ration`} className="font-medium">
                Ration <span className="font-normal text-ink-soft">(grammes par jour)</span>
              </label>
              <input
                id={`${id}-ration`}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={ration}
                onChange={(e) => setRation(e.target.value)}
                className={`mt-2 ${CHAMP}`}
              />
            </div>
          </div>
          <p className="text-small text-ink-soft">
            La bonne ration est celle indiquée sur le paquet ou par votre vétérinaire.
          </p>
        </>
      }
      resultat={
        resultat ? (
          <>
            <Chiffre intitule="Le réservoir tient environ">
              {resultat.jours.min === resultat.jours.max
                ? `${resultat.jours.max} jour${resultat.jours.max > 1 ? "s" : ""}`
                : `${resultat.jours.min} à ${resultat.jours.max} jours`}
            </Chiffre>
            <p className="mt-4">
              Avec un réservoir plein, soit environ {formatNombre.format(resultat.grammes.min)} à{" "}
              {formatNombre.format(resultat.grammes.max)} g de croquettes.
            </p>
            <Formule>
              Calcul&nbsp;: {formatNombre.format(l)} L × {GRAMMES_PAR_LITRE.min} à {GRAMMES_PAR_LITRE.max} g par litre ={" "}
              {formatNombre.format(resultat.grammes.min)} à {formatNombre.format(resultat.grammes.max)} g, divisé par{" "}
              {formatNombre.format(g)} g par jour.
            </Formule>
          </>
        ) : (
          <p className="font-display text-[1.75rem] leading-tight">
            Indiquez la contenance et la ration pour voir combien de jours il tient.
          </p>
        )
      }
    />
  );
}
