// Les listes qui se souviennent (pack 8b) : chaque liste à mémoire, avec les `id` stables de ses cases, dans l'ordre
// du guide. ListeSignes (prop `memoire`) vérifie au build que les `id` du MDX sont exactement ceux-ci : une case
// ajoutée, retirée ou renommée dans le guide doit l'être ici aussi, sinon le build échoue.
// `equipement` : cases de la liste qui lisent et écrivent dans l'équipement du carnet (la jauge des 7 essentiels)
// au lieu de listes[id].
export type ListeMemoire = {
  id: string;
  titre: string;
  href: string; // la liste dans son guide (ancre relevée dans la page générée)
  cases: string[];
  equipement?: Record<string, string>;
  prefixeIgnore?: string; // entrées de listes[id] qui ne sont pas des cases (ex. « choix:debout » du plan)
};

export const LISTES_MEMOIRE: ListeMemoire[] = [
  {
    id: "arrivee-chat",
    titre: "L'arrivée du chat",
    href: "/guides/arrivee-chat-chaton-liste/#la-liste-a-cocher",
    cases: [
      "certificat",
      "identification",
      "veterinaire",
      "litiere",
      "gamelles",
      "nourriture",
      "griffoir",
      "transport",
      "couchage",
      "jouets",
      "piece-calme",
      "securite",
    ],
    equipement: {
      litiere: "litiere",
      gamelles: "eau",
      nourriture: "nourriture",
      griffoir: "griffoir",
      transport: "transport",
      couchage: "couchage",
      jouets: "jouets",
    },
  },
  {
    id: "partir-en-week-end",
    titre: "Partir en week-end",
    href: "/guides/partir-en-week-end-chat/#la-liste-a-cocher-avant-de-partir",
    cases: ["deux-points-eau", "fontaine", "croquettes", "bac-en-plus", "fenetres", "produits", "pieces-fraiches", "occupation", "proche"],
  },
  {
    id: "plan-griffes",
    titre: "Le plan anti-griffes",
    href: "/griffer-grimper/chat-griffe-canape/#plan-anti-griffes",
    cases: ["etape-1", "etape-2", "etape-3", "etape-4", "etape-5"],
    prefixeIgnore: "choix:",
  },
];

export function listeMemoire(id: string): ListeMemoire {
  const l = LISTES_MEMOIRE.find((x) => x.id === id);
  if (!l) throw new Error(`Liste à mémoire inconnue : ${id} (src/lib/listes.ts)`);
  return l;
}

// Cases cochées d'une liste, d'après le carnet (cases de la liste + cases reliées à l'équipement).
export function cochesDeListe(
  liste: ListeMemoire,
  carnet: { listes: Record<string, string[]>; equipement: string[] } | null,
): Set<string> {
  const coches = new Set<string>();
  if (!carnet) return coches;
  const propres = carnet.listes[liste.id] ?? [];
  for (const c of liste.cases) {
    const eq = liste.equipement?.[c];
    if (eq ? carnet.equipement.includes(eq) : propres.includes(c)) coches.add(c);
  }
  return coches;
}

// Liste « jamais commencée » : rien dans listes[id] (pas même une réponse) et aucune case cochée.
export const listeCommencee = (liste: ListeMemoire, carnet: { listes: Record<string, string[]>; equipement: string[] }) =>
  (carnet.listes[liste.id]?.length ?? 0) > 0 || cochesDeListe(liste, carnet).size > 0;
