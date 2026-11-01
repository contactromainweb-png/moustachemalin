import Link from "next/link";
import { AmazonDisclosure } from "@/components/AmazonDisclosure";
import { Logo, MotMalin, RELIEF_TITRE } from "@/components/Logo";
import { PAGES_INFO, RESEAUX, rubriquesEnLigne, SITE } from "@/lib/site";

// Pictogrammes des réseaux (tracés Simple Icons, domaine public).
const ICONES: Record<(typeof RESEAUX)[number]["nom"], string> = {
  Pinterest:
    "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z",
  TikTok:
    "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
};

export function SiteFooter() {
  const rubriques = rubriquesEnLigne();

  return (
    // Collé à la page quand elle finit sur un aplat plein (data-fin-pleine, sur l'accueil).
    <footer className="mt-32 bg-field px-4 pb-8 pt-16 sm:mt-44 sm:px-8 [main:has([data-fin-pleine])+&]:mt-0 sm:[main:has([data-fin-pleine])+&]:mt-0">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-[34ch]">
            <Logo fond="theme" taille="pied" />
            <p className="mt-6 text-lead">{SITE.tagline}</p>
            <AmazonDisclosure className="mt-6" />
            {/* Comptes du site (src/lib/site.ts) : TikTok n'apparaît que si NEXT_PUBLIC_TIKTOK_URL est renseignée. */}
            <ul aria-label="Moustache Malin sur les réseaux" className="mt-6 flex flex-wrap gap-x-6">
              {RESEAUX.map((r) => (
                <li key={r.nom}>
                  <a
                    href={r.url}
                    rel="me noopener"
                    target="_blank"
                    className="inline-flex min-h-11 items-center gap-2.5 font-medium underline-offset-4 hover:underline"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-current">
                      <path d={ICONES[r.nom]} />
                    </svg>
                    {r.nom}
                  </a>
                </li>
              ))}
            </ul>
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

        {/* Le nom revient en grand pour fermer la page (sauf sur l'accueil : sa dernière section le montre déjà). */}
        <p
          aria-hidden="true"
          className="font-display mt-20 text-[clamp(3.5rem,13.5vw,13rem)] text-caramel [main:has([data-fin-pleine])+footer_&]:hidden"
        >
          <span style={{ textShadow: RELIEF_TITRE.moustache }}>Moustache</span>{" "}
          <MotMalin relief={RELIEF_TITRE.malin} />
        </p>
        <p className="mt-6 text-small text-ink-soft">
          © {process.env.BUILD_YEAR} {SITE.name} · <a href={`mailto:${SITE.email}`} className="underline underline-offset-4">{SITE.email}</a> ·{" "}
          <Link href="/credits-photos/" className="underline underline-offset-4">
            Crédits photos
          </Link>
        </p>
      </div>
    </footer>
  );
}
