"use client";

import { useEffect, useRef, useState } from "react";
import { apresAffichage, estOrdinateur, peutAnimer } from "@/lib/capacites";

// Vidéo du premier écran, ajoutée seulement sur ordinateur, une fois la page chargée : l'image fixe
// en dessous reste le premier élément affiché. Muette, en boucle ; plus on fait défiler la page,
// plus le chat accélère (vitesse de lecture, jamais de saut dans la vidéo).
// Version 1920 px seulement si la vidéo s'affiche sur plus de 1400 pixels réels (grand écran ou écran dense).
export function HeroVideo({ src, srcLarge }: { src: string; srcLarge: string }) {
  const [source, setSource] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!peutAnimer() || !estOrdinateur()) return;
    return apresAffichage(() => {
      // La vidéo occupe 10 colonnes sur 12.
      const largeur = window.innerWidth * (10 / 12) * window.devicePixelRatio;
      setSource(largeur > 1400 ? srcLarge : src);
    });
  }, [src, srcLarge]);

  useEffect(() => {
    const video = ref.current;
    if (!source || !video) return;

    let vitesse = 1;
    let dernierY = window.scrollY;
    let dernierT = performance.now();
    let cible = 1;
    let raf = 0;

    const auScroll = () => {
      const t = performance.now();
      const v = Math.abs(window.scrollY - dernierY) / Math.max(t - dernierT, 16); // pixels par milliseconde
      dernierY = window.scrollY;
      dernierT = t;
      cible = Math.max(cible, Math.min(1 + v * 3, 3));
    };
    const boucle = () => {
      cible += (1 - cible) * 0.03; // revient doucement à la vitesse normale
      vitesse += (cible - vitesse) * 0.2;
      if (Math.abs(video.playbackRate - vitesse) > 0.02) video.playbackRate = vitesse;
      raf = requestAnimationFrame(boucle);
    };

    // La boucle ne tourne que quand la vidéo est à l'écran.
    const obs = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) {
        video.play().catch(() => {});
        raf = requestAnimationFrame(boucle);
      } else video.pause();
    });
    obs.observe(video);
    window.addEventListener("scroll", auScroll, { passive: true });
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", auScroll);
    };
  }, [source]);

  if (!source) return null;
  return (
    <video
      ref={ref}
      src={source}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-hidden="true"
      onPlaying={() => setVisible(true)}
      className={`absolute inset-0 h-full w-full object-cover object-[70%_50%] transition-opacity duration-700 ease-out ${visible ? "opacity-100" : "opacity-0"}`}
    />
  );
}
