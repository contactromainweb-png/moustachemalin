"use client";

import { useLayoutEffect } from "react";
import { apresAffichage, estOrdinateur, peutAnimer } from "@/lib/capacites";
import { fin, pelote } from "./scenes";

type Lenis = { scrollTo: (cible: number, options?: { immediate?: boolean }) => void };

// Mouvements de l'accueil ; rien avec « animations réduites » ou en économie de données.
// Ordinateur à souris (≥ 1024 px) : défilement fluide (Lenis), premier écran épinglé et particules liées au défilement
// (GSAP ScrollTrigger), chargés une fois la page affichée ; sans eux, tout est déjà à sa place. Seul le premier écran
// retient le défilement. Petits soucis, pelote et mur défilent normalement et apparaissent une seule fois (voir apparitions).
// Téléphone, tablette, écran tactile : défilement natif, aucune section bloquée, ni Lenis ni GSAP. Chaque bloc
// apparaît une seule fois en arrivant à l'écran et le compteur monte quand il apparaît (voir apparitions).
// Aucun aimantage (snap) : la page ne bouge jamais d'elle-même, seul le visiteur fait défiler.
// Changement de page : tout est défait dans le nettoyage d'un effet de mise en page (useLayoutEffect), qui s'exécute
// pendant la mise à jour du DOM et non après. Mouvement est placé en tête de l'accueil : React le démonte avant les
// sections, donc l'épinglage est retiré (pin-spacer défait) avant que React ne retire ces sections.
// L'élément épinglé est en plus l'unique enfant d'un conteneur dédié (voir HeroAccueil).
export function Mouvement() {
  useLayoutEffect(() => {
    if (!peutAnimer()) return;
    if (!estOrdinateur()) return apparitions("partout");
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
      const finitions: (() => void)[] = [];

      const lenis = new Lenis({ anchors: true, autoRaf: false });
      const tic = (temps: number) => lenis.raf(temps * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tic);
      gsap.ticker.lagSmoothing(0);
      (window as Window & { mmLenis?: Lenis }).mmLenis = lenis;

      // Tout ce que GSAP crée ici (tweens, timelines, ScrollTrigger, épinglages) est enregistré dans ce contexte,
      // limité à <main>, et défait d'un coup par ctx.revert().
      const ctx = gsap.context(() => {
        heros(gsap);
        finitions.push(desintegration(gsap));
        finitions.push(pelote(), fin(gsap), apparitions("ordinateur"));
        ScrollTrigger.refresh();
      }, document.querySelector("main") ?? undefined);

      nettoyer = () => {
        // L'épinglage d'abord : l'élément revient à sa place dans le DOM que React connaît.
        ctx.revert();
        finitions.forEach((f) => f());
        ScrollTrigger.getAll().forEach((t) => t.kill());
        gsap.ticker.remove(tic);
        gsap.ticker.lagSmoothing(500, 33);
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

// Fondu et léger glissement de chaque bloc à son entrée dans l'écran, une seule fois (transition CSS, voir
// [data-apparitions] dans globals.css), puis le compteur du mur qui monte jusqu'au vrai chiffre.
// « partout » (téléphone, tablette) : tous les blocs de la page.
// « ordinateur » : seulement les petits soucis, la pelote et le mur ; les autres blocs gardent leur entrée en CSS (.reveal).
function apparitions(portee: "partout" | "ordinateur") {
  const blocs = Array.from(
    document.querySelectorAll<HTMLElement>(
      portee === "partout"
        ? "main [data-apparait], main .reveal"
        : "main :is([data-soucis], [data-pelote], [data-mur]) [data-apparait]",
    ),
  );
  const compteur = document.querySelector<HTMLElement>("[data-mur-compteur]");
  const total = Number(compteur?.textContent) || 0;
  const hauteur = window.innerHeight;
  const dejaVisible = (el: HTMLElement) => el.getBoundingClientRect().top < hauteur;
  let animation = 0;

  // Ce qui est déjà à l'écran reste tel quel ; le reste attend son tour.
  blocs.forEach((el) => {
    el.setAttribute("data-apparait", "");
    if (dejaVisible(el)) el.setAttribute("data-vu", "");
  });
  document.documentElement.setAttribute("data-apparitions", portee);

  const observateur = new IntersectionObserver(
    (entrees) => {
      for (const e of entrees) {
        if (!e.isIntersecting) continue;
        e.target.setAttribute("data-vu", "");
        observateur.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  blocs.filter((el) => !el.hasAttribute("data-vu")).forEach((el) => observateur.observe(el));

  // Compteur : 0 tant qu'il n'est pas arrivé, puis il monte en 1,2 s (ralenti à la fin). Sur ordinateur, où le chiffre
  // est immense, il part de la première valeur à autant de chiffres (10 pour 36) : sa largeur ne change pas, rien ne bouge.
  const depart = portee === "ordinateur" ? 10 ** (String(total).length - 1) : 0;
  let observateurCompteur: IntersectionObserver | null = null;
  if (compteur && total > 0 && !dejaVisible(compteur)) {
    compteur.textContent = String(depart);
    observateurCompteur = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        observateurCompteur?.disconnect();
        const debut = performance.now();
        const pas = (t: number) => {
          const p = Math.min(1, (t - debut) / 1200);
          compteur.textContent = String(Math.round(depart + (total - depart) * (1 - (1 - p) ** 3)));
          if (p < 1) animation = requestAnimationFrame(pas);
        };
        animation = requestAnimationFrame(pas);
      },
      { threshold: 0.6 },
    );
    observateurCompteur.observe(compteur);
  }

  return () => {
    observateur.disconnect();
    observateurCompteur?.disconnect();
    cancelAnimationFrame(animation);
    if (compteur) compteur.textContent = String(total);
    document.documentElement.removeAttribute("data-apparitions");
  };
}

type Gsap = typeof import("gsap").gsap;

// Scène 1: du très gros plan au chat entier, puis l'image recule en carte aux coins arrondis.
// Le titre ne bouge pas : il reste entier à l'écran pendant tout le mouvement.
function heros(gsap: Gsap) {
  // Le gros plan de départ vient du CSS (propriété scale, réglée pour ne jamais dépasser la définition de la
  // photo) : GSAP le reprend en transform pour le défaire.
  const zoom = document.querySelector<HTMLElement>("[data-hero-zoom]");
  if (!zoom) return;
  const depart = parseFloat(getComputedStyle(zoom).scale) || 1;
  zoom.style.scale = "none";
  gsap.set(zoom, { scale: depart });
  gsap
    .timeline({
      scrollTrigger: {
        trigger: "[data-hero]",
        start: "top top",
        end: "+=90%",
        pin: true,
        scrub: 0.6,
      },
    })
    .to("[data-hero-zoom]", { scale: 1, ease: "power1.inOut", duration: 0.65 }, 0)
    .to(
      "[data-hero-media]",
      { scale: 0.9, borderRadius: 32, ease: "power2.inOut", duration: 0.35 },
      0.65,
    );
}

// Scène 2 : la phrase s'écrit mot par mot en sortant d'un flou, pendant que la photo se désintègre en particules
// et se reforme en une autre. Rien n'est épinglé : l'effet suit le défilement sur 1 écran exactement, à partir du moment
// où le haut de la section arrive aux trois quarts de l'écran. Le WebGL n'est préparé qu'à l'approche de la section.
function desintegration(gsap: Gsap) {
  const scene = document.querySelector<HTMLElement>("[data-desint-scene]");
  if (!scene) return () => {};
  const cadre = scene.querySelector<HTMLElement>("[data-desint-cadre]")!;
  const canevas = scene.querySelector<HTMLCanvasElement>("[data-desint-canevas]")!;
  const imageA = scene.querySelector<HTMLImageElement>("[data-desint-a]")!;
  const imageB = scene.querySelector<HTMLImageElement>("[data-desint-b]")!;
  const mots = scene.querySelectorAll<HTMLElement>("[data-mot]");
  let particules: ReturnType<typeof import("./particules").creerParticules> = null;
  const etat = { progres: 0 };
  let pret = false;

  const afficher = () => {
    const p = etat.progres;
    // Aux deux bouts, les vraies photos (nettes) ; entre les deux, les particules.
    const enVol = p > 0.015 && p < 0.985 && particules;
    canevas.style.opacity = enVol ? "1" : "0";
    imageA.style.opacity = p <= 0.015 || !particules ? String(1 - gsap.utils.clamp(0, 1, (p - 0.45) / 0.1)) : "0";
    imageB.style.opacity = p >= 0.985 || !particules ? String(gsap.utils.clamp(0, 1, (p - 0.45) / 0.1)) : "0";
    if (enVol) particules!.dessiner(p);
  };

  const preparer = async () => {
    if (pret) return;
    pret = true;
    imageA.loading = "eager";
    imageB.loading = "eager";
    await Promise.all([imageA.decode(), imageB.decode()]).catch(() => {});
    const { creerParticules } = await import("./particules");
    try {
      particules = creerParticules({ canevas, cadre, imageA, imageB, colonnes: 150 });
    } catch {
      particules = null;
    }
    afficher();
  };

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: scene,
      start: "top 75%",
      end: "+=100%",
      scrub: 0.6,
      onRefresh: () => particules?.redimensionner(),
    },
  });
  // Les mots sortent du flou un par un ; « heureux » arrive au moment où la photo s'envole.
  // Avant leur tour, ils restent lisibles (contraste 3:1 au moins, grand texte) : blanc à 40 %, orange à 68 %.
  gsap.set(mots, {
    opacity: (_: number, mot: HTMLElement) => (mot.classList.contains("mot-serif") ? 0.68 : 0.4),
    filter: "blur(10px)",
    y: "0.1em",
  });
  tl.to(mots, { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.12, stagger: 0.06, ease: "power2.out" }, 0);
  tl.to(etat, { progres: 1, duration: 0.85, ease: "power1.inOut", onUpdate: afficher }, 0.12);

  // Préparation des particules un écran avant l'arrivée de la section.
  const observateur = new IntersectionObserver(
    (entrees) => {
      if (entrees.some((e) => e.isIntersecting)) {
        observateur.disconnect();
        void preparer();
      }
    },
    { rootMargin: "100% 0px" },
  );
  observateur.observe(scene);

  return () => {
    observateur.disconnect();
    particules?.liberer();
    imageA.style.opacity = "";
    imageB.style.opacity = "";
    canevas.style.opacity = "";
  };
}
