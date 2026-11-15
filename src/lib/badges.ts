import type { Carnet } from "./carnet.ts";
import { ESSENTIELS } from "./carnet.ts";

// Les badges d'exploration (pack 8b) : calculés à partir du carnet, jamais stockés à part.
// `articles` : slug → type et rubrique de chaque article en ligne (calculé au build par la page /carnet/).
export type IndexArticles = Record<string, { type: string; rubrique: string }>;
export type Badge = { id: string; titre: string; gagne: boolean; aFaire: string };

export const RUBRIQUES_EQUIPEMENT = ["litieres", "fontaines", "repas", "griffer-grimper", "sorties"] as const;

export function badges(c: Carnet, articles: IndexArticles): Badge[] {
  const lus = c.lus.map((s) => articles[s]).filter(Boolean);
  const rubriques = RUBRIQUES_EQUIPEMENT.filter((r) => lus.some((a) => a.rubrique === r)).length;
  const outils = Object.keys(c.outils).length;
  const essentiels = ESSENTIELS.filter((id) => c.equipement.includes(id)).length;
  return [
    {
      id: "comparatif",
      titre: "Premier comparatif",
      gagne: lus.some((a) => a.type === "comparatif"),
      aFaire: "Lis un comparatif jusqu'au bout",
    },
    {
      id: "tour",
      titre: "Tour du propriétaire",
      gagne: rubriques === RUBRIQUES_EQUIPEMENT.length,
      aFaire: `Lis un article dans chaque rubrique (${rubriques} sur ${RUBRIQUES_EQUIPEMENT.length})`,
    },
    { id: "quiz", titre: "Quiz", gagne: c.quiz.length > 0, aFaire: "Termine un quiz de comparatif" },
    { id: "diagnostic", titre: "Diagnostic", gagne: c.tests.length > 0, aFaire: "Fais le test d'un guide" },
    { id: "calculs", titre: "Calculs", gagne: outils > 0, aFaire: "Retiens une valeur dans un outil" },
    { id: "bande", titre: "La bande", gagne: c.bande === true, aFaire: "Va saluer la bande de Kira" },
    { id: "essentiel", titre: "L'essentiel", gagne: essentiels === ESSENTIELS.length, aFaire: "Coche les 7 essentiels" },
  ];
}
