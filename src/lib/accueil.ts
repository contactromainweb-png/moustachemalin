import { PHOTOS, type Photo } from "@/lib/medias";

// Section « Les petits soucis du quotidien » : un souci par étape, avec sa couleur, son mot géant, sa photo et son article.
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
  },
  {
    id: "souci-griffes",
    fond: "blanc",
    geant: ["Griffes", "libres"],
    titre: "Les griffes",
    texte: "Un griffoir au bon endroit protège le canapé. Un arbre à chat lui donne de quoi grimper et dormir en hauteur.",
    lien: { href: "/griffer-grimper/griffoir-chat/", label: "Lire le comparatif des griffoirs" },
    lienSecondaire: { href: "/griffer-grimper/arbre-a-chat/", label: "Voir le comparatif des arbres à chat" },
    photo: PHOTOS.chatonsArbre,
    cadrage: "object-[50%_50%]",
  },
];

// Bloc « Selon mon chat » : un profil de chat, sa photo et les pages qui lui répondent.
// `visible: false` = profil prêt mais masqué, en attendant l'article qui lui correspond (chaton, chat âgé).
export type Profil = {
  id: string;
  mot: [string, string]; // premier mot en grotesque, second en serif italique
  liens: { href: string; label: string }[];
  photo: Photo;
  cadrage: string;
  visible: boolean;
};

const mur = (n: string, alt: string, credit: string, width = 1800, height = 1200): Photo => ({
  src: `/media/mur-${n}.jpg`,
  width,
  height,
  alt,
  credit,
});

export const PROFILS: Profil[] = [
  {
    id: "appartement",
    mot: ["En", "appartement"],
    liens: [{ href: "/litieres/litiere-autonettoyante/", label: "Quelle litière autonettoyante choisir" }],
    photo: mur("21", "Un chat tigré et blanc couché sur le sol clair d'un appartement, dans un rayon de soleil.", "krazyYangNA, Pexels"),
    cadrage: "object-[40%_50%]",
    visible: true,
  },
  {
    id: "plusieurs-chats",
    mot: ["Plusieurs", "chats"],
    liens: [{ href: "/litieres/litiere-autonettoyante/#B0DG59SQ5P", label: "La litière pour plusieurs chats" }],
    photo: mur("10", "Deux chatons qui jouent devant une fenêtre, l'un perché sur un hamac pour chat.", "Anna Hinckel, Pexels"),
    cadrage: "object-[78%_50%]",
    visible: true,
  },
  {
    id: "week-end",
    mot: ["Je pars le", "week-end"],
    liens: [
      { href: "/litieres/litiere-autonettoyante/", label: "Une litière qui se vide seule" },
      { href: "/repas/distributeur-croquettes-chat/", label: "Un distributeur de croquettes" },
    ],
    photo: mur("14", "Un chat roux installé seul sous la couette d'un lit, l'air paisible.", "Natalie Bond, Pexels"),
    cadrage: "object-[60%_50%]",
    visible: true,
  },
  {
    id: "boit-peu",
    mot: ["Il boit", "peu"],
    liens: [{ href: "/guides/mon-chat-ne-boit-pas/", label: "Mon chat ne boit pas : que faire" }],
    photo: PHOTOS.chatBol,
    cadrage: "object-[50%_50%]",
    visible: true,
  },
  {
    id: "chaton",
    mot: ["Un", "chaton"],
    liens: [],
    photo: mur("18", "Un chaton tricolore aux yeux bleus qui avance sur une dalle de pierre.", "Mahmoud Yahyaoui, Pexels", 1806),
    cadrage: "object-[50%_50%]",
    visible: false,
  },
  {
    id: "chat-age",
    mot: ["Un chat", "âgé"],
    liens: [],
    photo: mur("29", "Gros plan sur un chat tigré qui somnole, les yeux fermés.", "Magda Ehlers, Pexels"),
    cadrage: "object-[50%_50%]",
    visible: false,
  },
];
