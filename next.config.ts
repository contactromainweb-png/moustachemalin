import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import fs from "node:fs";
import path from "node:path";

// Toutes les pages qui existent (chaque dossier de src/app qui contient un page.tsx), calculé à chaque
// construction. Le menu et les liens internes s'en servent pour masquer les pages pas encore écrites.
function pagesEnLigne(dossier = "src/app", url = "/"): string[] {
  const pages = fs.existsSync(path.join(dossier, "page.tsx")) ? [url] : [];
  for (const d of fs.readdirSync(dossier, { withFileTypes: true })) {
    if (d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("(")) {
      pages.push(...pagesEnLigne(path.join(dossier, d.name), `${url}${d.name}/`));
    }
  }
  return pages;
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  trailingSlash: true,
  // Année affichée dans le footer, figée à chaque construction du site.
  env: {
    BUILD_YEAR: String(new Date().getFullYear()),
    PAGES_EN_LIGNE: pagesEnLigne().join(","),
  },
  partialPrefetching: true,
  // Photos servies en AVIF (le plus léger), sinon WebP, à la taille de l'écran.
  images: {
    formats: ["image/avif", "image/webp"],
    // Qualité 80 pour les photos de chats (les poils se dégradent vite en dessous), jusqu’à 3840 px pour les écrans Retina.
    qualities: [80],
    deviceSizes: [640, 750, 828, 960, 1080, 1280, 1600, 1920, 2560, 3840, 4608, 5120],
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withMDX = createMDX({
  options: {
    // Tableaux Markdown, et lecture du bloc --- en tête des articles (exporté sous le nom `frontmatter`).
    remarkPlugins: [
      "remark-gfm",
      // Passages « À VALIDER PAR ROMAIN » retirés avant publication (plugin du projet).
      path.join(process.cwd(), "plugins/remark-a-valider.mjs"),
      "remark-frontmatter",
      ["remark-mdx-frontmatter", { name: "frontmatter" }],
      // Espaces insécables avant « : ; ? ! » (plugin du projet, dossier plugins/).
      path.join(process.cwd(), "plugins/remark-espaces-fines.mjs"),
    ],
  },
});

export default withMDX(nextConfig);
