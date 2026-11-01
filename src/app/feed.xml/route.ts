import { cheminArticle } from "@/lib/articles";
import { articlesDuFlux } from "@/lib/rubriques";
import { SITE } from "@/lib/site";

// Fil RSS des articles (/feed.xml), signalé dans le <head> de chaque page : lecteurs de flux (Feedly) et outils qui
// suivent les nouveautés. Généré au build, comme le reste du site ; du plus récemment mis à jour au plus ancien.
const echapper = (texte: string) =>
  texte.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const dateRss = (jour: string) => new Date(`${jour}T08:00:00Z`).toUTCString();

export function GET() {
  const articles = articlesDuFlux();
  const items = articles
    .map((fm) => {
      const url = new URL(cheminArticle(fm), SITE.url).toString();
      return `    <item>
      <title>${echapper(fm.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${echapper(fm.description)}</description>
      <pubDate>${dateRss(fm.updatedAt)}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${echapper(SITE.name)}</title>
    <link>${SITE.url}/</link>
    <description>${echapper(SITE.tagline)}</description>
    <language>fr-FR</language>
    <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml" />
${articles[0] ? `    <lastBuildDate>${dateRss(articles[0].updatedAt)}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
