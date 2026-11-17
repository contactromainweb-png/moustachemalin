"use client";

import { useId, useState } from "react";
import { BacsLitiere } from "@/components/outils/BacsLitiere";
import { Cadre, Chiffre, Formule } from "@/components/outils/Cadre";
import { NombreAnime } from "@/components/outils/NombreAnime";
import { RetenirCarnet } from "@/components/outils/RetenirCarnet";
import { majCarnet, useCarnet } from "@/lib/carnet";
import { nombreDeLitieres } from "@/lib/outils-calculs";
import { useProfil } from "@/lib/profil";

// Calculateur « Combien de litières pour mes chats ? » : un bac par chat, plus un (src/lib/outils-calculs.ts).
// Le nombre de chats se règle avec deux gros boutons (moins, plus) ; sans JavaScript, la page affiche 1 chat, 2 bacs.
// Carnet (pack 8b) : valeur de départ = nombre retenu dans le carnet, sinon 2 si le profil dit « Ils sont plusieurs »,
// sinon 1 (appliquée après l'hydratation : au rendu serveur, carnet et profil valent null).
const MAX = 10;

export function CalculLitieres() {
  const id = useId();
  const carnet = useCarnet();
  const profil = useProfil();
  const [saisie, setSaisie] = useState<number | null>(null);
  const retenu = carnet?.outils.chats;
  // carnet non nul = il y a un profil (voir src/lib/carnet.ts)
  const depuisProfil = !!carnet && (retenu !== undefined || profil?.nbChats === "plusieurs");
  const depart = retenu ?? (depuisProfil ? 2 : 1);
  const chats = saisie ?? depart;
  const setChats = (f: (c: number) => number) => setSaisie(f(chats));
  const bacs = nombreDeLitieres(chats) ?? 2;
  const bouton =
    "flex size-12 items-center justify-center rounded-full border-2 border-ink/25 bg-paper text-[1.75rem] leading-none transition-colors duration-150 hover:border-ink disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <Cadre
      id={id}
      titre="Votre foyer"
      champs={
        <div>
          <p id={`${id}-label`} className="font-medium">
            Nombre de chats
          </p>
          <div role="group" aria-labelledby={`${id}-label`} className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
            <button
              type="button"
              aria-label="Un chat de moins"
              disabled={chats <= 1}
              onClick={() => setChats((c) => Math.max(1, c - 1))}
              className={bouton}
            >
              −
            </button>
            <output aria-live="off" className="min-w-[3ch] text-center font-display text-[2.5rem] tabular-nums">
              {chats}
            </output>
            <button
              type="button"
              aria-label="Un chat de plus"
              disabled={chats >= MAX}
              onClick={() => setChats((c) => Math.min(MAX, c + 1))}
              className={bouton}
            >
              +
            </button>
          </div>
        </div>
      }
      resultat={
        <>
          <Chiffre intitule="Bacs à litière conseillés">
            <NombreAnime valeur={bacs} />
          </Chiffre>
          <BacsLitiere nombre={bacs} />
          <p className="mt-4">
            Pour {chats} chat{chats > 1 ? "s" : ""}, prévoyez {bacs} bacs, placés dans des endroits différents.
          </p>
          <Formule>
            Règle&nbsp;: un bac par chat, plus un, soit {chats} + 1 = {bacs}.
          </Formule>
          <RetenirCarnet
            repris={saisie === null && depuisProfil}
            retenu={retenu === chats}
            onRetenir={() => majCarnet((c) => ({ ...c, outils: { ...c.outils, chats } }))}
          />
        </>
      }
    />
  );
}
