"use client";

import { useEffect, useRef, useState } from "react";
import { formatNombre } from "@/components/outils/Cadre";

// Grand chiffre d'un outil qui défile de l'ancienne valeur à la nouvelle (pack 9) : 350 ms, courbe ease-out, à chaque
// changement de résultat. Rien au premier affichage (pas de « 0 → 120 » à l'ouverture), rien avec « animations
// réduites », rien si l'une des deux valeurs n'est pas un nombre.
// Lecteurs d'écran : les chiffres qui défilent sont cachés (aria-hidden) et la valeur finale est dans un texte
// sr-only : le panneau aria-live du Cadre n'annonce que la valeur finale, une fois.
// Largeur : une copie invisible de la valeur finale réserve sa place (le texte autour ne saute pas) ; les valeurs
// intermédiaires gardent le nombre de décimales de la valeur finale.
const DUREE = 350;

// Les outils ne s'animent qu'en réponse au visiteur : tant qu'il n'a rien touché (clavier, souris, doigt), un
// changement de valeur (par exemple la valeur du carnet reprise juste après le chargement) s'affiche directement.
let interaction = false;
if (typeof window !== "undefined") {
  const marquer = () => {
    interaction = true;
  };
  for (const evt of ["pointerdown", "keydown"]) window.addEventListener(evt, marquer, { once: true, capture: true });
}
export const visiteurAInteragi = () => interaction;
const easeOut = (t: number) => 1 - (1 - t) ** 3;

function decimales(n: number) {
  if (!Number.isFinite(n) || Number.isInteger(n)) return 0;
  const texte = String(n);
  const i = texte.indexOf(".");
  return i < 0 ? 0 : Math.min(2, texte.length - i - 1);
}

export function NombreAnime({ valeur, format = formatNombre.format }: { valeur: number; format?: (n: number) => string }) {
  const [affiche, setAffiche] = useState(valeur);
  const courant = useRef(valeur);
  const premier = useRef(true);

  useEffect(() => {
    if (premier.current) {
      premier.current = false;
      return;
    }
    const depart = courant.current;
    const direct = () => {
      courant.current = valeur;
      setAffiche(valeur);
    };
    if (
      !Number.isFinite(depart) ||
      !Number.isFinite(valeur) ||
      depart === valeur ||
      !interaction ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      direct();
      return;
    }
    const pas = 10 ** decimales(valeur);
    const debut = performance.now();
    let image = 0;
    const tour = (maintenant: number) => {
      const t = Math.min(1, (maintenant - debut) / DUREE);
      const v = t === 1 ? valeur : Math.round((depart + (valeur - depart) * easeOut(t)) * pas) / pas;
      courant.current = v;
      setAffiche(v);
      if (t < 1) image = requestAnimationFrame(tour);
    };
    image = requestAnimationFrame(tour);
    return () => cancelAnimationFrame(image);
  }, [valeur]);

  const final = format(valeur);
  return (
    <>
      <span aria-hidden="true" className="inline-grid">
        <span className="invisible col-start-1 row-start-1">{final}</span>
        <span className="col-start-1 row-start-1">{format(affiche)}</span>
      </span>
      <span className="sr-only">{final}</span>
    </>
  );
}
