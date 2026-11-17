import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  DEPART_JEU_BALLE,
  LANCERS_JEU_BALLE,
  PALIERS_JEU_BALLE,
  TEXTES_JEU_BALLE,
  TOUT_PRES_JEU_BALLE,
  texteApresLancer,
} from "../src/lib/jeu-balle.ts";

// Les 13 textes validés par Romain (complément au pack 9), mot pour mot.
const VALIDES = [
  "Lance-la, je te la rapporte. Chez moi, c'est une spécialité.",
  "Et voilà, à tes pieds. Encore ?",
  "Rapportée. Tu la relances ?",
  "Pas mal, ce lancer. Je peux faire mieux qu'attraper, tu sais : je rapporte.",
  "Mission accomplie. Je t'attends.",
  "Un vrai petit chien, il paraît. Je ne vois pas de quoi on parle.",
  "Plus loin, la prochaine fois. Je n'ai même pas eu besoin de courir.",
  "Encore une. Pose-la à mes pieds… ah non, c'est mon rôle.",
  "Je te la rends. Pour l'instant.",
  "Cinq. Je commence à peine à m'échauffer.",
  "Dix. Je suis très joueuse, tu sais.",
  "Vingt balles. Tu fatigues avant moi, c'est prévu.",
  "Cinquante. Là, c'est toi le chat qui rapporte.",
  "C'était un lancer, ça ?",
];

test("la liste contient exactement les textes validés", () => {
  assert.deepEqual([...TEXTES_JEU_BALLE].sort(), [...VALIDES].sort());
  assert.equal(LANCERS_JEU_BALLE.length, 8);
});

test("les 6 premiers lancers sortent dans l'ordre, les paliers remplacent la phrase", () => {
  let precedent = DEPART_JEU_BALLE;
  const vus: string[] = [];
  for (let n = 1; n <= 6; n++) {
    precedent = texteApresLancer(n, precedent, false, 0);
    vus.push(precedent);
  }
  assert.deepEqual(vus, [...LANCERS_JEU_BALLE.slice(0, 4), PALIERS_JEU_BALLE[5], LANCERS_JEU_BALLE[5]]);
  for (const n of [5, 10, 20, 50]) assert.equal(texteApresLancer(n, "x", true), PALIERS_JEU_BALLE[n]);
});

test("jamais deux fois de suite la même phrase, le lancer tout près réagit", () => {
  let precedent = DEPART_JEU_BALLE;
  for (let n = 1; n <= 300; n++) {
    const t = texteApresLancer(n, precedent, n % 7 === 0);
    assert.notEqual(t, precedent, `lancer ${n}`);
    precedent = t;
  }
  assert.equal(texteApresLancer(8, LANCERS_JEU_BALLE[0], true), TOUT_PRES_JEU_BALLE);
  assert.notEqual(texteApresLancer(9, TOUT_PRES_JEU_BALLE, true), TOUT_PRES_JEU_BALLE);
});

test("aucun texte de Kira écrit en dur dans les composants du jeu", () => {
  for (const f of ["src/components/JeuBalle.tsx", "src/components/JeuBalleDiffere.tsx", "src/components/JeuBalleAttente.tsx"]) {
    const source = readFileSync(f, "utf8");
    for (const t of VALIDES) assert.ok(!source.includes(t.slice(0, 20)), `${f} : « ${t} »`);
  }
});
