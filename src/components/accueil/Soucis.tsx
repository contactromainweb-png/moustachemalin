import Image from "next/image";
import Link from "next/link";
import { BoutonAction } from "@/components/BoutonAction";
import { SOUCIS } from "@/lib/accueil";
import { pageEnLigne } from "@/lib/site";

// Scène 3 : une liste de panneaux colorés qui défilent normalement, sans aucun épinglage. Dans chaque panneau, le mot
// géant, la photo et le texte apparaissent l'un après l'autre à leur arrivée à l'écran, une seule fois (data-apparait, voir
// Mouvement). Le mot géant ouvre chaque panneau, au premier plan, et chevauche légèrement la photo.
// Sans JavaScript ou avec « animations réduites » : les mêmes panneaux, immobiles.
// Ordinateur seulement : sous 1024 px, les cartes « Mon problème » (Problemes) la remplacent.

export function Soucis() {
  return (
    <section id="soucis" data-soucis aria-labelledby="titre-soucis" className="overflow-x-clip max-lg:hidden">
      <div data-soucis-scene className="mx-auto max-w-[90rem] px-4 py-20 sm:px-8 lg:py-24">
        <h2 id="titre-soucis" data-apparait className="font-display max-w-[14ch] text-head">
          Les petits soucis du quotidien
        </h2>

        <ol className="isolate mt-12 flex flex-col gap-6">
          {SOUCIS.map((s) => (
            <li
              key={s.id}
              data-souci
              data-fond={s.fond}
              aria-labelledby={s.id}
              className="relative grid gap-5 rounded-[2rem] p-5 sm:p-8 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0 lg:px-12 lg:py-8"
            >
              {/* Mot géant : première ligne, devant la photo qu'il chevauche légèrement. */}
              <p
                data-souci-geant
                data-apparait
                className="font-display relative z-30 text-[clamp(2.75rem,13vw,11rem)] lg:col-span-12 lg:row-start-1 lg:-mb-[0.14em] lg:whitespace-nowrap lg:text-[min(11vw,19svh)]"
              >
                {s.geant[0]} <span className="mot-serif">{s.geant[1]}</span>
              </p>

              <figure
                data-souci-photo
                data-apparait
                style={{ "--i": 1 } as React.CSSProperties}
                className="relative flex flex-col lg:col-span-6 lg:col-start-7 lg:row-start-2"
              >
                <div
                  data-souci-cadre
                  className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-black/10 sm:aspect-[3/2] lg:aspect-auto lg:h-[max(18rem,42svh)]"
                >
                  <Image
                    src={s.photo.src}
                    alt={s.photo.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    quality={80}
                    className={`object-cover ${s.cadrage}`}
                  />
                </div>
              </figure>

              <div
                data-souci-texte
                data-apparait
                style={{ "--i": 2 } as React.CSSProperties}
                className="relative z-20 lg:col-span-5 lg:row-start-2 lg:self-center"
              >
                <h3 id={s.id} className="font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.5rem)]">
                  {s.titre}
                </h3>
                <p className="mt-2 max-w-[38ch] text-lead lg:mt-5">{s.texte}</p>
                {pageEnLigne(s.lien.href) ? (
                  <div className="mt-4 flex flex-col items-start gap-1 lg:mt-8 lg:gap-4">
                    <BoutonAction href={s.lien.href}>{s.lien.label}</BoutonAction>
                    {s.liensSecondaires
                      ?.filter((l) => pageEnLigne(l.href))
                      .map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          className="py-2 font-medium underline decoration-[var(--f-souligne)] decoration-2 underline-offset-[6px]"
                        >
                          {l.label}
                        </Link>
                      ))}
                  </div>
                ) : (
                  <p className="mt-4 text-[var(--f-doux)]">Comparatif en préparation.</p>
                )}
              </div>

            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
