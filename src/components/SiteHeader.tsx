import Link from "next/link";
import { Logo } from "@/components/Logo";
import { rubriquesEnLigne } from "@/lib/site";

const linkClass =
  "py-2 underline-offset-[6px] decoration-2 decoration-accent hover:underline transition-colors duration-200";

// Bandeau bleu nuit de 4 rem (l'accueil retranche cette hauteur à son premier écran).
export function SiteHeader() {
  const rubriques = rubriquesEnLigne();

  return (
    <header className="relative z-30 bg-nuit px-4 text-blanc sm:px-8">
      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-6">
        <Logo fond="sombre" taille="entete" />

        {rubriques.length > 0 ? (
          <>
            {/* Ordinateur : les rubriques en ligne. */}
            <nav aria-label="Rubriques" className="hidden lg:block">
              <ul className="flex items-center gap-8 text-small font-medium">
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
              <summary className="flex min-h-11 cursor-pointer list-none items-center rounded-full bg-accent px-5 text-small font-medium text-on-accent transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97] [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">Menu</span>
                <span className="hidden group-open:inline">Fermer</span>
              </summary>
              <nav
                aria-label="Rubriques"
                className="absolute inset-x-0 top-full hidden bg-nuit px-4 pb-8 pt-2 group-open:block"
              >
                <ul className="flex flex-col">
                  {rubriques.map((r) => (
                    <li key={r.href}>
                      <Link href={r.href} className="font-display block py-3 text-[2.25rem]">
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
