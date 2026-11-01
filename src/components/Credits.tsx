import Image from "next/image";
import credits from "../../content/credits.json";
import { COUSINS, GALERIE } from "@/components/KiraGalerie";
import { MUR, MUR_CENTRE, PHOTOS } from "@/lib/medias";

// Description de chaque photo, reprise de src/lib/medias.ts et des galeries de Kira (même texte que sur les pages où elle apparaît).
const DESCRIPTIONS = new Map([...Object.values(PHOTOS), ...MUR, MUR_CENTRE, ...GALERIE, ...COUSINS].map((p) => [p.src, p.alt]));

type Credit = {
  fichier: string;
  description?: string; // photo absente de src/lib/medias.ts
  auteur: string;
  source: string;
  url: string;
  licence: string;
};

// Toutes les photos et vidéos du site, lues dans content/credits.json : une vignette, l'auteur, la source et la
// licence. Page /credits-photos/ : les crédits ne sont plus affichés sous les photos.
export function Credits() {
  const liste = credits as Credit[];
  if (liste.length === 0) {
    return <p>Aucune photo ni vidéo externe n&apos;est encore utilisée sur le site.</p>;
  }
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {liste.map((c) => {
        const src = c.fichier.replace(/^public/, "");
        const image = /\.(jpe?g|png|webp|avif)$/i.test(src);
        return (
          <li key={c.fichier} className="text-small">
            {image ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem] bg-field">
                <Image
                  src={src}
                  alt={DESCRIPTIONS.get(src) ?? c.description ?? ""}
                  fill
                  loading="lazy"
                  quality={80}
                  sizes="(min-width: 1280px) 16rem, (min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                  className="object-cover"
                />
              </div>
            ) : null}
            <p className="mt-3 font-medium">{c.auteur}</p>
            <p className="text-ink-soft">
              {/* Photo personnelle (sans adresse source) : pas de lien. */}
              {c.url ? (
                <a href={c.url} className="underline decoration-accent decoration-2 underline-offset-4" rel="noopener" target="_blank">
                  {c.source}
                </a>
              ) : (
                c.source
              )}{" "}
              · {c.licence}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
