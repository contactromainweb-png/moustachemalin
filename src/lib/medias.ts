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

// Image de partage par défaut sur les réseaux sociaux (1200 × 630).
export const IMAGE_PARTAGE = {
  url: "/og-moustache-malin.jpg",
  width: 1200,
  height: 630,
  alt: "Gros plan sur un chat blanc aux yeux verts.",
};
