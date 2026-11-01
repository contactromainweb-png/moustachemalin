import type { ArticleLien } from "@/components/RubriqueTemplate";
import { PHOTOS, type Photo } from "@/lib/medias";

// Une même image ne doit jamais apparaître deux fois sur une page (contrôlé au build : scripts/controle-images.mjs).
// Chaque carte d'article prend donc la première photo de son article qui n'est pas déjà sur la page : sa photo
// d'en-tête, sinon une autre photo de l'article (frontmatter `photo`, puis les <PhotoMoyenne>/<Photo> du texte).
// Sans photo libre, la carte s'affiche sans image. `prises` = images déjà présentes sur la page (complété au fur et
// à mesure, pour que deux cartes ne prennent pas la même).
export function attribuerPhotos(articles: ArticleLien[], prises: Set<string>): ArticleLien[] {
  return articles.map((a) => {
    const photo = (a.photos ?? (a.photo ? [a.photo] : [])).find((nom) => !prises.has(PHOTOS[nom].src));
    if (photo) prises.add(PHOTOS[photo].src);
    return { ...a, photo };
  });
}

export const sources = (...photos: (Photo | undefined)[]) =>
  new Set(photos.filter((p) => p !== undefined).map((p) => p.src));
