"use client";

import { useEffect } from "react";
import { apresAffichage, estOrdinateur, peutAnimer } from "@/lib/capacites";

// Défilement fluide (Lenis) et mouvements liés au défilement (GSAP ScrollTrigger), sur ordinateur seulement.
// Chargés une fois la page chargée et au repos : ils n'entrent jamais dans le premier affichage.
// Sans eux, tout est déjà à sa place : ils ne font qu'ajouter le mouvement.
export function Mouvement() {
  useEffect(() => {
    if (!peutAnimer() || !estOrdinateur()) return;
    let nettoyer = () => {};
    let annule = false;

    const demarrer = async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (annule) return;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({ anchors: true, autoRaf: false });
      const tic = (temps: number) => lenis.raf(temps * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tic);
      gsap.ticker.lagSmoothing(0);
      (window as Window & { mmLenis?: unknown }).mmLenis = lenis;

      const ctx = gsap.context(() => {
        // Premier écran : la vidéo se rapproche doucement quand on quitte l'écran.
        gsap.to("[data-hero-media]", {
          scale: 1.08,
          ease: "none",
          scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true },
        });
        // Chaque carte arrive depuis la colonne précédente : elle avance d'une colonne par objet.
        // La première est déjà dans la première colonne : elle monte sur place, pour ne jamais sortir de l'écran.
        gsap.utils.toArray<HTMLElement>("[data-carte]").forEach((carte, i) => {
          gsap.fromTo(
            carte,
            i === 0 ? { y: 64 } : { xPercent: -100 },
            {
              ...(i === 0 ? { y: 0 } : { xPercent: 0 }),
              ease: "none",
              scrollTrigger: { trigger: carte.parentElement, start: "top bottom", end: "top 25%", scrub: 0.6 },
            },
          );
        });
      });

      nettoyer = () => {
        ctx.revert();
        gsap.ticker.remove(tic);
        lenis.destroy();
        delete (window as Window & { mmLenis?: unknown }).mmLenis;
      };
    };

    const annulerAttente = apresAffichage(() => void demarrer());

    return () => {
      annule = true;
      annulerAttente();
      nettoyer();
    };
  }, []);

  return null;
}
