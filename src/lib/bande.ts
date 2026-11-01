import type { Photo } from "@/lib/medias";

// Page /la-bande-de-kira/ : les chats de la famille de Romain (photos personnelles, publiées avec l'accord de leurs
// familles). Charte (CLAUDE.md §11) : seule Kira a une voix ; les cousins ne « parlent » pas, et chaque phrase décrit
// seulement ce qu'on voit sur la photo, sans habitude inventée. Jamais le prénom de la compagne, du père ni de la
// sœur de Romain. Jamais de marque ni de modèle pour l'arbre à chat de Chichoune.
export type Cousin = { prenom: string; chezQui: string; phrase: string; photo: Photo };

export const BANDE: Cousin[] = [
  {
    prenom: "Sucette",
    chezQui: "La chatte de la compagne de Romain",
    phrase: "Une chatte tigrée qui avance dans l'herbe du jardin, au milieu des violettes.",
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
    phrase: "Un chat noir qui traverse le jardin, la queue dressée.",
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
    phrase: "Une chatte rousse en pleine sieste, couchée sur une table.",
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
    phrase: "Un chat tigré et blanc couché sur une chaise, qui regarde l'objectif.",
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
    phrase: "Une chatte tricolore installée dans la niche d'un arbre à chat, entre deux poteaux.",
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
