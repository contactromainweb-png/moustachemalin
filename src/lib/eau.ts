// Calcul du calculateur « Combien d'eau doit boire mon chat ? » (content/outils/combien-eau-chat.mdx).
// Besoin total : 50 à 60 ml par kilo et par jour. La pâtée apporte 75 % de son poids en eau, les croquettes 10 %.
// Ce qui reste à boire est arrondi à 10 ml, jamais en dessous de 0. Fonction pure, testée dans tests/eau.test.ts.
export type Repas = { poids: number; patee: number; croquettes: number };
export type Estimation = { min: number; max: number };

export const BESOIN_ML_PAR_KG = { min: 50, max: 60 };
export const PART_EAU = { patee: 0.75, croquettes: 0.1 };

const arrondi10 = (ml: number) => Math.max(0, Math.round(ml / 10) * 10);

export function eauABoire({ poids, patee, croquettes }: Repas): Estimation {
  const nourriture = patee * PART_EAU.patee + croquettes * PART_EAU.croquettes;
  return {
    min: arrondi10(poids * BESOIN_ML_PAR_KG.min - nourriture),
    max: arrondi10(poids * BESOIN_ML_PAR_KG.max - nourriture),
  };
}
