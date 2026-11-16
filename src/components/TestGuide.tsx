"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { BulleKira } from "@/components/BulleKira";
import { CarteProfil } from "@/components/CarteProfil";
import { ajouter, majCarnet } from "@/lib/carnet";
import { avecPrenom, useMonte, useProfil, type ProfilChat } from "@/lib/profil";
import type { Morceau } from "@/lib/quiz";
import { TESTS_GUIDES, type BlocResultat } from "@/lib/tests-guides";
import { espacesFines } from "@/lib/typo";
import { sansCesure } from "@/components/SansCesure";

// Test d'un guide : <TestGuide id="mon-chat-ne-boit-pas" /> (configuration : src/lib/tests-guides.ts).
// Des cases à cocher et un résultat recalculé à chaque case (aria-live). Rien n'est enregistré.
// Sans JavaScript, rien ne s'affiche (data-avec-js) ; avec JavaScript, rendu après l'hydratation, dans un emplacement
// de hauteur réservée.
type Fenetre = Window & { umami?: { track: (nom: string, donnees: Record<string, string>) => void } };

const RESERVE: Record<string, string> = {
  "mon-chat-ne-boit-pas": "min-h-[75rem] sm:min-h-[61rem]",
  "litiere-sent-mauvais": "min-h-[71rem] sm:min-h-[59rem]",
};

export function TestGuide({ id }: { id: string }) {
  const monte = useMonte();
  const config = TESTS_GUIDES[id];
  if (!config) throw new Error(`Test de guide inconnu : ${id} (src/lib/tests-guides.ts)`);
  return (
    <section
      data-avec-js
      aria-labelledby={`test-${id}`}
      className={`my-12 max-w-[44rem] rounded-[1.5rem] bg-kira px-4 py-6 sm:px-8 sm:py-8 ${RESERVE[id] ?? ""}`}
    >
      {monte ? <Test id={id} /> : null}
    </section>
  );
}

const lien = "font-medium underline decoration-accent decoration-2 underline-offset-4 hover:text-ink-soft";

function Morceaux({ morceaux, prenom }: { morceaux: Morceau[]; prenom: string | null }) {
  return (
    <>
      {morceaux.map((m, i) =>
        typeof m === "string" ? (
          <span key={i}>{espacesFines(avecPrenom(m, prenom))}</span>
        ) : m.lien.startsWith("#") ? (
          <a key={i} href={m.lien} className={lien}>
            {espacesFines(m.texte)}
          </a>
        ) : (
          <Link key={i} href={m.lien} className={lien}>
            {espacesFines(m.texte)}
          </Link>
        ),
      )}
    </>
  );
}

const correspond = (si: Partial<ProfilChat>, profil: ProfilChat | null) =>
  !!profil && Object.entries(si).every(([cle, valeur]) => profil[cle as keyof ProfilChat] === valeur);

function Test({ id }: { id: string }) {
  const config = TESTS_GUIDES[id];
  const uid = useId();
  const profil = useProfil();
  const prenom = profil?.prenom ?? null;
  const [coches, setCoches] = useState<Set<string>>(() => new Set());
  const [carte, setCarte] = useState(false);
  const mesure = useRef(false);
  const blocs = coches.size ? config.resultat(coches) : [];
  const Titre = config.niveau === 2 ? "h2" : "h3";

  // Statistiques : un seul événement, au premier résultat affiché ; aucune case ni prénom n'est transmis.
  useEffect(() => {
    if (coches.size === 0 || mesure.current) return;
    mesure.current = true;
    (window as Fenetre).umami?.track("test-guide", { guide: config.slug });
    majCarnet((c) => ({ ...c, tests: ajouter(c.tests, config.slug) })); // carnet (pack 8b), seulement avec profil
  }, [coches, config.slug]);

  const basculer = (caseId: string) =>
    setCoches((avant) => {
      const apres = new Set(avant);
      if (apres.has(caseId)) apres.delete(caseId);
      else apres.add(caseId);
      return apres;
    });

  return (
    <>
      <Titre
        id={`test-${id}`}
        className={`font-display mb-5 ${config.niveau === 2 ? "text-[clamp(1.75rem,1.2rem+2vw,2.75rem)]" : "text-[clamp(1.5rem,1.2rem+1.2vw,2.125rem)]"}`}
      >
        {sansCesure(espacesFines(avecPrenom(config.titre, prenom)))}
      </Titre>
      <BulleKira className="mb-5">
        <p>{espacesFines(avecPrenom(config.kira, prenom))}</p>
      </BulleKira>

      {profil ? null : (
        <div className="mb-5">
          {carte ? (
            <div className="rounded-[1.25rem] bg-paper px-4 py-5 sm:px-6">
              <CarteProfil />
            </div>
          ) : (
            <button type="button" aria-expanded={false} onClick={() => setCarte(true)} className={`min-h-11 text-small ${lien}`}>
              Créer son profil
            </button>
          )}
        </div>
      )}

      {config.groupes.map((g, gi) => (
        <fieldset key={gi} className={gi > 0 ? "mt-6" : ""}>
          <legend className={g.titre ? "mb-3 text-lead font-semibold" : "sr-only"}>
            {g.titre ? espacesFines(g.titre) : "Ce que tu observes"}
          </legend>
          <ul className="space-y-2">
            {g.cases.map((c) => {
              const mention = c.mention && correspond(c.mention.si, profil) ? c.mention.texte : null;
              return (
                <li key={c.id}>
                  <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-xl bg-white px-4 py-3 text-nuit">
                    <input
                      type="checkbox"
                      id={`${uid}-${c.id}`}
                      checked={coches.has(c.id)}
                      onChange={() => basculer(c.id)}
                      className="mt-0.5 size-5 shrink-0 accent-[#14213d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    />
                    <span>
                      {espacesFines(c.label)}
                      {mention ? <span className="font-medium"> {mention}</span> : null}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      ))}

      <div aria-live="polite" className="mt-6 space-y-3">
        {coches.size === 0 ? (
          <p className="font-medium">{espacesFines(avecPrenom(config.vide, prenom))}</p>
        ) : (
          blocs.map((b, i) => <Bloc key={i} bloc={b} prenom={prenom} />)
        )}
        {config.toujours ? <p className="text-small text-ink-soft">{config.toujours}</p> : null}
      </div>
    </>
  );
}

function Bloc({ bloc, prenom }: { bloc: BlocResultat; prenom: string | null }) {
  if (bloc.ton === "liste") {
    return (
      <ul className="list-disc space-y-1 pl-6 marker:text-accent">
        {bloc.items.map((m, i) => (
          <li key={i}>
            <Morceaux morceaux={m} prenom={prenom} />
          </li>
        ))}
      </ul>
    );
  }
  if (bloc.ton === "titre") {
    return (
      <p className="font-semibold">
        <Morceaux morceaux={bloc.morceaux} prenom={prenom} />
      </p>
    );
  }
  const styles = {
    urgence: "border-[1.5px] border-[#b42318] bg-white text-[#b42318] font-semibold",
    attention: "bg-accent/20",
    normal: "bg-white",
  }[bloc.ton];
  return (
    <div className={`rounded-[1.25rem] px-5 py-4 ${styles}`}>
      {bloc.ton === "attention" ? <p className="mb-1 font-semibold">Attention</p> : null}
      {bloc.ton === "urgence" ? <p className="mb-1 uppercase tracking-wide">Urgence</p> : null}
      <p>
        <Morceaux morceaux={bloc.morceaux} prenom={prenom} />
      </p>
    </div>
  );
}
