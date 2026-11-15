import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

// Un faux navigateur : localStorage en mémoire, événements sans effet.
const stock = new Map<string, string>();
let bloque = false;
(globalThis as unknown as { window: unknown }).window = {
  localStorage: {
    getItem: (k: string) => {
      if (bloque) throw new Error("SecurityError");
      return stock.get(k) ?? null;
    },
    setItem: (k: string, v: string) => {
      if (bloque) throw new Error("QuotaExceededError");
      stock.set(k, v);
    },
    removeItem: (k: string) => {
      if (bloque) throw new Error("SecurityError");
      stock.delete(k);
    },
  },
  dispatchEvent: () => true,
  addEventListener: () => {},
  removeEventListener: () => {},
};

const { bornerCarnet, lireCarnet, majCarnet, oublierCarnet, LUS_MAX } = await import("../src/lib/carnet.ts");

const PROFIL = JSON.stringify({ prenom: "Mochi", age: "chaton", nbChats: "plusieurs", dehors: "oui", version: 1 });
const lu = () => JSON.parse(stock.get("mm-carnet") ?? "null");

beforeEach(() => {
  stock.clear();
  bloque = false;
  oublierCarnet();
});

test("lecture : un carnet abîmé, vide ou d'une autre version est ignoré", () => {
  assert.equal(lireCarnet(null), null);
  assert.equal(lireCarnet("{pas du json"), null);
  assert.equal(lireCarnet("[]"), null);
  assert.equal(lireCarnet('"texte"'), null);
  assert.equal(lireCarnet(JSON.stringify({ version: 2, lus: ["a"] })), null);
  // Version 1 avec des champs abîmés : les champs sont remis à zéro, le reste est gardé.
  const c = lireCarnet(JSON.stringify({ version: 1, equipement: "litiere", lus: [1, "guide", null], listes: [1] }));
  assert.deepEqual(c?.equipement, []);
  assert.deepEqual(c?.lus, ["guide"]);
  assert.deepEqual(c?.listes, {});
});

test("bornes : sans doublon, 100 slugs lus au plus, valeurs d'outils courtes", () => {
  const lus = Array.from({ length: 130 }, (_, i) => `article-${i}`);
  const c = bornerCarnet({
    version: 1,
    equipement: ["litiere", "litiere", "eau"],
    lus: [...lus, "article-5"],
    listes: { "partir-en-week-end": ["eau", "eau", "bac"] },
    outils: { chats: 11, poids: "4,5 kg et des poussières", contenance: "3", ration: 60 as unknown as string, modele: "pas un asin", alimentation: "120/40" },
  });
  assert.deepEqual(c.equipement, ["litiere", "eau"]);
  assert.equal(c.lus.length, LUS_MAX);
  assert.equal(c.lus.at(-1), "article-5"); // relu : passe en dernier
  assert.deepEqual(c.listes["partir-en-week-end"], ["eau", "bac"]);
  assert.equal(c.outils.chats, undefined);
  assert.equal(c.outils.poids, "4,5 kg et");
  assert.ok(c.outils.poids!.length <= 10);
  assert.equal(c.outils.ration, "60");
  assert.equal(c.outils.modele, undefined);
  assert.equal(c.outils.alimentation, "120/40");
  assert.equal(bornerCarnet({ outils: { chats: 2.5 } }).outils.chats, undefined);
  assert.equal(bornerCarnet({ outils: { chats: 10 } }).outils.chats, 10);
  assert.equal(bornerCarnet({ outils: { chats: 0 } }).outils.chats, undefined);
});

test("jamais de prénom ni de champ inconnu dans le carnet", () => {
  const c = bornerCarnet({ version: 1, prenom: "Mochi" } as never);
  assert.equal("prenom" in c, false);
});

test("aucune écriture sans profil", () => {
  assert.equal(majCarnet((c) => ({ ...c, lus: ["guide"] })), false);
  assert.equal(stock.has("mm-carnet"), false);
  // Profil abîmé : toujours rien.
  stock.set("mm-profil", "{abîmé");
  assert.equal(majCarnet((c) => ({ ...c, lus: ["guide"] })), false);
  assert.equal(stock.has("mm-carnet"), false);
});

test("avec profil : écriture, puis « oublier » efface la clé", () => {
  stock.set("mm-profil", PROFIL);
  assert.equal(majCarnet((c) => ({ ...c, equipement: ["litiere"] })), true);
  assert.deepEqual(lu().equipement, ["litiere"]);
  assert.equal(lu().version, 1);
  oublierCarnet();
  assert.equal(stock.has("mm-carnet"), false);
});

test("stockage bloqué : aucune erreur", () => {
  stock.set("mm-profil", PROFIL);
  bloque = true;
  assert.doesNotThrow(() => majCarnet((c) => ({ ...c, lus: ["guide"] })));
  assert.doesNotThrow(() => oublierCarnet());
});
