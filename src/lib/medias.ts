// Photos et vidéos du site (fichiers dans public/media/, crédits détaillés dans content/credits.json).
// Les pages les appellent par leur nom : changer une photo ici la change partout.
export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  credit: string; // affiché sous la photo
};

export const PHOTOS = {
  chatonSaut: {
    src: "/media/accueil-chaton-saut.jpg",
    width: 2000,
    height: 1333,
    alt: "Un chaton roux en plein saut, pattes tendues vers un rayon de soleil, dans un salon.",
    credit: "Photo : Dmytro Koplyk, Pexels",
  },
  chatTapisPoster: {
    src: "/media/accueil-chat-tapis-poster.jpg",
    width: 1280,
    height: 676,
    alt: "Un chat roux debout sur un tapis clair, la tête levée.",
    credit: "Vidéo : cottonbro studio, Pexels",
  },
  // Même image, recadrée en hauteur sur le chat : le téléphone n'affiche qu'une tranche du paysage.
  chatTapisPosterMobile: {
    src: "/media/accueil-chat-tapis-poster-mobile.jpg",
    width: 720,
    height: 948,
    alt: "Un chat roux debout sur un tapis clair, la tête levée.",
    credit: "Vidéo : cottonbro studio, Pexels",
  },
  chatFauteuil: {
    src: "/media/litieres-chat-fauteuil.jpg",
    width: 2000,
    height: 1333,
    alt: "Un chat tigré et blanc endormi, roulé en boule dans un fauteuil orange.",
    credit: "Photo : Erdem Horat, Pexels",
  },
  chatRobinet: {
    src: "/media/guide-chat-robinet.jpg",
    width: 2000,
    height: 1331,
    alt: "Un chat bengal penché sur un lavabo, qui boit l'eau qui coule du robinet.",
    credit: "Photo : Helena Jankovičová Kováčová, Pexels",
  },
  chatBol: {
    src: "/media/guide-chat-bol.jpg",
    width: 2000,
    height: 1333,
    alt: "Un chat roux qui boit dans un bol en inox posé sur une couverture.",
    credit: "Photo : Vlad Deep, Pexels",
  },
  chatSoleil: {
    src: "/media/chat-soleil.jpg",
    width: 2000,
    height: 1500,
    alt: "Un chat roux à poils longs allongé dans une flaque de soleil sur un sol clair.",
    credit: "Photo : Himanshu Tambe, Pexels",
  },
  chatonsArbre: {
    src: "/media/accueil-chatons-arbre.jpg",
    width: 2000,
    height: 1500,
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
  chatCanape: {
    src: "/media/methode-chat-canape.jpg",
    width: 2000,
    height: 1500,
    alt: "Un salon lumineux avec des plantes à la fenêtre, et un chat qui dort sur un canapé bleu au milieu des coussins.",
    credit: "Photo : Merve Bayar, Pexels",
  },
} satisfies Record<string, Photo>;

// Vidéo du premier écran : 1280 px par défaut, 1920 px pour les écrans larges (voir HeroVideo).
export const VIDEO_ACCUEIL = {
  src: "/media/accueil-chat-tapis.mp4",
  srcLarge: "/media/accueil-chat-tapis-1920.mp4",
  poster: PHOTOS.chatTapisPoster,
  posterMobile: PHOTOS.chatTapisPosterMobile,
};

// Image de partage par défaut sur les réseaux sociaux (1200 × 630).
export const IMAGE_PARTAGE = {
  url: "/og-moustache-malin.jpg",
  width: 1200,
  height: 630,
  alt: "Un chaton roux en plein saut dans un salon baigné de soleil.",
};
