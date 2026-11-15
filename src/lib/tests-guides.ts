import type { ProfilChat } from "@/lib/profil";
import type { Morceau } from "@/lib/quiz";

// Tests des guides (pack de nuit 7) : des cases à cocher et un résultat calculé dans le navigateur (TestGuide).
// Les cases cochées ne sont jamais enregistrées. « {prenom} » est remplacé par le prénom du profil, sinon « ton chat ».
// Les ancres (#…) sont celles des titres « ## » de la page générée (plugins/remark-sommaire.mjs), vérifiées au build
// de contrôle : ne pas les deviner.
export type CaseTest = {
  id: string;
  label: string;
  // Mention ajoutée au libellé quand le profil correspond.
  mention?: { si: Partial<Pick<ProfilChat, "nbChats" | "age" | "dehors">>; texte: string };
};
export type BlocResultat = { ton: "urgence" | "attention" | "normal" | "titre"; morceaux: Morceau[] } | { ton: "liste"; items: Morceau[][] };
export type TestGuideConfig = {
  slug: string;
  titre: string;
  niveau: 2 | 3;
  kira: string;
  groupes: { titre?: string; cases: CaseTest[] }[];
  resultat: (coches: Set<string>) => BlocResultat[];
  vide: string; // rien de coché
  toujours?: string;
};

const ASTUCES = "#8-astuces-pour-aider-votre-chat-a-boire-plus";
const ALERTE = "#quand-l-odeur-est-un-signal-d-alerte";

const boire: TestGuideConfig = {
  slug: "mon-chat-ne-boit-pas",
  titre: "{prenom} boit-il assez ? Le test en 30 secondes",
  niveau: 3,
  kira: "Moi, je bois au robinet : c'est mon côté star. Coche ce que tu observes chez {prenom}.",
  vide: "Coche ce qui ressemble à {prenom}.",
  groupes: [
    {
      cases: [
        { id: "gamelle", label: "Sa gamelle d'eau baisse à peine d'un jour à l'autre" },
        { id: "croquettes", label: "Il mange surtout des croquettes" },
        { id: "collee", label: "Sa gamelle d'eau est collée à sa gamelle de nourriture" },
        { id: "robinet", label: "Il préfère boire au robinet ou dans les verres" },
      ],
    },
    {
      titre: "Et ces signes-là ?",
      cases: [
        { id: "pli", label: "La peau pincée entre ses omoplates met plusieurs secondes à se remettre en place" },
        { id: "gencives", label: "Ses gencives sont sèches ou collantes" },
        { id: "yeux", label: "Ses yeux paraissent enfoncés" },
        { id: "fatigue", label: "Il est fatigué, mange moins ou se cache" },
      ],
    },
  ],
  resultat: (c) => {
    const alertes = ["pli", "gencives", "yeux", "fatigue"].filter((id) => c.has(id)).length;
    const habitudes = ["gamelle", "croquettes", "collee", "robinet"].filter((id) => c.has(id)).length;
    if (alertes > 0) {
      return [
        {
          ton: "attention",
          morceaux: [
            "Ces signes peuvent indiquer une déshydratation. Montre {prenom} à un vétérinaire rapidement, surtout s'il ne mange pas non plus.",
          ],
        },
      ];
    }
    if (habitudes >= 2) {
      return [
        {
          ton: "normal",
          morceaux: [
            "{prenom} boit peut-être un peu juste. ",
            { lien: ASTUCES, texte: "Les astuces plus bas" },
            " peuvent l'aider, à commencer par de l'eau loin de sa gamelle et une fontaine.",
          ],
        },
      ];
    }
    if (habitudes === 1) {
      return [
        {
          ton: "normal",
          morceaux: [
            "Rien d'inquiétant à première vue. Garde un œil sur sa gamelle d'eau, et lis ",
            { lien: ASTUCES, texte: "nos astuces" },
            " si tu veux qu'il boive un peu plus.",
          ],
        },
      ];
    }
    return [];
  },
  toujours: "Ce test ne remplace pas l'avis d'un vétérinaire.",
};

// Causes de l'odeur : libellé de la cause et liens vers la section du guide (et vers l'outil pour le nombre de bacs).
const CAUSES: Record<string, Morceau[]> = {
  ramassage: [{ lien: "#1-le-ramassage-n-est-pas-assez-frequent", texte: "Le ramassage" }],
  bac: [{ lien: "#2-le-bac-lui-meme-garde-les-odeurs", texte: "Le bac" }],
  litiere: [{ lien: "#3-la-litiere-n-est-pas-adaptee", texte: "La litière" }],
  nombre: [
    { lien: "#4-pas-assez-de-bacs-ou-mal-places", texte: "Le nombre de bacs" },
    " (et l'outil ",
    { lien: "/outils/combien-de-litieres/", texte: "« Combien de litières »" },
    ")",
  ],
  emplacement: [{ lien: "#4-pas-assez-de-bacs-ou-mal-places", texte: "L'emplacement" }],
};
const CAUSE_DE: Record<string, keyof typeof CAUSES> = {
  rythme: "ramassage",
  rayures: "bac",
  parfumee: "litiere",
  couche: "litiere",
  bacs: "nombre",
  placard: "emplacement",
};

const odeur: TestGuideConfig = {
  slug: "litiere-sent-mauvais",
  titre: "D'où vient l'odeur ? Le diagnostic en 1 minute",
  niveau: 2,
  kira: "Moi, je recouvre très bien. Mais même le meilleur recouvrement ne fait pas de miracle. Coche ce qui ressemble à chez toi.",
  vide: "Coche ce qui ressemble à chez toi.",
  groupes: [
    {
      cases: [
        { id: "rythme", label: "Je ramasse moins d'une fois par jour" },
        { id: "rayures", label: "Le bac a des rayures, ou garde l'odeur même lavé" },
        { id: "parfumee", label: "La litière est parfumée, ou n'est pas agglomérante" },
        { id: "couche", label: "La couche de litière fait moins de 3 cm" },
        {
          id: "bacs",
          label: "Il y a moins de bacs que de chats + 1",
          mention: { si: { nbChats: "plusieurs" }, texte: "(avec plusieurs chats, vérifie bien celle-ci)" },
        },
        { id: "placard", label: "Le bac est dans un placard ou un coin sans air" },
        { id: "alerte", label: "L'odeur est soudain plus forte, ou mon chat urine plus souvent ou hors du bac" },
        { id: "urgence", label: "Mon chat va souvent à la litière sans résultat, force ou miaule" },
      ],
    },
  ],
  resultat: (c) => {
    const blocs: BlocResultat[] = [];
    if (c.has("urgence")) {
      blocs.push({
        ton: "urgence",
        morceaux: [
          "Consulte un vétérinaire sans attendre : ça peut être une obstruction urinaire, une urgence (surtout chez un mâle). ",
          { lien: ALERTE, texte: "Quand l'odeur est un signal d'alerte" },
        ],
      });
    }
    if (c.has("alerte")) {
      blocs.push({
        ton: "attention",
        morceaux: ["Ça peut venir de sa santé : parles-en à ton vétérinaire. ", { lien: ALERTE, texte: "Quand l'odeur est un signal d'alerte" }],
      });
    }
    const causes = [...new Set(Object.keys(CAUSE_DE).filter((id) => c.has(id)).map((id) => CAUSE_DE[id]))];
    if (causes.length) {
      blocs.push({ ton: "titre", morceaux: ["Les causes probables chez toi :"] });
      blocs.push({ ton: "liste", items: causes.map((k) => CAUSES[k]) });
    }
    return blocs;
  },
};

export const TESTS_GUIDES: Record<string, TestGuideConfig> = { [boire.slug]: boire, [odeur.slug]: odeur };
