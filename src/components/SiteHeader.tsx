import Link from "next/link";
import { rubriquesEnLigne, SITE } from "@/lib/site";

const linkClass =
  "py-2 underline-offset-4 decoration-2 hover:underline hover:decoration-caramel transition-colors";

export function SiteHeader() {
  const rubriques = rubriquesEnLigne();

  return (
    <header className="relative px-4 sm:px-8">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-6 py-3">
        <Link
          href="/"
          className="py-2 font-display text-[1.75rem] sm:text-[2rem] hover:text-caramel transition-colors"
        >
          {SITE.name}
        </Link>

        {rubriques.length > 0 ? (
          <>
            {/* Ordinateur : les rubriques en ligne. */}
            <nav aria-label="Rubriques" className="hidden lg:block">
              <ul className="flex items-center gap-7 text-small">
                {rubriques.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className={linkClass}>
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Téléphone : menu dépliant, fonctionne sans JavaScript. */}
            <details className="group lg:hidden">
              <summary className="flex min-h-11 cursor-pointer list-none items-center bg-ink px-4 text-small text-paper [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">Menu</span>
                <span className="hidden group-open:inline">Fermer</span>
              </summary>
              <nav
                aria-label="Rubriques"
                className="absolute inset-x-0 z-20 mt-5 hidden group-open:block bg-caramel-field px-4 pb-8 pt-4 text-on-caramel"
              >
                <ul className="flex flex-col">
                  {rubriques.map((r) => (
                    <li key={r.href}>
                      <Link href={r.href} className="block py-3 font-display text-[2rem]">
                        {r.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </details>
          </>
        ) : null}
      </div>
    </header>
  );
}
