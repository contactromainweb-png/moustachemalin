import Image from "next/image";
import { Portrait } from "@/components/KiraNote";
import { espacesFines } from "@/lib/typo";

// Petite galerie de Kira (page À propos) : photos personnelles de Romain, jamais en plein écran.
// Grand écran : quatre photos côte à côte ; tablette : deux par ligne ; téléphone : elles défilent à l'horizontale.
// Textes fournis par Romain : aucune phrase de Kira, aucune habitude inventée (charte, CLAUDE.md section 11).
// kira-sphinx-table.jpg reste dans public/media/kira/ mais n'est plus montrée (moins nette que les nouvelles).
type PhotoGalerie = { src: string; alt: string; width: number; height: number; legende?: string };

export const GALERIE: PhotoGalerie[] = [
  { src: "/media/kira/kira-tete-penchee.jpg", alt: "Kira, tête penchée, qui regarde l'objectif", width: 1545, height: 1906 },
  {
    src: "/media/kira/kira-attrape-jouet.jpg",
    alt: "Kira qui attrape son jouet",
    width: 1326,
    height: 2177,
    legende: "Fofolle et joueuse, comme promis.",
  },
  { src: "/media/kira/kira-joue-plumeau.jpg", alt: "Kira qui joue avec sa canne à plumes", width: 1536, height: 2048 },
  {
    src: "/media/kira/kira-joue-avec-romain.jpg",
    alt: "Kira qui joue avec Romain",
    width: 1536,
    height: 2048,
    legende: "Séance de jeu quotidienne.",
  },
];

// Les chats de la famille de Romain (photos personnelles, publiées avec l'accord de leurs propriétaires).
// Ce ne sont pas des photos de Kira, et ils ne « parlent » pas : seule Kira a une voix. Aucun prénom de propriétaire.
export const COUSINS: PhotoGalerie[] = [
  {
    src: "/media/famille/sucette-jardin-violettes.jpg",
    alt: "Sucette, la chatte de la compagne de Romain, au jardin parmi les violettes",
    width: 1500,
    height: 2000,
    legende: "Sucette",
  },
  {
    src: "/media/famille/black-pearl-portrait.jpg",
    alt: "Black Pearl, le chat noir de la compagne de Romain, assis dans l'herbe",
    width: 1500,
    height: 2000,
    legende: "Black Pearl",
  },
  {
    src: "/media/famille/rebelle-sieste.jpg",
    alt: "Rebelle, la chatte du père de Romain, en pleine sieste sur une table",
    width: 1341,
    height: 746,
    legende: "Rebelle",
  },
  {
    src: "/media/famille/imotep-chaise.jpg",
    alt: "Imotep, le chat de la sœur de Romain, couché sur une chaise",
    width: 1455,
    height: 1482,
    legende: "Imotep",
  },
  {
    src: "/media/famille/chichoune-ventre-en-lair.jpg",
    alt: "Chichoune, la chatte de la sœur de Romain, allongée sur le dos près d'une fenêtre",
    width: 1656,
    height: 2208,
    legende: "Chichoune",
  },
];

export function KiraGalerie() {
  return (
    <section aria-label="Kira en photos" className="reveal my-12 max-w-[44rem]">
      <div className="mb-5 flex items-center gap-4">
        <Portrait />
        <p className="font-medium">Kira en photos</p>
      </div>
      {/* contain:inline-size : la rangée défile dans la page au lieu d'élargir la colonne qui la contient. */}
      <ul className="-mx-4 flex [contain:inline-size] snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-4">
        {GALERIE.map((p) => (
          <li key={p.src} className="w-[68vw] shrink-0 snap-start sm:w-auto">
            <Vignette photo={p} sizes="(min-width: 1280px) 11rem, (min-width: 640px) 22rem, 68vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}

// Juste après la galerie : « Les cousins de Kira », cinq petites photos côte à côte (elles défilent sur téléphone).
export function KiraCousins() {
  return (
    <section aria-labelledby="cousins-kira" className="reveal my-12 max-w-[44rem]">
      <h2 id="cousins-kira" className="font-medium">
        Les cousins de Kira
      </h2>
      <p className="mt-2 max-w-[60ch]">
        {espacesFines(
          "Kira n'est pas la seule à poser pour le site : Sucette et Black Pearl, les chats de ma compagne, Rebelle, la chatte de mon père, et Imotep et Chichoune, les chats de ma sœur, passent parfois une tête.",
        )}
      </p>
      <ul className="-mx-4 mt-5 flex [contain:inline-size] snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0 sm:pb-0">
        {COUSINS.map((p) => (
          <li key={p.src} className="w-[36vw] shrink-0 snap-start sm:w-auto">
            <Vignette photo={p} sizes="(min-width: 640px) 9rem, 36vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Vignette({ photo: p, sizes }: { photo: PhotoGalerie; sizes: string }) {
  return (
    <figure>
      <Image
        src={p.src}
        alt={p.alt}
        width={p.width}
        height={p.height}
        sizes={sizes}
        quality={80}
        className="aspect-[3/4] w-full rounded-[1.25rem] bg-field object-cover"
      />
      {p.legende ? <figcaption className="mt-3 text-small text-ink-soft">{espacesFines(p.legende)}</figcaption> : null}
    </figure>
  );
}
