import Image from "next/image";
import { MUR, MUR_CENTRE, PHOTOS } from "@/lib/medias";
import { appareilsCompares } from "@/lib/rubriques";

// Scène 5 : zoom arrière depuis une photo plein écran vers un mur de photos de chats, puis un compteur géant.
// Le chiffre est calculé au build : les appareils réellement passés en revue dans les comparatifs en ligne.
// Ordinateur : mur de 7 × 5 ; téléphone : 5 × 5. La photo du centre est placée d'office au milieu de la grille.
// Sans JavaScript ou avec « animations réduites » : le mur entier, voilé de bleu nuit, et le compteur par-dessus.
// Téléphone et tablette : section moins haute, sans blocage ; seul le chiffre monte quand il apparaît (Mouvement).

// Les vignettes ont toutes le format 4:5 ; une photo paysage est rognée sur les côtés, donc affichée plus large que
// sa case. Largeur de case : 128vw / 7 (ordinateur), 150vw / 5 (téléphone), agrandie 1,2 fois au départ du zoom.
function taillesVignette(largeur: number, hauteur: number) {
  const f = Math.max(1, largeur / hauteur / 0.8) * 1.2;
  return `(min-width: 1024px) ${Math.ceil(18.3 * f)}vw, ${Math.ceil(30 * f)}vw`;
}

const VIGNETTES = [
  ...MUR,
  ...[PHOTOS.chatSoleil, PHOTOS.chatChaise, PHOTOS.chatBol, PHOTOS.chatonsArbre, PHOTOS.chatRobinet].map(
    ({ src, width, height }) => ({ src, width, height }),
  ),
].slice(0, 34);

export function Mur() {
  const total = appareilsCompares();
  if (total === 0) return null;

  return (
    <section data-mur aria-labelledby="titre-mur" className="relative overflow-hidden bg-nuit text-blanc">
      <div data-mur-scene className="relative grid h-[32rem] place-items-center overflow-hidden lg:h-svh lg:min-h-[36rem]">
        <div
          data-mur-grille
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 grid w-[150vw] -translate-x-1/2 -translate-y-1/2 grid-cols-5 gap-[1.2vw] lg:w-[128vw] lg:grid-cols-7 lg:gap-[0.8vw]"
        >
          <div
            data-mur-centre
            className="relative z-10 col-start-3 row-start-3 aspect-[4/5] overflow-hidden rounded-[0.9rem] lg:col-start-4"
          >
            <Image
              src={MUR_CENTRE.src}
              alt=""
              fill
              sizes="(max-aspect-ratio: 4/5) 175vw, 100vw"
              quality={80}
              className="object-cover"
            />
          </div>
          {VIGNETTES.map((p, i) => (
            <div
              key={p.src}
              data-mur-vignette
              className={`relative aspect-[4/5] overflow-hidden rounded-[0.9rem] ${i >= 24 ? "max-lg:hidden" : ""}`}
            >
              <Image
                src={p.src}
                alt=""
                fill
                sizes={taillesVignette(p.width, p.height)}
                quality={80}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div data-mur-fond aria-hidden="true" className="absolute inset-0 z-20 bg-nuit/75" />
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 text-center">
          <h2 id="titre-mur" className="flex flex-col items-center">
            <span data-mur-compteur className="font-display text-[clamp(8rem,34vw,24rem)] leading-[0.8] tabular-nums">
              {total}
            </span>
            <span data-mur-legende data-apparait className="font-display mt-4 text-[clamp(2rem,1.2rem+3.4vw,4.5rem)]">
              appareils passés au <span className="mot-serif text-accent">crible</span>
            </span>
          </h2>
          <p data-mur-legende data-apparait style={{ "--i": 2 } as React.CSSProperties} className="mt-6 max-w-[40ch] text-lead text-blanc/85">
            Dans nos comparatifs, fiche technique après fiche technique.
          </p>
        </div>
      </div>
    </section>
  );
}
