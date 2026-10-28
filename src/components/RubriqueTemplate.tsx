import Image from "next/image";
import Link from "next/link";
import { StagePage, type StagePhoto } from "@/components/StagePage";
import { TitreSerif } from "@/components/TitreSerif";
import { LIBELLES_TYPE, type TypeArticle } from "@/lib/articles";
import { PHOTOS } from "@/lib/medias";
import { espacesFines } from "@/lib/typo";

export type ArticleLien = {
  href: string;
  titre: string;
  description: string;
  type: TypeArticle;
  photo?: keyof typeof PHOTOS;
  motSerif?: string;
  updatedAt?: string;
};

type Props = {
  titre: string;
  intro: string;
  articles: ArticleLien[];
  photo?: StagePhoto;
};

// Page de rubrique : introduction courte, cartes vers les articles (grande photo, titre avec son mot en serif
// italique), photo d'ambiance qui reste en place sur ordinateur. Apparitions légères en CSS seulement.
export function RubriqueTemplate({ titre, intro, articles, photo }: Props) {
  return (
    <StagePage title={titre} lead={intro} photo={photo} stageWord={titre}>
      <h2 data-fond="page" className="font-display mb-8 text-head">
        Nos <span className="mot-serif">articles</span>
      </h2>
      <ul className="grid gap-6 sm:grid-cols-2">
        {articles.map((a) => {
          const image = a.photo ? PHOTOS[a.photo] : undefined;
          return (
            <li key={a.href} className="reveal">
              <Link
                href={a.href}
                className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-field transition-transform duration-200 ease-[var(--ease-out)] active:scale-[0.99]"
              >
                {image ? (
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={image.src}
                      alt=""
                      fill
                      quality={80}
                      sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-[var(--ease-out)] [@media(hover:hover)]:group-hover:scale-[1.03]"
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col px-5 pb-6 pt-5">
                  <p className="text-small font-medium text-ink-soft">
                    {LIBELLES_TYPE[a.type].nom}
                  </p>
                  <span className="mt-2 block font-display text-[1.6rem] leading-tight">
                    <TitreSerif titre={a.titre} mot={a.motSerif} />
                  </span>
                  <span className="mt-3 block">{espacesFines(a.description)}</span>
                  <span className="mt-auto block pt-5 font-medium underline decoration-2 underline-offset-[6px]">
                    {LIBELLES_TYPE[a.type].lire}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </StagePage>
  );
}
