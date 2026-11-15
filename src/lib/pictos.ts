import type { Product } from "@/lib/products";

// Pastilles et barre de repère des fiches produits (PictosProduit), pour toutes les catégories. Fonction pure, testée
// par tests/pictos.test.ts. Règles : uniquement des mots tirés des specs (content/products/*.json) ; une spec absente
// n'affiche rien. Les icônes (clés ci-dessous) sont dessinées dans src/components/PictosProduit.tsx.
export type Icone =
  | "agglo" | "grains" | "feuille" | "pierre" | "sansParfum" | "charbon" | "compost" | "toilettes" | "poubelle"
  | "ouverte" | "fermee" | "appli" | "sansAppli" | "bac" | "bruit" | "poids"
  | "goutte" | "inox" | "plastique" | "sansFil" | "secteur" | "reserve" | "repas" | "camera" | "sansCourant" | "bol"
  | "hauteur" | "sol" | "plafond" | "ancre" | "vertical" | "formeL" | "plat" | "tapis" | "sisal" | "carton" | "feutre"
  | "reversible" | "clapet" | "puce" | "sansPile" | "piles" | "chats";

export type Picto = { icone: Icone; mot: string };
// Barre de repère : `debut` et `fin` entre 0 et 1 sur l'échelle (une seule valeur : debut = 0).
export type Barre = { titre: string; debut: number; fin: number; legende: string; note: string } | { titre: string; vide: string };

// Nombres d'un texte, virgule décimale comprise (même règle que nombres() de src/lib/filtres.ts, recopiée ici pour
// que le fichier se teste avec node seul, sans les alias « @/ » de Next).
const nombres = (t: string | undefined) => (t?.match(/\d+(?:,\d+)?/g) ?? []).map((n) => Number(n.replace(",", ".")));
const commence = (t: string | undefined, d: string) => !!t && t.toLowerCase().startsWith(d.toLowerCase());
const contient = (t: string | undefined, m: string) => !!t && t.toLowerCase().includes(m.toLowerCase());
export const fr = (n: number) => String(Math.round(n * 10) / 10).replace(".", ",");
const borne = (x: number) => Math.max(0, Math.min(1, x));

const maxi = (t: string | undefined) => {
  const n = nombres(t);
  return n.length ? Math.max(...n) : null;
};

// Première valeur suivie de l'unité voulue : « 3,8 L au total » → 3,8 ; rien sans l'unité.
function valeur(t: string | undefined, unite: string) {
  const m = t?.match(new RegExp(`(\\d+(?:,\\d+)?)\\s*${unite}\\b`));
  return m ? Number(m[1].replace(",", ".")) : null;
}

// Poids minimal accepté : « 1,5 à 8 kg » → 1,5 ; une phrase sans plage chiffrée en kg ne donne rien.
function poidsMini(t: string | undefined) {
  const m = t?.match(/(\d+(?:,\d+)?)\s*(?:à|-|–)\s*\d+(?:,\d+)?\s*kg/i) ?? t?.match(/dès\s*(\d+(?:,\d+)?)\s*kg/i);
  return m ? Number(m[1].replace(",", ".")) : null;
}

// Poids d'un sac ramené à 10 L, lu dans « 10 L, 8,6 kg » ; null si le volume ou le poids manque.
function poidsPour10L(sac: string | undefined) {
  const l = sac?.match(/(\d+(?:,\d+)?)\s*L\b/);
  const kg = sac?.match(/(\d+(?:,\d+)?)\s*kg/);
  if (!l || !kg) return null;
  const v = (Number(kg[1].replace(",", ".")) / Number(l[1].replace(",", "."))) * 10;
  return { kg: v, environ: contient(sac, "environ") };
}

// Bruit annoncé, sur la même échelle de 20 à 60 dB pour toutes les catégories (l'ancienne, de 30 à 60, écrasait
// les fontaines à 23 et 26 dB). « ≤ 40 dB » s'écrit « 40 dB au plus » ; « 35 à 45 dB » garde sa plage ; « environ »
// reste dans la légende.
const BRUIT_MIN = 20;
const BRUIT_MAX = 60;
export function barreBruit(bruit: string | undefined): Barre | null {
  const n = nombres(bruit);
  if (!n.length || !/db/i.test(bruit ?? "")) return null;
  const haut = Math.max(...n);
  const plage = n.length > 1 && /\d\s*(?:à|-|–)\s*\d/.test(bruit ?? "");
  const environ = contient(bruit, "environ") ? "environ " : "";
  const legende = /≤|au plus|maximum/i.test(bruit ?? "")
    ? `${environ}${fr(haut)} dB au plus`
    : plage
      ? `${environ}${fr(Math.min(...n))} à ${fr(haut)} dB`
      : `${environ}${fr(haut)} dB`;
  return {
    titre: "Bruit annoncé",
    debut: 0,
    fin: borne((haut - BRUIT_MIN) / (BRUIT_MAX - BRUIT_MIN)),
    legende,
    note: `échelle de ${BRUIT_MIN} à ${BRUIT_MAX} dB, plus court = plus discret`,
  };
}

const garde = (liste: (Picto | null | false)[]) => liste.filter((x): x is Picto => !!x);

export function pictosProduit(p: Product): { pastilles: Picto[]; barre: Barre | null } {
  const s = p.specs ?? {};
  switch (p.category) {
    case "litiere-chat": {
      const e = s.elimination;
      const poids = poidsPour10L(s.sac);
      return {
        pastilles: garde([
          commence(s.type, "Agglomérante")
            ? { icone: "agglo", mot: "Agglomérante" }
            : commence(s.type, "Non agglomérante") && { icone: "grains", mot: "Non agglomérante" },
          commence(s.origine, "Végétale")
            ? { icone: "feuille", mot: "Végétale" }
            : commence(s.origine, "Minérale") && { icone: "pierre", mot: "Minérale" },
          commence(s.parfum, "Sans") && { icone: "sansParfum", mot: "Sans parfum" },
          contient(s.matiere, "charbon actif") && { icone: "charbon", mot: "Charbon actif" },
          contient(e, "compost") && { icone: "compost", mot: "Compost" },
          contient(e, "toilettes") && !contient(e, "pas dans les toilettes") && { icone: "toilettes", mot: "Toilettes" },
          (contient(e, "poubelle") || contient(e, "ordures")) && { icone: "poubelle", mot: "Poubelle" },
        ]),
        barre: poids
          ? {
              titre: "Poids pour 10 L",
              debut: 0,
              fin: borne(poids.kg / 12),
              legende: `${poids.environ ? "environ " : ""}${fr(poids.kg)} kg pour 10 L`,
              note: "échelle de 0 à 12 kg",
            }
          : { titre: "Poids pour 10 L", vide: "poids non précisé" },
      };
    }
    case "litiere-autonettoyante": {
      const bac = nombres(s.bacDechets?.split("(")[0])[0];
      const db = maxi(s.bruit);
      const kg = poidsMini(s.poidsChat);
      return {
        pastilles: garde([
          commence(s.type, "Ouverte")
            ? { icone: "ouverte", mot: "Ouverte" }
            : commence(s.type, "Fermée") && { icone: "fermee", mot: "Fermée" },
          commence(s.application, "Oui")
            ? { icone: "appli", mot: "Appli" }
            : commence(s.application, "Non") && { icone: "sansAppli", mot: "Sans appli" },
          bac !== undefined && { icone: "bac", mot: `Bac ${fr(bac)} L` },
          db !== null && /db/i.test(s.bruit ?? "") && { icone: "bruit", mot: `${fr(db)} dB` },
          kg !== null && { icone: "poids", mot: `Dès ${fr(kg)} kg` },
        ]),
        barre: barreBruit(s.bruit),
      };
    }
    case "fontaine-a-eau-chat": {
      const litres = valeur(s.capacite, "L");
      const plastique = contient(s.materiau, "plastique") || commence(s.materiau, "ABS");
      const inox = contient(s.materiau, "inox");
      return {
        pastilles: garde([
          litres !== null && { icone: "goutte", mot: `${fr(litres)} L` },
          plastique
            ? { icone: "plastique", mot: inox ? "Plastique et inox" : "Plastique" }
            : inox && { icone: "inox", mot: "Inox" },
          // D'après le DÉBUT de la spec : « Secteur (seule la pompe est sans fil) » donne « Secteur ».
          commence(s.alimentation, "Secteur")
            ? { icone: "secteur", mot: "Secteur" }
            : (commence(s.alimentation, "Sans fil") || commence(s.alimentation, "Batterie")) && {
                icone: "sansFil",
                mot: "Sans fil",
              },
          commence(s.application, "Oui") && { icone: "appli", mot: "Appli" },
        ]),
        barre: barreBruit(s.bruit),
      };
    }
    case "distributeur-croquettes-chat": {
      const litres = valeur(s.capacite, "L");
      const repas = s.repas?.match(/(\d+)\s*repas/i);
      const gravite = contient(s.fonctionnement, "gravité") || contient(s.repas, "gravité");
      const sansAppli = contient(s.programmation, "sans application") || commence(s.programmation, "Aucune");
      return {
        pastilles: garde([
          litres !== null && { icone: "reserve", mot: `${fr(litres)} L` },
          sansAppli
            ? { icone: "sansAppli", mot: "Sans appli" }
            : contient(s.programmation, "application") && { icone: "appli", mot: "Appli" },
          !!repas && { icone: "repas", mot: `Jusqu'à ${repas[1]} repas` },
          !!s.camera && { icone: "camera", mot: "Caméra" },
          gravite && { icone: "sansCourant", mot: "Sans électricité" },
          (contient(s.bol, "inox") || contient(s.bols, "inox")) && { icone: "bol", mot: "Bol inox" },
        ]),
        barre:
          litres !== null
            ? { titre: "Capacité", debut: 0, fin: borne(litres / 6), legende: `${fr(litres)} L`, note: "échelle de 0 à 6 L" }
            : null,
      };
    }
    case "arbre-a-chat": {
      const plafond = contient(s.fixation, "plafond") || contient(s.hauteur, "plafond");
      const n = nombres(s.hauteur);
      const sol = s.encombrement?.match(/(\d+(?:,\d+)?)\s*×\s*(\d+(?:,\d+)?)\s*cm/);
      const ECHELLE = 280;
      let barre: Barre | null = null;
      let hauteur: string | null = null;
      if (plafond && n.length >= 2) {
        hauteur = `${fr(Math.min(...n))} à ${fr(Math.max(...n))} cm`;
        barre = {
          titre: "Hauteur",
          debut: borne(Math.min(...n) / ECHELLE),
          fin: borne(Math.max(...n) / ECHELLE),
          legende: `${hauteur}, réglable`,
          note: `échelle de 0 à ${ECHELLE} cm`,
        };
      } else if (n.length) {
        hauteur = `${fr(n[0])} cm de haut`;
        barre = { titre: "Hauteur", debut: 0, fin: borne(n[0] / ECHELLE), legende: `${fr(n[0])} cm`, note: `échelle de 0 à ${ECHELLE} cm` };
      }
      return {
        pastilles: garde([
          !!hauteur && { icone: "hauteur", mot: hauteur },
          !!sol && { icone: "sol", mot: `${sol[1]} × ${sol[2]} cm au sol` },
          plafond && contient(s.fixation, "plafond") && { icone: "plafond", mot: "Fixé au plafond" },
          (contient(s.securite, "anti-basculement") || contient(s.stabilite, "anti-basculement")) && {
            icone: "ancre",
            mot: "Anti-basculement",
          },
        ]),
        barre,
      };
    }
    case "griffoir-chat": {
      const h = contient(s.hauteur, "sans objet") ? null : valeur(s.hauteur, "cm");
      return {
        pastilles: garde([
          commence(s.type, "Poteau") || commence(s.type, "Vertical")
            ? { icone: "vertical", mot: "Vertical" }
            : commence(s.type, "En L")
              ? { icone: "formeL", mot: "En L" }
              : commence(s.type, "Plat")
                ? { icone: "plat", mot: "Plat" }
                : commence(s.type, "Tapis") && { icone: "tapis", mot: "Tapis" },
          contient(s.matiere, "sisal")
            ? { icone: "sisal", mot: "Sisal" }
            : contient(s.matiere, "carton")
              ? { icone: "carton", mot: "Carton" }
              : contient(s.matiere, "feutre") && { icone: "feutre", mot: "Feutre" },
          !!s.reversible && { icone: "reversible", mot: "Réversible" },
        ]),
        barre: h !== null ? { titre: "Hauteur", debut: 0, fin: borne(h / 100), legende: `${fr(h)} cm`, note: "échelle de 0 à 100 cm" } : null,
      };
    }
    case "chatiere": {
      const ids = s.animaux?.match(/jusqu'à\s*(\d+)\s*identifiants/i);
      // Largeur de passage : la première dimension de « 146 × 135 mm », convertie en cm.
      const o = s.ouverture?.match(/(\d+(?:,\d+)?)\s*×\s*\d+(?:,\d+)?\s*(mm|cm)/);
      const largeur = o ? Number(o[1].replace(",", ".")) / (o[2] === "mm" ? 10 : 1) : null;
      return {
        pastilles: garde([
          commence(s.type, "Manuelle")
            ? { icone: "clapet", mot: "Manuelle" }
            : commence(s.type, "Électronique") && { icone: "puce", mot: "À puce" },
          commence(s.alimentation, "Aucune")
            ? { icone: "sansPile", mot: "Sans pile" }
            : !!s.alimentation && { icone: "piles", mot: "Piles" },
          !!ids && { icone: "chats", mot: `${ids[1]} chats max` },
        ]),
        barre:
          largeur !== null
            ? {
                titre: "Largeur de passage",
                debut: 0,
                fin: borne(largeur / 25),
                legende: `${fr(largeur)} cm`,
                note: "échelle de 0 à 25 cm",
              }
            : null,
      };
    }
    default:
      return { pastilles: [], barre: null };
  }
}
