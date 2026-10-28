import Image from "next/image";
import { PHOTOS, type Photo } from "@/lib/medias";

type Props = {
  photo: Photo;
  // Taille d'affichage pour le choix de la bonne résolution (voir next/image).
  sizes: string;
  // Photo en haut de page sur ordinateur : demandée en priorité dès qu'elle est affichée.
  enTete?: boolean;
  className?: string;
};

// Photo avec son crédit dessous. Format paysage 3:2, coins droits.
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
      <figcaption className="mt-2 text-small text-ink-soft">{photo.credit}</figcaption>
    </figure>
  );
}

// Dans un article MDX : <Photo nom="chatBol" />
export function PhotoMdx({ nom }: { nom: keyof typeof PHOTOS }) {
  const photo = PHOTOS[nom];
  if (!photo) throw new Error(`Photo inconnue dans PHOTOS (src/lib/medias.ts) : ${nom}`);
  return <Figure photo={photo} sizes="(min-width: 1024px) 44rem, 100vw" className="reveal my-12 max-w-[44rem]" />;
}
