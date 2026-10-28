import Image from "next/image";
import Link from "next/link";
import { TitreSerif } from "@/components/TitreSerif";
import { PHOTOS } from "@/lib/medias";
import { tousLesArticles } from "@/lib/rubriques";

// Scène 4, sur fond bleu nuit : au fond, une pelote de laine en particules (fils lumineux, cœur orange) qui tourne
// doucement et reste en place (canevas WebGL, voir pelote.ts) ; par-dessus défilent des cartes en verre dépoli
// lavande, une par article en ligne. Sans JavaScript ou avec « animations réduites » : le halo orange seul, immobile.
export function Pelote() {
  const articles = tousLesArticles();
  if (articles.length === 0) return null;

  return (
    <section data-pelote data-fond="nuit" aria-labelledby="titre-dossiers" className="relative">
      <div
        data-pelote-decor
        aria-hidden="true"
        className="pointer-events-none sticky top-0 -mb-[100svh] h-svh overflow-hidden"
      >
        <div className="absolute left-1/2 top-1/2 size-[min(70vw,70svh)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_122_26/0.32),rgb(185_166_255/0.08)_55%,transparent)]" />
        <canvas data-pelote-canevas className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700" />
      </div>

      <div className="relative mx-auto max-w-[90rem] px-4 pb-28 pt-24 sm:px-8 lg:pb-48 lg:pt-40">
        <h2 id="titre-dossiers" className="font-display max-w-[12ch] text-[clamp(2.75rem,1.4rem+5.4vw,7rem)]">
          Lire <span className="mot-serif">avant</span> d&apos;acheter
        </h2>
        <p className="mt-6 max-w-[36ch] text-lead text-[var(--f-doux)]">
          Nos comparatifs et nos guides, écrits à partir des fiches techniques des fabricants.
        </p>

        <ul className="mt-20 flex flex-col gap-16 lg:mt-32 lg:gap-[28svh] lg:motion-reduce:gap-16">
          {articles.map((a, i) => {
            const photo = a.photo ? PHOTOS[a.photo] : undefined;
            return (
              <li
                key={a.href}
                data-pelote-carte
                className={`w-full max-w-[34rem] ${i % 2 ? "lg:ml-auto lg:mr-[6%]" : "lg:ml-[6%]"}`}
              >
                <Link
                  href={a.href}
                  className="group block rounded-[2rem] bg-[rgb(52_48_104/0.94)] p-2 ring-1 ring-white/15 transition-transform duration-200 ease-[var(--ease-out)] active:scale-[0.99] lg:bg-[rgb(185_166_255/0.16)] lg:backdrop-blur-xl"
                >
                  {photo ? (
                    <div className="relative aspect-[3/2] overflow-hidden rounded-[1.5rem]">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 640px) 34rem, 100vw"
                        quality={80}
                        className="object-cover transition-transform duration-700 ease-[var(--ease-out)] [@media(hover:hover)]:group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : null}
                  <div className="px-4 pb-6 pt-5 sm:px-6">
                    <p className="text-small font-medium text-lavande">
                      {a.type === "comparatif" ? "Comparatif" : "Guide"}
                    </p>
                    <h3 className="font-display mt-2 text-[clamp(1.75rem,1.3rem+1.6vw,2.75rem)]">
                      <TitreSerif titre={a.titre} mot={a.motSerif} />
                    </h3>
                    <p className="mt-3 text-[var(--f-doux)]">{a.description}</p>
                    <p className="mt-5 inline-flex items-center gap-2 font-medium text-accent">
                      {a.type === "comparatif" ? "Lire le comparatif" : "Lire le guide"}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 ease-[var(--ease-out)] [@media(hover:hover)]:group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </p>
                    {photo ? <p className="mt-4 text-small text-[var(--f-doux)]">{photo.credit}</p> : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
