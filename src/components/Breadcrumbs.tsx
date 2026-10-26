import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export type Crumb = { label: string; href: string };

// Fil d'Ariane + schema BreadcrumbList. Le dernier élément est la page courante.
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const tous = [{ label: "Accueil", href: "/" }, ...items];
  return (
    <nav aria-label="Fil d'Ariane" className="text-small text-ink-soft">
      <ol className="flex flex-wrap gap-x-2">
        {tous.map((c, i) => (
          <li key={c.href} className="flex gap-x-2">
            {i < tous.length - 1 ? (
              <>
                <Link href={c.href} className="underline-offset-4 hover:text-ink hover:underline">
                  {c.label}
                </Link>
                <span aria-hidden="true">/</span>
              </>
            ) : (
              <span aria-current="page">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: tous.map((c, i) => ({
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
