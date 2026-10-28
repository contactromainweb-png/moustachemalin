import { getImageProps } from "next/image";
import { preload } from "react-dom";
import { BoutonAction } from "@/components/BoutonAction";
import { HeroVideo } from "@/components/accueil/HeroVideo";
import { VIDEO_ACCUEIL } from "@/lib/medias";

const ORDINATEUR = "(min-width: 1024px)";
const TELEPHONE = "(max-width: 1023.98px)";

// Premier écran : un chat en plein écran (vidéo sur ordinateur, photo sur téléphone), le titre énorme
// posé dessus, le bouton vers le comparatif des litières. Au défilement, l'image et son texte reculent
// ensemble en carte aux coins arrondis (voir Mouvement) ; sans JavaScript, tout est déjà en place.
export function HeroAccueil() {
  const poster = VIDEO_ACCUEIL.poster;
  const mobile = VIDEO_ACCUEIL.posterMobile;

  // Ordinateur : l'image paysage, optimisée par Next. Téléphone : un recadrage vertical préparé à
  // l'avance en AVIF (35 Ko), servi tel quel ; le JPEG ne sert qu'aux navigateurs sans AVIF.
  const { props: ordinateur } = getImageProps({
    alt: "",
    src: poster.src,
    fill: true,
    quality: 60,
    sizes: "100vw",
  });
  const { props: telephone } = getImageProps({
    alt: poster.alt,
    src: mobile.src,
    width: mobile.width,
    height: mobile.height,
    unoptimized: true,
    loading: "eager",
    fetchPriority: "high",
  });
  preload(VIDEO_ACCUEIL.posterMobileAvif, {
    as: "image",
    type: "image/avif",
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

  return (
    <section
      data-hero
      aria-labelledby="titre-accueil"
      className="relative h-[calc(100svh-4rem)] min-h-[34rem] overflow-hidden bg-nuit"
    >
      <div data-hero-media className="absolute inset-0 overflow-hidden">
        <picture>
          <source media={ORDINATEUR} srcSet={ordinateur.srcSet} sizes={ordinateur.sizes} />
          <source media={TELEPHONE} type="image/avif" srcSet={VIDEO_ACCUEIL.posterMobileAvif} />
          <img
            {...telephone}
            alt={poster.alt}
            className="absolute inset-0 h-full w-full object-cover object-[62%_40%] lg:object-[70%_50%]"
          />
        </picture>
        <HeroVideo src={VIDEO_ACCUEIL.src} srcLarge={VIDEO_ACCUEIL.srcLarge} />
        {/* Voile bleu nuit en bas : le titre blanc reste lisible sur le tapis clair. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgb(20_33_61/0.92)_0%,rgb(20_33_61/0.7)_38%,rgb(20_33_61/0)_72%)]"
        />

        <div data-sur-photo className="relative flex h-full flex-col justify-end px-4 pb-7 sm:px-8 lg:pb-12">
          <div className="mx-auto w-full max-w-[90rem]">
            <h1
              id="titre-accueil"
              className="font-display max-w-[13ch] text-[clamp(3.25rem,0.9rem+7.4vw,9rem)] text-blanc"
            >
              Bien équiper son chat, sans se tromper
            </h1>
            <div className="mt-6 flex flex-col items-start gap-6 lg:mt-8 lg:flex-row lg:items-end lg:justify-between">
              <p className="max-w-[40ch] text-lead text-blanc">
                Litières, fontaines, arbres à chat : nous comparons l&apos;équipement à partir des fiches techniques des
                fabricants.
              </p>
              <BoutonAction href="/litieres/litiere-autonettoyante/" className="shrink-0">
                Lire le comparatif des litières
              </BoutonAction>
            </div>
            <p className="mt-6 text-small text-blanc/75">{poster.credit}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
