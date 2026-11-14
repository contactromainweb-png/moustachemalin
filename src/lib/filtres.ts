import type { Product } from "@/lib/products";

// Pastilles « Je cherche… » au-dessus du tableau des comparatifs. Chaque filtre est une règle lue dans la fiche
// produit (content/products/*.json), jamais une liste écrite à la main : changer une fiche change le filtre.
// Une information absente de la fiche ne compte pas : le produit n'est pas retenu par ce filtre.
// `critere` est affiché sous les pastilles quand le filtre est choisi, pour dire exactement ce qu'il retient.
export type Filtre = { id: string; label: string; critere: string; retient: (p: Product) => boolean };
export type FiltreCalcule = { id: string; label: string; critere: string; asins: string[] };

// Les nombres d'un texte (« 35 à 45 dB » → [35, 45] ; « 2,5 L » → [2.5]).
export function nombres(texte: string | undefined): number[] {
  return (texte?.match(/\d+(?:,\d+)?/g) ?? []).map((n) => Number(n.replace(",", ".")));
}

// La plus grande valeur annoncée (pour un bruit « 35 à 45 dB », on retient 45), ou null si rien n'est chiffré.
function maximum(texte: string | undefined): number | null {
  const n = nombres(texte);
  return n.length ? Math.max(...n) : null;
}

const commence = (texte: string | undefined, debut: string) =>
  !!texte && texte.toLowerCase().startsWith(debut.toLowerCase());
const contient = (texte: string | undefined, mot: string) => !!texte && texte.toLowerCase().includes(mot.toLowerCase());

const petitBudget: Filtre = {
  id: "petit-budget",
  label: "Petit budget",
  critere: "Notre choix « petit budget » : le modèle le plus abordable de la sélection.",
  retient: (p) => p.badge === "Le meilleur petit budget",
};

const FILTRES: Record<string, Filtre[]> = {
  "litiere-autonettoyante": [
    petitBudget,
    {
      id: "plusieurs-chats",
      label: "Plusieurs chats",
      critere: "Un bac à déchets d'au moins 11 litres, pour ne pas le vider trop souvent.",
      retient: (p) => (maximum(p.specs.bacDechets?.split("(")[0]) ?? 0) >= 11,
    },
    {
      id: "silencieuse",
      label: "Silencieuse",
      critere: "Un niveau sonore annoncé par le fabricant de 45 dB au plus.",
      retient: (p) => {
        const db = maximum(p.specs.bruit);
        return db !== null && db <= 45;
      },
    },
    {
      id: "sans-appli",
      label: "Sans appli",
      critere: "Un modèle qui fonctionne sans application sur le téléphone.",
      retient: (p) => commence(p.specs.application, "Non"),
    },
  ],
  "fontaine-a-eau-chat": [
    {
      id: "inox",
      label: "Inox",
      critere: "Un réservoir en acier inoxydable.",
      retient: (p) => commence(p.specs.materiau, "Acier inoxydable"),
    },
    {
      id: "silencieuse",
      label: "Silencieuse",
      critere: "Un niveau sonore annoncé par le fabricant de 30 dB au plus.",
      retient: (p) => {
        const db = maximum(p.specs.bruit);
        return db !== null && db <= 30;
      },
    },
    {
      id: "sans-fil",
      label: "Sans fil",
      critere: "Une fontaine qui fonctionne sur batterie, sans câble branché.",
      retient: (p) => contient(p.specs.alimentation, "batterie"),
    },
  ],
  "litiere-chat": [
    petitBudget,
    {
      id: "agglomerante",
      label: "Agglomérante",
      critere: "Une litière qui forme des blocs : on retire l'urine chaque jour, sans tout changer.",
      retient: (p) => commence(p.specs.type, "Agglomérante"),
    },
    {
      id: "vegetale",
      label: "Végétale",
      critere: "Une litière d'origine végétale (bois, tofu), plus légère et souvent compostable.",
      retient: (p) => commence(p.specs.origine, "Végétale"),
    },
    {
      id: "sans-parfum",
      label: "Sans parfum",
      critere: "Une litière sans parfum ajouté, celle que préfèrent la plupart des chats.",
      retient: (p) => commence(p.specs.parfum, "Sans"),
    },
  ],
  "distributeur-croquettes-chat": [
    {
      id: "camera",
      label: "Caméra",
      critere: "Une caméra pour voir son chat manger depuis le téléphone.",
      retient: (p) => !!p.specs.camera,
    },
    {
      id: "double-bol",
      label: "Double bol",
      critere: "Deux bols servis en même temps.",
      retient: (p) => commence(p.specs.bols, "2 bols"),
    },
    {
      id: "sans-electricite",
      label: "Sans électricité",
      critere: "Un distributeur sans pile ni prise, qui fonctionne par gravité.",
      retient: (p) => contient(p.specs.fonctionnement, "sans électricité"),
    },
  ],
};

// Les filtres d'un tableau : ceux de la catégorie de ses produits, avec les ASIN retenus par chacun.
export function filtresPour(produits: Product[]): FiltreCalcule[] {
  const categorie = produits[0]?.category;
  return (FILTRES[categorie] ?? []).map(({ id, label, critere, retient }) => ({
    id,
    label,
    critere,
    asins: produits.filter(retient).map((p) => p.asin),
  }));
}
