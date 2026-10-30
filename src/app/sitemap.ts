import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Plan du site pour Google : toutes les pages existantes (liste calculée au build dans next.config.ts),
// sauf les pages d'exemple et la confirmation de la lettre, qui ne doivent pas être indexées.
export default function sitemap(): MetadataRoute.Sitemap {
  return (process.env.PAGES_EN_LIGNE ?? "")
    .split(",")
    .filter((chemin) => chemin && !chemin.startsWith("/exemples/") && !chemin.startsWith("/lettre/"))
    .map((chemin) => ({ url: new URL(chemin, SITE.url).toString() }));
}
