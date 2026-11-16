"use client";

import { useEffect, useRef, useState } from "react";
import { BulleKira } from "@/components/BulleKira";
import { ajouter, majCarnet } from "@/lib/carnet";
import { useMonte } from "@/lib/profil";
import { espacesFines } from "@/lib/typo";

// « Vrai ou faux ? » du guide « Litière autonettoyante : dangereuse ? » (pack 8b). Une affirmation à la fois, deux
// boutons ; après la réponse, « Bien vu » ou « Raté », l'explication (tirée de l'article) et le lien vers la section.
// Les réponses ne sont pas enregistrées : seul le slug du guide entre dans `tests` du carnet (avec profil).
// Même enveloppe que TestGuide : data-avec-js, rendu après l'hydratation, hauteur réservée, bg-kira, une BulleKira.
// Statistiques : l'événement existant « test-guide » (guide: "litiere-autonettoyante-danger") à la première réponse.
// Les ancres sont celles de la page générée (titres ### : plugins/remark-sommaire.mjs).
type Fenetre = Window & { umami?: { track: (nom: string, donnees: Record<string, string>) => void } };

const SLUG = "litiere-autonettoyante-danger";
const KIRA_DEBUT =
  "Moi, je passe un temps fou à recouvrir ma litière. Alors une machine qui ramasse à ma place… 6 affirmations : vrai ou faux ?";
const KIRA_FIN = "{score} sur 6 ! Les explications sont sous chaque réponse.";

const SANTE = { href: "#3-le-risque-discret-ne-plus-surveiller-sa-sante", texte: "Le risque discret : ne plus surveiller sa santé" };
const AFFIRMATIONS: {
  texte: string;
  vrai: boolean;
  explication: string;
  lien: { href: string; texte: string };
  urgence?: true;
}[] = [
  {
    texte: "Une litière autonettoyante convient à un chaton dès son arrivée.",
    vrai: false,
    explication: "Les capteurs ont besoin d'un poids minimum, souvent 1,5 kg. En dessous, un bac classique ou le mode manuel.",
    lien: { href: "#2-les-chatons-et-les-chats-tres-legers", texte: "Les chatons et les chats très légers" },
  },
  {
    texte: "La qualité des capteurs compte plus que le prix ou l'application.",
    vrai: true,
    explication: "C'est le critère n° 1 : les accidents sont rares, mais ils viennent de là.",
    lien: { href: "#1-un-cycle-qui-demarre-avec-le-chat-a-l-interieur", texte: "Un cycle qui démarre avec le chat à l'intérieur" },
  },
  {
    texte: "Avec une litière autonettoyante, plus besoin de surveiller ses selles et ses urines.",
    vrai: false,
    explication:
      "La machine ramasse tout : jette un œil régulier au bac à déchets, c'est souvent là qu'on voit les premiers signes d'un problème.",
    lien: SANTE,
  },
  {
    texte: "Un chat qui va souvent à la litière sans résultat peut être une urgence.",
    vrai: true,
    explication: "Surtout un mâle : ça peut être une obstruction urinaire. C'est une urgence vétérinaire.",
    lien: SANTE,
    urgence: true,
  },
  {
    texte: "On peut la poser sur un tapis épais.",
    vrai: false,
    explication: "Il lui faut un sol plat et dur : les capteurs de poids en ont besoin.",
    lien: { href: "#comment-l-utiliser-en-toute-securite", texte: "Comment l'utiliser en toute sécurité" },
  },
  {
    texte: "Une coupure de courant rend la litière dangereuse.",
    vrai: false,
    explication: "Ce n'est pas dangereux en soi : elle ne se nettoie plus, et le bac se remplit comme un bac classique.",
    lien: { href: "#5-les-pannes-et-coupures", texte: "Les pannes et coupures" },
  },
];

const lien = "font-medium underline decoration-accent decoration-2 underline-offset-4 hover:text-ink-soft";
const bouton =
  "min-h-12 rounded-full border-[1.5px] border-nuit bg-white px-6 font-semibold text-nuit transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100";

export function VraiFaux() {
  const monte = useMonte();
  return (
    <section
      data-avec-js
      aria-labelledby="titre-vrai-faux"
      className="my-12 min-h-[40rem] max-w-[44rem] rounded-[1.5rem] bg-kira px-4 py-6 sm:min-h-[34rem] sm:px-8 sm:py-8"
    >
      {monte ? <Jeu /> : null}
      <p className="mt-6 text-small text-ink-soft">Ce test ne remplace pas l&apos;avis d&apos;un vétérinaire.</p>
    </section>
  );
}

function Jeu() {
  const [etape, setEtape] = useState(0);
  const [reponse, setReponse] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [fins, setFins] = useState(0); // fait cligner Kira à chaque résultat
  const titre = useRef<HTMLParagraphElement>(null);
  const verdict = useRef<HTMLParagraphElement>(null);
  const aBouge = useRef(false);
  const mesure = useRef(false);
  const fini = etape >= AFFIRMATIONS.length;
  const a = AFFIRMATIONS[etape];

  // Le focus suit l'affirmation affichée (ou le résultat) après une action de l'utilisateur.
  useEffect(() => {
    if (aBouge.current) titre.current?.focus();
  }, [etape]);
  // Après la réponse, les boutons disparaissent : le focus passe au verdict.
  useEffect(() => {
    if (reponse !== null) verdict.current?.focus();
  }, [reponse]);

  const repondre = (vrai: boolean) => {
    setReponse(vrai);
    if (vrai === a.vrai) setScore((s) => s + 1);
    if (!mesure.current) {
      mesure.current = true;
      (window as Fenetre).umami?.track("test-guide", { guide: SLUG });
      majCarnet((c) => ({ ...c, tests: ajouter(c.tests, SLUG) }));
    }
  };
  const suivante = () => {
    aBouge.current = true;
    setReponse(null);
    if (etape + 1 >= AFFIRMATIONS.length) setFins((n) => n + 1);
    setEtape(etape + 1);
  };

  return (
    <>
      <h3 id="titre-vrai-faux" className="font-display mb-5 text-[clamp(1.5rem,1.2rem+1.2vw,2.125rem)]">
        {espacesFines("Vrai ou faux ? Le test en 1 minute")}
      </h3>
      <BulleKira vivante clinSignal={fins} className="mb-5">
        <p>{espacesFines(fini ? KIRA_FIN.replace("{score}", String(score)) : KIRA_DEBUT)}</p>
      </BulleKira>

      {fini ? (
        <div>
          <p ref={titre} tabIndex={-1} className="font-display text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] outline-none">
            {score} sur 6
          </p>
          <button
            type="button"
            onClick={() => {
              aBouge.current = true;
              setScore(0);
              setReponse(null);
              setEtape(0);
            }}
            className={`mt-4 min-h-11 ${lien}`}
          >
            Recommencer
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-2 text-small font-medium tabular-nums">
            <span className="sr-only">Affirmation </span>
            {etape + 1}/{AFFIRMATIONS.length}
          </p>
          <p
            ref={titre}
            tabIndex={-1}
            className={`mb-4 rounded-[1.25rem] px-5 py-4 text-lead font-semibold outline-none ${a.urgence ? "border-[1.5px] border-[#b42318] bg-white text-[#b42318]" : "bg-white text-nuit"}`}
          >
            {espacesFines(a.texte)}
          </p>
          {reponse === null ? (
            <div role="group" aria-label="Ta réponse" className="flex flex-wrap gap-3">
              <button type="button" onClick={() => repondre(true)} className={bouton}>
                Vrai
              </button>
              <button type="button" onClick={() => repondre(false)} className={bouton}>
                Faux
              </button>
            </div>
          ) : null}
          <div aria-live="polite">
            {reponse !== null ? (
              <div className="space-y-3">
                <p ref={verdict} tabIndex={-1} className="text-lead font-semibold outline-none">
                  {reponse === a.vrai ? "Bien vu" : "Raté"}
                  <span className="font-normal">&#8239;: c&apos;est {a.vrai ? "vrai" : "faux"}.</span>
                </p>
                <div
                  className={`rounded-[1.25rem] px-5 py-4 ${a.urgence ? "border-[1.5px] border-[#b42318] bg-white font-semibold text-[#b42318]" : "bg-white text-nuit"}`}
                >
                  {a.urgence ? <p className="mb-1 uppercase tracking-wide">Urgence</p> : null}
                  <p>{espacesFines(a.explication)}</p>
                  <p className="mt-2 font-normal text-nuit">
                    <a href={a.lien.href} className={lien}>
                      {espacesFines(a.lien.texte)}
                    </a>
                  </p>
                </div>
                <button type="button" onClick={suivante} className="min-h-12 rounded-full bg-nuit px-6 font-medium text-blanc">
                  Suivante
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
