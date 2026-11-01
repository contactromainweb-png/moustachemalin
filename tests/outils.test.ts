import assert from "node:assert/strict";
import { test } from "node:test";
import { autonomieDistributeur, coutLitiere, nombreDeLitieres } from "../src/lib/outils-calculs.ts";

test("autonomie : 3 L et 60 g par jour, 1 200 à 1 500 g, 20 à 25 jours", () => {
  assert.deepEqual(autonomieDistributeur(3, 60), { grammes: { min: 1200, max: 1500 }, jours: { min: 20, max: 25 } });
});

test("autonomie : un jour entamé ne compte pas", () => {
  assert.deepEqual(autonomieDistributeur(3.5, 70)?.jours, { min: 20, max: 25 });
  assert.deepEqual(autonomieDistributeur(2, 75)?.jours, { min: 10, max: 13 });
});

test("autonomie : rien sans contenance ni ration", () => {
  assert.equal(autonomieDistributeur(0, 60), null);
  assert.equal(autonomieDistributeur(3, 0), null);
  assert.equal(autonomieDistributeur(Number.NaN, 60), null);
});

test("coût : appareil + consommables sur 1 an et 3 ans, et par mois sur 3 ans", () => {
  assert.deepEqual(coutLitiere({ appareil: 360, sacs: 5, litiere: 10, autres: 0 }), {
    parMoisConsommables: 15,
    unAn: 540,
    troisAns: 900,
    parMoisSurTroisAns: 25,
  });
});

test("coût : arrondi au centime, champs vides comptés pour 0", () => {
  assert.deepEqual(coutLitiere({ appareil: 100, sacs: 3.33, litiere: Number.NaN, autres: -2 }), {
    parMoisConsommables: 3.33,
    unAn: 139.96,
    troisAns: 219.88,
    parMoisSurTroisAns: 6.11,
  });
});

test("coût : rien de saisi, pas de résultat", () => {
  assert.equal(coutLitiere({ appareil: 0, sacs: 0, litiere: 0, autres: 0 }), null);
});

test("litières : un bac par chat, plus un", () => {
  assert.equal(nombreDeLitieres(1), 2);
  assert.equal(nombreDeLitieres(3), 4);
  assert.equal(nombreDeLitieres(0), null);
  assert.equal(nombreDeLitieres(1.5), null);
});
