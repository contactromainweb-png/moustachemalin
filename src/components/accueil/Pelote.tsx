import Image from "next/image";
import Link from "next/link";
import { BoutonAction } from "@/components/BoutonAction";
import { TitreSerif } from "@/components/TitreSerif";
import { PROBLEMES, PROFILS, SOUCIS } from "@/lib/accueil";
import { LIBELLES_TYPE } from "@/lib/articles";
import { attribuerPhotos, sources } from "@/lib/cartes";
import { PHOTOS } from "@/lib/medias";
import { tousLesArticles } from "@/lib/rubriques";
import { RangeeCartes } from "./RangeeCartes";

// Scène 4, sur fond bleu nuit. La page avance toujours : aucun décor collant, aucun épinglage.
// Ordinateur (≥ 1024 px) : les comparatifs seulement (ni guides, ni avis, ni outils : ils restent sur /guides/), en grille
// de 3 colonnes, qui apparaissent à leur arrivée à l'écran (data-apparait, voir Mouvement) ; en haut à droite, une petite
// pelote décorative (canevas WebGL, voir pelote-webgl.ts) qui tourne une seule fois à son arrivée à l'écran, puis s'arrête.
// Sans JavaScript ou avec « animations réduites » : le halo orange seul, immobile.
// Téléphone et tablette (moins de 1024 px) : pas de pelote, seulement le halo ; les quatre comparatifs principaux en
// rangée à faire glisser (CSS scroll-snap, flèches du clavier), la carte suivante dépasse pour montrer qu'on peut glisser.

// Un comparatif par rubrique, dans l'ordre des rubriques du site.
const PRINCIPAUX = [
  "/litieres/litiere-autonettoyante/",
  "/fontaines/fontaine-a-eau-chat/",
  "/repas/distributeur-croquettes-chat/",
  "/griffer-grimper/arbre-a-chat/",
];

// Les cartes ne reprennent aucune photo déjà montrée plus haut (premier écran, particules, soucis, problèmes, profils) : un
// article dont la photo d'en-tête y figure prend une autre de ses photos (lib/cartes.ts).
const DEJA_SUR_LA_PAGE = () =>
  sources(
    PHOTOS.chatBlanc,
    PHOTOS.chatFenetre,
    ...SOUCIS.map((s) => s.photo),
    ...PROBLEMES.map((p) => p.photo),
    ...PROFILS.filter((p) => p.visible).map((p) => p.photo),
  );

export function Pelote() {
  const articles = attribuerPhotos(tousLesArticles(), DEJA_SUR_LA_PAGE());
  if (articles.length === 0) return null;
  const principaux = PRINCIPAUX.map((href) => articles.find((a) => a.href === href)).filter((a) => a !== undefined);
  const comparatifs = articles.filter((a) => a.type === "comparatif");

  return (
    <section data-pelote data-fond="nuit" aria-labelledby="titre-dossiers" className="relative overflow-clip">
      <div className="relative mx-auto max-w-[90rem] px-4 pb-16 pt-16 sm:px-8 lg:pb-32 lg:pt-32">
        <div
          data-pelote-decor
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-6 size-44 sm:right-8 lg:top-16 lg:size-[clamp(16rem,24vw,22rem)]"
        >
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgb(255_122_26/0.32),rgb(185_166_255/0.08)_55%,transparent)]" />
          <canvas data-pelote-canevas className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700 tactile:hidden" />
        </div>

        <h2 id="titre-dossiers" data-apparait className="font-display relative max-w-[12ch] text-[clamp(2.75rem,1.4rem+5.4vw,7rem)]">
          Lire <span className="mot-serif">avant</span> d&apos;acheter
        </h2>
        <p data-apparait className="relative mt-6 max-w-[36ch] text-lead text-[var(--f-doux)]">
          Nos comparatifs et nos guides, écrits à partir des fiches techniques des fabricants.
        </p>

        {principaux.length > 0 ? (
          <div className="lg:hidden">
            <RangeeCartes
              etiquette="Nos comparatifs principaux. Flèches gauche et droite pour faire défiler."
              className="-mx-4 mt-8 snap-x snap-mandatory scroll-px-4 overflow-x-auto px-4 py-2 [scrollbar-width:none] focus-visible:[outline-offset:-3px] sm:-mx-8 sm:scroll-px-8 sm:px-8 [&::-webkit-scrollbar]:hidden"
            >
              <ul className="flex w-max gap-3">
                {principaux.map((a) => {
                  const photo = a.photo ? PHOTOS[a.photo] : undefined;
                  return (
                    <li key={a.href} className="w-[min(80vw,22rem)] shrink-0 snap-start">
                      <Link
                        href={a.href}
                        className="flex h-full flex-col rounded-[1.5rem] bg-[rgb(52_48_104/0.94)] p-2 ring-1 ring-white/15 transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100"
                      >
                        {photo ? (
                          <div className="relative aspect-[3/2] overflow-hidden rounded-[1.125rem]">
                            <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 640px) 22rem, 80vw" quality={80} className="object-cover" />
                          </div>
                        ) : null}
                        <div className="flex flex-1 flex-col px-3 pb-4 pt-4">
                          <h3 className="font-display text-[1.625rem]">
                            <TitreSerif titre={a.titre.replace(/ : .*$/, "")} mot={a.motSerif} />
                          </h3>
                          <p className="mt-auto inline-flex items-center gap-2 pt-4 font-medium text-accent">
                            {LIBELLES_TYPE[a.type].lire}
                            <span aria-hidden="true">→</span>
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </RangeeCartes>
          </div>
        ) : null}

        <ul className="relative mt-16 grid grid-cols-3 gap-6 max-lg:hidden lg:mt-20">
          {comparatifs.map((a, i) => {
            const photo = a.photo ? PHOTOS[a.photo] : undefined;
            return (
              <li key={a.href} data-apparait style={{ "--i": i % 3 } as React.CSSProperties}>
                <Link
                  href={a.href}
                  className="group flex h-full flex-col rounded-[2rem] bg-[rgb(185_166_255/0.16)] p-2 ring-1 ring-white/15 transition-transform duration-200 ease-[var(--ease-out)] active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100"
                >
                  {photo ? (
                    <div className="relative aspect-[3/2] overflow-hidden rounded-[1.5rem]">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 1440px) 28rem, 30vw"
                        quality={80}
                        className="object-cover transition-transform duration-700 ease-[var(--ease-out)] motion-reduce:transition-none motion-safe:[@media(hover:hover)]:group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col px-4 pb-6 pt-5">
                    <p className="text-small font-medium text-lavande">
                      {LIBELLES_TYPE[a.type].nom}
                    </p>
                    <h3 className="font-display mt-2 text-[clamp(1.5rem,1rem+1vw,2rem)]">
                      <TitreSerif titre={a.titre} mot={a.motSerif} />
                    </h3>
                    <p className="mt-3 text-[var(--f-doux)]">{a.description}</p>
                    <p className="mt-auto inline-flex items-center gap-2 pt-5 font-medium text-accent">
                      {LIBELLES_TYPE[a.type].lire}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 ease-[var(--ease-out)] motion-reduce:transition-none motion-safe:[@media(hover:hover)]:group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <BoutonAction href="/guides/#groupe-comparatif" className="relative mt-8 lg:mt-12">
          Voir tous les comparatifs
        </BoutonAction>
      </div>
    </section>
  );
}
