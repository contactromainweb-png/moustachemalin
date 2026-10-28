"use client";

import { useEffect } from "react";
import { SOUCIS } from "@/lib/accueil";
import { apresAffichage, estOrdinateur, peutAnimer } from "@/lib/capacites";
import { comparaison, fin, mur, pelote } from "./scenes";

type Lenis = { scrollTo: (cible: number, options?: { immediate?: boolean }) => void };

// Défilement fluide (Lenis) et mouvements liés au défilement (GSAP ScrollTrigger) de l'accueil.
// Ordinateur et téléphone (version allégée sur téléphone : moins de particules, mosaïque 4 × 4, épinglages plus
// courts) ; rien avec « animations réduites » ou en économie de données. Chargés une fois la page affichée :
// sans eux, tout est déjà à sa place.
// Aucun aimantage (snap) : la page ne bouge jamais d'elle-même, seul le visiteur fait défiler.
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
      // Sur téléphone, la barre d'adresse qui apparaît ou disparaît ne recalcule pas les épinglages
      // (sinon la page saute au milieu d'un défilement).
      ScrollTrigger.config({ ignoreMobileResize: true });
      const ordinateur = estOrdinateur();
      const finitions: (() => void)[] = [];

      const lenis = new Lenis({ anchors: true, autoRaf: false });
      const tic = (temps: number) => lenis.raf(temps * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tic);
      gsap.ticker.lagSmoothing(0);
      (window as Window & { mmLenis?: Lenis }).mmLenis = lenis;

      const section = document.querySelector<HTMLElement>("[data-soucis]");
      const ctx = gsap.context(() => {
        heros(gsap, ordinateur);
        finitions.push(desintegration(gsap, ordinateur));
        if (section) finitions.push(soucis(gsap, lenis, section, ordinateur));
        finitions.push(pelote(gsap, ordinateur), mur(gsap, ordinateur), comparaison(gsap, ordinateur), fin(gsap));
        ScrollTrigger.refresh();
      });

      nettoyer = () => {
        finitions.forEach((f) => f());
        ctx.revert();
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

type Gsap = typeof import("gsap").gsap;

// Scène 1 : du très gros plan au chat entier, puis l'image recule en carte aux coins arrondis.
// Le titre ne bouge pas : il reste entier à l'écran pendant tout le mouvement.
function heros(gsap: Gsap, ordinateur: boolean) {
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
        end: ordinateur ? "+=90%" : "+=55%",
        pin: true,
        scrub: 0.6,
      },
    })
    .to("[data-hero-zoom]", { scale: 1, ease: "power1.inOut", duration: 0.65 }, 0)
    .to(
      "[data-hero-media]",
      { scale: ordinateur ? 0.9 : 0.94, borderRadius: ordinateur ? 32 : 24, ease: "power2.inOut", duration: 0.35 },
      0.65,
    );
}

// Scène 2 : la phrase s'écrit mot par mot en sortant d'un flou, pendant que la photo se désintègre en particules
// et se reforme en une autre. Le WebGL n'est préparé qu'à l'approche de la section.
function desintegration(gsap: Gsap, ordinateur: boolean) {
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
      particules = creerParticules({ canevas, cadre, imageA, imageB, colonnes: ordinateur ? 150 : 76 });
    } catch {
      particules = null;
    }
    afficher();
  };

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: scene,
      start: "top top",
      end: ordinateur ? "+=160%" : "+=110%",
      pin: true,
      scrub: 0.6,
      onRefresh: () => particules?.redimensionner(),
    },
  });
  // Les mots sortent du flou un par un ; « heureux » arrive au moment où la photo s'envole.
  // Avant leur tour, ils restent lisibles (contraste 3:1 au moins, grand texte) : blanc à 40 %, orange à 68 %.
  gsap.set(mots, {
    opacity: (_: number, mot: HTMLElement) => (mot.classList.contains("mot-serif") ? 0.68 : 0.4),
    filter: ordinateur ? "blur(10px)" : "none",
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

// Scène 3 : les petits soucis, une étape par écran (un peu plus d'un demi-écran sur téléphone).
function soucis(gsap: Gsap, lenis: Lenis, section: HTMLElement, ordinateur: boolean) {
  section.setAttribute("data-epingle", "");
  const etapes = gsap.utils.toArray<HTMLElement>("[data-souci]", section);
  const n = etapes.length;
  const textes = etapes.map((e) =>
    e.querySelectorAll<HTMLElement>("[data-souci-texte], [data-souci-geant], [data-souci-credit]"),
  );
  const cadres = etapes.map((e) => e.querySelector<HTMLElement>("[data-souci-cadre]")!);
  const images = cadres.map((c) => c.querySelector<HTMLImageElement>("img")!);
  const jauges = gsap.utils.toArray<HTMLElement>("[data-jauge]", section);

  // La photo de l'étape affichée passe au-dessus des suivantes : elle se décompose et révèle celle d'en dessous.
  // Les photos sont au milieu (z 10+), les textes devant (z 20), le mot géant tout devant (z 30).
  const photos = etapes.map((e) => e.querySelector<HTMLElement>("[data-souci-photo]")!);
  photos.forEach((p, i) => (p.style.zIndex = String(10 + n - i)));
  const mosaiques = cadres.slice(0, -1).map((c, i) => mosaique(c, images[i], ordinateur));

  const entree = ordinateur ? 40 : 18;
  const sortie = ordinateur ? -32 : -14;
  const flou = (px: number) => (ordinateur ? `blur(${px}px)` : "none");

  gsap.set(textes.slice(1), { opacity: 0, y: entree, filter: flou(6) });
  gsap.set(images.slice(1), { scale: 1.12 });
  gsap.set(jauges[0], { scaleX: 1 });

  const marquerActive = (i: number) => {
    etapes.forEach((e, k) => e.toggleAttribute("data-actif", k === i));
    section.dataset.fond = SOUCIS[i].fond;
  };
  marquerActive(0);

  // Une étape par unité de temps ; une demi-unité de plus à la fin, pour lire la dernière étape.
  const queue = 0.5;
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: `+=${(n - 1 + queue) * (ordinateur ? 100 : 70)}%`,
      pin: true,
      scrub: 0.6,
      onUpdate: (st) => marquerActive(gsap.utils.clamp(0, n - 1, Math.round(st.progress * (n - 1 + queue)))),
    },
  });
  for (let i = 1; i < n; i++) {
    const debut = i - 1;
    // Fondu enchaîné : le texte sortant s'efface pendant que le suivant arrive ; ils se croisent, jamais d'écran vide.
    tl.to(textes[i - 1], { opacity: 0, y: sortie, filter: flou(4), duration: 0.55, ease: "power2.inOut" }, debut + 0.05)
      .to(textes[i], { opacity: 1, y: 0, filter: flou(0), duration: 0.6, ease: "power3.out" }, debut + 0.3)
      // La photo d'origine reste sous la mosaïque un court instant après le départ : à l'arrêt, aucun joint entre les carrés ne se voit.
      .set(images[i - 1], { opacity: 0 }, debut + 0.1)
      // La photo se décompose en carrés qui disparaissent au hasard ; la suivante recule légèrement dessous.
      .to(
        mosaiques[i - 1],
        { scale: 0, opacity: 0, duration: 0.45, ease: "power2.in", stagger: { amount: 0.45, from: "random" } },
        debut,
      )
      .to(images[i], { scale: 1, duration: 0.95, ease: "power2.out" }, debut)
      .to(jauges[i], { scaleX: 1, duration: 0.85, ease: "power2.inOut" }, debut);
  }
  // La timeline dure exactement n − 1 + queue : l'étape i est entièrement en place à la position de défilement i.
  tl.to({}, { duration: queue }, n - 1);
  // Au clavier, un lien d'une étape cachée qui reçoit le focus ramène le défilement à son étape
  // (seulement au clavier : un clic ne fait jamais bouger la page).
  etapes.forEach((e, i) =>
    e.addEventListener("focusin", (ev) => {
      const st = tl.scrollTrigger;
      if (!st || e.hasAttribute("data-actif") || !(ev.target as HTMLElement).matches(":focus-visible")) return;
      lenis.scrollTo(st.start + ((st.end - st.start) * i) / (n - 1 + queue), { immediate: true });
    }),
  );

  return () => {
    section.removeAttribute("data-epingle");
    delete section.dataset.fond;
    etapes.forEach((e) => e.removeAttribute("data-actif"));
    photos.forEach((p) => (p.style.zIndex = ""));
    document.querySelectorAll("[data-mosaique]").forEach((m) => m.remove());
    images.forEach((img) => (img.style.opacity = ""));
  };
}

// Recouvre une photo d'une grille de carrés qui en montrent chacun un morceau (même recadrage que la photo),
// puis cache la photo d'origine. Renvoie les carrés, à animer. Téléphone : 4 × 4 ; ordinateur : 8 de large.
function mosaique(cadre: HTMLElement, image: HTMLImageElement, ordinateur: boolean) {
  const boite = cadre.getBoundingClientRect();
  const colonnes = ordinateur ? 8 : 4;
  const rangees = ordinateur ? Math.max(4, Math.round((colonnes * boite.height) / boite.width)) : 4;
  const grille = document.createElement("div");
  grille.dataset.mosaique = "";
  grille.setAttribute("aria-hidden", "true");
  grille.style.cssText = `position:absolute;inset:0;display:grid;grid-template-columns:repeat(${colonnes},1fr);grid-template-rows:repeat(${rangees},1fr)`;
  const carres: HTMLElement[] = [];
  for (let r = 0; r < rangees; r++) {
    for (let c = 0; c < colonnes; c++) {
      const carre = document.createElement("div");
      // Légèrement agrandis (1,2 %) : les carrés se chevauchent et aucun joint ne se voit entre eux.
      carre.style.cssText = "position:relative;overflow:hidden;transform:scale(1.012)";
      const morceau = image.cloneNode() as HTMLImageElement;
      // Même srcset et même sizes que la photo : le navigateur reprend le fichier déjà chargé.
      morceau.alt = "";
      morceau.style.cssText = `position:absolute;max-width:none;width:${colonnes * 100}%;height:${rangees * 100}%;left:${-c * 100}%;top:${-r * 100}%`;
      carre.appendChild(morceau);
      grille.appendChild(carre);
      carres.push(carre);
    }
  }
  cadre.appendChild(grille);
  return carres;
}
