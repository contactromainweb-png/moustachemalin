// Scènes 4 à 7 de l'accueil sur ordinateur : animations liées au défilement (GSAP ScrollTrigger), appelées par Mouvement.
// Chaque fonction renvoie de quoi tout défaire. Sans elles (pas de JavaScript, « animations réduites »),
// les sections sont déjà complètes et immobiles.

type Gsap = typeof import("gsap").gsap;

// Scène 4 : la pelote tourne doucement, un peu plus vite quand on fait défiler ; les cartes entrent par le bas.
export function pelote(gsap: Gsap) {
  const section = document.querySelector<HTMLElement>("[data-pelote]");
  if (!section) return () => {};
  const canevas = section.querySelector<HTMLCanvasElement>("[data-pelote-canevas]")!;
  let rendu: ReturnType<typeof import("./pelote-webgl").creerPelote> = null;
  let visible = false;
  let boucle = 0;
  let angle = 0;
  let precedent = 0;
  const etat = { progres: 0 };

  const image = (t: number) => {
    const dt = precedent ? Math.min(0.05, (t - precedent) / 1000) : 0;
    precedent = t;
    angle += dt * 0.16;
    rendu?.dessiner(angle + etat.progres * 1.4, 0.38 + etat.progres * 0.35);
    if (visible) boucle = requestAnimationFrame(image);
  };

  const observateur = new IntersectionObserver(
    async ([e]) => {
      visible = e.isIntersecting;
      if (!visible) {
        cancelAnimationFrame(boucle);
        precedent = 0;
        return;
      }
      if (!rendu) {
        const { creerPelote } = await import("./pelote-webgl");
        try {
          rendu = creerPelote(canevas, false);
        } catch {
          rendu = null;
        }
        if (!rendu) return;
        canevas.style.opacity = "1";
      }
      cancelAnimationFrame(boucle);
      boucle = requestAnimationFrame(image);
    },
    { rootMargin: "20% 0px" },
  );
  observateur.observe(section);

  gsap.to(etat, {
    progres: 1,
    ease: "none",
    scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true, onRefresh: () => rendu?.redimensionner() },
  });
  gsap.utils.toArray<HTMLElement>("[data-pelote-carte]", section).forEach((carte, i) => {
    gsap.from(carte, {
      y: 90,
      rotate: i % 2 ? 2.5 : -2.5,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: carte, start: "top 88%", toggleActions: "play none none reverse" },
    });
  });

  return () => {
    observateur.disconnect();
    cancelAnimationFrame(boucle);
    rendu?.liberer();
    canevas.style.opacity = "";
  };
}

// Scène 5 : la photo du centre, plein écran, recule jusqu'à sa case ; les autres vignettes arrivent autour
// (du centre vers les bords) ; puis le voile bleu nuit tombe et le compteur monte jusqu'au vrai chiffre.
export function mur(gsap: Gsap) {
  const scene = document.querySelector<HTMLElement>("[data-mur-scene]");
  if (!scene) return () => {};
  const centre = scene.querySelector<HTMLElement>("[data-mur-centre]")!;
  const vignettes = gsap.utils
    .toArray<HTMLElement>("[data-mur-vignette]", scene)
    .filter((v) => v.offsetParent !== null);
  const fond = scene.querySelector<HTMLElement>("[data-mur-fond]")!;
  const compteur = scene.querySelector<HTMLElement>("[data-mur-compteur]")!;
  const legendes = scene.querySelectorAll<HTMLElement>("[data-mur-legende]");
  const total = Number(compteur.textContent) || 0;
  const valeur = { n: 0 };

  // Échelle qui fait couvrir tout l'écran à la case du centre (tailles sans transformation : offsetWidth/Height).
  const couvrir = () => Math.max(scene.clientWidth / centre.offsetWidth, scene.clientHeight / centre.offsetHeight) * 1.02;
  // Distance de chaque vignette au centre de l'écran (en px), pour les faire venir du centre vers les bords.
  const ecart = (v: HTMLElement) => {
    const b = v.getBoundingClientRect();
    const s = scene.getBoundingClientRect();
    return { x: b.left + b.width / 2 - (s.left + s.width / 2), y: b.top + b.height / 2 - (s.top + s.height / 2) };
  };
  const distances = vignettes.map((v) => Math.hypot(ecart(v).x, ecart(v).y));
  const loin = Math.max(...distances, 1);

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: scene,
      start: "top top",
      end: "+=190%",
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });
  tl.fromTo(centre, { scaleX: couvrir, scaleY: couvrir }, { scaleX: 1, scaleY: 1, duration: 0.5, ease: "power2.inOut" }, 0);
  vignettes.forEach((v, i) => {
    tl.fromTo(
      v,
      { opacity: 0, scale: 1.2, x: () => ecart(v).x * 0.3, y: () => ecart(v).y * 0.3 },
      { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.32, ease: "power2.out" },
      0.1 + (distances[i] / loin) * 0.22,
    );
  });
  tl.fromTo(fond, { opacity: 0 }, { opacity: 1, duration: 0.14 }, 0.66)
    .fromTo(
      valeur,
      { n: 0 },
      {
        n: total,
        duration: 0.2,
        ease: "power1.out",
        onUpdate: () => (compteur.textContent = String(Math.round(valeur.n))),
      },
      0.7,
    )
    .fromTo(compteur, { opacity: 0, yPercent: 12 }, { opacity: 1, yPercent: 0, duration: 0.12, ease: "power2.out" }, 0.68)
    .fromTo(legendes, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.12, stagger: 0.04, ease: "power2.out" }, 0.78)
    .to({}, { duration: 0.1 });

  return () => {
    compteur.textContent = String(total);
  };
}

// Scène 6 : la fiche se remplit, devient tableau, le critère du titre défile et allume sa ligne, puis le badge.
// Section épinglée.
export function comparaison(gsap: Gsap) {
  const section = document.querySelector<HTMLElement>("[data-comparaison]");
  if (!section) return () => {};
  const lignesFiche = section.querySelectorAll<HTMLElement>("[data-fiche-ligne]");
  const fiche = section.querySelector<HTMLElement>("[data-fiche]")!;
  const tableau = section.querySelector<HTMLElement>("[data-tableau]")!;
  const rangees = gsap.utils.toArray<HTMLElement>("[data-tableau-ligne]", section).map((r) => r.querySelectorAll<HTMLElement>("[data-ligne-fond]"));
  const badges = section.querySelectorAll<HTMLElement>("[data-badge]");
  const colonneChoix = section.querySelector<HTMLElement>("[data-tableau-colonne='choix']");
  const allume = "rgb(185 166 255 / 0.38)";

  section.setAttribute("data-defile", "");
  const mots = gsap.utils.toArray<HTMLElement>("[data-critere]", section);
  gsap.set(mots.slice(1), { yPercent: 105 });
  const scene = section.querySelector<HTMLElement>("[data-comparaison-scene]")!;

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: scene, start: "top top", end: "+=230%", pin: true, scrub: 0.6 },
  });
  tl.from(lignesFiche, { opacity: 0, x: -24, duration: 0.05, stagger: 0.04, ease: "power2.out" }, 0.02)
    .to(fiche, { y: -50, scale: 0.92, opacity: 0.35, duration: 0.1, ease: "power2.inOut" }, 0.24)
    .from(tableau, { opacity: 0, y: 70, duration: 0.1, ease: "power2.out" }, 0.27);
  rangees.forEach((cellules, r) => tl.from(cellules, { opacity: 0, y: 16, duration: 0.05, stagger: 0.012, ease: "power2.out" }, 0.33 + r * 0.03));
  // Un critère à la fois : le mot du titre change, sa ligne s'allume.
  const debut = 0.48;
  const pas = 0.11;
  mots.forEach((mot, i) => {
    const t = debut + i * pas;
    if (i > 0) {
      tl.to(mots[i - 1], { yPercent: -105, duration: 0.04, ease: "power2.inOut" }, t)
        .to(mot, { yPercent: 0, duration: 0.04, ease: "power2.inOut" }, t)
        .to(rangees[i - 1], { backgroundColor: "rgb(185 166 255 / 0)", duration: 0.04 }, t);
    }
    tl.to(rangees[i], { backgroundColor: allume, duration: 0.04 }, t);
  });
  const fin = debut + mots.length * pas;
  tl.to(rangees[rangees.length - 1], { backgroundColor: "rgb(185 166 255 / 0)", duration: 0.04 }, fin)
    .fromTo(
      badges,
      { opacity: 0, scale: 1.8, rotate: -22 },
      { opacity: 1, scale: 1, rotate: -6, duration: 0.07, ease: "back.out(2.2)" },
      fin + 0.02,
    );
  if (colonneChoix) tl.to(colonneChoix, { backgroundColor: "rgb(255 122 26 / 0.14)", duration: 0.05 }, fin + 0.02);
  tl.to({}, { duration: 0.08 });

  return () => {
    section.removeAttribute("data-defile");
  };
}

// Scène 7 : le bord courbé de la dernière section se tend en arrivant ; « Moustache Malin » monte.
export function fin(gsap: Gsap) {
  const section = document.querySelector<HTMLElement>("[data-fin]");
  if (!section) return () => {};
  const courbe = section.querySelector<HTMLElement>("[data-fin-courbe]")!;
  gsap.fromTo(
    courbe,
    { scaleY: 1 },
    { scaleY: 0, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "top 35%", scrub: 0.6 } },
  );
  gsap.from(section.querySelectorAll("[data-fin-mot]"), {
    yPercent: 35,
    opacity: 0,
    duration: 1,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: { trigger: section, start: "top 70%", toggleActions: "play none none reverse" },
  });
  return () => {};
}
