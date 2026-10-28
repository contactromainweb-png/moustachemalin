import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import Image from "next/image";
import { JsonLd } from "@/components/JsonLd";
import { TitreSerif } from "@/components/TitreSerif";
import { UpdatedDate } from "@/components/UpdatedDate";
import { cheminArticle, rubriqueArticle, type Frontmatter } from "@/lib/articles";
import { PHOTOS, type Photo } from "@/lib/medias";
import { getProduct } from "@/lib/products";
import { SITE } from "@/lib/site";
import { espacesFines } from "@/lib/typo";

// Modèle commun aux comparatifs et aux guides. Le corps (MethodNote, mention Amazon, sections)
// vient du fichier MDX. Pas de Three.js ici : les articles restent légers (cahier des charges, section 2).
type Props = { frontmatter: Frontmatter; photo?: Photo; children: ReactNode };

export function ArticleTemplate({ frontmatter: fm, photo, children }: Props) {
  const chemin = cheminArticle(fm);
  const url = new URL(chemin, SITE.url).toString();
  const image = photo ?? (fm.photo ? PHOTOS[fm.photo] : undefined);

  return (
    <article className="mx-auto max-w-[90rem] px-4 pt-6 sm:px-8 lg:pt-10">
      <Breadcrumbs items={[rubriqueArticle(fm), { label: espacesFines(fm.title), href: chemin }]} />

      <header data-fond="page" className="mt-10 lg:mt-14">
        <h1 className="font-display rise max-w-[20ch] text-[clamp(2.5rem,1.4rem+4.6vw,6rem)]">
          <TitreSerif titre={fm.title} mot={fm.motSerif} />
        </h1>
        <UpdatedDate date={fm.updatedAt} className="rise mt-6" />
        {image ? (
          // Grande photo d'en-tête, aussi sur téléphone : demandée en priorité, c'est le plus grand élément affiché.
          <figure className="rise mt-10 lg:mt-14" style={{ "--i": 2 } as React.CSSProperties}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-field sm:aspect-[16/9] lg:aspect-[21/9] lg:rounded-[2rem]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                quality={80}
                sizes="(min-width: 90rem) 86rem, (min-width: 640px) calc(100vw - 4rem), calc(100vw - 2rem)"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-2 text-small text-ink-soft">{image.credit}</figcaption>
          </figure>
        ) : null}
      </header>

      <div className="mt-10 max-w-[64rem] lg:mt-14">{children}</div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: fm.title,
          description: fm.description,
          datePublished: fm.publishedAt ?? fm.updatedAt,
          dateModified: fm.updatedAt,
          mainEntityOfPage: url,
          inLanguage: "fr-FR",
          author: { "@type": "Organization", name: SITE.name, url: SITE.url },
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
        }}
      />
      {fm.type === "comparatif" && fm.products?.length ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: fm.title,
            itemListElement: fm.products.map((asin, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: getProduct(asin).name,
              url: `${url}#${asin}`,
            })),
          }}
        />
      ) : null}
    </article>
  );
}
