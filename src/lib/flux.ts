import fs from "node:fs";
import path from "node:path";
import { cheminArticle, pinArticle, type Frontmatter } from "@/lib/articles";
import { articlesDuFlux } from "@/lib/rubriques";
import { SITE } from "@/lib/site";

// Flux RSS par rubrique (CLAUDE.md §11 bis), en plus du flux général /feed.xml : chacun alimente un tableau
// Pinterest, qui publie une épingle par nouvel article à partir de l'image verticale /pins/<slug>.jpg.
// Générés au build, comme le reste du site. Un article sans image /pins/ n'y figure pas (avertissement au build).
export type CleFlux = "litieres" | "fontaines" | "repas" | "griffer-grimper" | "conseils";

export const FLUX: Record<CleFlux, { titre: string; page: string; rubriques: string[]; tableau: string }> = {
  litieres: { titre: "Litières", page: "/litieres/", rubriques: ["litieres"], tableau: "Litières pour chat" },
  fontaines: { titre: "Fontaines", page: "/fontaines/", rubriques: ["fontaines"], tableau: "Fontaines à eau pour chat" },
  repas: { titre: "Repas", page: "/repas/", rubriques: ["repas"], tableau: "Distributeurs de croquettes pour chat" },
  "griffer-grimper": {
    titre: "Griffer, grimper",
    page: "/griffer-grimper/",
    rubriques: ["griffer-grimper"],
    tableau: "Arbres à chat et griffoirs",
  },
  conseils: {
    titre: "Conseils",
    page: "/guides/",
    rubriques: ["guides", "outils", "sorties"],
    tableau: "Conseils pour chat",
  },
};

export const cheminFlux = (cle: CleFlux) => (cle === "conseils" ? "/conseils/feed.xml" : `/${cle}/feed.xml`);

// Lien <link rel="alternate"> vers le flux d'une rubrique, pour le metadata.alternates de sa page.
export function fluxDansHead(cle: CleFlux) {
  return { "application/rss+xml": [{ url: cheminFlux(cle), title: `${SITE.name} : ${FLUX[cle].titre}` }] };
}

const echapper = (texte: string) =>
  texte.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const dateRss = (jour: string) => new Date(`${jour}T08:00:00Z`).toUTCString();
const publication = (fm: Frontmatter) => fm.publishedAt ?? fm.updatedAt;

// Les articles d'un flux (du plus récemment publié au plus ancien) avec le poids de leur image /pins/ ; ceux sans
// image sont écartés et signalés.
export function articlesDeFlux(cle: CleFlux) {
  const articles = articlesDuFlux()
    .filter((fm) => FLUX[cle].rubriques.includes(fm.rubrique))
    .sort((a, b) => publication(b).localeCompare(publication(a)));
  return articles.flatMap((fm) => {
    const fichier = path.join(process.cwd(), "public", pinArticle(fm));
    if (!fs.existsSync(fichier)) {
      console.warn(`⚠ Flux ${cheminFlux(cle)} : ${cheminArticle(fm)} écarté, pas d'image ${pinArticle(fm)}`);
      return [];
    }
    return [{ fm, poids: fs.statSync(fichier).size }];
  });
}

export function reponseFlux(cle: CleFlux) {
  const flux = FLUX[cle];
  const articles = articlesDeFlux(cle);
  const items = articles
    .map(({ fm, poids }) => {
      const url = new URL(cheminArticle(fm), SITE.url).toString();
      const image = new URL(pinArticle(fm), SITE.url).toString();
      return `    <item>
      <title>${echapper(fm.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${dateRss(publication(fm))}</pubDate>
      <description>${echapper(fm.description)}</description>
      <enclosure url="${image}" length="${poids}" type="image/jpeg" />
      <media:content url="${image}" medium="image" type="image/jpeg" width="1000" height="1500" fileSize="${poids}">
        <media:title>${echapper(fm.title)}</media:title>
        <media:description>${echapper(fm.description)}</media:description>
      </media:content>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${echapper(`${SITE.name} : ${flux.titre}`)}</title>
    <link>${SITE.url}${flux.page}</link>
    <description>${echapper(`${flux.tableau} : les derniers comparatifs, avis et guides de ${SITE.name}.`)}</description>
    <language>fr-FR</language>
    <atom:link href="${SITE.url}${cheminFlux(cle)}" rel="self" type="application/rss+xml" />
${articles[0] ? `    <lastBuildDate>${dateRss(publication(articles[0].fm))}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
