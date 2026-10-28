import { getImageProps } from "next/image";
import { preload } from "react-dom";
import { BoutonAction } from "@/components/BoutonAction";
import { PHOTOS } from "@/lib/medias";

const ORDINATEUR = "(min-width: 1024px)";
const TELEPHONE = "(max-width: 1023.98px)";

// Le titre, mot par mot : chaque mot sort d'un flou (CSS .entree-flou), « sans se tromper » en serif italique orange.
const MOTS = ["Bien", "équiper", "son", "chat,"];
const MOTS_SERIF = ["sans", "se", "tromper"];

// Premier écran (scène 1, « Macro ») : très gros plan sur l'œil et les moustaches d'un chat blanc, le titre posé
// dessus. Au défilement, l'image recule jusqu'au chat entier, puis devient une carte aux coins arrondis
// (voir Mouvement). Le gros plan est un simple agrandissement CSS : sans JavaScript, il reste en place.
// Ordinateur : la photo entière, servie assez grande pour le gros plan. Téléphone : un recadrage vertical.
export function HeroAccueil() {
  const { chatBlanc: photo, chatBlancTelephone: mobile } = PHOTOS;

  const { props: ordinateur } = getImageProps({
    alt: "",
    src: photo.src,
    width: photo.width,
    height: photo.height,
    quality: 80,
    sizes: "160vw",
  });
  const { props: telephone } = getImageProps({
    alt: photo.alt,
    src: mobile.src,
    width: mobile.width,
    height: mobile.height,
    quality: 80,
    sizes: "100vw",
    loading: "eager",
    fetchPriority: "high",
  });
  preload(telephone.src, {
    as: "image",
    imageSrcSet: telephone.srcSet,
    imageSizes: telephone.sizes,
    fetchPriority: "high",
    media: TELEPHONE,
  });
  preload(ordinateur.src, {
    as: "image",
    imageSrcSet: ordinateur.srcSet,
    imageSizes: ordinateur.sizes,
    fetchPriority: "high",
    media: ORDINATEUR,
  });

  let i = 0;
  return (
    <section
      data-hero
      aria-labelledby="titre-accueil"
      className="relative h-[calc(100svh-4rem)] min-h-[34rem] overflow-hidden bg-nuit"
    >
      <div data-hero-media className="absolute inset-0 overflow-hidden">
        <picture>
          <source media={ORDINATEUR} srcSet={ordinateur.srcSet} sizes={ordinateur.sizes} />
          <img
            {...telephone}
            alt={photo.alt}
            data-hero-zoom
            className="absolute inset-0 h-full w-full origin-[73%_30%] scale-[1.25] object-cover object-[50%_35%] lg:origin-[76%_38%] lg:scale-[1.6] lg:object-[50%_40%]"
          />
        </picture>
        {/* Voile bleu nuit en bas : le titre blanc reste lisible sur le pelage blanc. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgb(20_33_61/0.94)_0%,rgb(20_33_61/0.78)_34%,rgb(20_33_61/0)_70%)]"
        />

        <div data-sur-photo className="relative flex h-full flex-col justify-end px-4 pb-7 sm:px-8 lg:pb-12">
          <div className="mx-auto w-full max-w-[90rem]">
            <h1
              id="titre-accueil"
              className="font-display max-w-[13ch] text-[clamp(3.25rem,0.9rem+7.4vw,9rem)] text-blanc"
            >
              {MOTS.map((mot) => (
                <span key={mot}>
                  <span className="mot-entree entree-flou" style={{ "--i": i++ } as React.CSSProperties}>
                    {mot}
                  </span>{" "}
                </span>
              ))}
              {MOTS_SERIF.map((mot, k) => (
                <span key={mot}>
                  <span
                    className="mot-entree entree-flou mot-serif text-accent"
                    style={{ "--i": i++ } as React.CSSProperties}
                  >
                    {mot}
                  </span>
                  {k < MOTS_SERIF.length - 1 ? " " : null}
                </span>
              ))}
            </h1>
            <div
              className="entree-flou mt-6 flex flex-col items-start gap-6 lg:mt-8 lg:flex-row lg:items-end lg:justify-between"
              style={{ "--i": i + 2 } as React.CSSProperties}
            >
              <p className="max-w-[40ch] text-lead text-blanc">
                Litières, fontaines, arbres à chat : nous comparons l&apos;équipement à partir des fiches techniques des
                fabricants.
              </p>
              <BoutonAction href="/litieres/litiere-autonettoyante/" className="shrink-0">
                Lire le comparatif des litières
              </BoutonAction>
            </div>
            <p className="mt-6 text-small text-blanc/75">{photo.credit}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
