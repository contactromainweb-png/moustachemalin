"use client";

import type { KeyboardEvent, ReactNode } from "react";

// Rangée de cartes à faire glisser (téléphone et tablette) : le défilement et l'aimantage viennent du CSS (scroll-snap),
// ce composant ajoute seulement les flèches du clavier, aussi quand le focus est sur une carte. Sans JavaScript, la
// rangée reste accessible : elle est focalisable et se fait défiler au doigt ou avec les flèches du navigateur.
export function RangeeCartes({ etiquette, className, children }: { etiquette: string; className: string; children: ReactNode }) {
  const auClavier = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.key !== "ArrowLeft" && e.key !== "ArrowRight") || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const rangee = e.currentTarget;
    const cartes = rangee.querySelectorAll("li");
    if (cartes.length === 0) return;
    e.preventDefault();
    // Une carte à la fois : sa largeur plus l'écart avec la suivante.
    const pas = cartes.length > 1 ? cartes[1].offsetLeft - cartes[0].offsetLeft : cartes[0].offsetWidth;
    const calme = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rangee.scrollBy({ left: e.key === "ArrowRight" ? pas : -pas, behavior: calme ? "auto" : "smooth" });
  };

  return (
    <div role="region" aria-label={etiquette} tabIndex={0} onKeyDown={auClavier} data-apparait className={className}>
      {children}
    </div>
  );
}
