import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { CartesOutils } from "@/components/Outils";
import { StagePage, type StagePhoto } from "@/components/StagePage";
import { TitreSerif } from "@/components/TitreSerif";
import { LIBELLES_TYPE, type TypeArticle } from "@/lib/articles";
import { attribuerPhotos, sources } from "@/lib/cartes";
import { PHOTOS, type Photo } from "@/lib/medias";
import { SITE } from "@/lib/site";
import { espacesFines } from "@/lib/typo";

export type ArticleLien = {
  href: string;
  titre: string;
  description: string;
  type: TypeArticle;
  photo?: keyof typeof PHOTOS;
  photos?: (keyof typeof PHOTOS)[]; // toutes les photos de l'article, pour choisir celle de la carte (lib/cartes.ts)
  motSerif?: string;
  updatedAt?: string;
};

type Groupe = { type: TypeArticle; articles: ArticleLien[] };

type Props = {
  titre: string;
  intro: string;
  chemin: string; // adresse de la page, ex. "/litieres/" (fil d'Ariane, liste ItemList)
  // Texte de la rubrique sous les cartes (content/rubriques/<rubrique>.mdx : à quoi sert l'équipement, comment
  // choisir, liens vers chaque article, mini FAQ).
  texte?: ReactNode;
  photo?: StagePhoto;
  // Petite photo d'ambiance posée avant les cartes (page /guides/ : Rebelle), en plus de la grande photo de la scène.
  vignette?: Photo;
  // Page /outils/ : grandes cartes avec icône et bouton « Calculer maintenant », sans photo.
  outils?: boolean;
} & ({ articles: ArticleLien[]; groupes?: never } | { groupes: Groupe[]; articles?: never });

// Titre de chaque groupe (page /guides/) : le mot du milieu en serif italique.
const TITRES_GROUPE: Record<TypeArticle, [string, string, string]> = {
  guide: ["Nos", "guides", ""],
  avis: ["Nos", "avis", " détaillés"],
  duel: ["Nos", "duels", " pour trancher"],
  outil: ["Nos", "outils", ""],
  comparatif: ["Nos", "comparatifs", ""],
};

// Page de rubrique : introduction courte, cartes vers les articles (grande photo, titre avec son mot en serif
// italique), photo d'ambiance qui reste en place sur ordinateur. Apparitions légères en CSS seulement.
// `groupes` au lieu d'`articles` : les cartes sont rangées par type d'article, un titre par groupe (page /guides/).
// Fil d'Ariane au-dessus du titre ; schema ItemList avec tous les articles listés.
// Aucune carte ne reprend la photo de la page ni celle d'une autre carte (voir attribuerPhotos).
export function RubriqueTemplate({ titre, intro, chemin, texte, articles, groupes, photo, vignette, outils }: Props) {
  const liste = groupes ? groupes.flatMap((g) => g.articles) : articles;
  const prises = sources(photo, vignette);
  return (
    <StagePage
      title={titre}
      lead={intro}
      photo={photo}
      stageWord={titre}
      filAriane={<Breadcrumbs items={[{ label: titre, href: chemin }]} />}
    >
      {vignette ? (
        <Image
          src={vignette.src}
          alt={vignette.alt}
          width={vignette.width}
          height={vignette.height}
          quality={80}
          sizes="(min-width: 640px) 20rem, 80vw"
          className="mb-14 w-full max-w-[20rem] rounded-[1.25rem] bg-field"
        />
      ) : null}
      {groupes ? (
        groupes.map((g, i) => {
          const [avant, mot, apres] = TITRES_GROUPE[g.type];
          return (
            <section key={g.type} aria-labelledby={`groupe-${g.type}`} className={i > 0 ? "mt-20" : undefined}>
              <h2 id={`groupe-${g.type}`} data-fond="page" className="font-display mb-8 text-head">
                {avant} <span className="mot-serif">{mot}</span>
                {apres}
              </h2>
              {g.type === "outil" ? (
                <CartesOutils articles={g.articles} />
              ) : (
                <Cartes articles={attribuerPhotos(g.articles, prises)} />
              )}
            </section>
          );
        })
      ) : outils ? (
        <>
          <h2 data-fond="page" className="font-display mb-8 text-head">
            Nos <span className="mot-serif">outils</span>
          </h2>
          <CartesOutils articles={articles} />
        </>
      ) : (
        <CartesRubrique articles={attribuerPhotos(articles, prises)} />
      )}
      {texte ? <div className="mt-24">{texte}</div> : null}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: titre,
          url: new URL(chemin, SITE.url).toString(),
          itemListElement: liste.map((a, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: a.titre,
            url: new URL(a.href, SITE.url).toString(),
          })),
        }}
      />
    </StagePage>
  );
}

// Page de rubrique : « Nos articles », puis les duels à part (« Nos duels pour trancher »), comme sur /guides/.
// Les photos sont attribuées sur l'ensemble avant le partage : aucune carte ne répète celle d'une autre.
function CartesRubrique({ articles }: { articles: ArticleLien[] }) {
  const duels = articles.filter((a) => a.type === "duel");
  const autres = articles.filter((a) => a.type !== "duel");
  const [avant, mot, apres] = TITRES_GROUPE.duel;
  return (
    <>
      <h2 data-fond="page" className="font-display mb-8 text-head">
        Nos <span className="mot-serif">articles</span>
      </h2>
      <Cartes articles={autres} />
      {duels.length > 0 ? (
        <section aria-labelledby="groupe-duel" className="mt-20">
          <h2 id="groupe-duel" data-fond="page" className="font-display mb-8 text-head">
            {avant} <span className="mot-serif">{mot}</span>
            {apres}
          </h2>
          <Cartes articles={duels} />
        </section>
      ) : null}
    </>
  );
}

function Cartes({ articles }: { articles: ArticleLien[] }) {
  return (
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
                    alt={image.alt}
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
  );
}
