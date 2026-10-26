import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import fs from "node:fs";
import path from "node:path";

// Pages de premier niveau qui existent (dossier src/app/<nom>/page.tsx), calculé à chaque construction.
// Le menu s'en sert pour n'afficher que les rubriques déjà créées.
const routesEnLigne = fs
  .readdirSync(path.join(process.cwd(), "src/app"), { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(process.cwd(), "src/app", d.name, "page.tsx")))
  .map((d) => d.name);

const nextConfig: NextConfig = {
  cacheComponents: true,
  trailingSlash: true,
  // Année affichée dans le footer, figée à chaque construction du site.
  env: {
    BUILD_YEAR: String(new Date().getFullYear()),
    ROUTES_EN_LIGNE: routesEnLigne.join(","),
  },
  partialPrefetching: true,
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
  // Plugins remark/rehype à ajouter ici (sous forme de chaînes pour Turbopack)
});

export default withMDX(nextConfig);
