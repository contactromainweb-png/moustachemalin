import fs from "node:fs";
import path from "node:path";
import { cheminArticle, pinArticle } from "@/lib/articles";
import { articlesDuFlux } from "@/lib/rubriques";
import { SITE } from "@/lib/site";

// Fil RSS des articles (/feed.xml), signalé dans le <head> de chaque page : lecteurs de flux (Feedly) et outils qui
// suivent les nouveautés. Généré au build, comme le reste du site ; du plus récemment mis à jour au plus ancien.
// Chaque article porte son image verticale (enclosure + media:content) : Pinterest publie une épingle par nouvel
// article à partir de ce flux. Les images sont fabriquées avant le build (scripts/pins.mjs) : sans elles, la
// lecture de leur taille échoue et le build s'arrête.
const echapper = (texte: string) =>
  texte.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const dateRss = (jour: string) => new Date(`${jour}T08:00:00Z`).toUTCString();

export function GET() {
  const articles = articlesDuFlux();
  const items = articles
    .map((fm) => {
      const url = new URL(cheminArticle(fm), SITE.url).toString();
      const pin = pinArticle(fm);
      const image = new URL(pin, SITE.url).toString();
      const poids = fs.statSync(path.join(process.cwd(), "public", pin)).size;
      return `    <item>
      <title>${echapper(fm.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${echapper(fm.description)}</description>
      <pubDate>${dateRss(fm.updatedAt)}</pubDate>
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
