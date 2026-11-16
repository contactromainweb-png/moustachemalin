import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { parse } from "yaml";
import type { Product } from "../src/lib/products.ts";
import { quizPour } from "../src/lib/quiz.ts";

// Les quiz des comparatifs, calculés sur les vraies fiches (content/products/) et les produits de chaque page :
// chaque réponse qui impose quelque chose retient au moins un produit de la page (sinon quizPour lève une erreur).
const RACINE = path.join(import.meta.dirname, "..");
const fiches = new Map<string, Product>(
  fs
    .readdirSync(path.join(RACINE, "content", "products"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(RACINE, "content", "products", f), "utf8")) as Product)
    .map((p) => [p.asin, p]),
);
const produitsDe = (mdx: string) => {
  const texte = fs.readFileSync(path.join(RACINE, "content", mdx), "utf8");
  const fm = parse(texte.split(/^---\s*$/m)[1]) as { products: string[] };
  return fm.products.map((asin) => {
    const p = fiches.get(asin);
    assert.ok(p, `fiche manquante : ${asin}`);
    return p;
  });
};

const PAGES: Record<string, string> = {
  "litiere-chat": "litieres/meilleure-litiere-chat.mdx",
  "litiere-autonettoyante": "litieres/litiere-autonettoyante.mdx",
  "fontaine-a-eau-chat": "fontaines/fontaine-a-eau-chat.mdx",
  "distributeur-croquettes-chat": "repas/distributeur-croquettes-chat.mdx",
  "arbre-a-chat": "griffer-grimper/arbre-a-chat.mdx",
  "griffoir-chat": "griffer-grimper/griffoir-chat.mdx",
  chatiere: "sorties/chatiere.mdx",
};

for (const [categorie, mdx] of Object.entries(PAGES)) {
  test(`quiz ${categorie} : chaque réponse retient au moins un produit de la page`, () => {
    const quiz = quizPour(categorie, produitsDe(mdx));
    for (const q of quiz.questions) {
      for (const r of q.reponses) {
        if (r.asins) assert.ok(r.asins.length > 0, `${q.question} → ${r.label}`);
        // Liste lisible des ASIN retenus (compte rendu du pack 8b) : node --test tests/quiz.test.ts
        if (process.env.QUIZ_DETAIL) console.log(`${categorie} | ${q.question} | ${r.label} | ${r.asins?.join(", ") ?? "peu importe"}`);
      }
    }
  });
}

test("quiz arbre à chat : chaton et chat âgé retiennent le Feandrea 85,8 cm avec rampe", () => {
  const quiz = quizPour("arbre-a-chat", produitsDe("griffer-grimper/arbre-a-chat.mdx"));
  const [chaton, senior] = quiz.questions[0].reponses;
  assert.deepEqual(chaton.asins, ["B0FQTR37WR"]);
  assert.deepEqual(senior.asins, ["B0FQTR37WR"]);
});
