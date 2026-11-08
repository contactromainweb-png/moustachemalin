// Scènes 4 et 7 de l'accueil sur ordinateur, appelées par Mouvement.
// Chaque fonction renvoie de quoi tout défaire. Sans elles (pas de JavaScript, « animations réduites »),
// les sections sont déjà complètes et immobiles.

type Gsap = typeof import("gsap").gsap;

// Scène 4 : la petite pelote décorative tourne une seule fois, à son arrivée à l'écran, puis s'arrête. Rien n'est lié
// au défilement. Le canevas n'est préparé qu'à ce moment-là.
export function pelote() {
  const decor = document.querySelector<HTMLElement>("[data-pelote-decor]");
  const canevas = decor?.querySelector<HTMLCanvasElement>("[data-pelote-canevas]");
  if (!decor || !canevas) return () => {};
  const DUREE = 2400;
  const INCLINAISON = 0.38;
  let rendu: ReturnType<typeof import("./pelote-webgl").creerPelote> = null;
  let boucle = 0;
  let angle = 0;
  let annule = false;

  // Un canevas redimensionné est effacé : on redessine la dernière image.
  const auRedimensionnement = () => {
    rendu?.redimensionner();
    rendu?.dessiner(angle, INCLINAISON);
  };

  const observateur = new IntersectionObserver(
    async ([e]) => {
      if (!e.isIntersecting) return;
      observateur.disconnect();
      const { creerPelote } = await import("./pelote-webgl");
      if (annule) return;
      try {
        rendu = creerPelote(canevas, false);
      } catch {
        rendu = null;
      }
      if (!rendu) return;
      canevas.style.opacity = "1";
      window.addEventListener("resize", auRedimensionnement);
      const depart = performance.now();
      const image = (t: number) => {
        const p = Math.min(1, (t - depart) / DUREE);
        angle = (1 - (1 - p) ** 3) * Math.PI * 1.5;
        rendu?.dessiner(angle, INCLINAISON);
        if (p < 1) boucle = requestAnimationFrame(image);
      };
      boucle = requestAnimationFrame(image);
    },
    { threshold: 0.5 },
  );
  observateur.observe(decor);

  return () => {
    annule = true;
    observateur.disconnect();
    cancelAnimationFrame(boucle);
    window.removeEventListener("resize", auRedimensionnement);
    rendu?.liberer();
    canevas.style.opacity = "";
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
