// Textes de Kira dans le mini-jeu de la balle (pack 9 et son complément) : les 13 seuls qu'elle dit dans le jeu,
// validés par Romain. Des réactions au jeu, jamais une nouvelle habitude. Aucun autre texte de Kira dans JeuBalle.

export const DEPART_JEU_BALLE = "Lance-la, je te la rapporte. Chez moi, c'est une spécialité.";

// Après un lancer : les 6 premières dans l'ordre (lancers 1 à 6), puis au hasard parmi les 8, jamais la même deux
// fois de suite.
export const LANCERS_JEU_BALLE = [
  "Et voilà, à tes pieds. Encore ?",
  "Rapportée. Tu la relances ?",
  "Pas mal, ce lancer. Je peux faire mieux qu'attraper, tu sais : je rapporte.",
  "Mission accomplie. Je t'attends.",
  "Un vrai petit chien, il paraît. Je ne vois pas de quoi on parle.",
  "Plus loin, la prochaine fois. Je n'ai même pas eu besoin de courir.",
  "Encore une. Pose-la à mes pieds… ah non, c'est mon rôle.",
  "Je te la rends. Pour l'instant.",
];

// Paliers : remplacent la phrase du lancer, une seule fois chacun (le compteur ne passe qu'une fois par chaque palier).
export const PALIERS_JEU_BALLE: Record<number, string> = {
  5: "Cinq. Je commence à peine à m'échauffer.",
  10: "Dix. Je suis très joueuse, tu sais.",
  20: "Vingt balles. Tu fatigues avant moi, c'est prévu.",
  50: "Cinquante. Là, c'est toi le chat qui rapporte.",
};

// Balle tombée à moins de 30 % de la largeur du terrain.
export const TOUT_PRES_JEU_BALLE = "C'était un lancer, ça ?";
export const SEUIL_TOUT_PRES = 0.3;

export const TEXTES_JEU_BALLE = [DEPART_JEU_BALLE, ...LANCERS_JEU_BALLE, ...Object.values(PALIERS_JEU_BALLE), TOUT_PRES_JEU_BALLE];

// Texte de la bulle après le lancer n° `balles` (1, 2, …). `precedent` : le texte affiché juste avant.
// `toutPres` : la balle est tombée tout près. `hasard` : nombre dans [0, 1[ (Math.random, remplaçable en test).
export function texteApresLancer(balles: number, precedent: string, toutPres: boolean, hasard = Math.random()) {
  const palier = PALIERS_JEU_BALLE[balles];
  if (palier) return palier;
  if (toutPres && precedent !== TOUT_PRES_JEU_BALLE) return TOUT_PRES_JEU_BALLE;
  if (balles <= 6 && LANCERS_JEU_BALLE[balles - 1] !== precedent) return LANCERS_JEU_BALLE[balles - 1];
  const choix = LANCERS_JEU_BALLE.filter((t) => t !== precedent);
  return choix[Math.floor(hasard * choix.length)];
}
