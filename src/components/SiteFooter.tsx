import Link from "next/link";
import { AmazonDisclosure } from "@/components/AmazonDisclosure";
import { PAGES_INFO, RUBRIQUES, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-32 bg-field px-4 pb-8 pt-16 sm:mt-44 sm:px-8">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-[34ch]">
            <p className="text-lead">{SITE.tagline}</p>
            <AmazonDisclosure className="mt-6" />
          </div>
          <nav aria-label="Rubriques (pied de page)">
            <ul className="flex flex-col gap-2">
              {RUBRIQUES.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="underline-offset-4 hover:underline">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Informations">
            <ul className="flex flex-col gap-2">
              {PAGES_INFO.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="underline-offset-4 hover:underline">
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
