"use client";

import { useEffect } from "react";
import { apresAffichage, estOrdinateur, peutAnimer } from "@/lib/capacites";

type Lenis = { scrollTo: (cible: number, options?: { immediate?: boolean }) => void };

// Défilement fluide (Lenis) et mouvements liés au défilement (GSAP ScrollTrigger) de l'accueil.
// Ordinateur et téléphone (épinglages plus courts sur téléphone) ; rien avec « animations réduites »
// ou en économie de données. Chargés une fois la page affichée : sans eux, tout est déjà à sa place.
export function Mouvement() {
  useEffect(() => {
    if (!peutAnimer()) return;
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
      const ordinateur = estOrdinateur();

      const lenis = new Lenis({ anchors: true, autoRaf: false });
      const tic = (temps: number) => lenis.raf(temps * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tic);
      gsap.ticker.lagSmoothing(0);
      (window as Window & { mmLenis?: Lenis }).mmLenis = lenis;

      const section = document.querySelector<HTMLElement>("[data-soucis]");
      const ctx = gsap.context(() => {
        // 1. Premier écran : l'image recule et devient une carte aux coins arrondis, puis la page reprend.
        //    Le titre ne bouge pas : il reste entier à l'écran pendant tout le mouvement.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: "[data-hero]",
              start: "top top",
              end: ordinateur ? "+=60%" : "+=35%",
              pin: true,
              scrub: 0.6,
            },
          })
          .to("[data-hero-media]", {
            scale: ordinateur ? 0.9 : 0.94,
            borderRadius: ordinateur ? 32 : 24,
            ease: "power2.out",
          });

        // 2. Les petits soucis : section épinglée, une étape par écran (un peu plus d'un demi-écran sur téléphone).
        if (!section) return;
        section.setAttribute("data-epingle", "");
        const etapes = gsap.utils.toArray<HTMLElement>("[data-souci]", section);
        const textes = etapes.map((e) => e.querySelectorAll<HTMLElement>("[data-souci-texte], [data-souci-credit]"));
        const cadres = etapes.map((e) => e.querySelector<HTMLElement>("[data-souci-cadre]")!);
        const jauges = gsap.utils.toArray<HTMLElement>("[data-jauge]", section);
        const n = etapes.length;
        // Décalage des textes : petit sur téléphone, où le texte est près du bas de l'écran.
        const entree = ordinateur ? 48 : 20;
        const sortie = ordinateur ? -40 : -20;

        gsap.set(textes.slice(1), { opacity: 0, y: entree });
        gsap.set(cadres.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(cadres.map((c) => c.querySelector("img")).slice(1), { scale: 1.15 });
        gsap.set(jauges[0], { scaleX: 1 });

        const marquerActive = (i: number) => etapes.forEach((e, k) => e.toggleAttribute("data-actif", k === i));
        marquerActive(0);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${(n - 1) * (ordinateur ? 90 : 60)}%`,
            pin: true,
            scrub: 0.6,
            snap: { snapTo: "labels", inertia: false, duration: { min: 0.2, max: 0.6 }, ease: "power2.inOut" },
            onUpdate: (st) => marquerActive(Math.round(st.progress * (n - 1))),
          },
        });
        tl.addLabel("etape0", 0);
        for (let i = 1; i < n; i++) {
          const debut = i - 1;
          // Le texte sortant monte et s'efface, puis le suivant arrive d'en dessous : jamais deux textes ensemble.
          tl.to(textes[i - 1], { opacity: 0, y: sortie, duration: 0.4, ease: "power2.inOut" }, debut)
            .to(textes[i], { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, debut + 0.45)
            // La photo suivante se dévoile par le bas, en reculant légèrement (zoom arrière).
            .to(cadres[i], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.85, ease: "power2.inOut" }, debut)
            .to(cadres[i].querySelector("img"), { scale: 1, duration: 0.95, ease: "power2.out" }, debut)
            .to(jauges[i], { scaleX: 1, duration: 0.85, ease: "power2.inOut" }, debut)
            .addLabel(`etape${i}`, i);
        }

        ScrollTrigger.refresh();

        // Au clavier, un lien d’une étape cachée qui reçoit le focus ramène le défilement à son étape.
        etapes.forEach((e, i) =>
          e.addEventListener("focusin", () => {
            const st = tl.scrollTrigger;
            if (!st || e.hasAttribute("data-actif")) return;
            lenis.scrollTo(st.start + ((st.end - st.start) * i) / (n - 1), { immediate: true });
          }),
        );
      });

      nettoyer = () => {
        ctx.revert();
        section?.removeAttribute("data-epingle");
        gsap.ticker.remove(tic);
        lenis.destroy();
        delete (window as Window & { mmLenis?: Lenis }).mmLenis;
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
