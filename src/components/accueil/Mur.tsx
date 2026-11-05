import Image from "next/image";
import { PROFILS } from "@/lib/accueil";
import { MUR, MUR_CENTRE, PHOTOS } from "@/lib/medias";
import { appareilsCompares } from "@/lib/rubriques";

// Scène 5 : un mur de photos de chats, voilé de bleu nuit, et un compteur géant par-dessus. Le chiffre est calculé au
// build : les appareils réellement passés en revue dans les comparatifs en ligne.
// Ordinateur : mur de 7 × 5, exactement 1 écran de haut ; téléphone : 5 × 5. La photo du centre est placée d'office au
// milieu de la grille. Aucun épinglage : le chiffre monte et la légende apparaît à l'arrivée à l'écran (voir Mouvement).
// Sans JavaScript ou avec « animations réduites » : tout est déjà en place, immobile.
// Téléphone et tablette : section moins haute.

// Les vignettes ont toutes le format 4:5 ; une photo paysage est rognée sur les côtés, donc affichée plus large que
// sa case. Largeur de case : 128vw / 7 (ordinateur), 150vw / 5 (téléphone, avec une marge de 1,2).
function taillesVignette(largeur: number, hauteur: number) {
  const f = Math.max(1, largeur / hauteur / 0.8);
  return `(min-width: 1024px) ${Math.ceil(18.3 * f)}vw, ${Math.ceil(30 * f * 1.2)}vw`;
}

// Les vignettes ne dépassent jamais 1 280 px affichés : 4 largeurs suffisent, au lieu des 13 de next/image.
// Le HTML de l'accueil s'en trouve nettement allégé (le mur répétait 34 longues listes), ce qui l'affiche plus vite.
const LARGEURS_VIGNETTE = [384, 640, 960, 1280];
const adresse = (src: string, w: number) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=80`;
function srcsetVignette(src: string, largeur: number) {
  const largeurs = LARGEURS_VIGNETTE.filter((w) => w <= largeur);
  return largeurs.map((w) => `${adresse(src, w)} ${w}w`).join(", ");
}

// Aucune vignette ne reprend une photo déjà montrée sur l'accueil (une même image jamais deux fois par page, contrôlé
// au build) : les photos du mur prises par « Selon mon chat » sont retirées, et le mur est complété par des photos
// qui n'illustrent aucun article (celles des textes de rubriques, et deux photos d'ambiance).
const PRISES = new Set(PROFILS.filter((p) => p.visible).map((p) => p.photo.src));
const VIGNETTES = [
  ...MUR.filter((p) => !PRISES.has(p.src)),
  ...[
    PHOTOS.chatsPasserelles,
    PHOTOS.chatSoleil,
    PHOTOS.chatCanapeLumineux,
    PHOTOS.chatRouxBassine,
    PHOTOS.chatTigreCroquettes,
    PHOTOS.chatArbrePlateforme,
    PHOTOS.chatonBolEau,
  ].map(({ src, width, height }) => ({ src, width, height })),
].slice(0, 34);

export function Mur() {
  const total = appareilsCompares();
  if (total === 0) return null;

  return (
    <section data-mur aria-labelledby="titre-mur" className="relative overflow-hidden bg-nuit text-blanc">
      <div className="relative grid h-[32rem] place-items-center overflow-hidden lg:h-svh">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 grid w-[150vw] -translate-x-1/2 -translate-y-1/2 grid-cols-5 gap-[1.2vw] lg:w-[128vw] lg:grid-cols-7 lg:gap-[0.8vw]"
        >
          <div
            className="relative z-10 col-start-3 row-start-3 aspect-[4/5] overflow-hidden rounded-[0.9rem] lg:col-start-4"
          >
            <Image
              src={MUR_CENTRE.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 19vw, (max-aspect-ratio: 4/5) 175vw, 100vw"
              quality={80}
              className="object-cover"
            />
          </div>
          {VIGNETTES.map((p, i) => (
            <div
              key={p.src}
              className={`relative aspect-[4/5] overflow-hidden rounded-[0.9rem] ${i >= 24 ? "max-lg:hidden" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- srcset court fait à la main, voir plus haut */}
              <img
                src={adresse(p.src, 640)}
                srcSet={srcsetVignette(p.src, p.width)}
                sizes={taillesVignette(p.width, p.height)}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        <div aria-hidden="true" className="absolute inset-0 z-20 bg-nuit/75" />
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 text-center">
          <h2 id="titre-mur" className="flex flex-col items-center">
            <span data-mur-compteur className="font-display text-[clamp(8rem,34vw,24rem)] leading-[0.8] lg:text-[clamp(7rem,min(34vw,42svh),24rem)] tabular-nums">
              {total}
            </span>{" "}
            {/* L'espace ci-dessus : le titre se lit « 36 appareils passés au crible », pas « 36appareils ». */}
            <span data-apparait className="font-display mt-4 text-[clamp(2rem,1.2rem+3.4vw,4.5rem)]">
              appareils passés au <span className="mot-serif text-accent">crible</span>
            </span>
          </h2>
          <p data-apparait style={{ "--i": 2 } as React.CSSProperties} className="mt-6 max-w-[40ch] text-lead text-blanc/85">
            Dans nos comparatifs, fiche technique après fiche technique.
          </p>
        </div>
      </div>
    </section>
  );
}
