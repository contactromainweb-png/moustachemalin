"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { BulleKira } from "@/components/BulleKira";
import { KiraDessin } from "@/components/KiraDessin";
import { TexteBulleJeu } from "@/components/TexteBulleJeu";
import { DEPART_JEU_BALLE, SEUIL_TOUT_PRES, texteApresLancer } from "@/lib/jeu-balle";
import { espacesFines } from "@/lib/typo";

// Mini-jeu « Kira rapporte la balle » (pack 9), sur la page 404 et la page de la bande. Vrai fait : Kira rapporte
// ses jouets aux pieds de Romain (CLAUDE.md § 11). Chargé après la page (JeuBalleDiffere), rien n'est enregistré :
// le compteur repart de 0 à chaque visite. Tutoiement, comme les quiz.
// Un lancer (environ 1,8 s) : la balle part en arc, Kira se tourne vers elle (le dessin est de face, queue à droite :
// on la retourne quand elle court vers la droite, pour que la queue suive), court en sautillant, prend la balle sous
// son menton, revient, la pose devant elle et cligne de l'œil. Uniquement des transform (Web Animations).
// Animations réduites : rien ne bouge, un clic compte la balle, change la bulle et fait cligner Kira.


const BALLE = 22;
const DUREES = { vol: 480, rebond: 160, course: 500, prise: 100, pose: 120 };

export function JeuBalle() {
  const [balles, setBalles] = useState(0);
  const [texte, setTexte] = useState(DEPART_JEU_BALLE);
  const compte = useRef(0);
  const [enCours, setEnCours] = useState(false);
  const occupe = useRef(false);
  const vivant = useRef(true);
  const anims = useRef<Animation[]>([]);
  const terrain = useRef<HTMLDivElement>(null);
  const course = useRef<HTMLDivElement>(null);
  const saut = useRef<HTMLDivElement>(null);
  const sens = useRef<HTMLDivElement>(null);
  const kira = useRef<HTMLDivElement>(null);
  const balleX = useRef<HTMLDivElement>(null);
  const balleY = useRef<HTMLDivElement>(null);
  const bouton = useRef<HTMLButtonElement>(null);
  const rendreFocus = useRef(false);

  // Le bouton désactivé pendant le lancer perd le focus : on le lui rend une fois réactivé (navigation au clavier).
  useEffect(() => {
    if (enCours || !rendreFocus.current) return;
    rendreFocus.current = false;
    bouton.current?.focus();
  }, [enCours]);

  useEffect(() => {
    vivant.current = true;
    return () => {
      vivant.current = false;
      for (const a of anims.current) a.cancel();
      anims.current = [];
    };
  }, []);

  const jouer = (el: HTMLElement, images: Keyframe[], duree: number, easing = "linear") => {
    const a = el.animate(images, { duration: duree, easing, fill: "forwards" });
    anims.current.push(a);
    return a.finished;
  };

  // Une balle de plus, et la bulle réagit (textes : src/lib/jeu-balle.ts).
  const compter = (toutPres = false) => {
    compte.current += 1;
    const n = compte.current;
    setBalles(n);
    setTexte((precedent) => texteApresLancer(n, precedent, toutPres));
  };

  async function lancer(cibleX?: number) {
    if (occupe.current) return;
    const t = terrain.current, k = kira.current, bx = balleX.current, by = balleY.current;
    const c = course.current, s = saut.current, se = sens.current;
    if (!t || !k || !bx || !by || !c || !s || !se) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      compter();
      return;
    }
    occupe.current = true;
    setEnCours(true);
    rendreFocus.current = document.activeElement === bouton.current;

    // Géométrie mesurée au début du lancer (en px, relative au terrain).
    const rt = t.getBoundingClientRect();
    const rk = k.getBoundingClientRect();
    const rb = bx.getBoundingClientRect();
    const departBalle = rb.left - rt.left + BALLE / 2;
    const droiteKira = rk.right - rt.left;
    const min = droiteKira + 4;
    const max = rt.width - BALLE;
    const brut = cibleX ?? rt.width * (0.55 + Math.random() * 0.35);
    const arrivee = Math.min(max, Math.max(min, brut));
    const dx = arrivee - departBalle;
    const hauteur = Math.min(100, rt.height * 0.45);
    // Sous le menton : le haut de la balle à 59 % de la hauteur de Kira (menton du dessin : y = 178 sur 300).
    const menton = rk.top + rk.height * 0.59;
    const leve = Math.max(0, rb.bottom - (menton + BALLE));
    const sauts = (base: number) => [0, 1, 0, 1, 0, 1, 0].map((h) => ({ transform: `translateY(${base - 6 * h}px)` }));

    try {
      // 1. La balle part en arc (horizontale linéaire, verticale en cloche), puis un petit rebond.
      const vol = [
        jouer(bx, [{ transform: "translateX(0)" }, { transform: `translateX(${dx}px)` }], DUREES.vol),
        jouer(
          by,
          [
            { transform: "translateY(0)", easing: "cubic-bezier(0.3, 0.6, 0.5, 1)" },
            { transform: `translateY(${-hauteur}px)`, offset: 0.5, easing: "cubic-bezier(0.5, 0, 0.7, 0.4)" },
            { transform: "translateY(0)" },
          ],
          DUREES.vol,
        ),
      ];
      await Promise.all(vol);
      if (!vivant.current) return;
      // 2. Le rebond, pendant que Kira se tourne et court vers la balle.
      jouer(by, [{ transform: "translateY(0)" }, { transform: "translateY(-10px)", easing: "ease-in" }, { transform: "translateY(0)" }], DUREES.rebond, "ease-out");
      se.style.transform = dx > 0 ? "scaleX(-1)" : "";
      await Promise.all([
        jouer(c, [{ transform: "translateX(0)" }, { transform: `translateX(${dx}px)` }], DUREES.course, "ease-in-out"),
        jouer(s, sauts(0), DUREES.course),
      ]);
      if (!vivant.current) return;
      // 3. Elle prend la balle sous son menton.
      await jouer(by, [{ transform: "translateY(0)" }, { transform: `translateY(${-leve}px)` }], DUREES.prise, "ease-out");
      if (!vivant.current) return;
      // 4. Retour à sa place avec la balle.
      se.style.transform = "";
      await Promise.all([
        jouer(c, [{ transform: `translateX(${dx}px)` }, { transform: "translateX(0)" }], DUREES.course, "ease-in-out"),
        jouer(s, sauts(0), DUREES.course),
        jouer(bx, [{ transform: `translateX(${dx}px)` }, { transform: "translateX(0)" }], DUREES.course, "ease-in-out"),
        jouer(by, sauts(-leve), DUREES.course),
      ]);
      if (!vivant.current) return;
      // Elle la pose devant elle.
      await jouer(by, [{ transform: `translateY(${-leve}px)` }, { transform: "translateY(0)" }], DUREES.pose, "ease-in");
      if (!vivant.current) return;
    } catch {
      // Animation annulée (page quittée) : on s'arrête là.
      return;
    }
    // Tout est revenu à sa place : on retire les animations (positions de départ).
    for (const a of anims.current) a.cancel();
    anims.current = [];
    occupe.current = false;
    setEnCours(false);
    compter(arrivee < rt.width * SEUIL_TOUT_PRES);
  }

  const surTerrain = (e: MouseEvent<HTMLDivElement>) => {
    const t = terrain.current;
    if (!t || occupe.current) return;
    lancer(e.clientX - t.getBoundingClientRect().left);
  };


  return (
    <div className="w-full">
      <BulleKira sansDessin vivante className="mb-5 max-w-[30rem]">
        <TexteBulleJeu texte={texte} />
      </BulleKira>
      <div
        ref={terrain}
        role="group"
        aria-label="Terrain de jeu : lance la balle à Kira"
        onClick={surTerrain}
        className={`relative h-56 w-full touch-manipulation select-none overflow-hidden rounded-[1.5rem] bg-field sm:h-64 ${enCours ? "" : "cursor-pointer"}`}
      >
        {/* Le sol : un simple trait. */}
        <div aria-hidden="true" className="absolute inset-x-5 bottom-7 h-0.5 rounded-full bg-ink/20" />
        <div ref={course} className="absolute bottom-[23px] left-4 sm:bottom-[22px] sm:left-8">
          <div ref={saut}>
            <div ref={sens} className="origin-center">
              <div ref={kira}>
                <KiraDessin taille={96} clinSignal={balles} clinMemeReduit className="block size-[72px] sm:size-24" />
              </div>
            </div>
          </div>
        </div>
        <div ref={balleX} aria-hidden="true" className="absolute bottom-[18px] left-[41px] z-10 sm:left-[69px]">
          <div ref={balleY}>
            <svg viewBox="0 0 22 22" width={BALLE} height={BALLE} className="block">
              <circle cx="11" cy="11" r="10.25" fill="var(--color-accent)" stroke="#14213D" strokeWidth="1.5" />
              <path d="M5 4.5 Q9 11 5 17.5 M17 4.5 Q13 11 17 17.5" fill="none" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-col items-start gap-x-6 gap-y-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          ref={bouton}
          type="button"
          onClick={() => lancer()}
          disabled={enCours}
          aria-disabled={enCours}
          className="inline-flex min-h-12 items-center rounded-full bg-accent px-7 font-semibold text-on-accent transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97] disabled:cursor-wait disabled:opacity-70 motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          Lancer la balle
        </button>
        <p role="status" className="tabular-nums">
          {espacesFines("Balles rapportées : ")}
          <span className="inline-block min-w-[3ch]">{balles}</span>
        </p>
      </div>
    </div>
  );
}
