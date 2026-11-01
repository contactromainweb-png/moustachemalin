"use client";

import { useId, useState } from "react";
import { Cadre, Chiffre, Formule } from "@/components/outils/Cadre";
import { nombreDeLitieres } from "@/lib/outils-calculs";

// Calculateur « Combien de litières pour mes chats ? » : un bac par chat, plus un (src/lib/outils-calculs.ts).
// Le nombre de chats se règle avec deux gros boutons (moins, plus) ; sans JavaScript, la page affiche 1 chat, 2 bacs.
const MAX = 10;

export function CalculLitieres() {
  const id = useId();
  const [chats, setChats] = useState(1);
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
          <div role="group" aria-labelledby={`${id}-label`} className="mt-3 flex items-center gap-5">
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
          <Chiffre intitule="Bacs à litière conseillés">{bacs}</Chiffre>
          <p className="mt-4">
            Pour {chats} chat{chats > 1 ? "s" : ""}, prévoyez {bacs} bacs, placés dans des endroits différents.
          </p>
          <Formule>
            Règle&nbsp;: un bac par chat, plus un, soit {chats} + 1 = {bacs}.
          </Formule>
        </>
      }
    />
  );
}
