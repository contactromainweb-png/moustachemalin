import Image from "next/image";
import type { ReactNode } from "react";
import type { Photo } from "@/lib/medias";
import { espacesFines } from "@/lib/typo";

export type StagePhoto = Photo;

type Props = {
  title: string;
  lead: string;
  updated?: string;
  photo?: StagePhoto;
  // Mot affiché en grand sur le panneau tant qu'aucune photo n'est choisie.
  stageWord: string;
  // Portrait (page À propos) : sur téléphone, la photo vient juste après l'introduction, au format vertical.
  portrait?: boolean;
  // Fil d'Ariane, au-dessus du titre (pages rubriques).
  filAriane?: ReactNode;
  children: ReactNode;
};

// Mise en page « scène partagée » des pages institutionnelles :
// ordinateur : à droite une photo qui reste en place, à gauche une colonne de lecture.
// Téléphone : la photo vient après le texte, pour que le titre reste le premier élément affiché (LCP) ;
// un portrait vient juste après l'introduction (le titre reste au-dessus).
// Une photo verticale garde un format vertical sur téléphone ; sa légende (photo.legende) est posée en pastille sur la photo.
export function StagePage({ title, lead, updated, photo, stageWord, portrait = false, filAriane, children }: Props) {
  const vertical = portrait || (photo !== undefined && photo.height > photo.width);
  const zones = portrait ? "[grid-template-areas:'intro'_'photo'_'corps']" : "[grid-template-areas:'intro'_'corps'_'photo']";
  const colonne = "px-4 sm:px-8 lg:pl-[max(2rem,calc((100vw-90rem)/2+2rem))] lg:pr-16";
  return (
    <div
      className={`grid ${zones} lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:grid-rows-[auto_1fr] lg:[grid-template-areas:'intro_photo'_'corps_photo']`}
    >
      <div className={`${colonne} ${filAriane ? "pt-6 lg:pt-10" : "pt-10 lg:pt-20"} [grid-area:intro]`}>
        {filAriane ? <div className="mb-6 lg:mb-10">{filAriane}</div> : null}
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
        className={`${photo ? (portrait ? "mt-10 px-4 sm:px-8" : "mb-8 px-4 sm:px-8") : "hidden"} [grid-area:photo] lg:sticky lg:top-0 lg:mb-0 lg:block lg:h-svh lg:self-start lg:p-3`}
      >
        <figure className={`relative ${vertical ? "aspect-[4/5] max-w-md" : "aspect-[4/3]"} overflow-hidden rounded-[1.5rem] bg-lavande lg:aspect-auto lg:h-full lg:max-w-none lg:rounded-[2rem]`}>
          {photo ? (
            <>
              {/* Ordinateur : plus grand élément de l'écran, demandé en priorité. Téléphone : chargé à l'approche. */}
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                loading={portrait ? "eager" : "lazy"}
                fetchPriority="high"
                quality={80}
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
                style={photo.position ? { objectPosition: photo.position } : undefined}
              />
              {photo.legende ? (
                <figcaption className="absolute inset-x-3 bottom-3 rounded-[1rem] bg-paper/95 px-4 py-3 text-small text-ink lg:inset-x-6 lg:bottom-6 lg:max-w-[34rem]">
                  {espacesFines(photo.legende)}
                </figcaption>
              ) : null}
            </>
          ) : (
            <p
              aria-hidden="true"
              className="font-display absolute bottom-6 left-6 right-6 text-[clamp(4rem,9vw,9rem)] text-nuit"
            >
              {stageWord}
            </p>
          )}
        </figure>
      </aside>
    </div>
  );
}
