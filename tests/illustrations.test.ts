import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { varianteIllustration } from "../src/lib/illustrations.ts";
import type { Product } from "../src/lib/products.ts";

// Les vraies fiches de content/products/ (les produits d'exemple à part).
const DOSSIER = path.join(import.meta.dirname, "..", "content", "products");
const fiches: Product[] = fs
  .readdirSync(DOSSIER)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(DOSSIER, f), "utf8")));
const vrais = fiches.filter((p) => !p.exemple);

test("chaque vrai produit obtient un dessin propre à son type (jamais la patte neutre)", () => {
  assert.ok(vrais.length >= 42, `${vrais.length} vrais produits seulement`);
  const neutres = vrais.filter((p) => varianteIllustration(p) === "neutre").map((p) => p.slug);
  assert.deepEqual(neutres, []);
});

test("les produits d'exemple et les catégories inconnues gardent la patte neutre, sans erreur", () => {
  for (const p of fiches.filter((f) => f.exemple)) assert.equal(varianteIllustration(p), "neutre");
  assert.equal(varianteIllustration({ category: "gamelle", specs: {} }), "neutre");
  assert.equal(varianteIllustration({ category: "griffoir-chat", specs: {} }), "neutre");
});

test("les règles du pack 8a sur quelques cas connus", () => {
  const v = (slug: string) => varianteIllustration(vrais.find((p) => p.slug === slug)!);
  assert.equal(v("neakasa-m1-lite"), "litiere-ouverte");
  assert.equal(v("petkit-pura-max-2"), "litiere-fermee");
  assert.equal(v("catsan-hygiene-10l"), "sac-grains");
  assert.equal(v("ever-clean-extra-agglomerante-sans-parfum"), "sac-boules");
  assert.equal(v("edipets-gravite-3-8l"), "distributeur-gravite");
  assert.equal(v("oneisall-5l-double"), "distributeur-2-bols");
  assert.equal(v("bemoony-3l"), "distributeur");
  assert.equal(v("feandrea-arbre-85-rampe"), "arbre-petit");
  assert.equal(v("globlazer-f70-pro-178"), "arbre-moyen");
  assert.equal(v("fukumaru-arbre-plafond"), "arbre-plafond");
  assert.equal(v("fantasreen-griffoir-88"), "griffoir-poteau");
  assert.equal(v("conlun-griffoir-mural-l"), "griffoir-l");
  assert.equal(v("trixie-wild-cat-carton"), "griffoir-plat");
  assert.equal(v("lefunom-tapis-griffoir-adhesif"), "griffoir-tapis");
  assert.equal(v("trixie-chatiere-tunnel"), "chatiere-manuelle");
  assert.equal(v("sureflap-chatiere-puce"), "chatiere-puce");
});
