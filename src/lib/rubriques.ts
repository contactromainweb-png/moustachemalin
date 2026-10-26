import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import type { ArticleLien } from "@/components/RubriqueTemplate";
import { cheminArticle, type Frontmatter } from "@/lib/articles";
import { pageEnLigne } from "@/lib/site";

// Articles d'une rubrique, lus dans content/<rubrique>/*.mdx (bloc --- en tête de fichier).
// Seuls ceux dont la page existe sont listés : un nouvel article apparaît dans sa rubrique
// dès que son dossier src/app/<rubrique>/<slug>/ est créé. Comparatifs d'abord, puis du plus récent au plus ancien.
export function articlesDeRubrique(rubrique: string): ArticleLien[] {
  const dossier = path.join(process.cwd(), "content", rubrique);
  if (!fs.existsSync(dossier)) return [];

  return fs
    .readdirSync(dossier)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const source = fs.readFileSync(path.join(dossier, f), "utf8");
      const bloc = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!bloc) throw new Error(`Bloc --- manquant en tête de content/${rubrique}/${f}`);
      return parse(bloc[1]) as Frontmatter;
    })
    .filter((fm) => !fm.noindex && pageEnLigne(cheminArticle(fm)))
    .sort((a, b) =>
      a.type === b.type ? b.updatedAt.localeCompare(a.updatedAt) : a.type === "comparatif" ? -1 : 1,
    )
    .map((fm) => ({ href: cheminArticle(fm), titre: fm.title, description: fm.description, type: fm.type }));
}
