// Ce que l'appareil du visiteur peut afficher sur l'accueil (à appeler côté navigateur seulement).
// Mouvement réduit ou économie de données : photos fixes, sans vidéo ni animation au scroll.

type NavigatorEtendu = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

// Animations au scroll (Lenis, GSAP) et vidéo : refusées si le visiteur demande moins de mouvement
// ou économise ses données.
export function peutAnimer() {
  const nav = navigator as NavigatorEtendu;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return !nav.connection?.saveData;
}

// Ordinateur avec souris et écran large.
export function estOrdinateur() {
  return window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
}

// Lance `action` une fois la page chargée (image du premier écran comprise) et le navigateur au repos :
// vidéo, 3D et défilement fluide ne concurrencent jamais le premier affichage. Renvoie de quoi annuler.
export function apresAffichage(action: () => void) {
  let annule = false;
  let idle = 0;
  const auRepos = "requestIdleCallback" in window;
  const lancer = () => {
    if (annule) return;
    if (auRepos) idle = window.requestIdleCallback(() => !annule && action(), { timeout: 2000 });
    else idle = window.setTimeout(() => !annule && action(), 200);
  };
  if (document.readyState === "complete") lancer();
  else window.addEventListener("load", lancer, { once: true });
  return () => {
    annule = true;
    window.removeEventListener("load", lancer);
    if (auRepos) window.cancelIdleCallback(idle);
    else window.clearTimeout(idle);
  };
}
