import Image from "next/image";
import Link from "next/link";
import { BoutonAction } from "@/components/BoutonAction";
import { SOUCIS } from "@/lib/accueil";
import { pageEnLigne } from "@/lib/site";

// Scène 3. Quand l'animation est prête (data-epingle sur la section, posé par Mouvement), les étapes se superposent :
// la section reste épinglée et prend la couleur de l'étape affichée, la photo se décompose en mosaïque pour révéler
// la suivante, les textes passent en fondu enchaîné et un chat détouré traverse l'écran.
// Sans JavaScript ou avec « animations réduites », c'est une liste de panneaux colorés : tout reste lisible et cliquable.
// Sur téléphone épinglé, toutes les photos ont la même hauteur : la précédente ne dépasse jamais sous la suivante.

export function Soucis() {
  return (
    <section id="soucis" data-soucis aria-labelledby="titre-soucis" className="group/soucis overflow-x-clip">
      <div
        data-soucis-scene
        className="mx-auto max-w-[90rem] px-4 py-20 sm:px-8 lg:py-32 group-data-[epingle]/soucis:flex group-data-[epingle]/soucis:h-svh group-data-[epingle]/soucis:flex-col group-data-[epingle]/soucis:py-6 lg:group-data-[epingle]/soucis:py-10"
      >
        <div className="flex items-end justify-between gap-6">
          <h2
            id="titre-soucis"
            className="font-display max-w-[14ch] text-head group-data-[epingle]/soucis:text-[clamp(1.75rem,1.2rem+1.6vw,2.75rem)] lg:group-data-[epingle]/soucis:max-w-none"
          >
            Les petits soucis du quotidien
          </h2>
          {/* Jauge des étapes : visible seulement en mode épinglé. */}
          <div aria-hidden="true" className="hidden shrink-0 gap-2 pb-2 group-data-[epingle]/soucis:flex">
            {SOUCIS.map((s) => (
              <span key={s.id} className="block h-1.5 w-8 overflow-hidden rounded-full bg-current/20 sm:w-12">
                <span
                  data-jauge
                  className="block h-full w-full origin-left scale-x-0 rounded-full bg-[var(--f-jauge)]"
                />
              </span>
            ))}
          </div>
        </div>

        <ol className="isolate mt-12 flex flex-col gap-6 lg:mt-16 lg:gap-8 group-data-[epingle]/soucis:relative group-data-[epingle]/soucis:mt-5 group-data-[epingle]/soucis:min-h-0 group-data-[epingle]/soucis:flex-1 lg:group-data-[epingle]/soucis:mt-8">
          {SOUCIS.map((s) => (
            <li
              key={s.id}
              data-souci
              data-fond={s.fond}
              aria-labelledby={s.id}
              className="relative grid gap-5 rounded-[2rem] p-5 sm:p-8 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-6 lg:p-12 group-data-[epingle]/soucis:absolute group-data-[epingle]/soucis:inset-0 group-data-[epingle]/soucis:content-start group-data-[epingle]/soucis:gap-4 group-data-[epingle]/soucis:rounded-none group-data-[epingle]/soucis:p-0 lg:group-data-[epingle]/soucis:grid-rows-[minmax(0,1fr)_auto] lg:group-data-[epingle]/soucis:content-normal lg:group-data-[epingle]/soucis:gap-y-4"
            >
              <figure
                data-souci-photo
                className="relative order-first flex flex-col lg:order-none lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:group-data-[epingle]/soucis:h-full lg:group-data-[epingle]/soucis:min-h-0"
              >
                <div
                  data-souci-cadre
                  className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-black/10 sm:aspect-[3/2] lg:aspect-auto lg:h-[62svh] group-data-[epingle]/soucis:aspect-auto group-data-[epingle]/soucis:h-[max(8rem,calc(100svh-36rem))] lg:group-data-[epingle]/soucis:h-auto lg:group-data-[epingle]/soucis:min-h-0 lg:group-data-[epingle]/soucis:flex-1"
                >
                  <Image
                    src={s.photo.src}
                    alt={s.photo.alt}
                    fill
                    sizes="(min-width: 1024px) 60vw, 140vw"
                    quality={80}
                    className={`object-cover ${s.cadrage}`}
                  />
                </div>
                <figcaption data-souci-credit className="mt-2 text-small text-[var(--f-doux)]">
                  {s.photo.credit} ; chat : {s.chat.credit}
                </figcaption>
              </figure>

              <p
                data-souci-geant
                className="font-display relative z-20 text-[clamp(2.75rem,11.5vw,11rem)] lg:col-span-12 lg:row-start-2 lg:whitespace-nowrap"
              >
                {s.geant[0]} <span className="mot-serif">{s.geant[1]}</span>
              </p>

              {/* Chat détouré, en bas à droite, derrière les textes ; il traverse l'écran au changement d'étape. */}
              <div
                data-souci-chat
                aria-hidden="true"
                className={`pointer-events-none absolute bottom-0 right-[3%] z-[5] ${s.hauteurChat}`}
              >
                <Image
                  src={s.chat.src}
                  alt=""
                  width={s.chat.width}
                  height={s.chat.height}
                  sizes="(min-width: 1024px) 40vw, 60vw"
                  quality={80}
                  className="h-full w-auto max-w-none"
                />
              </div>

              <div data-souci-texte className="relative z-20 lg:col-span-5 lg:row-start-1 lg:self-center">
                <h3 id={s.id} className="font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.5rem)]">
                  {s.titre}
                </h3>
                <p className="mt-3 max-w-[38ch] text-lead lg:mt-5">{s.texte}</p>
                {pageEnLigne(s.lien.href) ? (
                  <div className="mt-5 flex flex-col items-start gap-3 lg:mt-8 lg:gap-4">
                    <BoutonAction href={s.lien.href}>{s.lien.label}</BoutonAction>
                    {s.lienSecondaire && pageEnLigne(s.lienSecondaire.href) ? (
                      <Link
                        href={s.lienSecondaire.href}
                        className="py-2 font-medium underline decoration-[var(--f-souligne)] decoration-2 underline-offset-[6px]"
                      >
                        {s.lienSecondaire.label}
                      </Link>
                    ) : null}
                  </div>
                ) : (
                  <p className="mt-5 text-[var(--f-doux)]">Comparatif en préparation.</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
