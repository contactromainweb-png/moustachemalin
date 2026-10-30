import Image from "next/image";
import Link from "next/link";
import { PROBLEMES } from "@/lib/accueil";
import { pageEnLigne } from "@/lib/site";

// Téléphone et tablette (masqué dès 1024 px) : juste après le premier écran, quatre cartes photo compactes en
// grille 2 × 2, chacune mène droit à l'article qui répond au souci. Une carte dont la page n'existe pas disparaît.
export function Problemes() {
  const problemes = PROBLEMES.filter((p) => pageEnLigne(p.href));
  if (problemes.length === 0) return null;

  return (
    <section data-fond="page" aria-labelledby="titre-problemes" className="px-4 pb-6 pt-12 sm:px-8 lg:hidden">
      <h2 id="titre-problemes" data-apparait className="font-display text-head">
        Mon <span className="mot-serif">problème</span>, c&apos;est…
      </h2>
      <ul className="mt-6 grid grid-cols-2 gap-3">
        {problemes.map((p, i) => (
          <li key={p.id} data-apparait style={{ "--i": i } as React.CSSProperties}>
            <Link
              href={p.href}
              data-sur-photo
              className="group relative isolate flex aspect-square flex-col justify-end overflow-hidden rounded-[1.5rem] bg-nuit p-4 text-blanc transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97] sm:aspect-[3/2] sm:p-6"
            >
              <Image
                src={p.photo.src}
                alt=""
                fill
                quality={80}
                sizes="(min-width: 640px) 45vw, 46vw"
                className={`-z-10 object-cover ${p.cadrage}`}
              />
              <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-nuit via-nuit/50 to-transparent" />
              <span className="font-display text-[1.375rem] sm:text-[2rem]">{p.titre}</span>
              <span aria-hidden="true" className="mt-2 flex size-8 items-center justify-center rounded-full bg-accent text-on-accent">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
