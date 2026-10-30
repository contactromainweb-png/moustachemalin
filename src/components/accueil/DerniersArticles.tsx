import Link from "next/link";
import { formatDate } from "@/components/UpdatedDate";
import { LIBELLES_TYPE } from "@/lib/articles";
import { derniersArticles } from "@/lib/rubriques";
import { espacesFines } from "@/lib/typo";

// Bloc B : les trois articles mis à jour le plus récemment, avec leur date (lue dans le frontmatter `updatedAt`).
// Sous 1024 px, « Selon mon chat » est masqué : la section suit directement l'aplat lavande, d'où sa marge du haut.
export function DerniersArticles() {
  const articles = derniersArticles(3);
  if (articles.length === 0) return null;

  return (
    <section data-fond="page" aria-labelledby="titre-derniers" className="px-4 pb-24 max-lg:pt-20 sm:px-8 lg:pb-32">
      <div className="mx-auto grid max-w-[90rem] gap-10 lg:grid-cols-12 lg:gap-12">
        <h2 id="titre-derniers" className="reveal font-display text-head lg:col-span-4">
          Derniers articles et <span className="mot-serif">mises à jour</span>
        </h2>
        <ol className="space-y-4 lg:col-span-8">
          {articles.map((a) => (
            <li key={a.href} className="reveal">
              <Link
                href={a.href}
                className="group grid gap-x-8 gap-y-2 rounded-[1.5rem] bg-field px-5 py-6 transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.99] sm:grid-cols-[11rem_1fr_auto] sm:items-center sm:px-8"
              >
                <span className="text-small text-ink-soft">
                  {LIBELLES_TYPE[a.type].nom}
                  {a.updatedAt ? (
                    <>
                      <span className="sm:hidden"> · </span>
                      <span className="sm:block">
                        Mis à jour le <time dateTime={a.updatedAt}>{formatDate(a.updatedAt)}</time>
                      </span>
                    </>
                  ) : null}
                </span>
                <span className="font-display text-[clamp(1.5rem,1.2rem+1vw,2.125rem)]">{espacesFines(a.titre)}</span>
                <span
                  aria-hidden="true"
                  className="hidden size-11 items-center justify-center rounded-full bg-accent text-on-accent transition-transform duration-200 ease-[var(--ease-out)] sm:flex [@media(hover:hover)]:group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
