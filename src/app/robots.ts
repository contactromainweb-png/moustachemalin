import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Consignes pour les robots des moteurs de recherche.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/exemples/" },
    sitemap: new URL("/sitemap.xml", SITE.url).toString(),
  };
}
