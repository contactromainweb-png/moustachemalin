"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { etatScene } from "@/components/accueil/etat-scene";
import { peut3D } from "@/lib/capacites";

// Three.js n'est téléchargé que si l'appareil peut l'afficher, et seulement quand la vitrine approche.
const Scene3D = dynamic(() => import("@/components/accueil/Scene3D"), { ssr: false });

type Lenis = { scrollTo: (cible: HTMLElement, options?: { offset?: number }) => void };

// Pilote de la scène 3D des chapitres : décide si elle se charge, mesure le défilement
// et, quand la scène est prête, masque les photos de fond (data-3d="on" sur la section).
export function ScenePilote({ ids }: { ids: string[] }) {
  const ancre = useRef<HTMLDivElement>(null);
  const [charger, setCharger] = useState(false);
  const [enMarche, setEnMarche] = useState(false);

  useEffect(() => {
    const section = ancre.current?.parentElement;
    if (!section || !peut3D()) return;

    // Chargement quand la vitrine est à moins d'un écran ; la scène ne tourne que quand elle est visible.
    const proche = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setCharger(true);
          proche.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    const visible = new IntersectionObserver(([e]) => setEnMarche(e.isIntersecting));
    proche.observe(section);
    visible.observe(section);

    // Avancement dans les chapitres : 0 au début de la gamelle, 3 sur l'arbre à chat.
    const mesurer = () => {
      const haut = section.getBoundingClientRect().top;
      etatScene.progres = Math.max(0, Math.min(ids.length - 1, -haut / window.innerHeight));
    };
    mesurer();
    window.addEventListener("scroll", mesurer, { passive: true });
    window.addEventListener("resize", mesurer);
    return () => {
      proche.disconnect();
      visible.disconnect();
      window.removeEventListener("scroll", mesurer);
      window.removeEventListener("resize", mesurer);
      section.removeAttribute("data-scene");
    };
  }, [ids.length]);

  // Un objet touché dans la scène : on descend jusqu'à son chapitre.
  const choisir = useCallback(
    (index: number) => {
      const cible = document.getElementById(ids[index]);
      if (!cible) return;
      const lenis = (window as Window & { mmLenis?: Lenis }).mmLenis;
      if (lenis) lenis.scrollTo(cible);
      else cible.scrollIntoView({ behavior: "smooth" });
    },
    [ids],
  );

  const pret = useCallback(() => {
    const section = ancre.current?.parentElement;
    section?.setAttribute("data-scene", "on");
  }, []);

  return (
    // Calque de la hauteur de la section ; la scène y reste collée en haut de l'écran
    // et s'arrête exactement à la fin du dernier chapitre.
    <div ref={ancre} aria-hidden="true" className={`pointer-events-none absolute inset-0 z-10 ${charger ? "" : "hidden"}`}>
      <div className="sticky top-0 h-svh">
        {charger ? <Scene3D enMarche={enMarche} onChoisir={choisir} onPret={pret} /> : null}
      </div>
    </div>
  );
}
