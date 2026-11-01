import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { filtresPour, nombres } from "../src/lib/filtres.ts";
import type { Product } from "../src/lib/products.ts";

// Les vraies fiches de content/products/, par catégorie.
const DOSSIER = path.join(import.meta.dirname, "..", "content", "products");
const fiches: Product[] = fs
  .readdirSync(DOSSIER)
  .map((f) => JSON.parse(fs.readFileSync(path.join(DOSSIER, f), "utf8")));
const noms = (categorie: string) => {
  const produits = fiches.filter((p) => p.category === categorie && !p.exemple);
  return Object.fromEntries(
    filtresPour(produits).map((f) => [f.id, f.asins.map((a) => produits.find((p) => p.asin === a)!.slug).sort()]),
  );
};

test("nombres : virgule décimale et fourchettes", () => {
  assert.deepEqual(nombres("2,5 L"), [2.5]);
  assert.deepEqual(nombres("35 à 45 dB annoncés"), [35, 45]);
  assert.deepEqual(nombres(undefined), []);
});

test("litières : bac de 11 L et plus, bruit chiffré, aucune sans application", () => {
  assert.deepEqual(noms("litiere-autonettoyante"), {
    "petit-budget": ["jummico-ouverte-12l"],
    "plusieurs-chats": ["catlink-ouverte-12l", "jummico-ouverte-12l", "neakasa-m1-lite"],
    silencieuse: ["petkit-purobot-max-pro-2"],
    "sans-appli": [],
  });
});

test("fontaines : inox, 30 dB au plus, sur batterie", () => {
  assert.deepEqual(noms("fontaine-a-eau-chat"), {
    inox: ["apauk-inox-3-2l", "feelneedy-sans-fil-3-2l", "petlibro-dockstream-inox"],
    silencieuse: ["petkit-eversweet-max", "petlibro-dockstream-inox"],
    "sans-fil": ["feelneedy-sans-fil-3-2l", "petkit-eversweet-max"],
  });
});

test("distributeurs : caméra, deux bols, gravité", () => {
  assert.deepEqual(noms("distributeur-croquettes-chat"), {
    camera: ["petkit-camera-5l"],
    "double-bol": ["oneisall-5l-double"],
    "sans-electricite": ["edipets-gravite-3-8l"],
  });
});

test("une information absente ne retient pas le produit", () => {
  const sansBruit = { ...fiches.find((p) => p.slug === "petlibro-dockstream-inox")!, specs: {} };
  const [, silencieuse] = filtresPour([sansBruit]);
  assert.deepEqual(silencieuse.asins, []);
});
