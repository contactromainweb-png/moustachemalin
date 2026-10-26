import Image from "next/image";
import type { ReactNode } from "react";

export type StagePhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  credit: string; // ex. « Photo : Jeanne Martin, Unsplash »
};

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
// à droite une photo qui reste en place, à gauche une colonne de lecture.
export function StagePage({ title, lead, updated, photo, stageWord, children }: Props) {
  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)]">
      <div className="px-4 pb-8 pt-10 sm:px-8 lg:pl-[max(2rem,calc((100vw-90rem)/2+2rem))] lg:pr-16 lg:pt-20">
        <h1 className="font-display rise max-w-[14ch] text-display">{title}</h1>
        <p className="rise mt-8 max-w-[38ch] text-lead" style={{ "--i": 1 } as React.CSSProperties}>
          {lead}
        </p>
        <div className="mt-16 max-w-[44rem]">
          {children}
          {updated ? <p className="mt-16 text-small text-ink-soft">Mis à jour le {updated}</p> : null}
        </div>
      </div>

      <aside
        aria-hidden={photo ? undefined : true}
        className="hidden lg:sticky lg:top-0 lg:block lg:h-svh lg:p-3"
      >
        <div className="relative h-full overflow-hidden bg-caramel-field">
          {photo ? (
            <>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <p className="absolute inset-x-0 bottom-0 bg-paper px-5 py-4 text-small text-ink-soft">
                {photo.credit}
              </p>
            </>
          ) : (
            <p
              aria-hidden="true"
              className="font-display absolute bottom-6 left-6 right-6 text-[clamp(4rem,9vw,9rem)] text-on-caramel"
            >
              {stageWord}
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
