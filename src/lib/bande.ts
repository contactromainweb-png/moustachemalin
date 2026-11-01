import type { Photo } from "@/lib/medias";

// Page /la-bande-de-kira/ : les chats de la famille de Romain (photos personnelles, publiées avec l'accord de leurs
// familles). Charte (CLAUDE.md §11, « La bande de Kira ») : seule Kira a une voix ; les cousins ne « parlent » pas.
// Chaque phrase visible est le texte exact de Romain, tiré de leurs traits réels, et jamais une copie de l'alt (qui,
// lui, décrit la photo). Aucune habitude inventée. Jamais le prénom de la compagne, du père ni de la
// sœur de Romain. Jamais de marque ni de modèle pour l'arbre à chat de Chichoune.
export type Cousin = { prenom: string; chezQui: string; phrase: string; photo: Photo };

export const BANDE: Cousin[] = [
  {
    prenom: "Sucette",
    chezQui: "La chatte de la compagne de Romain",
    phrase: "Sortie au jardin, pour une fois. D'habitude, Sucette dort en boule sur son fauteuil, sans un bruit.",
    photo: {
      src: "/media/famille/sucette-jardin-violettes.jpg",
      alt: "Sucette, la chatte tigrée de la compagne de Romain, dans l'herbe du jardin parmi les violettes",
      width: 1500,
      height: 2000,
      credit: "Photo : Romain, photo personnelle",
      position: "50% 35%",
    },
  },
  {
    prenom: "Black Pearl",
    chezQui: "Le chat de la compagne de Romain",
    phrase: "Caressez Black Pearl, il vous rend la pareille, à coups de langue.",
    photo: {
      src: "/media/famille/black-pearl-jardin.jpg",
      alt: "Black Pearl, le chat noir de la compagne de Romain, qui traverse le jardin la queue dressée",
      width: 1500,
      height: 2000,
      credit: "Photo : Romain, photo personnelle",
      position: "50% 55%",
    },
  },
  {
    prenom: "Rebelle",
    chezQui: "La chatte du père de Romain",
    phrase: "Rebelle porte bien son nom : elle n'en fait qu'à sa tête, et si elle n'a pas envie, c'est non.",
    photo: {
      src: "/media/famille/rebelle-sieste.jpg",
      alt: "Rebelle, la chatte rousse du père de Romain, en pleine sieste sur une table",
      width: 1341,
      height: 746,
      credit: "Photo : Romain, photo personnelle",
      position: "50% 60%",
    },
  },
  {
    prenom: "Imotep",
    chezQui: "Le chat de la sœur de Romain",
    phrase: "Le chat du quartier. Un miaulement devant la porte, et tout le monde a compris : dehors !",
    photo: {
      src: "/media/famille/imotep-chaise.jpg",
      alt: "Imotep, le chat tigré et blanc de la sœur de Romain, couché sur une chaise",
      width: 1455,
      height: 1482,
      credit: "Photo : Romain, photo personnelle",
      position: "50% 45%",
    },
  },
  {
    prenom: "Chichoune",
    chezQui: "La chatte de la sœur de Romain",
    phrase: "Câline et joueuse, Chichoune prend de la hauteur. Pour les caresses, elle préfère la table.",
    photo: {
      src: "/media/famille/chichoune-arbre-a-chat.jpg",
      alt: "Chichoune, la chatte tricolore de la sœur de Romain, dans la niche d'un arbre à chat",
      width: 1242,
      height: 2208,
      credit: "Photo : Romain, photo personnelle",
      position: "50% 28%",
    },
  },
];
