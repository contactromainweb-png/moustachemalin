import type { Product } from "@/lib/products";

// Choix du dessin générique d'une fiche produit (IllustrationAppareil), d'après la catégorie et les specs du produit.
// Fonction pure, testée par tests/illustrations.test.ts : chaque vrai produit doit obtenir une variante non neutre.
export type Variante =
  | "litiere-ouverte"
  | "litiere-fermee"
  | "sac-boules"
  | "sac-grains"
  | "fontaine"
  | "distributeur"
  | "distributeur-2-bols"
  | "distributeur-gravite"
  | "arbre-petit"
  | "arbre-moyen"
  | "arbre-plafond"
  | "griffoir-poteau"
  | "griffoir-l"
  | "griffoir-plat"
  | "griffoir-tapis"
  | "chatiere-manuelle"
  | "chatiere-puce"
  | "neutre";

// Ce que le dessin représente, pour le texte alternatif : « Illustration générique : <libellé> (pas une photo du produit) ».
export const LIBELLES: Record<Variante, string> = {
  "litiere-ouverte": "litière autonettoyante ouverte",
  "litiere-fermee": "litière autonettoyante fermée",
  "sac-boules": "sac de litière agglomérante",
  "sac-grains": "sac de litière",
  fontaine: "fontaine à eau",
  distributeur: "distributeur de croquettes",
  "distributeur-2-bols": "distributeur de croquettes à deux bols",
  "distributeur-gravite": "distributeur de croquettes par gravité",
  "arbre-petit": "petit arbre à chat avec rampe",
  "arbre-moyen": "arbre à chat",
  "arbre-plafond": "arbre à chat du sol au plafond",
  "griffoir-poteau": "griffoir poteau",
  "griffoir-l": "griffoir en L",
  "griffoir-plat": "griffoir plat en carton",
  "griffoir-tapis": "tapis griffoir",
  "chatiere-manuelle": "chatière",
  "chatiere-puce": "chatière à puce",
  neutre: "équipement pour chat",
};

const commence = (t: string | undefined, d: string) => !!t && t.toLowerCase().startsWith(d.toLowerCase());
const contient = (t: string | undefined, m: string) => !!t && t.toLowerCase().includes(m.toLowerCase());

// Hauteur en cm (la première valeur chiffrée), ou null si la spec n'en donne pas.
function hauteurCm(t: string | undefined) {
  const m = t?.match(/(\d+(?:,\d+)?)\s*cm/);
  return m ? Number(m[1].replace(",", ".")) : null;
}

export function varianteIllustration(p: Pick<Product, "category" | "specs" | "exemple">): Variante {
  if (p.exemple) return "neutre";
  const s = p.specs ?? {};
  switch (p.category) {
    case "litiere-autonettoyante":
      if (commence(s.type, "Ouverte")) return "litiere-ouverte";
      if (commence(s.type, "Fermée")) return "litiere-fermee";
      return "neutre";
    case "litiere-chat":
      return commence(s.type, "Agglomérante") ? "sac-boules" : "sac-grains";
    case "fontaine-a-eau-chat":
      return "fontaine";
    case "distributeur-croquettes-chat":
      if (contient(s.fonctionnement, "gravité") || contient(s.repas, "gravité")) return "distributeur-gravite";
      if (s.bols) return "distributeur-2-bols";
      return "distributeur";
    case "arbre-a-chat": {
      if (contient(s.fixation, "plafond") || contient(s.hauteur, "plafond")) return "arbre-plafond";
      const h = hauteurCm(s.hauteur);
      if (h === null) return "arbre-moyen";
      return h < 100 ? "arbre-petit" : "arbre-moyen";
    }
    case "griffoir-chat":
      if (commence(s.type, "Poteau")) return "griffoir-poteau";
      if (commence(s.type, "En L")) return "griffoir-l";
      if (commence(s.type, "Plat")) return "griffoir-plat";
      if (commence(s.type, "Tapis")) return "griffoir-tapis";
      return "neutre";
    case "chatiere":
      if (commence(s.type, "Manuelle")) return "chatiere-manuelle";
      if (commence(s.type, "Électronique")) return "chatiere-puce";
      return "neutre";
    default:
      return "neutre";
  }
}
