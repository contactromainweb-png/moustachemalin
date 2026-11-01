import Image from "next/image";
import { PHOTOS, type Photo } from "@/lib/medias";
import { espacesFines } from "@/lib/typo";

type Props = {
  photo: Photo;
  // Taille d'affichage pour le choix de la bonne résolution (voir next/image).
  sizes: string;
  // Photo en haut de page sur ordinateur : demandée en priorité dès qu'elle est affichée.
  enTete?: boolean;
  className?: string;
};

// Photo d'article (les crédits sont réunis sur la page /credits-photos/). Format paysage 3:2, coins droits.
// Toujours en chargement différé : masquée (display: none), elle n'est pas téléchargée du tout,
// ce qui garde le titre comme premier élément affiché sur téléphone (LCP).
export function Figure({ photo, sizes, enTete = false, className = "" }: Props) {
  return (
    <figure className={className}>
      <Image
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        sizes={sizes}
        loading="lazy"
        fetchPriority={enTete ? "high" : "auto"}
        quality={80}
        className="aspect-[3/2] w-full bg-field object-cover"
      />
    </figure>
  );
}

// Dans un article MDX, photo en taille moyenne avec sa légende : <PhotoMoyenne nom="kiraArbre" />
// (photos personnelles et photos d'appoint : jamais en pleine largeur). Verticale : format 3:4, 22rem au plus ;
// en largeur : format 3:2, 36rem au plus. Dimensions fixées, chargée à l'approche (pas de décalage de la page).
export function PhotoMoyenne({ nom }: { nom: keyof typeof PHOTOS }) {
  const photo: Photo = PHOTOS[nom];
  if (!photo) throw new Error(`Photo inconnue dans PHOTOS (src/lib/medias.ts) : ${nom}`);
  const paysage = photo.width > photo.height;
  return (
    <figure className={`reveal my-12 ${paysage ? "max-w-[36rem]" : "max-w-[22rem]"}`}>
      <Image
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        sizes={paysage ? "(min-width: 640px) 36rem, calc(100vw - 2rem)" : "(min-width: 640px) 22rem, calc(100vw - 2rem)"}
        loading="lazy"
        quality={80}
        className={`${paysage ? "aspect-[3/2]" : "aspect-[3/4]"} w-full rounded-[1.25rem] bg-field object-cover`}
        style={photo.position ? { objectPosition: photo.position } : undefined}
      />
      {photo.legende ? (
        <figcaption className="mt-3 text-small text-ink-soft">{espacesFines(photo.legende)}</figcaption>
      ) : null}
    </figure>
  );
}

// Dans un article MDX : <Photo nom="chatBol" />
export function PhotoMdx({ nom }: { nom: keyof typeof PHOTOS }) {
  const photo = PHOTOS[nom];
  if (!photo) throw new Error(`Photo inconnue dans PHOTOS (src/lib/medias.ts) : ${nom}`);
  return <Figure photo={photo} sizes="(min-width: 1024px) 44rem, 100vw" className="reveal my-12 max-w-[44rem]" />;
}
