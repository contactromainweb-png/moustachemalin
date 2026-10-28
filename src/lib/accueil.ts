import { PHOTOS, type Photo } from "@/lib/medias";

// Section « Les petits soucis du quotidien » : un souci par étape, avec sa photo et son article.
// Les phrases viennent des articles en ligne (comparatifs des litières et des fontaines, guide « Mon chat ne boit pas »).
// Un lien vers une page pas encore écrite est masqué automatiquement (voir pageEnLigne) : l'étape reste sans bouton.
export type Souci = {
  id: string;
  titre: string;
  texte: string;
  lien: { href: string; label: string };
  lienSecondaire?: { href: string; label: string };
  photo: Photo;
  // Point de la photo gardé au centre quand elle est recadrée.
  cadrage: string;
};

export const SOUCIS: Souci[] = [
  {
    id: "souci-litiere",
    titre: "La litière qui sent",
    texte: "Une litière autonettoyante range les déchets dans un bac fermé : vous le videz toutes les une à deux semaines.",
    lien: { href: "/litieres/litiere-autonettoyante/", label: "Lire le comparatif des litières" },
    photo: PHOTOS.chatFauteuil,
    cadrage: "object-[55%_50%]",
  },
  {
    id: "souci-boire",
    titre: "Le chat qui boit peu",
    texte: "Beaucoup de chats préfèrent l'eau qui coule. Une fontaine la garde filtrée et en mouvement.",
    lien: { href: "/guides/mon-chat-ne-boit-pas/", label: "Lire le guide « Mon chat ne boit pas »" },
    lienSecondaire: { href: "/fontaines/fontaine-a-eau-chat/", label: "Voir le comparatif des fontaines" },
    photo: PHOTOS.chatRobinet,
    cadrage: "object-[64%_50%]",
  },
  {
    id: "souci-repas",
    titre: "Les repas",
    texte: "Un bol large et peu profond, pour que ses moustaches ne touchent pas les bords.",
    lien: { href: "/repas/", label: "Voir la rubrique Repas" },
    photo: PHOTOS.chatBol,
    cadrage: "object-[48%_55%]",
  },
  {
    id: "souci-griffes",
    titre: "Les griffes",
    texte: "Un arbre à chat pour grimper, griffer et dormir en hauteur.",
    lien: { href: "/griffer-grimper/", label: "Voir la rubrique Griffer et grimper" },
    photo: PHOTOS.chatonsArbre,
    cadrage: "object-[44%_50%]",
  },
];
