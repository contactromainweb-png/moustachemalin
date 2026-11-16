"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { BulleKira } from "@/components/BulleKira";
import { ajouter, basculerDans, majCarnet, useCarnet } from "@/lib/carnet";
import { avecPrenom, useMonte, useProfil } from "@/lib/profil";
import { espacesFines } from "@/lib/typo";
import { sansCesure } from "@/components/SansCesure";

// Le plan anti-griffes du guide canapé (pack 8b) : une question (où griffe-t-il ?), puis 5 étapes à cocher, tirées
// de l'article et rien de plus. Avec un profil, la réponse et les étapes cochées sont gardées dans le carnet
// (listes["plan-griffes"] : « choix:debout » et « etape-1 »…, voir src/lib/listes.ts) ; sans profil, elles restent
// dans la page. Même enveloppe que TestGuide : data-avec-js, rendu après l'hydratation, hauteur réservée.
// Statistiques : l'événement existant « test-guide » (guide: "chat-griffe-canape") à la première réponse.
type Fenetre = Window & { umami?: { track: (nom: string, donnees: Record<string, string>) => void } };

const SLUG = "chat-griffe-canape";
const LISTE = "plan-griffes";
const KIRA = "Dis-moi où {prenom} griffe, et je te fais son plan en 5 étapes.";
const CHOIX = [
  { id: "debout", label: "Debout, sur l'accoudoir" },
  { id: "plat", label: "À plat, sur la base ou le tapis" },
  { id: "deux", label: "Les deux" },
] as const;
type Choix = (typeof CHOIX)[number]["id"];

const DEBOUT = "Un poteau assez haut pour qu'il s'étire de tout son long, ou un griffoir en L calé contre l'angle du canapé.";
const PLAT = "Un griffoir plat, au pied du canapé.";

const lien = "font-medium underline decoration-accent decoration-2 underline-offset-4 hover:text-ink-soft";

export function PlanGuide() {
  const monte = useMonte();
  return (
    <section
      id="plan-anti-griffes"
      data-avec-js
      aria-labelledby="titre-plan-anti-griffes"
      className="my-12 min-h-[66rem] max-w-[44rem] scroll-mt-20 rounded-[1.5rem] bg-kira px-4 py-6 sm:min-h-[52rem] sm:px-8 sm:py-8"
    >
      {monte ? <Plan /> : null}
    </section>
  );
}

function Plan() {
  const uid = useId();
  const profil = useProfil();
  const carnet = useCarnet();
  const prenom = profil?.prenom ?? null;
  const [local, setLocal] = useState<string[]>([]);
  const mesure = useRef(false);
  // Avec un profil, l'état vient du carnet ; sinon, il reste dans la page.
  const etat = carnet ? (carnet.listes[LISTE] ?? []) : local;
  const choix = etat.find((e) => e.startsWith("choix:"))?.slice(6) as Choix | undefined;
  const coche = (n: number) => etat.includes(`etape-${n}`);

  const changer = (f: (avant: string[]) => string[]) => {
    if (carnet) majCarnet((c) => ({ ...c, listes: { ...c.listes, [LISTE]: f(c.listes[LISTE] ?? []) } }));
    else setLocal(f);
  };

  useEffect(() => {
    if (!choix || mesure.current) return;
    mesure.current = true;
    (window as Fenetre).umami?.track("test-guide", { guide: SLUG });
    majCarnet((c) => ({ ...c, tests: ajouter(c.tests, SLUG) }));
  }, [choix]);

  const etapes = [
    <>
      {espacesFines("Pose un griffoir juste à côté de la zone abîmée, pas dans une autre pièce.")}{" "}
      {choix === "debout" || choix === "deux" ? <>{espacesFines(DEBOUT)} </> : null}
      {choix === "plat" || choix === "deux" ? <>{espacesFines(PLAT)} </> : null}
      Voir{" "}
      <Link href="/griffer-grimper/griffoir-chat/" className={lien}>
        notre comparatif des griffoirs
      </Link>
      .
    </>,
    espacesFines("Vérifie qu'il ne bouge pas : un griffoir qui bouge est abandonné tout de suite."),
    espacesFines("Rends-le attirant : un peu d'herbe à chat, un jouet qu'on fait passer dessus."),
    espacesFines("Félicite-le ou caresse-le quand il l'utilise."),
    espacesFines("Protège le canapé pendant la transition : un tapis adhésif ou une housse sur la zone griffée, quelques semaines."),
  ];

  return (
    <>
      <h3 id="titre-plan-anti-griffes" className="font-display mb-5 text-[clamp(1.5rem,1.2rem+1.2vw,2.125rem)]">
        {sansCesure(espacesFines(avecPrenom("Le plan anti-griffes de {prenom}", prenom)))}
      </h3>
      <BulleKira className="mb-5">
        <p>{espacesFines(avecPrenom(KIRA, prenom))}</p>
      </BulleKira>

      <fieldset>
        <legend className="mb-3 text-lead font-semibold">{espacesFines("Où griffe-t-il ?")}</legend>
        <div className="flex flex-wrap gap-2">
          {CHOIX.map((c) => (
            <label key={c.id} className="relative">
              <input
                type="radio"
                name={`${uid}-choix`}
                value={c.id}
                checked={choix === c.id}
                onChange={() => changer((avant) => [...avant.filter((e) => !e.startsWith("choix:")), `choix:${c.id}`])}
                className="peer sr-only"
              />
              <span className="flex min-h-11 cursor-pointer items-center rounded-full border-[1.5px] border-nuit/30 bg-white px-4 font-medium text-nuit transition-colors duration-150 hover:border-nuit peer-checked:border-nuit peer-checked:bg-nuit peer-checked:text-blanc peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent motion-reduce:transition-none">
                {c.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div aria-live="polite">
        {choix ? (
          <fieldset className="mt-6">
            <legend className="mb-3 text-lead font-semibold">Les 5 étapes</legend>
            <ol className="space-y-2">
              {etapes.map((texte, i) => {
                const n = i + 1;
                const Ligne = i === 0 ? "div" : "label"; // l'étape 1 contient un lien : pas de <label> autour
                return (
                  <li key={n}>
                    <Ligne className="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl bg-white px-4 py-3 text-nuit [&_a]:text-nuit">
                      <input
                        type="checkbox"
                        aria-labelledby={`${uid}-etape-${n}`}
                        checked={coche(n)}
                        onChange={(e) => changer((avant) => basculerDans(avant, `etape-${n}`, e.target.checked))}
                        className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[#14213d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      />
                      <span id={`${uid}-etape-${n}`}>
                        <span className="font-semibold">{n}. </span>
                        {texte}
                      </span>
                    </Ligne>
                  </li>
                );
              })}
            </ol>
          </fieldset>
        ) : null}
      </div>

      <div className="mt-6 space-y-3">
        <p className="font-medium">{espacesFines("À éviter : le punir, ou cacher le griffoir dans un coin où il ne passe jamais.")}</p>
        <p className="text-small">
          {espacesFines(
            "Si les griffades se multiplient d'un coup, avec d'autres changements (agitation, peurs, malpropreté), parles-en à ton vétérinaire.",
          )}{" "}
          <a href="#et-si-ca-ne-s-arrange-pas" className={lien}>
            {espacesFines("Et si ça ne s'arrange pas ?")}
          </a>
        </p>
      </div>
    </>
  );
}
