import Link from "next/link";
import { AmazonDisclosure } from "@/components/AmazonDisclosure";
import { PAGES_INFO, rubriquesEnLigne, SITE } from "@/lib/site";

export function SiteFooter() {
  const rubriques = rubriquesEnLigne();

  return (
    // Collé à la page quand elle finit sur un aplat plein (data-fin-pleine, sur l'accueil).
    <footer className="mt-32 bg-field px-4 pb-8 pt-16 sm:mt-44 sm:px-8 [main:has([data-fin-pleine])+&]:mt-0 sm:[main:has([data-fin-pleine])+&]:mt-0">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-[34ch]">
            <p className="text-lead">{SITE.tagline}</p>
            <AmazonDisclosure className="mt-6" />
          </div>
          {rubriques.length > 0 ? (
            <nav aria-label="Rubriques (pied de page)">
              <ul className="flex flex-col">
                {rubriques.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className="inline-block py-2.5 underline-offset-4 hover:underline">
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          <nav aria-label="Informations" className="md:col-start-3">
            <ul className="flex flex-col">
              {PAGES_INFO.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="inline-block py-2.5 underline-offset-4 hover:underline">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Le nom revient en grand pour fermer la page. */}
        <p
          aria-hidden="true"
          className="font-display mt-20 text-[clamp(3.5rem,13.5vw,13rem)] text-caramel"
        >
          {SITE.name}
        </p>
        <p className="mt-6 text-small text-ink-soft">
          © {process.env.BUILD_YEAR} {SITE.name} · <a href={`mailto:${SITE.email}`} className="underline underline-offset-4">{SITE.email}</a>
        </p>
      </div>
    </footer>
  );
}
