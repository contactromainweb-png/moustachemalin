import { useSyncExternalStore } from "react";
import { profilActuel } from "./profil.ts";

// Le carnet du chat (pack 8b) : ce que le site retient pour le visiteur, toujours dans son navigateur (localStorage,
// clé « mm-carnet »). Même façon de faire que profil.ts : lecture prudente, try/catch partout, repli en mémoire
// quand le stockage est refusé, null au rendu serveur et à l'hydratation.
// Principe de base : rien n'est retenu tant que le visiteur n'a pas créé le profil de son chat. Sans profil,
// majCarnet() ne fait rien et useCarnet() renvoie null. Rien ne part jamais du navigateur (ni vers nous, ni vers
// Umami). Jamais de prénom ici : il est dans le profil.
export type OutilsRetenus = {
  chats?: number;
  poids?: string;
  alimentation?: string;
  contenance?: string;
  ration?: string;
  modele?: string;
};
export type Carnet = {
  version: 1;
  equipement: string[]; // ids cochés (page /carnet/), essentiels et petits plus
  listes: Record<string, string[]>; // id de liste → ids des cases cochées
  lus: string[]; // slugs des articles lus jusqu'au bout (FinDeLecture)
  quiz: string[]; // catégories des quiz terminés
  tests: string[]; // slugs des guides dont le test a été fait
  outils: OutilsRetenus;
  bande?: true; // page de la bande visitée
};

const CLE = "mm-carnet";
const EVENEMENT = "mm-carnet";
const CLE_PROFIL = "mm-profil";

export const LUS_MAX = 100;
const TEXTE_MAX = 10; // poids, contenance, ration : texte saisi
const ID_MAX = 60;
const LISTES_MAX = 20;
const CASES_MAX = 60;

export const carnetVide = (): Carnet => ({ version: 1, equipement: [], listes: {}, lus: [], quiz: [], tests: [], outils: {} });

// Tableau de chaînes sans doublon, chaque chaîne non vide et bornée ; `max` garde les dernières entrées.
function chaines(valeur: unknown, max: number): string[] {
  if (!Array.isArray(valeur)) return [];
  const vus = new Set<string>();
  for (const v of valeur) {
    if (typeof v !== "string") continue;
    const s = v.trim();
    if (!s || s.length > ID_MAX) continue;
    vus.delete(s); // une entrée répétée passe en dernier (la plus récente)
    vus.add(s);
  }
  return [...vus].slice(-max);
}

const texteCourt = (v: unknown, max = TEXTE_MAX) => {
  if (typeof v !== "string" && typeof v !== "number") return undefined;
  const s = String(v).trim().slice(0, max).trim();
  return s ? s : undefined;
};

function outilsBornes(valeur: unknown): OutilsRetenus {
  if (!valeur || typeof valeur !== "object") return {};
  const o = valeur as Record<string, unknown>;
  const res: OutilsRetenus = {};
  const n = typeof o.chats === "number" ? o.chats : Number.NaN;
  if (Number.isInteger(n) && n >= 1 && n <= 10) res.chats = n;
  const poids = texteCourt(o.poids);
  if (poids) res.poids = poids;
  const contenance = texteCourt(o.contenance);
  if (contenance) res.contenance = contenance;
  const ration = texteCourt(o.ration);
  if (ration) res.ration = ration;
  const alimentation = texteCourt(o.alimentation, 20);
  if (alimentation && /^\d{1,4}\/\d{1,4}$/.test(alimentation)) res.alimentation = alimentation;
  if (typeof o.modele === "string" && /^[A-Z0-9]{10}$/.test(o.modele)) res.modele = o.modele;
  return res;
}

// Remet un carnet dans les bornes : tableaux sans doublon, `lus` à 100 slugs, valeurs d'outils courtes.
export function bornerCarnet(c: Partial<Carnet> & Record<string, unknown>): Carnet {
  const listes: Record<string, string[]> = {};
  if (c.listes && typeof c.listes === "object" && !Array.isArray(c.listes)) {
    for (const [cle, cases] of Object.entries(c.listes).slice(0, LISTES_MAX)) {
      if (!cle || cle.length > ID_MAX) continue;
      listes[cle] = chaines(cases, CASES_MAX);
    }
  }
  const carnet: Carnet = {
    version: 1,
    equipement: chaines(c.equipement, CASES_MAX),
    listes,
    lus: chaines(c.lus, LUS_MAX),
    quiz: chaines(c.quiz, 30),
    tests: chaines(c.tests, 30),
    outils: outilsBornes(c.outils),
  };
  if (c.bande === true) carnet.bande = true;
  return carnet;
}

// Lecture prudente : un carnet abîmé ou d'une autre version est ignoré (null).
export function lireCarnet(brut: string | null): Carnet | null {
  if (!brut) return null;
  try {
    const c = JSON.parse(brut);
    if (!c || typeof c !== "object" || Array.isArray(c) || c.version !== 1) return null;
    return bornerCarnet(c);
  } catch {
    return null;
  }
}

function brutStocke(): string | null {
  try {
    return window.localStorage.getItem(CLE);
  } catch {
    return null;
  }
}

// Repli en mémoire quand le stockage est refusé : le carnet tient le temps de la page.
let memoire: string | null = null;
let dernierBrut: string | null | undefined;
let dernierAvecProfil: boolean | undefined;
let dernierCarnet: Carnet | null = null;

function instantane(): Carnet | null {
  const avecProfil = !!profilActuel();
  const brut = brutStocke() ?? memoire;
  if (brut !== dernierBrut || avecProfil !== dernierAvecProfil) {
    dernierBrut = brut;
    dernierAvecProfil = avecProfil;
    dernierCarnet = avecProfil ? (lireCarnet(brut) ?? carnetVide()) : null;
  }
  return dernierCarnet;
}

function abonner(rappel: () => void) {
  const surStockage = (e: StorageEvent) => {
    if (e.key === null || e.key === CLE || e.key === CLE_PROFIL) rappel();
  };
  window.addEventListener("storage", surStockage); // autres onglets
  window.addEventListener(EVENEMENT, rappel); // cet onglet
  window.addEventListener("mm-profil", rappel); // profil créé ou oublié
  return () => {
    window.removeEventListener("storage", surStockage);
    window.removeEventListener(EVENEMENT, rappel);
    window.removeEventListener("mm-profil", rappel);
  };
}

// Le carnet, ou null (pas de profil, ou rendu serveur et hydratation : aucun écart entre le HTML et le client).
export function useCarnet(): Carnet | null {
  return useSyncExternalStore(abonner, instantane, () => null);
}

// Modifie le carnet. Ne fait rien s'il n'y a pas de profil enregistré. Renvoie true si le carnet a été modifié.
export function majCarnet(f: (c: Carnet) => Carnet): boolean {
  if (typeof window === "undefined" || !profilActuel()) return false;
  let actuel: Carnet;
  try {
    actuel = lireCarnet(brutStocke() ?? memoire) ?? carnetVide();
  } catch {
    actuel = carnetVide();
  }
  let suivant: Carnet;
  try {
    suivant = bornerCarnet(f(structuredClone(actuel)) as Carnet & Record<string, unknown>);
  } catch {
    return false;
  }
  const brut = JSON.stringify(suivant);
  try {
    window.localStorage.setItem(CLE, brut);
    memoire = null;
  } catch {
    memoire = brut;
  }
  try {
    window.dispatchEvent(new Event(EVENEMENT));
  } catch {
    // rien à faire
  }
  return true;
}

export function oublierCarnet() {
  memoire = null;
  try {
    window.localStorage.removeItem(CLE);
  } catch {
    // rien à faire
  }
  try {
    window.dispatchEvent(new Event(EVENEMENT));
  } catch {
    // rien à faire
  }
}

// Petites aides pour les composants.
export const ajouter = (tableau: string[], valeur: string) => (tableau.includes(valeur) ? tableau : [...tableau, valeur]);
export const basculerDans = (tableau: string[], valeur: string, coche: boolean) =>
  coche ? ajouter(tableau, valeur) : tableau.filter((v) => v !== valeur);

// Les 7 essentiels de la jauge : la partie « L'équipement indispensable dès le premier jour » du guide arrivée,
// rien d'autre (CLAUDE.md § 11 quinquies).
export const ESSENTIELS = ["litiere", "eau", "nourriture", "griffoir", "transport", "couchage", "jouets"] as const;
export const essentielsCoches = (c: Carnet | null) => (c ? ESSENTIELS.filter((id) => c.equipement.includes(id)).length : 0);
