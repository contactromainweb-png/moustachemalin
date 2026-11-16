import { nombres, regleFiltre } from "./filtres.ts";
import type { ProfilChat } from "@/lib/profil";
import type { Product } from "@/lib/products";

// Quiz des comparatifs (pack de nuit 7) : une entrée par catégorie. Comme pour filtres.ts, chaque réponse a une
// règle lue dans la fiche produit (content/products/*.json), jamais une liste d'ASIN écrite à la main ; `null` =
// « peu importe », la réponse n'impose rien. Score d'un produit = nombre de réponses dont la règle le retient.
// `pourquoi` est le texte affiché sous « Pourquoi » quand la réponse retient le produit.
// `siProfil` : réponse cochée d'avance quand le profil du chat correspond (l'utilisateur peut la changer).
// Les « notes » s'affichent avec le résultat quand le profil correspond ; « {prenom} » y est remplacé par le prénom.
export type Morceau = string | { lien: string; texte: string };
type Reponse = {
  label: string;
  retient: ((p: Product) => boolean) | null;
  pourquoi?: string;
  siProfil?: Partial<Pick<ProfilChat, "age" | "nbChats" | "dehors">>;
};
type Note = {
  si: Partial<Pick<ProfilChat, "age" | "nbChats" | "dehors">>;
  place: "avant" | "apres";
  attention?: boolean;
  morceaux: Morceau[];
};
type Quiz = { kira: string; questions: { question: string; reponses: Reponse[] }[]; notes: Note[] };

// Version calculée au build, envoyée au navigateur : pour chaque réponse, les ASIN de la page qu'elle retient.
export type QuizCalcule = {
  categorie: string;
  kira: string;
  questions: {
    question: string;
    reponses: { label: string; asins: string[] | null; pourquoi?: string; siProfil?: Reponse["siProfil"] }[];
  }[];
  notes: Note[];
  produits: { asin: string; name: string; badge?: string }[];
};

const commence = (texte: string | undefined, debut: string) => !!texte && texte.toLowerCase().startsWith(debut.toLowerCase());
const contient = (texte: string | undefined, mot: string) => !!texte && texte.toLowerCase().includes(mot.toLowerCase());
const badge = (nom: string) => (p: Product) => p.badge === nom;
// Arbre à chat pour chaton ou chat âgé : 90 cm au plus et une rampe dans le nom.
const basEtRampe = (p: Product) => {
  const [h] = nombres(p.specs.hauteur);
  return h !== undefined && h <= 90 && contient(p.name, "rampe");
};

const QUIZ: Record<string, Quiz> = {
  "litiere-chat": {
    kira: "Moi, je recouvre ma litière pendant des heures, alors j'ai mon avis sur la question. 3 questions et je te montre les 2 qui collent.",
    questions: [
      {
        question: "Où veux-tu jeter la litière usagée ?",
        reponses: [
          { label: "À la poubelle, peu importe", retient: null },
          {
            label: "Au compost ou aux toilettes",
            // Seulement ce que dit la fiche (champ elimination) : une litière végétale ne se composte pas forcément.
            retient: (p) =>
              contient(p.specs.elimination, "compost") ||
              (contient(p.specs.elimination, "toilettes") && !contient(p.specs.elimination, "pas dans les toilettes")),
            pourquoi: "Se composte ou se jette aux toilettes (selon le fabricant)",
          },
        ],
      },
      {
        question: "Porter les sacs, c'est un souci ?",
        reponses: [
          { label: "Non", retient: null },
          {
            label: "Oui, je veux léger",
            retient: (p) => commence(p.specs.origine, "Végétale") || contient(p.specs.matiere, "Silice"),
            pourquoi: "Plus légère qu'une argile",
          },
        ],
      },
      {
        question: "Ta priorité ?",
        reponses: [
          {
            label: "Zéro odeur",
            retient: (p) => contient(p.specs.matiere, "charbon actif"),
            pourquoi: "Avec charbon actif contre les odeurs",
          },
          { label: "Petit budget", retient: badge("Le meilleur petit budget"), pourquoi: "Notre choix petit budget" },
          { label: "La changer le moins souvent", retient: (p) => !!p.specs.duree, pourquoi: "Durée annoncée par le fabricant" },
        ],
      },
    ],
    notes: [
      {
        si: { nbChats: "plusieurs" },
        place: "apres",
        morceaux: ["Avec plusieurs chats, ", { lien: "/outils/combien-de-litieres/", texte: "compte un bac par chat, plus un" }, "."],
      },
    ],
  },
  "litiere-autonettoyante": {
    kira: "Une litière qui se nettoie toute seule ? Moi qui passe un temps fou à recouvrir… 4 questions et je te montre les 2 qui collent.",
    questions: [
      {
        question: "Combien de chats l'utiliseront ?",
        reponses: [
          { label: "Un seul", retient: null },
          {
            label: "Plusieurs",
            retient: regleFiltre("litiere-autonettoyante", "plusieurs-chats"),
            pourquoi: "Bac à déchets d'au moins 11 L",
            siProfil: { nbChats: "plusieurs" },
          },
        ],
      },
      {
        question: "Elle sera près d'une chambre ?",
        reponses: [
          {
            label: "Oui, il faut qu'elle soit discrète",
            retient: regleFiltre("litiere-autonettoyante", "silencieuse"),
            pourquoi: "Annoncée à 45 dB au plus",
          },
          { label: "Non, peu importe", retient: null },
        ],
      },
      {
        question: "Ouverte ou fermée ?",
        reponses: [
          { label: "Ouverte, il n'aime pas être enfermé", retient: (p) => commence(p.specs.type, "Ouverte"), pourquoi: "Modèle ouvert" },
          {
            label: "Fermée, contre les projections et les odeurs",
            retient: (p) => commence(p.specs.type, "Fermée"),
            pourquoi: "Modèle fermé",
          },
          { label: "Peu importe", retient: null },
        ],
      },
      {
        question: "Ton budget ?",
        reponses: [
          { label: "Petit budget", retient: badge("Le meilleur petit budget"), pourquoi: "Notre choix petit budget" },
          { label: "Je veux le meilleur", retient: badge("Le meilleur globalement"), pourquoi: "Notre choix global" },
        ],
      },
    ],
    notes: [
      {
        // Libellé vérifié : la clé de spec est poidsChat, libellée « Poids du chat » dans SPEC_LABELS.
        si: { age: "chaton" },
        place: "avant",
        attention: true,
        morceaux: [
          "{prenom} est encore un chaton : chaque fabricant indique un poids ou un âge minimum (voir la ligne « Poids du chat » des fiches). En attendant, garde un bac classique à côté : ",
          { lien: "/litieres/meilleure-litiere-chat/", texte: "notre comparatif des litières pour chat" },
          ".",
        ],
      },
    ],
  },
  "fontaine-a-eau-chat": {
    kira: "Moi, je bois au robinet : l'eau qui coule, c'est mon truc. 4 questions et je te montre les 2 qui collent.",
    questions: [
      {
        question: "Combien de chats boiront ?",
        reponses: [
          { label: "Un seul", retient: null },
          {
            label: "Plusieurs",
            retient: (p) => Math.max(0, ...nombres(p.specs.capacite)) >= 3,
            pourquoi: "3 L ou plus, conseillé pour deux chats",
            siProfil: { nbChats: "plusieurs" },
          },
        ],
      },
      {
        question: "Où sera la fontaine ?",
        reponses: [
          {
            label: "Dans une chambre ou un studio",
            retient: regleFiltre("fontaine-a-eau-chat", "silencieuse"),
            pourquoi: "Annoncée à 30 dB au plus",
          },
          { label: "Dans une pièce de vie", retient: null },
        ],
      },
      {
        question: "Une prise à côté ?",
        reponses: [
          { label: "Oui", retient: null },
          {
            label: "Non, je veux la poser n'importe où",
            retient: regleFiltre("fontaine-a-eau-chat", "sans-fil"),
            pourquoi: "Fonctionne sur batterie",
          },
        ],
      },
      {
        question: "Ta priorité ?",
        reponses: [
          {
            label: "Un nettoyage facile, sur la durée",
            retient: regleFiltre("fontaine-a-eau-chat", "inox"),
            pourquoi: "Réservoir en inox",
          },
          { label: "Petit budget", retient: badge("Le meilleur petit budget"), pourquoi: "Notre choix petit budget" },
        ],
      },
    ],
    notes: [
      {
        si: { nbChats: "plusieurs" },
        place: "apres",
        morceaux: ["Même avec un grand réservoir, change l'eau au moins tous les deux ou trois jours."],
      },
    ],
  },
  "distributeur-croquettes-chat": {
    kira: "Mon humain me rapporte un jouet à chaque course. Pour les repas, 4 questions et je te montre les 2 distributeurs qui collent.",
    questions: [
      {
        question: "Combien de chats mangent ?",
        reponses: [
          { label: "Un seul", retient: null },
          {
            label: "Deux, la même chose",
            retient: regleFiltre("distributeur-croquettes-chat", "double-bol"),
            pourquoi: "2 bols servis en même temps",
          },
          {
            label: "Deux, des croquettes différentes",
            retient: (p) => contient(p.specs.capacite, "deux compartiments"),
            pourquoi: "Deux compartiments, pour deux croquettes",
          },
        ],
      },
      {
        question: "Pour régler les repas ?",
        reponses: [
          {
            label: "Depuis mon téléphone",
            retient: (p) => commence(p.specs.programmation, "Application"),
            pourquoi: "Repas réglés et suivis depuis l'application",
          },
          {
            label: "Avec un bouton, sans appli",
            retient: (p) => contient(p.specs.programmation, "sans application"),
            pourquoi: "Se règle sans téléphone",
          },
          {
            label: "Sans électricité, pour une courte absence",
            retient: regleFiltre("distributeur-croquettes-chat", "sans-electricite"),
            pourquoi: "Par gravité, sans pile ni prise",
          },
        ],
      },
      {
        question: "Le voir manger à distance ?",
        reponses: [
          {
            label: "Oui, avec une caméra",
            retient: regleFiltre("distributeur-croquettes-chat", "camera"),
            pourquoi: "Caméra, à regarder depuis le téléphone",
          },
          { label: "Non", retient: null },
        ],
      },
      {
        question: "Ton budget ?",
        reponses: [
          { label: "Petit budget", retient: badge("Le meilleur petit budget"), pourquoi: "Notre choix petit budget" },
          { label: "Peu importe", retient: null },
        ],
      },
    ],
    notes: [
      {
        si: { nbChats: "plusieurs" },
        place: "apres",
        morceaux: ["Avec des régimes différents, il faut deux distributeurs, ou un modèle à deux compartiments."],
      },
    ],
  },
  "arbre-a-chat": {
    kira: "J'ai eu un arbre à chat d'entrée de gamme, et je joue avec les pompons. 3 questions et je te montre les 2 qui collent.",
    questions: [
      {
        question: "Qui va grimper ?",
        reponses: [
          { label: "Un chaton", retient: basEtRampe, pourquoi: "Bas (moins de 90 cm), avec rampe", siProfil: { age: "chaton" } },
          { label: "Un chat âgé", retient: basEtRampe, pourquoi: "Bas (moins de 90 cm), avec rampe", siProfil: { age: "senior" } },
          {
            label: "Un grand chat, ou plusieurs",
            retient: (p) => contient(p.specs.chats, "2 à 4") || contient(p.specs.charge, "4 chats"),
            pourquoi: "Prévu pour plusieurs chats (selon le fabricant)",
            siProfil: { nbChats: "plusieurs" },
          },
          { label: "Un chat adulte", retient: null },
        ],
      },
      {
        question: "Ta place au sol ?",
        reponses: [
          {
            label: "Peu de place",
            retient: (p) => {
              if (contient(p.specs.encombrement, "faible emprise")) return true;
              const [a, b] = nombres(p.specs.encombrement);
              return a !== undefined && b !== undefined && a * b <= 1600;
            },
            pourquoi: "Petite emprise au sol",
          },
          { label: "J'ai de la place", retient: null },
        ],
      },
      {
        question: "Ta priorité ?",
        reponses: [
          {
            label: "La stabilité",
            retient: (p) => !!p.specs.stabilite || !!p.specs.fixation || contient(p.specs.securite, "basculement"),
            pourquoi: "Base lourde, anti-basculement ou fixation (selon le fabricant)",
          },
          { label: "Petit budget", retient: badge("Le meilleur petit budget"), pourquoi: "Notre choix petit budget" },
          { label: "Le look", retient: badge("Le plus design"), pourquoi: "Notre choix design" },
        ],
      },
    ],
    notes: [],
  },
  "griffoir-chat": {
    kira: "Dis-moi où griffe ton chat : 3 questions et je te montre les 2 griffoirs qui collent.",
    questions: [
      {
        question: "Où griffe-t-il ?",
        reponses: [
          {
            label: "Debout, sur l'accoudoir ou un meuble",
            retient: (p) => commence(p.specs.type, "Poteau") || contient(p.specs.type, "En L") || contient(p.specs.type, "vertical"),
            pourquoi: "Se griffe debout",
          },
          {
            label: "À plat, sur le tapis",
            retient: (p) =>
              contient(p.specs.type, "Plat") || contient(p.specs.type, "horizontal") || contient(p.specs.usage, "horizontal"),
            pourquoi: "Se griffe à plat",
          },
          {
            label: "Je veux protéger un endroit précis",
            retient: (p) => contient(p.specs.type, "adhésif") || p.badge === "Pour protéger le canapé",
            pourquoi: "Protège la zone abîmée",
          },
        ],
      },
      {
        question: "Sisal ou carton ?",
        reponses: [
          { label: "Qui dure longtemps", retient: (p) => contient(p.specs.matiere, "sisal"), pourquoi: "Sisal, plus résistant" },
          { label: "Le moins cher", retient: (p) => contient(p.specs.matiere, "carton"), pourquoi: "Carton, moins cher" },
          { label: "Peu importe", retient: null },
        ],
      },
      {
        question: "Combien de chats ?",
        reponses: [
          { label: "Un seul", retient: null },
          {
            label: "Plusieurs",
            retient: badge("Pour plusieurs chats"),
            pourquoi: "Plusieurs plaques, pour plusieurs chats",
            siProfil: { nbChats: "plusieurs" },
          },
        ],
      },
    ],
    notes: [],
  },
  chatiere: {
    kira: "Moi, je ne sors pas. Mais Sucette, Black Pearl et Imotep, oui. Avant de découper la porte : 3 questions et je te montre les 2 chatières qui collent.",
    questions: [
      {
        question: "Des chats du voisinage peuvent entrer, ou un de tes chats ne doit pas sortir ?",
        reponses: [
          { label: "Oui", retient: (p) => contient(p.specs.type, "puce"), pourquoi: "Ne s'ouvre que pour la puce de ton chat" },
          { label: "Non", retient: (p) => commence(p.specs.type, "Manuelle"), pourquoi: "Manuelle, sans pile" },
        ],
      },
      {
        question: "Ton chat est…",
        reponses: [
          {
            label: "Plutôt grand (Maine Coon…)",
            // Premier nombre de l'ouverture, en mm (× 10 si la fiche l'indique en cm).
            retient: (p) => {
              const [largeur] = nombres(p.specs.ouverture);
              if (largeur === undefined) return false;
              return (/\bcm\b/.test(p.specs.ouverture ?? "") ? largeur * 10 : largeur) >= 170;
            },
            pourquoi: "Ouverture d'au moins 17 cm de large",
          },
          { label: "De taille moyenne", retient: null },
        ],
      },
      {
        question: "Où la poser ?",
        reponses: [
          { label: "Dans une porte fine", retient: null },
          { label: "Dans un mur ou une porte épaisse", retient: badge("Pour murs et portes épais"), pourquoi: "Avec tunnel" },
        ],
      },
    ],
    notes: [
      {
        si: { dehors: "non" },
        place: "avant",
        morceaux: ["D'après son profil, {prenom} reste dedans : une chatière lui servira le jour où il sortira."],
      },
    ],
  },
};

// Le quiz d'une page, calculé sur les seuls produits de la page (jamais les fiches d'exemple de la catégorie).
// Le build échoue si une réponse qui impose quelque chose ne retient aucun produit de la page : on ne propose
// jamais une réponse sans résultat.
export function quizPour(categorie: string, produits: Product[]): QuizCalcule {
  const quiz = QUIZ[categorie];
  if (!quiz) throw new Error(`Aucun quiz pour la catégorie ${categorie} (src/lib/quiz.ts)`);
  const etrangers = produits.filter((p) => p.category !== categorie || p.exemple);
  if (etrangers.length) {
    throw new Error(`Quiz ${categorie} : produits hors catégorie ou d'exemple (${etrangers.map((p) => p.asin).join(", ")})`);
  }
  return {
    categorie,
    kira: quiz.kira,
    notes: quiz.notes,
    produits: produits.map((p) => ({ asin: p.asin, name: p.name, badge: p.badge })),
    questions: quiz.questions.map((q) => ({
      question: q.question,
      reponses: q.reponses.map(({ label, retient, pourquoi, siProfil }) => {
        const asins = retient ? produits.filter(retient).map((p) => p.asin) : null;
        if (asins && asins.length === 0) {
          throw new Error(`Quiz ${categorie} : la réponse « ${label} » (${q.question}) ne retient aucun produit de la page`);
        }
        return { label, asins, pourquoi, siProfil };
      }),
    })),
  };
}
