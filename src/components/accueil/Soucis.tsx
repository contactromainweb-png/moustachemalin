import Image from "next/image";
import Link from "next/link";
import { BoutonAction } from "@/components/BoutonAction";
import { SOUCIS } from "@/lib/accueil";
import { pageEnLigne } from "@/lib/site";

// Scène 3. Quand l'animation est prête (data-epingle sur la section, posé par Mouvement), les étapes se superposent :
// la section reste épinglée et prend la couleur de l'étape affichée, la photo se décompose en mosaïque pour révéler
// la suivante, et les textes passent en fondu enchaîné.
// Le mot géant ouvre chaque étape, en haut et au premier plan : il reste entier à l'écran pendant toute la lecture.
// Sans JavaScript ou avec « animations réduites », c'est une liste de panneaux colorés : tout reste lisible et cliquable.

export function Soucis() {
  return (
    <section id="soucis" data-soucis aria-labelledby="titre-soucis" className="group/soucis overflow-x-clip">
      <div
        data-soucis-scene
        className="mx-auto max-w-[90rem] px-4 py-20 sm:px-8 lg:py-32 group-data-[epingle]/soucis:flex group-data-[epingle]/soucis:h-svh group-data-[epingle]/soucis:flex-col group-data-[epingle]/soucis:py-5 lg:group-data-[epingle]/soucis:py-8"
      >
        <div className="flex items-end justify-between gap-6">
          <h2
            id="titre-soucis"
            className="font-display max-w-[14ch] text-head group-data-[epingle]/soucis:max-w-none group-data-[epingle]/soucis:text-[clamp(1.5rem,1.1rem+1.4vw,2.5rem)]"
          >
            Les petits soucis du quotidien
          </h2>
          {/* Jauge des étapes : visible seulement en mode épinglé. */}
          <div aria-hidden="true" className="hidden shrink-0 gap-2 pb-1.5 group-data-[epingle]/soucis:flex">
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

        <ol className="isolate mt-12 flex flex-col gap-6 lg:mt-16 lg:gap-8 group-data-[epingle]/soucis:relative group-data-[epingle]/soucis:mt-4 group-data-[epingle]/soucis:min-h-0 group-data-[epingle]/soucis:flex-1 lg:group-data-[epingle]/soucis:mt-6">
          {SOUCIS.map((s) => (
            <li
              key={s.id}
              data-souci
              data-fond={s.fond}
              aria-labelledby={s.id}
              className="relative grid gap-5 rounded-[2rem] p-5 sm:p-8 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-6 lg:p-12 group-data-[epingle]/soucis:absolute group-data-[epingle]/soucis:inset-0 group-data-[epingle]/soucis:content-start group-data-[epingle]/soucis:gap-3 group-data-[epingle]/soucis:rounded-none group-data-[epingle]/soucis:p-0 lg:group-data-[epingle]/soucis:grid-rows-[auto_minmax(0,1fr)] lg:group-data-[epingle]/soucis:content-normal lg:group-data-[epingle]/soucis:gap-y-0"
            >
              {/* Mot géant : première ligne, devant la photo qu'il chevauche légèrement. */}
              <p
                data-souci-geant
                className="font-display relative z-30 text-[clamp(2.75rem,13vw,11rem)] lg:col-span-12 lg:row-start-1 lg:whitespace-nowrap group-data-[epingle]/soucis:text-[min(13vw,8.5svh)] lg:group-data-[epingle]/soucis:-mb-[0.14em] lg:group-data-[epingle]/soucis:text-[min(11vw,19svh)]"
              >
                {s.geant[0]} <span className="mot-serif">{s.geant[1]}</span>
              </p>

              <figure
                data-souci-photo
                className="relative flex flex-col lg:col-span-6 lg:col-start-7 lg:row-start-2 lg:group-data-[epingle]/soucis:min-h-0"
              >
                <div
                  data-souci-cadre
                  className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-black/10 sm:aspect-[3/2] lg:aspect-auto lg:h-[56svh] group-data-[epingle]/soucis:aspect-auto group-data-[epingle]/soucis:h-[max(7rem,calc(100svh-33.5rem))] lg:group-data-[epingle]/soucis:h-auto lg:group-data-[epingle]/soucis:min-h-0 lg:group-data-[epingle]/soucis:flex-1"
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
                className="relative z-20 lg:col-span-5 lg:row-start-2 lg:self-center lg:group-data-[epingle]/soucis:pb-10"
              >
                <h3 id={s.id} className="font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.5rem)]">
                  {s.titre}
                </h3>
                <p className="mt-2 max-w-[38ch] text-lead lg:mt-5">{s.texte}</p>
                {pageEnLigne(s.lien.href) ? (
                  <div className="mt-4 flex flex-col items-start gap-1 lg:mt-8 lg:gap-4">
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
