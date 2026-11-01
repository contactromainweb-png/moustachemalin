// Photos du site (fichiers dans public/media/, crédits détaillés dans content/credits.json).
// Les pages les appellent par leur nom : changer une photo ici la change partout.
// Règle « niveau luxe » : source de 3 000 px de large au moins, contrôlée à 100 %, fichier maître à la taille
// utile, jamais agrandi ; next/image en tire les tailles utiles, en qualité 80.
export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  credit: string; // auteur et source, pour mémoire (la page /credits-photos/ lit content/credits.json)
  position?: string; // point gardé au centre quand la photo est recadrée (CSS object-position), sinon le centre
  legende?: string; // légende affichée sous la photo (PhotoMoyenne)
};

export const PHOTOS = {
  chatBlanc: {
    src: "/media/accueil-chat-blanc.jpg",
    width: 5165,
    height: 3443,
    alt: "Gros plan sur un chat blanc aux yeux verts, moustaches déployées, qui regarde l'objectif.",
    credit: "Photo : realfish, Unsplash",
  },
  // Recadrage vertical de la même photo (œil, truffe et moustaches) pour le premier écran sur téléphone.
  chatBlancTelephone: {
    src: "/media/accueil-chat-blanc-telephone.jpg",
    width: 1937,
    height: 3443,
    alt: "Gros plan sur l'œil vert et les moustaches d'un chat blanc.",
    credit: "Photo : realfish, Unsplash",
  },
  chatChaise: {
    src: "/media/litieres-chat-chaise.jpg",
    width: 3840,
    height: 2880,
    alt: "Un chat noir et blanc à poils longs assis sur une chaise blanche, dans une pièce claire et dépouillée.",
    credit: "Photo : Natalia Rudomin, Unsplash",
  },
  chatRobinet: {
    src: "/media/boire-chat-robinet.jpg",
    width: 3840,
    height: 2423,
    alt: "Une chatte tricolore qui boit, langue sortie, le filet d'eau d'un robinet au-dessus d'un lavabo blanc.",
    credit: "Photo : Sugarman Joe, Unsplash",
  },
  chatonBol: {
    src: "/media/boire-chaton-bol.jpg",
    width: 3840,
    height: 2561,
    alt: "Un chaton tigré et blanc qui lape l'eau d'un bol en verre.",
    credit: "Photo : Carolien van Oijen, Unsplash",
  },
  chatBol: {
    src: "/media/guide-chat-bol.jpg",
    width: 3840,
    height: 2560,
    alt: "Un chat roux qui boit dans un bol en inox posé sur une couverture.",
    credit: "Photo : Vlad Deep, Pexels",
  },
  chatSoleil: {
    src: "/media/chat-rayon-soleil.jpg",
    width: 3840,
    height: 2560,
    alt: "Un chat roux et blanc assis sur un parquet, dans un rayon de soleil, la tête levée vers l'objectif.",
    credit: "Photo : Kristina Yadykina, Unsplash",
  },
  chatonsArbre: {
    src: "/media/accueil-chatons-arbre.jpg",
    width: 3840,
    height: 2880,
    alt: "Deux chatons tigrés installés chacun sur une plateforme d'arbre à chat, contre un mur blanc.",
    credit: "Photo : mraqieb, Pexels",
  },
  chatGamelle: {
    src: "/media/repas-chat-gamelle.jpg",
    width: 3840,
    height: 2560,
    alt: "Une chatte tricolore qui lève les yeux de sa gamelle en inox remplie de croquettes, dans un rayon de soleil.",
    credit: "Photo : roselino rocha, Pexels",
  },
  chatMeuble: {
    src: "/media/litieres-chat-meuble.jpg",
    width: 3840,
    height: 2560,
    alt: "Un chat tigré aux yeux dorés qui avance prudemment sous un meuble, dans une lumière chaude.",
    credit: "Photo : Helena Jankovičová Kováčová, Pexels",
  },
  chatFenetre: {
    src: "/media/litieres-chat-fenetre.jpg",
    width: 3840,
    height: 2563,
    alt: "Un chat roux assis devant la fenêtre ouverte d'un appartement, dans la lumière du soir.",
    credit: "Photo : 大 董, Pexels",
  },
  chatsPasserelles: {
    src: "/media/griffer-chats-passerelles.jpg",
    width: 3840,
    height: 2563,
    alt: "Un chat noir et blanc et un chat tigré qui se promènent sur des passerelles en bois fixées à un mur blanc.",
    credit: "Photo : Arina Krasnikova, Pexels",
  },
  chatArbre: {
    src: "/media/griffer-chat-arbre.jpg",
    width: 3840,
    height: 2560,
    alt: "Un chat Devon Rex allongé sur la plateforme moelleuse d'un arbre à chat, près d'une fenêtre ensoleillée.",
    credit: "Photo : Chen EdisoN, Pexels",
  },
  chatGriffes: {
    src: "/media/griffer-chat-griffes.jpg",
    width: 3840,
    height: 2560,
    alt: "Un chat tigré dressé sur ses pattes arrière qui fait ses griffes sur un tronc, en contre-jour.",
    credit: "Photo : Fred AUGÉ, Pexels",
  },
  chatEvier: {
    src: "/media/boire-chat-robinet-evier.jpg",
    width: 3840,
    height: 2555,
    alt: "Un chat Bengal penché sur un lavabo blanc qui boit le filet d'eau du robinet.",
    credit: "Photo : Helena Jankovičová Kováčová, Pexels",
    position: "50% 30%",
  },
  // Photos personnelles de Romain (Kira), droits à lui. kira-assise-yeux-bleus : recadrée en carré sans le coin de
  // téléviseur ; portrait rond de « Qui écrit ici ».
  kiraAssise: {
    src: "/media/kira/kira-assise-yeux-bleus.jpg",
    width: 1704,
    height: 1704,
    alt: "Kira, la chatte de Romain, assise au salon",
    credit: "Photo : Romain, photo personnelle",
    position: "62% 40%",
  },
  kiraRegardeEnHaut: {
    src: "/media/kira/kira-regarde-en-haut.jpg",
    width: 1571,
    height: 2023,
    alt: "Kira qui regarde en l'air, attentive",
    credit: "Photo : Romain, photo personnelle",
    position: "50% 40%",
  },
  kiraTetePenchee: {
    src: "/media/kira/kira-tete-penchee.jpg",
    width: 1545,
    height: 1906,
    alt: "Kira, l'air innocent",
    credit: "Photo : Romain, photo personnelle",
    position: "45% 35%",
  },
  kiraDebout: {
    src: "/media/kira/kira-debout-deux-pattes.jpg",
    width: 1519,
    height: 2357,
    alt: "Kira debout sur ses pattes arrière pour attraper un jouet",
    credit: "Photo : Romain, photo personnelle",
    position: "50% 30%",
    legende: "Kira s'étire de tout son long pour attraper son jouet. Grimper et s'étirer, c'est un besoin.",
  },
  // Chats de la famille de Romain (photos personnelles, publiées avec l'accord de leurs propriétaires). Ce ne sont
  // jamais des photos de Kira ; aucun prénom de propriétaire n'est écrit.
  sucetteJardin: {
    src: "/media/famille/sucette-jardin-violettes.jpg",
    width: 1500,
    height: 2000,
    alt: "Sucette, la chatte de la compagne de Romain, au jardin parmi les violettes",
    credit: "Photo : Romain, photo personnelle",
    position: "50% 45%",
  },
  sucetteBlackPearlSieste: {
    src: "/media/famille/sucette-et-black-pearl-sieste.jpg",
    width: 1320,
    height: 1760,
    alt: "Sucette et Black Pearl, en pleine sieste au soleil",
    credit: "Photo : Romain, photo personnelle",
    legende: "Deux chats, deux caractères : avec plusieurs chats, la capacité du bac compte double.",
  },
  rebelleSieste: {
    src: "/media/famille/rebelle-sieste.jpg",
    width: 1341,
    height: 746,
    alt: "Rebelle, la chatte du père de Romain, en pleine sieste sur une table",
    credit: "Photo : Romain, photo personnelle",
  },
  imotepArbre: {
    src: "/media/famille/imotep-arbre-a-chat.jpg",
    width: 1376,
    height: 2208,
    alt: "Imotep, le chat de la sœur de Romain, installé sur son arbre à chat près d'une fenêtre",
    credit: "Photo : Romain, photo personnelle",
    legende: "Imotep, le chat de ma sœur, installé près de la fenêtre, en poste d'observation.",
  },
  chichouneGriffoir: {
    src: "/media/famille/chichoune-griffoir-carton.jpg",
    width: 1932,
    height: 1997,
    alt: "Chichoune, une chatte tricolore, debout sur un griffoir plat en carton",
    credit: "Photo : Romain, photo personnelle",
    legende: "Chichoune sur son griffoir en carton : les résidus autour, c'est le signe qu'il sert.",
  },
  chichouneUtiliseGriffoir: {
    src: "/media/famille/chichoune-utilise-griffoir.jpg",
    width: 1443,
    height: 1752,
    alt: "Chichoune penchée sur son griffoir en carton",
    credit: "Photo : Romain, photo personnelle",
  },
  // Kira sur son ancien arbre à chat (photo personnelle de Romain, prise le soir : légèrement éclaircie, 1536 × 2048).
  kiraArbre: {
    src: "/media/kira/kira-arbre-a-chat.jpg",
    width: 1536,
    height: 2048,
    alt: "Kira qui joue en haut de son ancien arbre à chat",
    credit: "Photo : Romain, photo personnelle",
    legende: "Kira sur son ancien arbre à chat, un modèle d'entrée de gamme qui ne fait pas partie de notre sélection.",
  },
  // Portrait de Romain (photo personnelle, 1518 × 1892 : utilisée telle quelle, jamais agrandie).
  romain: {
    src: "/media/romain.jpg",
    width: 1518,
    height: 1892,
    alt: "Romain, auteur de Moustache Malin",
    credit: "Photo : Romain",
    position: "50% 30%",
  },
} satisfies Record<string, Photo>;

// Scène 5 de l’accueil : le mur de photos (vignettes, petit côté 1 200 px) et sa photo centrale, plein écran au départ.
export const MUR_CENTRE: Photo = {
  src: "/media/mur-centre.jpg",
  width: 3840,
  height: 5760,
  alt: "Un chat roux et blanc couché sur un tapis, dans un salon lumineux, qui regarde l’objectif.",
  credit: "Helena Jankovičová Kováčová, Pexels",
};

export const MUR: Omit<Photo, "alt">[] = [
  { src: "/media/mur-01.jpg", width: 1800, height: 1200, credit: "Pixabay, Pexels" },
  { src: "/media/mur-02.jpg", width: 1200, height: 1226, credit: "Charles Pragnell, Pexels" },
  { src: "/media/mur-03.jpg", width: 1800, height: 1200, credit: "Anna Fusciello, Pexels" },
  { src: "/media/mur-04.jpg", width: 1800, height: 1200, credit: "Anete Lusina, Pexels" },
  { src: "/media/mur-05.jpg", width: 1200, height: 1800, credit: "Milada Vigerova, Pexels" },
  { src: "/media/mur-06.jpg", width: 1805, height: 1200, credit: "Mónika Erdei, Pexels" },
  { src: "/media/mur-07.jpg", width: 1200, height: 1800, credit: "cottonbro studio, Pexels" },
  { src: "/media/mur-08.jpg", width: 1800, height: 1200, credit: "Anna Hinckel, Pexels" },
  { src: "/media/mur-09.jpg", width: 1800, height: 1200, credit: "Anna Hinckel, Pexels" },
  { src: "/media/mur-10.jpg", width: 1800, height: 1200, credit: "Anna Hinckel, Pexels" },
  { src: "/media/mur-11.jpg", width: 1200, height: 1800, credit: "Lera Mk, Pexels" },
  { src: "/media/mur-12.jpg", width: 1800, height: 1200, credit: "Amelia Giannitto, Pexels" },
  { src: "/media/mur-13.jpg", width: 1200, height: 1800, credit: "witchagron buapa, Pexels" },
  { src: "/media/mur-14.jpg", width: 1800, height: 1200, credit: "Natalie Bond, Pexels" },
  { src: "/media/mur-15.jpg", width: 1200, height: 1800, credit: "MikeGz, Pexels" },
  { src: "/media/mur-16.jpg", width: 1800, height: 1200, credit: "Helena Jankovičová Kováčová, Pexels" },
  { src: "/media/mur-17.jpg", width: 1200, height: 1600, credit: "Deniz Krkl, Pexels" },
  { src: "/media/mur-18.jpg", width: 1806, height: 1200, credit: "Mahmoud Yahyaoui, Pexels" },
  { src: "/media/mur-19.jpg", width: 1800, height: 1200, credit: "Gundula Vogel, Pexels" },
  { src: "/media/mur-20.jpg", width: 1800, height: 1200, credit: "Michał Robak, Pexels" },
  { src: "/media/mur-21.jpg", width: 1800, height: 1200, credit: "krazyYangNA, Pexels" },
  { src: "/media/mur-22.jpg", width: 1200, height: 1800, credit: "Jared 'Shy' Chapman, Pexels" },
  { src: "/media/mur-23.jpg", width: 1800, height: 1200, credit: "Camilo Ospina, Pexels" },
  { src: "/media/mur-24.jpg", width: 1798, height: 1200, credit: "大 董, Pexels" },
  { src: "/media/mur-25.jpg", width: 1200, height: 1600, credit: "Hemant Singh, Pexels" },
  { src: "/media/mur-26.jpg", width: 1798, height: 1200, credit: "大 董, Pexels" },
  { src: "/media/mur-27.jpg", width: 1200, height: 1800, credit: "Nuray, Pexels" },
  { src: "/media/mur-28.jpg", width: 1649, height: 1200, credit: "Ayşegül Aytören, Pexels" },
  { src: "/media/mur-29.jpg", width: 1800, height: 1200, credit: "Magda Ehlers, Pexels" },
];

// Image de partage par défaut sur les réseaux sociaux (1200 × 630) : le logo, fabriqué par src/app/opengraph-image.tsx
// (servi à l'adresse /opengraph-image). Le layout la reçoit automatiquement ; les articles la redonnent ici.
export const IMAGE_PARTAGE = {
  url: "/opengraph-image/", // avec la barre finale (trailingSlash) : réponse directe, sans redirection
  width: 1200,
  height: 630,
  alt: "Logo Moustache Malin : une tête de chat orange aux six moustaches, qui fait un clin d'œil.",
};
