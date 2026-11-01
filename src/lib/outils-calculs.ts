// Calculs des outils « Autonomie d'un distributeur », « Coût réel d'une litière autonettoyante » et « Combien de
// litières ». Fonctions pures, sans prix ni donnée produit écrits ici, testées dans tests/outils.test.ts.

// --- Autonomie d'un distributeur de croquettes ---------------------------------------------------------------
// Un litre de croquettes pèse environ 400 à 500 g selon leur taille et leur forme. Autonomie = poids que contient
// le réservoir, divisé par la ration du jour, arrondi au jour entier inférieur (on ne compte pas un jour entamé).
export const GRAMMES_PAR_LITRE = { min: 400, max: 500 };

export type Autonomie = { grammes: { min: number; max: number }; jours: { min: number; max: number } };

export function autonomieDistributeur(litres: number, rationGrammes: number): Autonomie | null {
  if (!(litres > 0) || !(rationGrammes > 0)) return null;
  const min = Math.round(litres * GRAMMES_PAR_LITRE.min);
  const max = Math.round(litres * GRAMMES_PAR_LITRE.max);
  return {
    grammes: { min, max },
    jours: { min: Math.floor(min / rationGrammes), max: Math.floor(max / rationGrammes) },
  };
}

// --- Coût réel d'une litière autonettoyante ------------------------------------------------------------------
// Coût sur une durée = prix de l'appareil + dépenses du mois × nombre de mois. « Par mois » = le coût sur 3 ans
// réparti sur 36 mois (l'achat de l'appareil compris). Montants arrondis au centime ; un champ vide compte pour 0.
export type Depenses = { appareil: number; sacs: number; litiere: number; autres: number };
export type Cout = { parMoisConsommables: number; unAn: number; troisAns: number; parMoisSurTroisAns: number };

const centimes = (euros: number) => Math.round(euros * 100) / 100;

export function coutLitiere({ appareil, sacs, litiere, autres }: Depenses): Cout | null {
  const valeurs = [appareil, sacs, litiere, autres].map((v) => (Number.isFinite(v) && v > 0 ? v : 0));
  const [a, ...mensuel] = valeurs;
  const parMois = mensuel.reduce((t, v) => t + v, 0);
  if (a === 0 && parMois === 0) return null;
  const troisAns = a + parMois * 36;
  return {
    parMoisConsommables: centimes(parMois),
    unAn: centimes(a + parMois * 12),
    troisAns: centimes(troisAns),
    parMoisSurTroisAns: centimes(troisAns / 36),
  };
}

// --- Combien de litières ------------------------------------------------------------------------------------
// Règle courante des vétérinaires félins (AAFP) : un bac par chat, plus un.
export function nombreDeLitieres(chats: number): number | null {
  if (!Number.isInteger(chats) || chats < 1) return null;
  return chats + 1;
}
