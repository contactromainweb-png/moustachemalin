import assert from "node:assert/strict";
import { test } from "node:test";
import { eauABoire } from "../src/lib/eau.ts";

test("chat de 4 kg sans nourriture : 200 à 240 ml", () => {
  assert.deepEqual(eauABoire({ poids: 4, patee: 0, croquettes: 0 }), { min: 200, max: 240 });
});

test("chat de 4 kg avec 100 g de pâtée : 130 à 170 ml", () => {
  assert.deepEqual(eauABoire({ poids: 4, patee: 100, croquettes: 0 }), { min: 130, max: 170 });
});

test("chat de 2 kg avec 200 g de pâtée : rien à boire en plus", () => {
  assert.deepEqual(eauABoire({ poids: 2, patee: 200, croquettes: 0 }), { min: 0, max: 0 });
});

test("les croquettes comptent pour 10 % de leur poids", () => {
  assert.deepEqual(eauABoire({ poids: 4, patee: 0, croquettes: 50 }), { min: 200, max: 240 });
  assert.deepEqual(eauABoire({ poids: 4, patee: 0, croquettes: 100 }), { min: 190, max: 230 });
});
