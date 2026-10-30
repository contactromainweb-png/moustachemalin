import Image from "next/image";
import Link from "next/link";
import { PROFILS } from "@/lib/accueil";
import { pageEnLigne } from "@/lib/site";
import { espacesFines } from "@/lib/typo";

// Bloc A, « Selon mon chat » : quatre profils en cartes photo, chacun mène aux pages qui lui répondent.
// Les profils masqués (chaton, chat âgé) attendent leur article ; un lien vers une page absente disparaît.
// Une carte à lien unique est cliquable en entier (le lien s'étend sur la carte).
// Ordinateur seulement : sous 1024 px, les cartes « Mon problème » (Problemes) la remplacent.
export function SelonMonChat() {
  const profils = PROFILS.filter((p) => p.visible)
    .map((p) => ({ ...p, liens: p.liens.filter((l) => pageEnLigne(l.href.split("#")[0])) }))
    .filter((p) => p.liens.length > 0);
  if (profils.length === 0) return null;

  return (
    <section data-fond="page" aria-labelledby="titre-selon" className="px-4 py-24 max-lg:hidden sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[90rem]">
        <h2 id="titre-selon" className="reveal font-display text-[clamp(2.75rem,1.4rem+5vw,6.5rem)]">
          Selon mon <span className="mot-serif">chat</span>
        </h2>
        <p className="reveal mt-6 max-w-[40ch] text-lead">
          Chaque chat a sa façon de vivre. Choisissez la vôtre, on vous montre par où commencer.
        </p>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {profils.map((p) => (
            <li key={p.id} className="reveal group relative isolate overflow-hidden rounded-[2rem] bg-nuit text-blanc">
              <div className="relative aspect-[4/5]">
                <Image
                  src={p.photo.src}
                  alt={p.photo.alt}
                  fill
                  quality={80}
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 46vw, 92vw"
                  className={`object-cover transition-transform duration-700 ease-[var(--ease-out)] [@media(hover:hover)]:group-hover:scale-[1.04] ${p.cadrage}`}
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-nuit via-nuit/45 to-transparent" />
              </div>
              {/* data-fond="nuit" : mot en serif orange, sans le surlignage lavande des fonds clairs ; fond laissé transparent. */}
              <div
                data-sur-photo
                data-fond="nuit"
                style={{ backgroundColor: "transparent" }}
                className="absolute inset-x-0 bottom-0 p-5 sm:p-6"
              >
                <h3 className="font-display text-[clamp(2rem,1.5rem+1.6vw,2.75rem)]">
                  {p.mot[0]} <span className="mot-serif">{p.mot[1]}</span>
                </h3>
                <ul className="mt-3">
                  {p.liens.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className={`flex min-h-11 items-center gap-2 font-medium underline decoration-accent decoration-2 underline-offset-[6px] ${
                          p.liens.length === 1 ? "after:absolute after:inset-0" : ""
                        }`}
                      >
                        {espacesFines(l.label)}
                        <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
