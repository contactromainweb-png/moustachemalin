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

// En-têtes de sécurité de toutes les pages (audit de novembre 2026, pack A). Ils sont ici et pas dans netlify.toml :
// sur Netlify, les [[headers]] de netlify.toml ne s'appliquent qu'aux fichiers statiques, pas aux pages servies par
// Next.js (vérifié sur l'aperçu de la PR 27).
// CSP : tout vient du site lui-même, sauf
//   - Umami (statistiques sans cookie) : le script sur cloud.umami.is, les envois sur gateway.umami.is ;
//   - Brevo (lettre) : le formulaire est envoyé en fetch, ou sans JavaScript en POST classique, vers *.sibforms.com.
// 'unsafe-inline' (scripts et styles) : Next.js écrit les données de page dans de petits scripts en ligne, et les
// composants des attributs style ; des pages statiques ne peuvent pas recevoir de nonce.
// Pages encadrées interdites partout : X-Frame-Options DENY et frame-ancestors 'none'.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cloud.umami.is",
  "connect-src 'self' https://cloud.umami.is https://gateway.umami.is https://api-gateway.umami.dev https://*.sibforms.com",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "form-action 'self' https://*.sibforms.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const EN_TETES_SECURITE = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  trailingSlash: true,
  // Pas d'en-tête X-Powered-By: Next.js (inutile de dire aux robots ce qui fait tourner le site).
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: EN_TETES_SECURITE }];
  },
  // Année affichée dans le footer, figée à chaque construction du site.
  env: {
    BUILD_YEAR: String(new Date().getFullYear()),
    PAGES_EN_LIGNE: pagesEnLigne().join(","),
    // Date du build à Paris (AAAA-MM-JJ) : les épingles fraîches datées de ce jour ou avant entrent dans les flux
    // (src/lib/epingles.ts). EPINGLES_AUJOURDHUI=AAAA-MM-JJ npm run build simule une autre date.
    EPINGLES_AUJOURDHUI:
      process.env.EPINGLES_AUJOURDHUI ??
      new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()),
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
      // Sommaire des articles de plus de 1 500 mots, avec une ancre par titre (plugin du projet).
      path.join(process.cwd(), "plugins/remark-sommaire.mjs"),
      // Bandes de fond par section « ## » et Kira séparatrices (après le sommaire, qui pose les ancres).
      path.join(process.cwd(), "plugins/remark-bandes.mjs"),
    ],
  },
});

export default withMDX(nextConfig);
