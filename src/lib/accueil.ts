import { MUR, PHOTOS, type Photo } from "@/lib/medias";

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
  liensSecondaires?: { href: string; label: string }[];
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
    liensSecondaires: [{ href: "/litieres/litiere-sent-mauvais/", label: "Lire le guide « Litière qui sent mauvais »" }],
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
    liensSecondaires: [{ href: "/fontaines/fontaine-a-eau-chat/", label: "Voir le comparatif des fontaines" }],
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
    liensSecondaires: [
      { href: "/griffer-grimper/chat-griffe-canape/", label: "Lire le guide « Mon chat griffe le canapé »" },
      { href: "/griffer-grimper/arbre-a-chat/", label: "Voir le comparatif des arbres à chat" },
    ],
    photo: PHOTOS.chatonsArbre,
    cadrage: "object-[50%_50%]",
  },
];

// Cartes « Mon problème, c'est… » : téléphone et tablette seulement, juste après le premier écran. Elles reprennent
// en six cartes les soucis et les profils de chat, deux sections réservées à l'ordinateur. `guide` : lien texte
// sous la carte, vers le guide qui répond au même souci.
export type Probleme = {
  id: string;
  titre: string;
  href: string;
  guide?: { href: string; label: string };
  photo: Photo;
  cadrage: string;
};

export const PROBLEMES: Probleme[] = [
  {
    id: "litiere",
    titre: "La litière qui sent",
    href: "/litieres/litiere-autonettoyante/",
    guide: { href: "/litieres/litiere-sent-mauvais/", label: "Le guide anti-odeurs" },
    photo: PHOTOS.chatChaise,
    cadrage: "object-[50%_40%]",
  },
  {
    id: "boit-peu",
    titre: "Il boit peu",
    href: "/guides/mon-chat-ne-boit-pas/",
    photo: PHOTOS.chatRobinet,
    cadrage: "object-[40%_50%]",
  },
  {
    id: "week-end",
    titre: "Je pars en week-end",
    href: "/guides/partir-en-week-end-chat/",
    guide: { href: "/repas/distributeur-croquettes-chat/", label: "Le comparatif des distributeurs" },
    photo: PHOTOS.chatGamelle,
    cadrage: "object-[50%_50%]",
  },
  {
    id: "griffes",
    titre: "Il griffe tout",
    href: "/griffer-grimper/griffoir-chat/",
    guide: { href: "/griffer-grimper/chat-griffe-canape/", label: "Le guide « canapé griffé »" },
    photo: PHOTOS.chatGriffes,
    cadrage: "object-[50%_40%]",
  },
  {
    id: "accueil-chat",
    titre: "J'accueille un chat",
    href: "/guides/arrivee-chat-chaton-liste/",
    photo: PHOTOS.chatonRouxBalle,
    cadrage: "object-[50%_55%]",
  },
  {
    id: "plusieurs-chats",
    titre: "J'ai plusieurs chats",
    href: "/outils/combien-de-litieres/",
    photo: PHOTOS.sucetteBlackPearlSieste,
    cadrage: "object-[50%_55%]",
  },
];

// Bloc « Selon mon chat » : un profil de chat, sa photo et les pages qui lui répondent.
// `visible: false` = profil prêt mais masqué, en attendant l'article qui lui correspond (chat âgé).
export type Profil = {
  id: string;
  mot: [string, string]; // premier mot en grotesque, second en serif italique
  liens: { href: string; label: string }[];
  photo: Photo;
  cadrage: string;
  visible: boolean;
};

// Photo n° n du mur de l’accueil (src/lib/medias.ts), avec sa description.
const mur = (n: number): Photo => MUR[n - 1];

export const PROFILS: Profil[] = [
  {
    id: "appartement",
    mot: ["En", "appartement"],
    liens: [{ href: "/litieres/litiere-autonettoyante/", label: "Quelle litière autonettoyante choisir" }],
    photo: mur(21),
    cadrage: "object-[40%_50%]",
    visible: true,
  },
  {
    id: "plusieurs-chats",
    mot: ["Plusieurs", "chats"],
    liens: [{ href: "/litieres/litiere-autonettoyante/#B0DG59SQ5P", label: "La litière pour plusieurs chats" }],
    photo: PHOTOS.sucetteBlackPearlSieste,
    cadrage: "object-[50%_55%]",
    visible: true,
  },
  {
    id: "week-end",
    mot: ["Je pars le", "week-end"],
    liens: [
      { href: "/guides/partir-en-week-end-chat/", label: "La liste pour partir serein" },
      { href: "/litieres/litiere-autonettoyante/", label: "Une litière qui se vide seule" },
      { href: "/repas/distributeur-croquettes-chat/", label: "Un distributeur de croquettes" },
    ],
    photo: mur(14),
    cadrage: "object-[60%_50%]",
    visible: true,
  },
  {
    id: "boit-peu",
    mot: ["Il boit", "peu"],
    liens: [{ href: "/guides/mon-chat-ne-boit-pas/", label: "Mon chat ne boit pas : que faire" }],
    photo: PHOTOS.chatGrisTasse,
    cadrage: "object-[50%_50%]",
    visible: true,
  },
  {
    id: "chaton",
    mot: ["Un", "chaton"],
    liens: [{ href: "/guides/arrivee-chat-chaton-liste/", label: "La liste pour bien l'accueillir" }],
    photo: mur(18),
    cadrage: "object-[50%_50%]",
    visible: true,
  },
  {
    id: "chat-age",
    mot: ["Un chat", "âgé"],
    liens: [],
    photo: mur(29),
    cadrage: "object-[50%_50%]",
    visible: false,
  },
];
