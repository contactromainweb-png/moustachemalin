import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Consignes pour les robots des moteurs de recherche. Les pages d'exemple ne sont pas bloquées ici : elles portent une
// balise noindex, que Google doit pouvoir lire (une page bloquée par robots.txt peut être indexée sans son contenu).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", SITE.url).toString(),
  };
}
