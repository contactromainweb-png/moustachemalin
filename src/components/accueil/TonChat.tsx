"use client";

import { useEffect, useRef } from "react";
import { CarteProfil } from "@/components/CarteProfil";

// « Ton chat, ton site » (pack de nuit 7) : la carte du profil du chat, juste après le premier écran et le mot de Kira,
// avant la scène bleu nuit. Le bloc n'existe qu'avec JavaScript (data-avec-js) : sans lui, l'accueil reste celui d'avant.
// Quand la carte change de hauteur (profil créé, oublié…), on prévient le défilement animé de l'accueil (GSAP
// ScrollTrigger, Lenis) par un événement « resize », pour que les scènes suivantes se recalent.
export function TonChat() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("ResizeObserver" in window)) return;
    let hauteur = el.offsetHeight;
    const obs = new ResizeObserver(() => {
      if (el.offsetHeight === hauteur) return;
      hauteur = el.offsetHeight;
      window.dispatchEvent(new Event("resize"));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      data-avec-js
      data-fond="page"
      aria-labelledby="titre-ton-chat"
      className="px-4 pb-14 pt-10 sm:px-8 lg:pb-24 lg:pt-16"
    >
      <div className="mx-auto max-w-[90rem]">
        <h2 id="titre-ton-chat" className="font-display mb-6 text-head lg:mb-8">
          Ton chat, <span className="mot-serif">ton site</span>
        </h2>
        <div className="max-w-[44rem] rounded-[1.75rem] bg-kira px-4 py-6 sm:px-8 sm:py-8">
          <CarteProfil />
        </div>
      </div>
    </section>
  );
}
