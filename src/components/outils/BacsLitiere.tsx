"use client";

import { useState } from "react";
import { visiteurAInteragi } from "@/components/outils/NombreAnime";

// Petits bacs dessinés sous le résultat de « Combien de litières » (pack 9) : autant que le résultat, 8 dessinés au
// plus (au-delà : 7 bacs, « + N », puis le bac orange). Le dernier, « le + 1 », est orange. Illustration générique
// (un bac ouvert et quelques grains, aucune forme de produit réel), cachée aux lecteurs d'écran : le chiffre et la
// phrase disent déjà tout. Un bac ajouté arrive (fondu + montée de 6 px, 200 ms, globals.css .bac-arrive) ; celui qui
// part disparaît sans animation. Rien au premier affichage ni avec « animations réduites ».
const MAX_DESSINES = 8;

function Bac({ orange, arrive }: { orange: boolean; arrive: boolean }) {
  return (
    <svg
      viewBox="0 0 28 18"
      width="28"
      height="18"
      className={`${orange ? "text-accent-nuit" : ""} ${arrive ? "bac-arrive" : ""}`}
    >
      <path
        d="M2.5 4.5 L4.5 14.5 Q5 16.5 7 16.5 L21 16.5 Q23 16.5 23.5 14.5 L25.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g fill="currentColor">
        <circle cx="9" cy="10" r="1.1" />
        <circle cx="13.5" cy="8.5" r="1.1" />
        <circle cx="18" cy="10.5" r="1.1" />
        <circle cx="11.5" cy="12.5" r="1.1" />
        <circle cx="16" cy="13" r="1.1" />
      </g>
    </svg>
  );
}

export function BacsLitiere({ nombre }: { nombre: number }) {
  // Valeur précédente gardée en état (ajustement pendant le rendu, comme le recommande React).
  const [precedent, setPrecedent] = useState(nombre);
  const [ajout, setAjout] = useState(false);
  if (nombre !== precedent) {
    setPrecedent(nombre);
    setAjout(visiteurAInteragi() && nombre > precedent);
  }

  const debordement = nombre > MAX_DESSINES;
  // Le bac ajouté, c'est le bac orange (toujours dernier, nouvelle clé à chaque nombre) : il arrive seulement si le
  // nombre augmente après une action du visiteur.
  const cremes = debordement ? MAX_DESSINES - 1 : nombre - 1;

  return (
    <div aria-hidden="true" className="mt-5">
      <div className="flex flex-wrap items-center gap-2">
        {Array.from({ length: cremes }, (_, i) => (
          <Bac key={`c${i}`} orange={false} arrive={false} />
        ))}
        {debordement ? <span className="px-1 text-small font-semibold tabular-nums">+ {nombre - MAX_DESSINES}</span> : null}
        <Bac key={`o${nombre}`} orange arrive={ajout} />
      </div>
      <p className="mt-2 text-small text-accent-nuit">Le bac en plus</p>
    </div>
  );
}
