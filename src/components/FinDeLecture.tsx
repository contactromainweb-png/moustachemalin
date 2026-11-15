"use client";

import { useEffect, useRef } from "react";

// Mesure « fin de lecture » (pack 8a) : placé à la fin du corps d'un article, juste avant le formulaire de la lettre.
// Quand ce repère entre à l'écran, envoie une seule fois par page l'événement Umami `fin-de-lecture`, avec la page et
// le type d'article (attribut data-type-article de l'<article>, posé par ArticleTemplate). Rien d'autre : ni prénom,
// ni profil, ni temps passé. Sans Umami, sans IntersectionObserver ou hors d'un article, rien ne se passe.
// Listé sur /confidentialite/ (SectionsConfidentialite.tsx).
type Fenetre = Window & { umami?: { track: (nom: string, donnees: Record<string, string>) => void } };

const dejaEnvoye = new Set<string>();

export function FinDeLecture() {
  const repere = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = repere.current;
    const type = el?.closest<HTMLElement>("[data-type-article]")?.dataset.typeArticle;
    if (!el || !type || typeof IntersectionObserver === "undefined") return;
    const page = window.location.pathname;
    if (dejaEnvoye.has(page)) return;
    const observateur = new IntersectionObserver((entrees) => {
      // À l'écran, ou déjà dépassé (défilement rapide qui saute par-dessus le repère).
      const atteint = entrees.some((e) => e.isIntersecting || e.boundingClientRect.top < 0);
      if (!atteint || dejaEnvoye.has(page)) return;
      const umami = (window as Fenetre).umami;
      // Umami se charge tard (lazyOnload) : sans lui, on n'envoie rien et on continue d'observer.
      if (!umami) return;
      dejaEnvoye.add(page);
      umami.track("fin-de-lecture", { page, type });
      observateur.disconnect();
    });
    observateur.observe(el);
    return () => observateur.disconnect();
  }, []);

  return <div ref={repere} aria-hidden="true" className="h-px" />;
}
