import { DETOURES, PHOTOS, type Detoure, type Photo } from "@/lib/medias";

// Section « Les petits soucis du quotidien » : un souci par étape, avec sa couleur, son mot géant, sa photo,
// son chat détouré et son article.
// Les phrases viennent des articles en ligne (comparatifs des litières et des fontaines, guide « Mon chat ne boit pas »).
// Un lien vers une page pas encore écrite est masqué automatiquement (voir pageEnLigne) : l'étape reste sans bouton.
export type Souci = {
  id: string;
  fond: "orange" | "lavande" | "nuit" | "blanc";
  // Mot géant : le premier mot en grotesque, le second en serif italique.
  geant: [string, string];
  titre: string;
  texte: string;
  lien: { href: string; label: string };
  lienSecondaire?: { href: string; label: string };
  photo: Photo;
  // Point de la photo gardé au centre quand elle est recadrée.
  cadrage: string;
  chat: Detoure;
  // Hauteur du chat détouré (téléphone, puis ordinateur) : à surface à peu près égale, quelle que soit sa pose.
  hauteurChat: string;
};

export const SOUCIS: Souci[] = [
  {
    id: "souci-litiere",
    fond: "orange",
    geant: ["Zéro", "corvée"],
    titre: "La litière qui sent",
    texte:
      "Une litière autonettoyante range les déchets dans un bac fermé : vous le videz toutes les une à deux semaines.",
    lien: { href: "/litieres/litiere-autonettoyante/", label: "Lire le comparatif des litières" },
    photo: PHOTOS.chatChaise,
    cadrage: "object-[50%_40%]",
    chat: DETOURES.bond,
    hauteurChat: "h-[13svh] lg:h-[26svh]",
  },
  {
    id: "souci-boire",
    fond: "lavande",
    geant: ["Eau", "fraîche"],
    titre: "Le chat qui boit peu",
    texte: "Beaucoup de chats préfèrent l'eau qui coule. Une fontaine la garde filtrée et en mouvement.",
    lien: { href: "/guides/mon-chat-ne-boit-pas/", label: "Lire le guide « Mon chat ne boit pas »" },
    lienSecondaire: { href: "/fontaines/fontaine-a-eau-chat/", label: "Voir le comparatif des fontaines" },
    photo: PHOTOS.chatRobinet,
    cadrage: "object-[40%_50%]",
    chat: DETOURES.saut,
    hauteurChat: "h-[19svh] lg:h-[38svh]",
  },
  {
    id: "souci-repas",
    fond: "nuit",
    geant: ["Bien", "manger"],
    titre: "Les repas",
    texte: "Un bol large et peu profond, pour que ses moustaches ne touchent pas les bords.",
    lien: { href: "/repas/", label: "Voir la rubrique Repas" },
    photo: PHOTOS.chatBol,
    cadrage: "object-[60%_45%]",
    chat: DETOURES.marche,
    hauteurChat: "h-[9svh] lg:h-[18svh]",
  },
  {
    id: "souci-griffes",
    fond: "blanc",
    geant: ["Griffes", "libres"],
    titre: "Les griffes",
    texte: "Un arbre à chat pour grimper, griffer et dormir en hauteur.",
    lien: { href: "/griffer-grimper/", label: "Voir la rubrique Griffer et grimper" },
    photo: PHOTOS.chatonsArbre,
    cadrage: "object-[50%_50%]",
    chat: DETOURES.tigre,
    hauteurChat: "h-[10svh] lg:h-[21svh]",
  },
];
