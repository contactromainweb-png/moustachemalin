"use client";

import Link from "next/link";
import { useState } from "react";
import { useProfil } from "@/lib/profil";

// Ligne « carnet » sous le résultat d'un calculateur (pack 8b), dans un emplacement de hauteur réservée.
// Sans pronom (les calculateurs restent au vouvoiement) :
// - `repris` : la valeur affichée vient du carnet ou du profil → « Repris du profil de Mochi » (simple information) ;
// - `retenu` faux (valeur différente de celle retenue, ou rien de retenu) → bouton « Retenir pour Mochi » ;
// - après le clic → « Retenu dans le carnet de Mochi » + « Voir le carnet ».
// Sans profil, rien ne s'affiche : le calculateur marche comme avant.
export function RetenirCarnet({
  repris,
  retenu,
  possible = true,
  onRetenir,
}: {
  repris: boolean;
  retenu: boolean;
  possible?: boolean; // false = rien à retenir pour l'instant (champs vides)
  onRetenir: () => void;
}) {
  const profil = useProfil();
  const [vientDeRetenir, setVientDeRetenir] = useState(false);
  const lien = "font-medium underline decoration-2 underline-offset-4";

  let contenu = null;
  if (profil) {
    const prenom = profil.prenom;
    if (retenu && (vientDeRetenir || !repris)) {
      contenu = (
        <>
          <span>Retenu dans le carnet de {prenom}</span>
          <span aria-hidden="true">·</span>
          <Link href="/carnet/" className={`flex min-h-11 items-center ${lien}`}>
            Voir le carnet
          </Link>
        </>
      );
    } else {
      contenu = (
        <>
          {repris ? <span>Repris du profil de {prenom}</span> : null}
          {repris && !retenu && possible ? <span aria-hidden="true">·</span> : null}
          {!retenu && possible ? (
            <button
              type="button"
              onClick={() => {
                onRetenir();
                setVientDeRetenir(true);
              }}
              className={`min-h-11 ${lien}`}
            >
              Retenir pour {prenom}
            </button>
          ) : null}
        </>
      );
    }
  }

  return (
    <div aria-live="polite" className="mt-4 flex min-h-11 flex-wrap items-center gap-x-2 text-small">
      {contenu}
    </div>
  );
}
