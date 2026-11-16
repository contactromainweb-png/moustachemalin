"use client";

import Link from "next/link";
import { useState } from "react";
import { basculerDans, majCarnet, useCarnet } from "@/lib/carnet";
import { cochesDeListe, listeMemoire } from "@/lib/listes";
import { useMonte, useProfil } from "@/lib/profil";
import { espacesFines } from "@/lib/typo";

// Liste de signes à cocher, dans un guide santé (MDX) : <ListeSignes signes={[{ titre, texte }, …]} />.
// Elle aide seulement à faire le point : aucun diagnostic. À partir de 2 cases cochées, elle renvoie au
// vétérinaire. Le compteur est annoncé aux lecteurs d'écran (aria-live). Sans JavaScript, les cases restent
// cochables et la liste se lit comme une liste normale.
// `texte` commence par son séparateur (« : … » ou « qui … »), pour reprendre la phrase telle qu'elle est écrite.
// Liste de préparation (guides week-end, arrivée) : items sans `titre`, `legende` et `unite` adaptées, `alerte={null}`.
// Listes qui se souviennent (pack 8b) : `memoire="partir-en-week-end"` (ou "arrivee-chat") lit et écrit les cases
// cochées dans listes[memoire] du carnet, s'il y a un profil (src/lib/carnet.ts). Chaque case a alors un `id` stable,
// et ces `id` doivent être exactement ceux de src/lib/listes.ts, sinon le build échoue. `equipement` (liste arrivée) :
// ces cases-là lisent et écrivent dans l'équipement du carnet (la jauge de /carnet/), et l'inverse.
// Les lignes ajoutées sous la liste sont au tutoiement (élément interactif), comme le profil.
type Signe = { id?: string; titre?: string; texte: string };

const lien = "font-medium underline decoration-accent decoration-2 underline-offset-4 hover:text-ink-soft";

export function ListeSignes({
  signes,
  legende = "Cochez ce que vous observez",
  unite = "signe",
  alerte = "Vous observez plusieurs de ces signes : parlez-en à votre vétérinaire.",
  memoire,
  equipement,
}: {
  signes: Signe[];
  legende?: string;
  unite?: string;
  alerte?: string | null;
  memoire?: string;
  equipement?: Record<string, string>;
}) {
  const liste = memoire ? listeMemoire(memoire) : null;
  if (liste) {
    const ids = signes.map((s) => s.id);
    if (ids.some((id) => !id)) throw new Error(`ListeSignes « ${memoire} » : chaque case doit avoir un id`);
    if (ids.join("|") !== liste.cases.join("|")) {
      throw new Error(`ListeSignes « ${memoire} » : les id du MDX (${ids.join(", ")}) diffèrent de src/lib/listes.ts`);
    }
    if (JSON.stringify(equipement ?? {}) !== JSON.stringify(liste.equipement ?? {})) {
      throw new Error(`ListeSignes « ${memoire} » : la prop equipement diffère de src/lib/listes.ts`);
    }
  } else if (equipement) {
    throw new Error("ListeSignes : `equipement` demande `memoire`");
  }

  const monte = useMonte();
  const profil = useProfil();
  const carnet = useCarnet();
  const [locales, setLocales] = useState<boolean[]>(() => signes.map(() => false));
  // Avec un profil, les cases viennent du carnet ; sinon (ou sans mémoire), elles restent dans la page.
  const depuisCarnet = !!liste && !!carnet;
  const cochesCarnet = depuisCarnet ? cochesDeListe(liste, carnet) : null;
  const coches = cochesCarnet ? signes.map((s) => cochesCarnet.has(s.id!)) : locales;
  const total = coches.filter(Boolean).length;

  const basculer = (i: number, coche: boolean) => {
    if (depuisCarnet) {
      const id = signes[i].id!;
      const eq = liste.equipement?.[id];
      majCarnet((c) =>
        eq
          ? { ...c, equipement: basculerDans(c.equipement, eq, coche) }
          : { ...c, listes: { ...c.listes, [liste.id]: basculerDans(c.listes[liste.id] ?? [], id, coche) } },
      );
    } else {
      setLocales((c) => c.map((v, j) => (j === i ? coche : v)));
    }
  };

  return (
    <fieldset className="my-8 rounded-[1.5rem] border border-ink/15 px-5 py-6 sm:px-7">
      <legend className="px-2 font-semibold">{legende}</legend>
      <ul className="space-y-2">
        {signes.map((s, i) => (
          <li key={s.id ?? s.titre ?? s.texte}>
            <label className="flex cursor-pointer gap-4 rounded-xl px-3 py-3 transition-colors duration-150 hover:bg-field has-[:checked]:bg-field">
              <input
                type="checkbox"
                checked={coches[i]}
                onChange={(e) => basculer(i, e.target.checked)}
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

      {liste ? (
        // Seulement avec JavaScript ; hauteur réservée pour que rien ne saute à l'hydratation.
        <div data-avec-js className="mt-3 flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 px-3 text-small">
          {!monte ? null : profil && carnet ? (
            <>
              <span>La liste de {profil.prenom} est gardée dans son carnet.</span>
              <Link href="/carnet/" className={`flex min-h-11 items-center ${lien}`}>
                Voir le carnet
              </Link>
              {liste.id === "partir-en-week-end" && total > 0 ? (
                <button
                  type="button"
                  onClick={() => majCarnet((c) => ({ ...c, listes: { ...c.listes, [liste.id]: [] } }))}
                  className={`min-h-11 ${lien}`}
                >
                  Tout décocher pour le prochain départ
                </button>
              ) : null}
            </>
          ) : (
            <>
              <span>Crée le profil de ton chat pour que cette liste s&apos;en souvienne.</span>
              <Link href="/#titre-ton-chat" className={`flex min-h-11 items-center ${lien}`}>
                Créer son profil
              </Link>
            </>
          )}
        </div>
      ) : null}
    </fieldset>
  );
}
