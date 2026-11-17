"use client";

import { useId, useState } from "react";
import { CHAMP, Cadre, Chiffre, Formule, formatNombre, nombre } from "@/components/outils/Cadre";
import { NombreAnime } from "@/components/outils/NombreAnime";
import { RetenirCarnet } from "@/components/outils/RetenirCarnet";
import { majCarnet, useCarnet, type OutilsRetenus } from "@/lib/carnet";
import { GRAMMES_PAR_LITRE, autonomieDistributeur } from "@/lib/outils-calculs";

// Calculateur « Combien de jours tient un distributeur de croquettes ? » (calcul : src/lib/outils-calculs.ts).
// La contenance se saisit, ou se remplit en choisissant un des distributeurs de notre comparatif (liste lue dans
// content/products/ par AutonomieDistributeur). Aucune ration proposée : c'est au paquet ou au vétérinaire de la donner.
// Carnet (pack 8b) : modèle, contenance et ration retenus servent de valeurs de départ (après l'hydratation), sinon vide.
export type Distributeur = { asin: string; nom: string; litres: number };

export function CalculAutonomie({ distributeurs }: { distributeurs: Distributeur[] }) {
  const id = useId();
  const carnet = useCarnet();
  const retenu = carnet?.outils;
  const modeleRetenu = retenu?.modele && distributeurs.some((d) => d.asin === retenu.modele) ? retenu.modele : "";
  const [saisie, setSaisie] = useState<{
    modele: string;
    litres: string;
    ration: string;
  } | null>(null);
  const valeurs = saisie ?? {
    modele: modeleRetenu,
    litres: retenu?.contenance ?? "",
    ration: retenu?.ration ?? "",
  };
  const { modele, litres, ration } = valeurs;
  const setModele = (v: string) => setSaisie((s) => ({ ...(s ?? valeurs), modele: v }));
  const setLitres = (v: string) => setSaisie((s) => ({ ...(s ?? valeurs), litres: v }));
  const setRation = (v: string) => setSaisie((s) => ({ ...(s ?? valeurs), ration: v }));
  const aRetenir: OutilsRetenus = {
    ...(modele ? { modele } : {}),
    ...(litres.trim() ? { contenance: litres.trim() } : {}),
    ...(ration.trim() ? { ration: ration.trim() } : {}),
  };
  const dejaRetenu =
    (retenu?.modele ?? "") === (aRetenir.modele ?? "") &&
    (retenu?.contenance ?? "") === (aRetenir.contenance ?? "") &&
    (retenu?.ration ?? "") === (aRetenir.ration ?? "");
  const intact = saisie === null && !!(retenu?.modele || retenu?.contenance || retenu?.ration);

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
                maxLength={10}
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
                maxLength={10}
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
        <>
          {resultat ? (
            <>
              <Chiffre intitule="Le réservoir tient environ">
                {resultat.jours.min === resultat.jours.max ? (
                  <>
                    <NombreAnime valeur={resultat.jours.max} /> jour{resultat.jours.max > 1 ? "s" : ""}
                  </>
                ) : (
                  <>
                    <NombreAnime valeur={resultat.jours.min} /> à <NombreAnime valeur={resultat.jours.max} /> jours
                  </>
                )}
              </Chiffre>
              <p className="mt-4">
                Avec un réservoir plein, soit environ {formatNombre.format(resultat.grammes.min)} à{" "}
                {formatNombre.format(resultat.grammes.max)} g de croquettes.
              </p>
              <Formule>
                Calcul&nbsp;: {formatNombre.format(l)} L × {GRAMMES_PAR_LITRE.min} à {GRAMMES_PAR_LITRE.max} g par litre
                = {formatNombre.format(resultat.grammes.min)} à {formatNombre.format(resultat.grammes.max)} g, divisé
                par {formatNombre.format(g)} g par jour.
              </Formule>
            </>
          ) : (
            <p className="font-display text-[1.75rem] leading-tight">
              Indiquez la contenance et la ration pour voir combien de jours il tient.
            </p>
          )}
          <RetenirCarnet
            repris={intact}
            retenu={dejaRetenu}
            possible={Object.keys(aRetenir).length > 0}
            onRetenir={() =>
              majCarnet((c) => {
                const autres = { ...c.outils };
                delete autres.modele;
                delete autres.contenance;
                delete autres.ration;
                return { ...c, outils: { ...autres, ...aRetenir } };
              })
            }
          />
        </>
      }
    />
  );
}
