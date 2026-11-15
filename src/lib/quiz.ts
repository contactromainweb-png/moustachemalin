import { regleFiltre } from "@/lib/filtres";
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
