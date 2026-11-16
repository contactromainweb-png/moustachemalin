"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AffiliateButton } from "@/components/AffiliateButton";
import { AmazonDisclosure } from "@/components/AmazonDisclosure";
import { BulleKira } from "@/components/BulleKira";
import { CarteProfil } from "@/components/CarteProfil";
import { ajouter, majCarnet } from "@/lib/carnet";
import { avecPrenom, useMonte, useProfil, type ProfilChat } from "@/lib/profil";
import type { Morceau, QuizCalcule } from "@/lib/quiz";
import { espacesFines, nomsInsecables } from "@/lib/typo";

// Le quiz d'un comparatif (données calculées au build par QuizComparatif). Une question à la fois, en pastilles,
// avec une barre de progression et un retour à la question précédente. Résultat : les 2 meilleurs scores (à égalité,
// l'ordre du tableau décide), chacun avec ses raisons, le lien vers sa fiche et le bouton Amazon habituel.
// Sans JavaScript, rien ne s'affiche (data-avec-js) ; avec JavaScript, le quiz n'est rendu qu'après l'hydratation,
// dans un emplacement de hauteur réservée : la page ne saute pas.
// Ce que dit Kira quand le résultat s'affiche (texte validé par Romain) ; « Recommencer » ramène le texte de départ.
const TROUVAILLES = "Voilà mes trouvailles pour {prenom} ! Clique sur « Montrer dans le tableau » pour les retrouver.";

type Fenetre = Window & { umami?: { track: (nom: string, donnees: Record<string, string>) => void } };

const correspond = (si: Partial<ProfilChat> | undefined, profil: ProfilChat | null) =>
  !!si && !!profil && Object.entries(si).every(([cle, valeur]) => profil[cle as keyof ProfilChat] === valeur);

export function QuizJeu({ quiz }: { quiz: QuizCalcule }) {
  const monte = useMonte();
  return (
    <section
      data-avec-js
      aria-label="Quiz : les 2 modèles qui collent à ton chat"
      className="my-12 min-h-[38rem] rounded-[1.5rem] bg-kira px-4 py-6 sm:min-h-[32rem] sm:px-8 sm:py-8 lg:min-h-[26rem]"
    >
      {monte ? <Jeu quiz={quiz} /> : null}
    </section>
  );
}

function Jeu({ quiz }: { quiz: QuizCalcule }) {
  const id = useId();
  const profil = useProfil();
  const prenom = profil?.prenom ?? null;
  const [reponses, setReponses] = useState<(number | undefined)[]>([]);
  const [etape, setEtape] = useState(0);
  const [carte, setCarte] = useState(false);
  const [resultats, setResultats] = useState(0); // fait cligner Kira à chaque résultat
  const titreQuestion = useRef<HTMLParagraphElement>(null);
  const titreResultat = useRef<HTMLParagraphElement>(null);
  const aBouge = useRef(false);
  const total = quiz.questions.length;
  const fini = etape >= total;

  // Réponse retenue : celle choisie, sinon celle que le profil coche d'avance.
  const choix = (i: number) =>
    reponses[i] ?? (() => {
      const k = quiz.questions[i].reponses.findIndex((r) => correspond(r.siProfil, profil));
      return k >= 0 ? k : undefined;
    })();

  // Le focus suit la question affichée (ou le résultat) après une action de l'utilisateur.
  useEffect(() => {
    if (!aBouge.current) return;
    (fini ? titreResultat : titreQuestion).current?.focus();
  }, [etape, fini]);

  const choisir = (k: number) => {
    aBouge.current = true;
    const suivantes = [...reponses];
    suivantes[etape] = k;
    setReponses(suivantes);
    setEtape(etape + 1);
    if (etape + 1 >= total) setResultats((n) => n + 1);
  };

  return (
    <>
      <BulleKira vivante clinSignal={resultats} className="mb-5">
        <p>{espacesFines(fini ? avecPrenom(TROUVAILLES, prenom) : quiz.kira)}</p>
      </BulleKira>

      {profil ? null : (
        <div className="mb-5">
          {carte ? (
            <div className="rounded-[1.25rem] bg-paper px-4 py-5 sm:px-6">
              <CarteProfil />
            </div>
          ) : (
            <button
              type="button"
              aria-expanded={false}
              onClick={() => setCarte(true)}
              className="min-h-11 text-small font-medium underline decoration-accent decoration-2 underline-offset-4 hover:text-ink-soft"
            >
              Créer son profil
            </button>
          )}
        </div>
      )}

      {fini ? null : (
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="text-small font-medium tabular-nums">
              <span className="sr-only">Question </span>
              {etape + 1}/{total}
            </span>
            <span aria-hidden="true" className="h-2 flex-1 overflow-hidden rounded-full bg-white/20">
              <span
                className="block h-full rounded-full bg-accent transition-[width] duration-300 ease-[var(--ease-out)] motion-reduce:transition-none"
                style={{ width: `${((etape + 1) / total) * 100}%` }}
              />
            </span>
          </div>
          <div role="group" aria-labelledby={`${id}-q`}>
            <p id={`${id}-q`} ref={titreQuestion} tabIndex={-1} className="mb-4 text-lead font-semibold outline-none">
              {espacesFines(quiz.questions[etape].question)}
            </p>
            <div className="flex flex-wrap gap-2">
              {quiz.questions[etape].reponses.map((r, k) => (
                <button
                  key={r.label}
                  type="button"
                  aria-pressed={choix(etape) === k}
                  onClick={() => choisir(k)}
                  className="min-h-12 rounded-full border-[1.5px] border-nuit/30 bg-white px-5 text-left font-medium text-nuit transition-colors duration-150 hover:border-nuit aria-pressed:border-nuit aria-pressed:bg-nuit aria-pressed:text-blanc motion-reduce:transition-none"
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-5">
            {etape > 0 ? (
              <button type="button" onClick={() => { aBouge.current = true; setEtape(etape - 1); }} className="min-h-11 font-medium underline decoration-accent decoration-2 underline-offset-4">
                ← Question précédente
              </button>
            ) : null}
            {choix(etape) !== undefined ? (
              <button type="button" onClick={() => choisir(choix(etape)!)} className="min-h-11 font-medium underline decoration-accent decoration-2 underline-offset-4">
                Question suivante →
              </button>
            ) : null}
          </div>
        </div>
      )}

      <div aria-live="polite">
        {fini ? (
          <Resultat
            quiz={quiz}
            choix={quiz.questions.map((_, i) => choix(i))}
            prenom={prenom}
            profil={profil}
            titreRef={titreResultat}
            onRecommencer={() => {
              aBouge.current = true;
              setReponses([]);
              setEtape(0);
            }}
          />
        ) : null}
      </div>
    </>
  );
}

function Morceaux({ morceaux, prenom }: { morceaux: Morceau[]; prenom: string | null }) {
  return (
    <>
      {morceaux.map((m, i) =>
        typeof m === "string" ? (
          <span key={i}>{espacesFines(avecPrenom(m, prenom))}</span>
        ) : (
          <Link key={i} href={m.lien} className="font-medium underline decoration-accent decoration-2 underline-offset-4">
            {m.texte}
          </Link>
        ),
      )}
    </>
  );
}

// Lignes et cartes du tableau mises en valeur (CSS : globals.css, data-quiz-pour). Rien n'est caché.
function marquer(asins: string[], etiquette: string | null) {
  document.querySelectorAll("#tableau-comparatif-donnees [data-quiz-pour]").forEach((el) => el.removeAttribute("data-quiz-pour"));
  if (!etiquette) return;
  for (const asin of asins) {
    document.querySelectorAll(`#tableau-comparatif-donnees [data-asin="${asin}"]`).forEach((el) => {
      el.setAttribute("data-quiz-pour", etiquette);
      if (el.tagName === "TR") el.querySelector(":scope > th")?.setAttribute("data-quiz-pour", etiquette);
    });
  }
}

function Resultat({
  quiz,
  choix,
  prenom,
  profil,
  titreRef,
  onRecommencer,
}: {
  quiz: QuizCalcule;
  choix: (number | undefined)[];
  prenom: string | null;
  profil: ProfilChat | null;
  titreRef: React.RefObject<HTMLParagraphElement | null>;
  onRecommencer: () => void;
}) {
  const retenues = quiz.questions.map((q, i) => (choix[i] === undefined ? undefined : q.reponses[choix[i]!]));
  const classement = quiz.produits
    .map((p, rang) => ({
      ...p,
      rang,
      raisons: retenues.filter((r) => r?.asins?.includes(p.asin)).map((r) => r!.pourquoi!),
    }))
    .filter((p) => p.raisons.length > 0)
    .sort((a, b) => b.raisons.length - a.raisons.length || a.rang - b.rang)
    .slice(0, 2);
  const pour = prenom ? `Pour ${prenom}` : "Pour ton chat";
  const notes = quiz.notes.filter((n) => correspond(n.si, profil));

  useEffect(() => {
    (window as Fenetre).umami?.track("quiz-termine", { categorie: quiz.categorie });
    // Carnet (pack 8b) : la catégorie du quiz terminé, seulement s'il y a un profil (jamais vers Umami).
    majCarnet((c) => ({ ...c, quiz: ajouter(c.quiz, quiz.categorie) }));
    return () => marquer([], null);
  }, [quiz.categorie]);

  return (
    <div>
      {notes
        .filter((n) => n.place === "avant")
        .map((n, i) => (
          <Note key={i} attention={n.attention}>
            <Morceaux morceaux={n.morceaux} prenom={prenom} />
          </Note>
        ))}
      <p ref={titreRef} tabIndex={-1} className="font-display text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] outline-none">
        {pour}
      </p>
      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {classement.map((p) => (
          <li key={p.asin} className="flex flex-col rounded-[1.25rem] border-[1.5px] border-nuit/15 bg-white px-5 py-5 text-nuit">
            {p.badge ? <p className="mb-1 text-small font-semibold text-[#6a4fd8]">{p.badge}</p> : null}
            <p className="text-lead font-semibold">{nomsInsecables(p.name)}</p>
            <p className="mt-3 font-medium">Pourquoi</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 marker:text-accent">
              {p.raisons.map((r) => (
                <li key={r}>{espacesFines(r)}</li>
              ))}
            </ul>
            <div className="mt-auto pt-5">
              <AffiliateButton asin={p.asin} emplacement="quiz" className="w-full" />
              <a href={`#${p.asin}`} className="mt-2 flex min-h-11 w-fit items-center font-medium underline decoration-accent decoration-2 underline-offset-4">
                Voir sa fiche
              </a>
            </div>
          </li>
        ))}
      </ul>
      <AmazonDisclosure className="mt-3" />
      {notes
        .filter((n) => n.place === "apres")
        .map((n, i) => (
          <p key={i} className="mt-4 font-medium">
            <Morceaux morceaux={n.morceaux} prenom={prenom} />
          </p>
        ))}
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="button"
          onClick={() => {
            marquer(classement.map((p) => p.asin), pour);
            const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            document.getElementById("tableau-comparatif")?.scrollIntoView({ behavior: reduit ? "auto" : "smooth", block: "start" });
          }}
          className="min-h-12 rounded-full bg-nuit px-5 font-medium text-blanc"
        >
          {classement.length > 1 ? "Montrer ces 2 modèles dans le tableau" : "Montrer ce modèle dans le tableau"}
        </button>
        <button
          type="button"
          onClick={() => {
            marquer([], null);
            onRecommencer();
          }}
          className="min-h-11 font-medium underline decoration-accent decoration-2 underline-offset-4"
        >
          Recommencer
        </button>
      </div>
    </div>
  );
}

function Note({ attention, children }: { attention?: boolean; children: React.ReactNode }) {
  return (
    <div className={`mb-5 rounded-[1.25rem] px-5 py-4 ${attention ? "bg-accent/20" : "bg-white"}`}>
      {attention ? <p className="mb-1 font-semibold">Attention</p> : null}
      <p>{children}</p>
    </div>
  );
}
