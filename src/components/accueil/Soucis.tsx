import Image from "next/image";
import Link from "next/link";
import { BoutonAction } from "@/components/BoutonAction";
import { SOUCIS } from "@/lib/accueil";
import { pageEnLigne } from "@/lib/site";

// Quand l'animation est prête (data-epingle sur la section, posé par Mouvement), les étapes se superposent :
// la section reste épinglée, le titre de gauche change et la photo de droite se dévoile par le bas à chaque étape.
// Sans JavaScript ou avec « animations réduites », c'est une simple liste : tout reste lisible et cliquable.
// Sur téléphone épinglé, toutes les photos ont la même hauteur : la précédente ne dépasse jamais sous la suivante.

export function Soucis() {
  return (
    <section id="soucis" data-soucis aria-labelledby="titre-soucis" className="group/soucis bg-paper">
      <div
        data-soucis-scene
        className="mx-auto max-w-[90rem] px-4 py-20 sm:px-8 lg:py-32 group-data-[epingle]/soucis:flex group-data-[epingle]/soucis:h-svh group-data-[epingle]/soucis:flex-col group-data-[epingle]/soucis:py-6 lg:group-data-[epingle]/soucis:py-10"
      >
        <div className="flex items-end justify-between gap-6">
          <h2 id="titre-soucis" className="font-display max-w-[14ch] text-head">
            Les petits soucis du quotidien
          </h2>
          {/* Jauge des étapes : visible seulement en mode épinglé. */}
          <div aria-hidden="true" className="hidden shrink-0 gap-2 pb-2 group-data-[epingle]/soucis:flex">
            {SOUCIS.map((s) => (
              <span key={s.id} className="block h-1.5 w-8 overflow-hidden rounded-full bg-ink/15 sm:w-12">
                <span data-jauge className="block h-full w-full origin-left scale-x-0 rounded-full bg-accent" />
              </span>
            ))}
          </div>
        </div>

        <ol
          className="mt-12 flex flex-col gap-20 lg:mt-16 lg:gap-32 group-data-[epingle]/soucis:relative group-data-[epingle]/soucis:mt-5 group-data-[epingle]/soucis:min-h-0 group-data-[epingle]/soucis:flex-1 lg:group-data-[epingle]/soucis:mt-8"
        >
          {SOUCIS.map((s) => (
            <li
              key={s.id}
              data-souci
              aria-labelledby={s.id}
              className="grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-10 group-data-[epingle]/soucis:absolute group-data-[epingle]/soucis:inset-0 group-data-[epingle]/soucis:content-start lg:group-data-[epingle]/soucis:content-normal lg:group-data-[epingle]/soucis:grid-rows-1"
            >
              <div data-souci-texte className="lg:col-span-5 lg:row-start-1">
                <h3 id={s.id} className="font-display text-[clamp(2.5rem,1rem+4.4vw,6rem)]">
                  {s.titre}
                </h3>
                <p className="mt-4 max-w-[38ch] text-lead lg:mt-6">{s.texte}</p>
                {pageEnLigne(s.lien.href) ? (
                  <div className="mt-6 flex flex-col items-start gap-4 lg:mt-8">
                    <BoutonAction href={s.lien.href}>{s.lien.label}</BoutonAction>
                    {s.lienSecondaire && pageEnLigne(s.lienSecondaire.href) ? (
                      <Link
                        href={s.lienSecondaire.href}
                        className="py-2 font-medium underline decoration-accent decoration-2 underline-offset-[6px]"
                      >
                        {s.lienSecondaire.label}
                      </Link>
                    ) : null}
                  </div>
                ) : (
                  <p className="mt-6 text-ink-soft">Comparatif en préparation.</p>
                )}
              </div>

              <figure
                data-souci-photo
                className="order-first flex flex-col lg:order-none lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:group-data-[epingle]/soucis:h-full lg:group-data-[epingle]/soucis:min-h-0"
              >
                <div
                  data-souci-cadre
                  className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-field sm:aspect-[3/2] lg:aspect-auto lg:h-[70svh] group-data-[epingle]/soucis:aspect-auto group-data-[epingle]/soucis:h-[max(10rem,calc(100svh-33rem))] lg:group-data-[epingle]/soucis:h-auto lg:group-data-[epingle]/soucis:min-h-0 lg:group-data-[epingle]/soucis:flex-1"
                >
                  <Image
                    src={s.photo.src}
                    alt={s.photo.alt}
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    quality={70}
                    className={`object-cover ${s.cadrage}`}
                  />
                </div>
                <figcaption data-souci-credit className="mt-2 text-small text-ink-soft">{s.photo.credit}</figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
