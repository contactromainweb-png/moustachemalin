import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Manifeste (ajout à l'écran d'accueil d'un téléphone) : icônes du logo dans public/brand/.
// Les icônes d'onglet viennent des fichiers du dossier app : favicon.ico, icon.svg et apple-icon.png.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: SITE.tagline,
    start_url: "/",
    display: "browser",
    lang: "fr",
    theme_color: "#14213D",
    background_color: "#FAF7F2",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
