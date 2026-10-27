import { PHOTOS, type Photo } from "@/lib/medias";

// Les quatre objets de l'appartement, dans l'ordre où la scène les éclaire.
// Les phrases viennent des articles en ligne (guide « Mon chat ne boit pas », comparatif des litières).
// Un lien vers une page pas encore écrite est masqué automatiquement (voir pageEnLigne).
export type Chapitre = {
  id: "gamelle" | "fontaine" | "litiere" | "arbre";
  nom: string;
  fait: string;
  detail: string;
  lien: { href: string; label: string } | null;
  photo: Photo;
  // Point de la photo gardé au centre quand elle est recadrée en hauteur (téléphone).
  cadrage: string;
  // Colonne de la carte sur ordinateur (1 à 4) : elle avance d'une colonne à chaque objet.
  colonne: 1 | 2 | 3 | 4;
  fond: string;
};

export const CHAPITRES: Chapitre[] = [
  {
    id: "gamelle",
    nom: "La gamelle",
    fait: "Un bol large et peu profond, pour que ses moustaches ne touchent pas les bords.",
    detail: "En céramique, en verre ou en inox.",
    lien: { href: "/guides/mon-chat-ne-boit-pas/", label: "Lire le guide « Mon chat ne boit pas »" },
    photo: PHOTOS.chatBol,
    cadrage: "object-[48%_55%]",
    colonne: 1,
    fond: "bg-ch-gamelle",
  },
  {
    id: "fontaine",
    nom: "La fontaine",
    fait: "Beaucoup de chats préfèrent l'eau qui bouge.",
    detail: "Une fontaine garde l'eau filtrée et oxygénée.",
    lien: { href: "/guides/mon-chat-ne-boit-pas/", label: "Lire le guide « Mon chat ne boit pas »" },
    photo: PHOTOS.chatRobinet,
    cadrage: "object-[64%_50%]",
    colonne: 2,
    fond: "bg-ch-fontaine",
  },
  {
    id: "litiere",
    nom: "La litière",
    fait: "Une litière autonettoyante se vide toutes les une à deux semaines.",
    detail: "6 modèles comparés sur leurs fiches techniques.",
    lien: { href: "/litieres/litiere-autonettoyante/", label: "Lire le comparatif des litières" },
    photo: PHOTOS.chatFauteuil,
    cadrage: "object-[66%_50%]",
    colonne: 3,
    fond: "bg-ch-litiere",
  },
  {
    id: "arbre",
    nom: "L'arbre à chat",
    fait: "Pour grimper, griffer et dormir en hauteur.",
    detail: "Comparatif en préparation.",
    lien: null,
    photo: PHOTOS.chatonsArbre,
    cadrage: "object-[44%_50%]",
    colonne: 4,
    fond: "bg-ch-arbre",
  },
];
