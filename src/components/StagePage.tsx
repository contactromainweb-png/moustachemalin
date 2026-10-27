import Image from "next/image";
import type { ReactNode } from "react";
import type { Photo } from "@/lib/medias";

export type StagePhoto = Photo;

type Props = {
  title: string;
  lead: string;
  updated?: string;
  photo?: StagePhoto;
  // Mot affiché en grand sur le panneau tant qu'aucune photo n'est choisie.
  stageWord: string;
  children: ReactNode;
};

// Mise en page « scène partagée » des pages institutionnelles :
// ordinateur : à droite une photo qui reste en place, à gauche une colonne de lecture.
// Téléphone : la photo vient après le texte, pour que le titre reste le premier élément affiché (LCP).
export function StagePage({ title, lead, updated, photo, stageWord, children }: Props) {
  const colonne = "px-4 sm:px-8 lg:pl-[max(2rem,calc((100vw-90rem)/2+2rem))] lg:pr-16";
  return (
    <div className="grid [grid-template-areas:'intro'_'corps'_'photo'] lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:grid-rows-[auto_1fr] lg:[grid-template-areas:'intro_photo'_'corps_photo']">
      <div className={`${colonne} pt-10 [grid-area:intro] lg:pt-20`}>
        <h1 className="font-display rise max-w-[14ch] text-display">{title}</h1>
        <p className="rise mt-8 max-w-[38ch] text-lead" style={{ "--i": 1 } as React.CSSProperties}>
          {lead}
        </p>
      </div>

      <div className={`${colonne} pb-8 [grid-area:corps]`}>
        <div className="mt-16 max-w-[44rem]">
          {children}
          {updated ? <p className="mt-16 text-small text-ink-soft">Mis à jour le {updated}</p> : null}
        </div>
      </div>

      <aside
        aria-hidden={photo ? undefined : true}
        className={`${photo ? "mb-8 px-4 sm:px-8" : "hidden"} [grid-area:photo] lg:sticky lg:top-0 lg:mb-0 lg:block lg:h-svh lg:self-start lg:p-3`}
      >
        <figure className="relative aspect-[4/3] overflow-hidden bg-caramel-field lg:aspect-auto lg:h-full">
          {photo ? (
            <>
              {/* Ordinateur : plus grand élément de l'écran, demandé en priorité. Téléphone : chargé à l'approche. */}
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                loading="lazy"
                fetchPriority="high"
                quality={70}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-paper px-5 py-3 text-small text-ink-soft lg:py-4">
                {photo.credit}
              </figcaption>
            </>
          ) : (
            <p
              aria-hidden="true"
              className="font-display absolute bottom-6 left-6 right-6 text-[clamp(4rem,9vw,9rem)] text-on-caramel"
            >
              {stageWord}
            </p>
          )}
        </figure>
      </aside>
    </div>
  );
}
