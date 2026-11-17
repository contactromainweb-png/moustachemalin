"use client";

import { useEffect, useRef, useState } from "react";

// Kira dessinée (fichier d'origine : public/kira/kira-assise.svg), en SVG inline pour pouvoir l'animer.
// C'est une illustration : elle ne remplace jamais les vraies photos de Kira (KiraNote, galerie, page de la bande).
// Clin d'œil de 0,7 s au survol, au clic ou au toucher ; un seul clin automatique par page, quand elle entre à l'écran.
// Queue : léger balancement continu (CSS, globals.css, classe .kira-queue). Avec « animations réduites » : ni
// balancement ni clin automatique ; le clin au clic reste.
let pageDuClinAuto: string | null = null;

// `clinSignal` : chaque nouvelle valeur (non nulle) fait cligner Kira, par exemple à l'affichage du résultat d'un quiz
// (pas avec « animations réduites »). `clinMemeReduit` : le signal répond directement à un clic (mini-jeu de la balle) ;
// comme le clin au clic, il reste alors avec « animations réduites ».
export function KiraDessin({
  taille = 96,
  className = "",
  clinSignal = 0,
  clinMemeReduit = false,
}: {
  taille?: number;
  className?: string;
  clinSignal?: number;
  clinMemeReduit?: boolean;
}) {
  const [clin, setClin] = useState(false);
  const minuteur = useRef<number | undefined>(undefined);
  const ref = useRef<SVGSVGElement>(null);

  const cligner = () => {
    window.clearTimeout(minuteur.current);
    setClin(true);
    minuteur.current = window.setTimeout(() => setClin(false), 700);
  };

  useEffect(() => {
    if (!clinSignal || (!clinMemeReduit && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    window.clearTimeout(minuteur.current);
    minuteur.current = window.setTimeout(() => {
      setClin(true);
      minuteur.current = window.setTimeout(() => setClin(false), 700);
    }, 150);
  }, [clinSignal, clinMemeReduit]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const obs = new IntersectionObserver(
      (entrees) => {
        if (!entrees.some((e) => e.isIntersecting)) return;
        obs.disconnect();
        if (pageDuClinAuto === window.location.pathname) return;
        pageDuClinAuto = window.location.pathname;
        window.clearTimeout(minuteur.current);
        minuteur.current = window.setTimeout(() => {
          setClin(true);
          minuteur.current = window.setTimeout(() => setClin(false), 700);
        }, 400);
      },
      { threshold: 0.6 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      window.clearTimeout(minuteur.current);
    };
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 300 300"
      width={taille}
      height={taille}
      role="img"
      aria-label="Kira, la chatte de Moustache Malin (dessin)"
      className={`kira-dessin shrink-0 ${className}`}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") cligner();
      }}
      onClick={cligner}
    >
      <g stroke="#14213D" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <g className="kira-queue">
          <path d="M190 262 C235 262 262 230 252 185 C246 160 232 150 222 156" fill="none" strokeWidth="27" />
          <path d="M190 262 C235 262 262 230 252 185 C246 160 232 150 222 156" fill="none" stroke="#A9ADB6" strokeWidth="21" />
          <path
            d="M190 262 C235 262 262 230 252 185 C246 160 232 150 222 156"
            fill="none"
            stroke="#6F737D"
            strokeWidth="21"
            strokeDasharray="9 11"
            strokeLinecap="butt"
          />
          <path d="M236 158 C230 152 224 152 220 157" fill="none" stroke="#3E424B" strokeWidth="22" />
        </g>
        <path d="M95 265 C80 205 95 160 150 152 C205 160 220 205 205 265 Z" fill="#EFE6DA" />
        <path d="M190 200 C200 225 200 248 195 262" fill="none" stroke="#DCCFBF" strokeWidth="10" />
        <path d="M120 170 C122 205 135 225 150 228 C165 225 178 205 180 170 C165 162 135 162 120 170 Z" fill="#FFFFFF" stroke="none" />
        <ellipse cx="125" cy="266" rx="20" ry="11" fill="#FFFFFF" />
        <ellipse cx="175" cy="266" rx="20" ry="11" fill="#FFFFFF" />
        <path d="M120 262 L120 270 M130 262 L130 271 M170 262 L170 271 M180 262 L180 270" strokeWidth="2" />
        <path d="M74 88 L58 4 L128 52 Z" fill="#8C909A" />
        <path d="M226 88 L242 4 L172 52 Z" fill="#8C909A" />
        <path d="M82 76 L71 24 L114 54 Z" fill="#F2C4C8" stroke="none" />
        <path d="M218 76 L229 24 L186 54 Z" fill="#F2C4C8" stroke="none" />
        <path d="M150 46 C95 46 66 80 68 115 C70 155 105 178 150 178 C195 178 230 155 232 115 C234 80 205 46 150 46 Z" fill="#D4D6DC" />
        <path d="M150 112 C122 112 98 128 98 148 C100 166 124 176 150 176 C176 176 200 166 202 148 C202 128 178 112 150 112 Z" fill="#FFFFFF" stroke="none" />
        <path d="M138 54 L141 78 M150 50 L150 76 M162 54 L159 78 M126 60 L132 80 M174 60 L168 80" stroke="#7B808A" strokeWidth="3.5" />
        <path d="M72 104 L92 108 M70 118 L91 118 M228 104 L208 108 M230 118 L209 118" stroke="#7B808A" strokeWidth="3.5" />
        <g className="kira-oeil-g">
          <ellipse cx="118" cy="104" rx="17" ry="19" fill="#6FB6F0" />
          <ellipse cx="119" cy="107" rx="6" ry="11" fill="#14213D" stroke="none" />
          <circle cx="112" cy="97" r="5" fill="#FFFFFF" stroke="none" />
          <circle cx="124" cy="114" r="2.2" fill="#FFFFFF" stroke="none" />
        </g>
        <g className="kira-oeil-d" style={clin ? { display: "none" } : undefined}>
          <ellipse cx="182" cy="104" rx="17" ry="19" fill="#6FB6F0" />
          <ellipse cx="181" cy="107" rx="6" ry="11" fill="#14213D" stroke="none" />
          <circle cx="176" cy="97" r="5" fill="#FFFFFF" stroke="none" />
          <circle cx="188" cy="114" r="2.2" fill="#FFFFFF" stroke="none" />
        </g>
        <path
          className="kira-clin"
          d="M166 106 Q182 94 198 106"
          fill="none"
          strokeWidth="4"
          style={clin ? undefined : { display: "none" }}
        />
        <path d="M142 132 L158 132 L150 141 Z" fill="#F4A9B4" />
        <path d="M150 141 Q143 151 135 147 M150 141 Q157 151 165 147" fill="none" strokeWidth="2.5" />
        <path
          d="M118 140 L72 132 M118 146 L70 148 M120 152 L76 162 M182 140 L228 132 M182 146 L230 148 M180 152 L224 162"
          stroke="#9AA0AA"
          strokeWidth="2"
        />
        <ellipse cx="104" cy="132" rx="9" ry="5" fill="#F7C9CF" stroke="none" opacity="0.7" />
        <ellipse cx="196" cy="132" rx="9" ry="5" fill="#F7C9CF" stroke="none" opacity="0.7" />
      </g>
    </svg>
  );
}
