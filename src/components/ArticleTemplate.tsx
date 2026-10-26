import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { MethodNote } from "@/components/MethodNote";
import { UpdatedDate } from "@/components/UpdatedDate";
import type { ArticleMeta } from "@/lib/articles";
import { getProduct } from "@/lib/products";
import { SITE } from "@/lib/site";

// Modèle commun aux comparatifs et aux guides. Le corps de l'article vient du fichier MDX.
// Pas de Three.js ici : les articles restent légers (cahier des charges, section 2).
export function ArticleTemplate({ meta, children }: { meta: ArticleMeta; children: ReactNode }) {
  const url = new URL(meta.chemin, SITE.url).toString();

  return (
    <article className="mx-auto max-w-[90rem] px-4 pt-6 sm:px-8 lg:pt-10">
      <Breadcrumbs items={[meta.rubrique, { label: meta.titre, href: meta.chemin }]} />

      <header className="mt-10 lg:mt-16">
        <h1 className="font-display rise max-w-[22ch] text-[clamp(2.5rem,1.4rem+4.6vw,6rem)]">{meta.titre}</h1>
        <UpdatedDate date={meta.misAJour} className="rise mt-6" />
      </header>

      <div className="mt-10 max-w-[64rem] lg:mt-14">
        {meta.type === "comparatif" ? <MethodNote /> : null}
        <div className={meta.type === "comparatif" ? "mt-12" : ""}>{children}</div>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: meta.titre,
          description: meta.description,
          datePublished: meta.publie,
          dateModified: meta.misAJour,
          mainEntityOfPage: url,
          inLanguage: "fr-FR",
          author: { "@type": "Organization", name: SITE.name, url: SITE.url },
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
        }}
      />
      {meta.type === "comparatif" && meta.produits?.length ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: meta.titre,
            itemListElement: meta.produits.map((asin, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: getProduct(asin).nom,
              url: `${url}#${asin}`,
            })),
          }}
        />
      ) : null}
    </article>
  );
}
