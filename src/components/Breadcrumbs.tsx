import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { pageEnLigne, SITE } from "@/lib/site";

export type Crumb = { label: string; href: string };

// Fil d'Ariane + schema BreadcrumbList. Le dernier élément est la page courante.
// Une étape dont la page n'existe pas encore s'affiche en texte simple, sans lien.
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const tous = [{ label: "Accueil", href: "/" }, ...items];
  return (
    <nav aria-label="Fil d'Ariane" className="text-small text-ink-soft">
      <ol className="flex flex-wrap gap-x-2">
        {tous.map((c, i) => {
          const derniere = i === tous.length - 1;
          return (
            <li key={c.href} className="flex gap-x-2">
              {derniere ? (
                <span aria-current="page">{c.label}</span>
              ) : pageEnLigne(c.href) ? (
                <Link href={c.href} className="underline-offset-4 hover:text-ink hover:underline">
                  {c.label}
                </Link>
              ) : (
                <span>{c.label}</span>
              )}
              {derniere ? null : <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          // Seules les pages qui existent sont déclarées à Google.
          itemListElement: tous
            .filter((c) => pageEnLigne(c.href))
            .map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: c.label,
              item: new URL(c.href, SITE.url).toString(),
            })),
        }}
      />
    </nav>
  );
}
