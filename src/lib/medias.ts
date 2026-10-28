// Photos du site (fichiers dans public/media/, crédits détaillés dans content/credits.json).
// Les pages les appellent par leur nom : changer une photo ici la change partout.
// Règle « niveau luxe » : source de 3 000 px de large au moins, contrôlée à 100 %, fichier maître de
// 3 840 px au plus (jamais agrandi) ; next/image en tire les tailles utiles, en qualité 80.
export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  credit: string; // affiché sous la photo
};

export const PHOTOS = {
  chatBlanc: {
    src: "/media/accueil-chat-blanc.jpg",
    width: 3840,
    height: 2560,
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
  chatCartons: {
    src: "/media/methode-chat-cartons.jpg",
    width: 2000,
    height: 1335,
    alt: "Un chat roux et blanc assis bien droit à côté d'une pile de cartons.",
    credit: "Photo : 大 董, Pexels",
  },
  chatCarton: {
    src: "/media/methode-chat-carton.jpg",
    width: 2000,
    height: 1333,
    alt: "Un chat tigré assis au fond d'un carton ouvert, qui regarde l'objectif.",
    credit: "Photo : Jared Brotman, Pexels",
  },
} satisfies Record<string, Photo>;

// Chats détourés (fond retiré) qui traversent l'écran dans la section « Les petits soucis ».
// Décoratifs : texte alternatif vide, mais crédit affiché sous l'étape.
export const DETOURES = {
  bond: { src: "/media/detoure-chat-bond.webp", width: 1430, height: 1200, credit: "The3dragons, Unsplash" },
  saut: { src: "/media/detoure-chat-saut.webp", width: 522, height: 1200, credit: "Jan Laugesen, Pexels" },
  marche: { src: "/media/detoure-chat-marche.webp", width: 2294, height: 1001, credit: "Kai Arun, Unsplash" },
  tigre: { src: "/media/detoure-chat-tigre.webp", width: 1962, height: 1075, credit: "Anna Venezia, Pexels" },
} satisfies Record<string, Omit<Photo, "alt">>;

export type Detoure = (typeof DETOURES)[keyof typeof DETOURES];

// Image de partage par défaut sur les réseaux sociaux (1200 × 630).
export const IMAGE_PARTAGE = {
  url: "/og-moustache-malin.jpg",
  width: 1200,
  height: 630,
  alt: "Gros plan sur un chat blanc aux yeux verts.",
};
