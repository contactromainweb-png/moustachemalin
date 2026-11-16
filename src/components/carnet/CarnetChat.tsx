"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import { BulleKira } from "@/components/BulleKira";
import { CarteProfil } from "@/components/CarteProfil";
import { PictoBadge } from "@/components/carnet/PictosBadges";
import { badges, type IndexArticles } from "@/lib/badges";
import {
  basculerDans,
  ESSENTIELS,
  essentielsCoches,
  majCarnet,
  oublierCarnet,
  useCarnet,
  type Carnet,
  type OutilsRetenus,
} from "@/lib/carnet";
import { cochesDeListe, listeCommencee, LISTES_MEMOIRE } from "@/lib/listes";
import { avecPrenom, oublierProfil, useMonte, useProfil, type ProfilChat } from "@/lib/profil";
import { espacesFines } from "@/lib/typo";

// La page /carnet/ (pack 8b) : le coin du chat. Tout est lu dans le navigateur (profil + carnet) ; rien n'en sort.
// Au rendu serveur et à l'hydratation, profil et carnet valent null : la page affiche sa version « sans profil »,
// dans un emplacement de hauteur réservée (page.tsx), puis la version avec profil prend sa place.
// Textes de Kira : ceux du pack 8b, validés par Romain, mot pour mot.
const KIRA_JAUGE = {
  debut: "Le carnet de {prenom} commence. Moi, mon humain me rapporte un jouet à chaque course : on a de la marge.",
  milieu: "Ça avance pour {prenom}. Encore quelques cases et c'est l'appart de rêve.",
  fin: "Tout l'essentiel est là pour {prenom}. Je suis presque jalouse.",
};

const GUIDE_ARRIVEE = "/guides/arrivee-chat-chaton-liste/";
const ARBRE_BAS = "/griffer-grimper/arbre-a-chat/#B0FQTR37WR"; // fiche Feandrea 85,8 cm avec rampe

type Ligne = { id: string; label: string; href: string; lien: string };

// Les 7 essentiels : la partie « L'équipement indispensable dès le premier jour » du guide arrivée, dans son ordre.
const LIGNES_ESSENTIELS: Record<(typeof ESSENTIELS)[number], Omit<Ligne, "id">> = {
  litiere: { label: "Un bac à litière et sa litière", href: "/litieres/meilleure-litiere-chat/", lien: "Comparer les litières" },
  eau: { label: "L'eau et les gamelles", href: `${GUIDE_ARRIVEE}#2-l-eau-et-les-gamelles`, lien: "Voir le guide" },
  nourriture: { label: "La nourriture", href: `${GUIDE_ARRIVEE}#3-la-nourriture`, lien: "Voir le guide" },
  griffoir: { label: "Un griffoir", href: "/griffer-grimper/griffoir-chat/", lien: "Comparer les griffoirs" },
  transport: { label: "Une caisse de transport", href: `${GUIDE_ARRIVEE}#5-la-caisse-de-transport`, lien: "Voir le guide" },
  couchage: { label: "Un couchage et des cachettes", href: `${GUIDE_ARRIVEE}#6-un-couchage-et-des-cachettes`, lien: "Voir le guide" },
  jouets: { label: "Des jouets", href: `${GUIDE_ARRIVEE}#7-des-jouets`, lien: "Voir le guide" },
};

const PETITS_PLUS: (Ligne & { siDehors?: true })[] = [
  { id: "fontaine", label: "Une fontaine à eau", href: "/fontaines/fontaine-a-eau-chat/", lien: "Comparer les fontaines" },
  { id: "distributeur", label: "Un distributeur de croquettes", href: "/repas/distributeur-croquettes-chat/", lien: "Comparer les distributeurs" },
  { id: "arbre", label: "Un arbre à chat", href: "/griffer-grimper/arbre-a-chat/", lien: "Comparer les arbres à chat" },
  {
    id: "autonettoyante",
    label: "Une litière autonettoyante",
    href: "/litieres/litiere-autonettoyante/",
    lien: "Comparer les litières autonettoyantes",
  },
  { id: "chatiere", label: "Une chatière", href: "/sorties/chatiere/", lien: "Comparer les chatières", siDehors: true },
];

const AGE: Record<ProfilChat["age"], string> = { chaton: "Chaton", adulte: "Adulte", senior: "Senior" };
const NB: Record<ProfilChat["nbChats"], string> = { "1": "Il est seul", plusieurs: "Ils sont plusieurs" };
const DEHORS: Record<ProfilChat["dehors"], string> = { non: "Il reste dedans", oui: "Il sort au jardin" };

const lien = "font-medium underline decoration-accent decoration-2 underline-offset-4 hover:text-ink-soft";
const carte = "rounded-[1.5rem] bg-field px-4 py-6 sm:px-7";
const titre2 = "font-display mb-4 text-[clamp(1.5rem,1.2rem+1.2vw,2.125rem)]";

// Le H1 : « Le carnet de ton chat », puis « Le carnet de Mochi » une fois le profil lu (après l'hydratation).
export function TitreCarnet() {
  const profil = useProfil();
  return (
    <h1 className="font-display max-w-[18ch] text-[clamp(2.5rem,1.4rem+4.6vw,6rem)]">
      Le carnet de <span className="mot-serif">{profil ? profil.prenom : "ton chat"}</span>
    </h1>
  );
}

export function CarnetChat({ articles, distributeurs }: { articles: IndexArticles; distributeurs: Record<string, string> }) {
  const monte = useMonte();
  const profil = useProfil();
  const carnet = useCarnet();

  if (!monte || !profil || !carnet) {
    return (
      <div className="max-w-[44rem]">
        <p className="text-lead">
          {espacesFines(
            "Ici, le site garde le carnet de ton chat : son équipement, tes listes, ce que tu as lu. Tout reste dans ton navigateur. Pour commencer, crée son profil.",
          )}
        </p>
        <p data-sans-js className="mt-6">
          <Link href="/#titre-ton-chat" className={lien}>
            Créer son profil sur l&apos;accueil
          </Link>
        </p>
        {monte ? (
          <div className="mt-8 rounded-[1.75rem] bg-kira px-4 py-6 sm:px-8 sm:py-8">
            <CarteProfil surCarnet />
          </div>
        ) : null}
      </div>
    );
  }
  return <AvecProfil profil={profil} carnet={carnet} articles={articles} distributeurs={distributeurs} />;
}

function AvecProfil({
  profil,
  carnet,
  articles,
  distributeurs,
}: {
  profil: ProfilChat;
  carnet: Carnet;
  articles: IndexArticles;
  distributeurs: Record<string, string>;
}) {
  const n = essentielsCoches(carnet);
  const kira = n === ESSENTIELS.length ? KIRA_JAUGE.fin : n >= 3 ? KIRA_JAUGE.milieu : KIRA_JAUGE.debut;

  return (
    <div>
      <div className="max-w-[56rem] rounded-[1.75rem] bg-kira px-4 py-6 sm:px-8 sm:py-8">
        <BulleKira vivante clinSignal={n}>
          <p>{espacesFines(avecPrenom(kira, profil.prenom))}</p>
        </BulleKira>
        <div className="mt-6 rounded-[1.25rem] bg-paper px-4 py-5 sm:px-6">
          <h2 className="sr-only">Son profil</h2>
          <dl className="mb-2 flex flex-wrap gap-x-6 gap-y-1">
            <Info terme="Âge">{AGE[profil.age]}</Info>
            <Info terme="À la maison">{NB[profil.nbChats]}</Info>
            <Info terme="Dehors">{DEHORS[profil.dehors]}</Info>
          </dl>
          <CarteProfil surCarnet />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
        <div className="space-y-8">
          <Essentiels carnet={carnet} n={n} />
          <SelonProfil profil={profil} />
          <PetitsPlus carnet={carnet} profil={profil} />
        </div>
        <div className="space-y-8">
          <Listes carnet={carnet} />
          <Outils outils={carnet.outils} distributeurs={distributeurs} />
          <Badges carnet={carnet} articles={articles} />
        </div>
      </div>

      <ToutEffacer prenom={profil.prenom} />
    </div>
  );
}

function Info({ terme, children }: { terme: string; children: ReactNode }) {
  return (
    <div className="flex gap-1.5">
      <dt className="text-ink-soft">{terme}&#8239;:</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  );
}

const cocher = (id: string, coche: boolean) => majCarnet((c) => ({ ...c, equipement: basculerDans(c.equipement, id, coche) }));

function CaseLigne({ ligne, coche }: { ligne: Ligne; coche: boolean }) {
  const uid = useId();
  return (
    <li className="flex flex-col rounded-xl bg-paper px-4 py-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-x-4">
      <label htmlFor={uid} className="flex min-h-11 cursor-pointer items-center gap-3">
        <input
          id={uid}
          type="checkbox"
          checked={coche}
          onChange={(e) => cocher(ligne.id, e.target.checked)}
          className="size-5 shrink-0 cursor-pointer accent-[var(--ink)]"
        />
        <span>{espacesFines(ligne.label)}</span>
      </label>
      <Link href={ligne.href} className={`-mt-2 flex min-h-11 w-fit items-center pl-8 text-small sm:mt-0 sm:pl-0 ${lien}`}>
        {ligne.lien}
        <span className="sr-only"> : {ligne.label}</span>
      </Link>
    </li>
  );
}

function Essentiels({ carnet, n }: { carnet: Carnet; n: number }) {
  const id = useId();
  return (
    <section aria-labelledby={`${id}-t`} className={carte}>
      <h2 id={`${id}-t`} className={titre2}>
        L&apos;essentiel
      </h2>
      <div className="mb-5 flex items-center gap-4">
        <div
          role="progressbar"
          aria-labelledby={`${id}-t`}
          aria-valuemin={0}
          aria-valuemax={ESSENTIELS.length}
          aria-valuenow={n}
          aria-valuetext={`${n} sur ${ESSENTIELS.length}`}
          className="h-3 flex-1 overflow-hidden rounded-full bg-ink/10"
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300 ease-[var(--ease-out)] motion-reduce:transition-none"
            style={{ width: `${(n / ESSENTIELS.length) * 100}%` }}
          />
        </div>
        <p className="shrink-0 font-semibold tabular-nums">
          {n} sur {ESSENTIELS.length}
        </p>
      </div>
      <ul className="space-y-2">
        {ESSENTIELS.map((e) => (
          <CaseLigne key={e} ligne={{ id: e, ...LIGNES_ESSENTIELS[e] }} coche={carnet.equipement.includes(e)} />
        ))}
      </ul>
    </section>
  );
}

function SelonProfil({ profil }: { profil: ProfilChat }) {
  const id = useId();
  const lignes: ReactNode[] = [];
  if (profil.nbChats === "plusieurs") {
    lignes.push(
      <>
        {espacesFines("Plusieurs chats : un bac par chat, plus un.")}{" "}
        <Link href="/outils/combien-de-litieres/" className={lien}>
          Compter les bacs
        </Link>
      </>,
    );
  }
  if (profil.dehors === "oui") {
    lignes.push(
      <>
        {espacesFines("Il sort : ")}
        <Link href="/sorties/chatiere/" className={lien}>
          comparer les chatières
        </Link>
      </>,
    );
  }
  if (profil.age === "chaton") {
    lignes.push(
      <>
        {espacesFines("Pour un chaton : ")}
        <Link href={ARBRE_BAS} className={lien}>
          les arbres à chat bas, avec rampe
        </Link>
        , et{" "}
        <Link href="/litieres/litiere-autonettoyante-danger/#2-les-chatons-et-les-chats-tres-legers" className={lien}>
          une litière autonettoyante attendra qu&apos;il ait le poids indiqué par le fabricant
        </Link>
        .
      </>,
    );
  }
  if (profil.age === "senior") {
    lignes.push(
      <>
        {espacesFines("Pour un chat âgé : ")}
        <Link href={ARBRE_BAS} className={lien}>
          les arbres à chat bas, avec rampe
        </Link>
      </>,
    );
  }
  if (!lignes.length) return null;
  return (
    <section aria-labelledby={`${id}-t`} className={carte}>
      <h2 id={`${id}-t`} className={titre2}>
        Selon son profil
      </h2>
      <ul className="list-disc space-y-3 pl-5 marker:text-accent">
        {lignes.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </section>
  );
}

function PetitsPlus({ carnet, profil }: { carnet: Carnet; profil: ProfilChat }) {
  const id = useId();
  return (
    <section aria-labelledby={`${id}-t`} className={carte}>
      <h2 id={`${id}-t`} className={titre2}>
        Les petits plus, si tu veux
      </h2>
      <ul className="space-y-2">
        {PETITS_PLUS.filter((p) => !p.siDehors || profil.dehors === "oui").map((p) => (
          <CaseLigne key={p.id} ligne={p} coche={carnet.equipement.includes(p.id)} />
        ))}
      </ul>
    </section>
  );
}

function Listes({ carnet }: { carnet: Carnet }) {
  const id = useId();
  return (
    <section aria-labelledby={`${id}-t`} className={carte}>
      <h2 id={`${id}-t`} className={titre2}>
        Tes listes
      </h2>
      <ul className="space-y-2">
        {LISTES_MEMOIRE.map((l) => (
          <li key={l.id} className="rounded-xl bg-paper px-4 py-3">
            <Link href={l.href} className={lien}>
              {espacesFines(l.titre)}
            </Link>
            <span>
              &#8239;:{" "}
              {listeCommencee(l, carnet) ? (
                <span className="tabular-nums">
                  {cochesDeListe(l, carnet).size} sur {l.cases.length}
                </span>
              ) : (
                "pas encore commencée"
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const nf = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });
const nombreTexte = (s: string) => {
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? nf.format(n) : s;
};

function Outils({ outils, distributeurs }: { outils: OutilsRetenus; distributeurs: Record<string, string> }) {
  const id = useId();
  const EAU = "/outils/combien-eau-chat/";
  const AUTONOMIE = "/outils/autonomie-distributeur-croquettes/";
  const lignes: { cle: keyof OutilsRetenus; texte: string; href: string }[] = [];
  if (outils.chats) lignes.push({ cle: "chats", texte: `Nombre de chats : ${outils.chats}`, href: "/outils/combien-de-litieres/" });
  if (outils.poids) lignes.push({ cle: "poids", texte: `Poids : ${nombreTexte(outils.poids)} kg`, href: EAU });
  if (outils.alimentation) {
    const [patee, croquettes] = outils.alimentation.split("/");
    lignes.push({ cle: "alimentation", texte: `Repas : ${patee} g de pâtée et ${croquettes} g de croquettes par jour`, href: EAU });
  }
  if (outils.modele && distributeurs[outils.modele]) {
    lignes.push({ cle: "modele", texte: `Distributeur : ${distributeurs[outils.modele]}`, href: AUTONOMIE });
  }
  if (outils.contenance) lignes.push({ cle: "contenance", texte: `Contenance : ${nombreTexte(outils.contenance)} L`, href: AUTONOMIE });
  if (outils.ration) lignes.push({ cle: "ration", texte: `Ration : ${nombreTexte(outils.ration)} g par jour`, href: AUTONOMIE });
  if (!lignes.length) return null;

  return (
    <section aria-labelledby={`${id}-t`} className={carte}>
      <h2 id={`${id}-t`} className={titre2}>
        Retenu dans les outils
      </h2>
      <ul className="space-y-2">
        {lignes.map((l) => (
          <li key={l.cle} className="flex flex-wrap items-center justify-between gap-x-4 rounded-xl bg-paper px-4 py-1.5">
            <Link href={l.href} className={`flex min-h-11 items-center ${lien}`}>
              {espacesFines(l.texte)}
            </Link>
            <button
              type="button"
              onClick={() =>
                majCarnet((c) => {
                  const o = { ...c.outils };
                  delete o[l.cle];
                  return { ...c, outils: o };
                })
              }
              className={`min-h-11 text-small ${lien}`}
            >
              Effacer<span className="sr-only"> : {l.texte}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Badges({ carnet, articles }: { carnet: Carnet; articles: IndexArticles }) {
  const id = useId();
  const liste = badges(carnet, articles);
  return (
    <section aria-labelledby={`${id}-t`} className={carte}>
      <h2 id={`${id}-t`} className={titre2}>
        Ses badges
      </h2>
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-2">
        {liste.map((b) => (
          <li
            key={b.id}
            className={`flex items-start gap-3 rounded-xl px-4 py-3 ${b.gagne ? "bg-paper" : "bg-paper/50 text-ink-soft"}`}
          >
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-full ${b.gagne ? "bg-accent text-on-accent" : "border-[1.5px] border-dashed border-ink/30"}`}
            >
              <PictoBadge id={b.id} />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold">
                <span className="sr-only">{b.gagne ? "Badge gagné : " : "Badge pas encore gagné : "}</span>
                {espacesFines(b.titre)}
              </span>
              <span className="block text-small">{b.gagne ? "Gagné" : espacesFines(b.aFaire)}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ToutEffacer({ prenom }: { prenom: string }) {
  const [confirmer, setConfirmer] = useState(false);
  return (
    <div className="mt-12 border-t border-ink/15 pt-8">
      {confirmer ? (
        <p role="group" aria-label="Tout effacer" className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span>Effacer le profil et le carnet de {prenom}&#8239;?</span>
          <button
            type="button"
            className="min-h-11 rounded-full bg-nuit px-4 font-medium text-blanc"
            onClick={() => {
              oublierCarnet();
              oublierProfil();
            }}
          >
            Oui, tout effacer
          </button>
          <button type="button" className={`min-h-11 ${lien}`} onClick={() => setConfirmer(false)}>
            Non
          </button>
        </p>
      ) : (
        <button type="button" className={`min-h-11 ${lien}`} onClick={() => setConfirmer(true)}>
          Tout effacer
        </button>
      )}
      <p className="mt-3 text-small text-ink-soft">
        Rien ne quitte ton navigateur.{" "}
        <Link href="/confidentialite/#carnet" className={lien}>
          Ce que garde le carnet
        </Link>
      </p>
    </div>
  );
}
