import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Figure } from "@/components/Figure";
import { JsonLd } from "@/components/JsonLd";
import { UpdatedDate } from "@/components/UpdatedDate";
import { cheminArticle, rubriqueArticle, type Frontmatter } from "@/lib/articles";
import type { Photo } from "@/lib/medias";
import { getProduct } from "@/lib/products";
import { SITE } from "@/lib/site";
import { espacesFines } from "@/lib/typo";

// Modèle commun aux comparatifs et aux guides. Le corps (MethodNote, mention Amazon, sections)
// vient du fichier MDX. Pas de Three.js ici : les articles restent légers (cahier des charges, section 2).
type Props = { frontmatter: Frontmatter; photo?: Photo; children: ReactNode };

export function ArticleTemplate({ frontmatter: fm, photo, children }: Props) {
  const chemin = cheminArticle(fm);
  const url = new URL(chemin, SITE.url).toString();

  return (
    <article className="mx-auto max-w-[90rem] px-4 pt-6 sm:px-8 lg:pt-10">
      <Breadcrumbs items={[rubriqueArticle(fm), { label: espacesFines(fm.title), href: chemin }]} />

      <header
        className={`mt-10 lg:mt-16 ${photo ? "lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-12" : ""}`}
      >
        <div>
          <h1 className="font-display rise max-w-[22ch] text-[clamp(2.5rem,1.4rem+4.6vw,6rem)]">{espacesFines(fm.title)}</h1>
          <UpdatedDate date={fm.updatedAt} className="rise mt-6" />
        </div>
        {photo ? (
          // Ordinateur seulement : sur téléphone, le titre reste le premier élément affiché (LCP).
          <Figure photo={photo} enTete sizes="38vw" className="hidden lg:block" />
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
