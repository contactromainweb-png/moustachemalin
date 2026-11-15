import { useSyncExternalStore } from "react";

// Le profil du chat du visiteur (pack de nuit 7) : prénom, âge, nombre de chats, accès à l'extérieur.
// Il reste dans le navigateur (localStorage, clé « mm-profil ») : rien n'est envoyé, ni à nous ni à l'outil de
// statistiques. Tout est protégé par try/catch : en navigation privée ou avec un stockage plein ou bloqué, le site
// marche quand même, simplement sans mémoire. Le prénom est toujours affiché comme du texte (jamais comme du HTML).
export type ProfilChat = {
  prenom: string;
  age: "chaton" | "adulte" | "senior";
  nbChats: "1" | "plusieurs";
  dehors: "oui" | "non";
  version: 1;
};

const CLE = "mm-profil";
const EVENEMENT = "mm-profil";
export const PRENOM_MAX = 20;

const AGES = ["chaton", "adulte", "senior"] as const;
const NB = ["1", "plusieurs"] as const;
const DEHORS = ["oui", "non"] as const;

export function nettoyerPrenom(prenom: string) {
  return prenom.trim().slice(0, PRENOM_MAX).trim();
}

// Lecture prudente : un profil abîmé ou d'une autre version est ignoré.
function lire(brut: string | null): ProfilChat | null {
  if (!brut) return null;
  try {
    const p = JSON.parse(brut) as Partial<ProfilChat>;
    const prenom = typeof p.prenom === "string" ? nettoyerPrenom(p.prenom) : "";
    if (
      p.version !== 1 ||
      !prenom ||
      !AGES.includes(p.age as ProfilChat["age"]) ||
      !NB.includes(p.nbChats as ProfilChat["nbChats"]) ||
      !DEHORS.includes(p.dehors as ProfilChat["dehors"])
    ) {
      return null;
    }
    return { prenom, age: p.age!, nbChats: p.nbChats!, dehors: p.dehors!, version: 1 };
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

// Repli en mémoire quand le stockage est refusé : le profil tient le temps de la page.
let memoire: string | null = null;
let dernierBrut: string | null | undefined;
let dernierProfil: ProfilChat | null = null;

function instantane(): ProfilChat | null {
  const brut = brutStocke() ?? memoire;
  if (brut !== dernierBrut) {
    dernierBrut = brut;
    dernierProfil = lire(brut);
  }
  return dernierProfil;
}

function abonner(rappel: () => void) {
  const surStockage = (e: StorageEvent) => {
    if (e.key === null || e.key === CLE) rappel();
  };
  window.addEventListener("storage", surStockage); // autres onglets
  window.addEventListener(EVENEMENT, rappel); // cet onglet
  return () => {
    window.removeEventListener("storage", surStockage);
    window.removeEventListener(EVENEMENT, rappel);
  };
}

// Le profil, ou null. Toujours null au rendu serveur et à l'hydratation : aucun écart entre le HTML et le client.
export function useProfil(): ProfilChat | null {
  return useSyncExternalStore(abonner, instantane, () => null);
}

// Renvoie true si le profil est bien enregistré dans le navigateur, false s'il ne tient qu'en mémoire.
export function enregistrerProfil(profil: Omit<ProfilChat, "version" | "prenom"> & { prenom: string }): boolean {
  const complet: ProfilChat = { ...profil, prenom: nettoyerPrenom(profil.prenom), version: 1 };
  const brut = JSON.stringify(complet);
  try {
    window.localStorage.setItem(CLE, brut);
    memoire = null;
    window.dispatchEvent(new Event(EVENEMENT));
    return true;
  } catch {
    // Stockage refusé : on garde le profil en mémoire pour cette page.
    memoire = brut;
    window.dispatchEvent(new Event(EVENEMENT));
    return false;
  }
}

export function oublierProfil() {
  memoire = null;
  try {
    window.localStorage.removeItem(CLE);
  } catch {
    // rien à faire
  }
  window.dispatchEvent(new Event(EVENEMENT));
}

// Vrai seulement côté client, après l'hydratation : pour les blocs qui ne s'affichent qu'avec JavaScript.
const rien = () => () => {};
export function useMonte(): boolean {
  return useSyncExternalStore(
    rien,
    () => true,
    () => false,
  );
}

// « {prenom} » remplacé par le prénom, ou par « ton chat » (« Ton chat » en début de phrase).
export function avecPrenom(texte: string, prenom: string | null | undefined) {
  if (prenom) return texte.replaceAll("{prenom}", prenom);
  return texte.replace(/(^|[.!?:]\s+|«\s?)\{prenom\}/g, (_, avant) => `${avant}Ton chat`).replaceAll("{prenom}", "ton chat");
}
