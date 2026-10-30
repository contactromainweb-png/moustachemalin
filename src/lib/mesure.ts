// Mesure d'audience sans cookie : Umami Cloud ou GoatCounter, au choix de Romain (offres gratuites).
// Rien n'est chargé tant que la variable de l'outil choisi n'est pas renseignée sur Netlify :
//   NEXT_PUBLIC_UMAMI_ID = identifiant du site dans Umami (« Website ID »)
//   NEXT_PUBLIC_GOATCOUNTER = code du compte GoatCounter (ex. « moustachemalin » pour moustachemalin.goatcounter.com)
// La page Confidentialité décrit automatiquement l'outil activé.
export const UMAMI_ID = process.env.NEXT_PUBLIC_UMAMI_ID;
export const GOATCOUNTER = process.env.NEXT_PUBLIC_GOATCOUNTER;
export const MESURE_ACTIVE = Boolean(UMAMI_ID || GOATCOUNTER);

// Où se trouvait le lien cliqué : résumé (TopPicks), tableau (ComparisonTable), fiche (ProductCard), encadré (ProductBox),
// avis (lien « Lire les avis clients sur Amazon » sous une fiche).
export type Emplacement = "résumé" | "tableau" | "fiche" | "encadré" | "avis";

type FenetreMesure = Window & {
  umami?: { track: (nom: string, donnees: Record<string, string>) => void };
  goatcounter?: { count: (vars: { path: string; title: string; event: boolean }) => void };
};

// Un clic sur un bouton Amazon : la page, le produit (ASIN) et l'emplacement du bouton.
export function mesurerClicAffilie(asin: string, emplacement: Emplacement) {
  const w = window as FenetreMesure;
  const page = window.location.pathname;
  w.umami?.track("clic-amazon", { page, asin, emplacement });
  w.goatcounter?.count({ path: `clic-amazon/${emplacement}/${asin}`, title: page, event: true });
}
