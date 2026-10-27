// Ce que l'appareil du visiteur peut afficher sur l'accueil (à appeler côté navigateur seulement).
// Téléphone, mouvement réduit, économie de données ou appareil modeste : photos fixes, sans vidéo ni 3D.

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

// Scène 3D : ordinateur, au moins 4 cœurs et 4 Go de mémoire, et WebGL disponible.
export function peut3D() {
  if (!peutAnimer() || !estOrdinateur()) return false;
  const nav = navigator as NavigatorEtendu;
  if ((nav.hardwareConcurrency ?? 8) < 4 || (nav.deviceMemory ?? 8) < 4) return false;
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}
