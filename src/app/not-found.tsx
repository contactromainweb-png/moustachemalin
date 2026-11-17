import type { Metadata } from "next";
import { getImageProps } from "next/image";
import Link from "next/link";
import { JeuBalleDiffere } from "@/components/ClientCommun";
import { PHOTOS } from "@/lib/medias";
import { tousLesArticles } from "@/lib/rubriques";
import { pageEnLigne } from "@/lib/site";
import { espacesFines } from "@/lib/typo";

// Page 404 : Kira prend la parole (charte « La voix de Kira », CLAUDE.md section 11), puis les pages toujours en
// place : l'accueil, chaque comparatif en ligne et les guides. Au-dessus du texte, une petite photo de Kira, tête
// penchée, l'air innocent. Sous les liens, le mini-jeu de la balle.
// Cachée aux moteurs (et absente du plan du site) : remplace la balise robots du layout.
export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const liens = [
    { href: "/", label: "Accueil" },
    ...tousLesArticles()
      .filter((a) => a.type === "comparatif")
      .map((a) => ({ href: a.href, label: a.titre.split(" : ")[0] })),
    { href: "/guides/", label: "Les guides" },
  ].filter((l) => pageEnLigne(l.href));

  // Photo de Kira : getImageProps (mêmes tailles et qualité que next/image) et une balise img simple. Le composant
  // Image est un composant client ; cette page part avec chaque page du site (layout racine) et, avec le mini-jeu, il
  // y ajoutait un fichier JavaScript de 7 Ko partout (pack 9).
  const { props: photo } = getImageProps({
    src: PHOTOS.kiraTetePenchee.src,
    alt: PHOTOS.kiraTetePenchee.alt,
    // Taille fixe (160 × 200, affichée en 128 ou 160 px de large) : un srcset 1x / 2x de 2 adresses au lieu de 19,
    // car ces adresses sont recopiées dans les données React de chaque page.
    width: 160,
    height: 200,
    quality: 80,
    // Pas de priorité haute : React ajouterait un préchargement de cette photo… dans chaque page du site (la 404 est
    // dans les données React de toutes les pages), en concurrence avec leur propre photo. Petite image : pas utile ici.
    loading: "lazy",
  });

  return (
    <div className="mx-auto max-w-[90rem] px-4 pb-24 pt-16 sm:px-8 sm:pt-28">
      {/* eslint-disable-next-line @next/next/no-img-element -- props calculées par getImageProps, voir plus haut */}
      <img
        {...photo}
        alt={PHOTOS.kiraTetePenchee.alt}
        className="aspect-[4/5] w-32 rounded-[1.25rem] bg-field object-cover sm:w-40"
        style={{ ...photo.style, objectPosition: PHOTOS.kiraTetePenchee.position }}
      />
      <h1 className="font-display mt-8 max-w-[16ch] text-display">
        Kira est passée <span className="mot-serif">par là</span>
      </h1>
      <p className="mt-8 max-w-[52ch] text-lead">
        {espacesFines(
          "Cette page a disparu. On soupçonne Kira de l'avoir prise pour un de ses jouets… et pour une fois, elle ne l'a pas rapportée. Pendant qu'on négocie, voici ce qui est toujours en place :",
        )}
      </p>
      <ul className="mt-10 flex flex-wrap gap-3">
        {liens.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              prefetch={l.href === "/" ? false : undefined}
              className="inline-flex min-h-12 items-center bg-caramel-field px-6 text-on-caramel transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {espacesFines(l.label)}
            </Link>
          </li>
        ))}
      </ul>
      {/* Mini-jeu « Kira rapporte la balle » (pack 9), par le module client commun (voir ClientCommun). */}
      <JeuBalleDiffere className="mt-16 max-w-[44rem]" />
    </div>
  );
}
