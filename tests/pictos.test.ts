import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { barreBruit, pictosProduit } from "../src/lib/pictos.ts";
import type { Product } from "../src/lib/products.ts";

const DOSSIER = path.join(import.meta.dirname, "..", "content", "products");
const vrais: Product[] = fs
  .readdirSync(DOSSIER)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(DOSSIER, f), "utf8")))
  .filter((p) => !p.exemple);

const textes = (p: Product) => {
  const { pastilles, barre } = pictosProduit(p);
  return [...pastilles.map((x) => x.mot), ...(barre ? Object.values(barre).map(String) : [])];
};

test("chaque vrai produit a au moins 2 pastilles", () => {
  const maigres = vrais.filter((p) => pictosProduit(p).pastilles.length < 2).map((p) => p.slug);
  assert.deepEqual(maigres, []);
});

test("aucune pastille ni légende ne contient NaN, undefined ou null", () => {
  for (const p of vrais)
    for (const t of textes(p)) assert.doesNotMatch(t, /NaN|undefined|null/, `${p.slug} : « ${t} »`);
});

test("bruit : échelle de 20 à 60 dB, « ≤ » devient « au plus »", () => {
  const b = barreBruit("≤ 40 dB annoncés");
  assert.ok(b && !("vide" in b));
  assert.equal(b.legende, "40 dB au plus");
  assert.equal(b.fin, 0.5);
  assert.match(b.note, /échelle de 20 à 60 dB/);
  const f = barreBruit("23 dB annoncés");
  assert.ok(f && !("vide" in f) && f.fin > 0 && f.legende === "23 dB");
  assert.equal(barreBruit("faible"), null);
});

test("quelques pastilles attendues", () => {
  const mots = (slug: string) => pictosProduit(vrais.find((p) => p.slug === slug)!).pastilles.map((x) => x.mot);
  assert.deepEqual(mots("petlibro-dockstream-inox"), ["2,5 L", "Inox", "Secteur"]);
  assert.ok(mots("feelneedy-sans-fil-3-2l").includes("Sans fil"));
  assert.ok(mots("edipets-gravite-3-8l").includes("Sans électricité"));
  assert.ok(mots("petkit-camera-5l").includes("Caméra"));
  assert.ok(mots("fukumaru-arbre-plafond").includes("Fixé au plafond"));
  assert.ok(mots("feandrea-arbre-85-rampe").includes("Anti-basculement"));
  assert.ok(mots("pettom-griffoir-3-pieces").includes("Réversible"));
  assert.ok(mots("sureflap-chatiere-puce").includes("32 chats max"));
  assert.ok(mots("ceesc-grande-chatiere").includes("Sans pile"));
});
