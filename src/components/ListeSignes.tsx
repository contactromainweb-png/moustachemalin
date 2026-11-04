"use client";

import { useState } from "react";
import { espacesFines } from "@/lib/typo";

// Liste de signes à cocher, dans un guide santé (MDX) : <ListeSignes signes={[{ titre, texte }, …]} />.
// Elle aide seulement à faire le point : aucun diagnostic. À partir de 2 cases cochées, elle renvoie au
// vétérinaire. Le compteur est annoncé aux lecteurs d'écran (aria-live). Sans JavaScript, les cases restent
// cochables et la liste se lit comme une liste normale.
// `texte` commence par son séparateur (« : … » ou « qui … »), pour reprendre la phrase telle qu'elle est écrite.
// Liste de préparation (guides week-end, arrivée) : items sans `titre`, `legende` et `unite` adaptées, `alerte={null}`.
type Signe = { titre?: string; texte: string };

export function ListeSignes({
  signes,
  legende = "Cochez ce que vous observez",
  unite = "signe",
  alerte = "Vous observez plusieurs de ces signes : parlez-en à votre vétérinaire.",
}: {
  signes: Signe[];
  legende?: string;
  unite?: string;
  alerte?: string | null;
}) {
  const [coches, setCoches] = useState<boolean[]>(() => signes.map(() => false));
  const total = coches.filter(Boolean).length;

  return (
    <fieldset className="my-8 rounded-[1.5rem] border border-ink/15 px-5 py-6 sm:px-7">
      <legend className="px-2 font-semibold">{legende}</legend>
      <ul className="space-y-2">
        {signes.map((s, i) => (
          <li key={s.titre ?? s.texte}>
            <label className="flex cursor-pointer gap-4 rounded-xl px-3 py-3 transition-colors duration-150 hover:bg-field has-[:checked]:bg-field">
              <input
                type="checkbox"
                checked={coches[i]}
                onChange={(e) => setCoches((c) => c.map((v, j) => (j === i ? e.target.checked : v)))}
                className="mt-1 size-5 shrink-0 cursor-pointer accent-[var(--ink)]"
              />
              <span>
                {s.titre ? <strong>{s.titre}</strong> : null}
                {espacesFines(s.texte)}
              </span>
            </label>
          </li>
        ))}
      </ul>

      <div aria-live="polite" className="mt-4 px-3">
        <p className="text-small text-ink-soft">
          {total === 0
            ? `Aucun ${unite} coché.`
            : `${total} ${unite}${total > 1 ? "s" : ""} coché${total > 1 ? "s" : ""} sur ${signes.length}.`}
        </p>
        {alerte && total >= 2 && (
          <p className="mt-3 rounded-xl bg-caramel-field px-4 py-4 font-semibold text-on-caramel">
            Vous observez plusieurs de ces signes : parlez-en à votre vétérinaire.
          </p>
        )}
      </div>
    </fieldset>
  );
}
