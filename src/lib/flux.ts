import fs from "node:fs";
import path from "node:path";
import { cheminArticle, pinArticle, type Frontmatter } from "@/lib/articles";
import { CHEMIN_BANDE, DATE_BANDE, EPINGLES_BANDE } from "@/lib/bande";
import { epinglesDe, estPubliee } from "@/lib/epingles";
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

const element = (e: { titre: string; lien: string; date: string; description: string; image: string; poids: number }) => `    <item>
      <title>${echapper(e.titre)}</title>
      <link>${e.lien}</link>
      <guid isPermaLink="true">${e.lien}</guid>
      <pubDate>${dateRss(e.date)}</pubDate>
      <description>${echapper(e.description)}</description>
      <enclosure url="${e.image}" length="${e.poids}" type="image/jpeg" />
      <media:content url="${e.image}" medium="image" type="image/jpeg" width="1000" height="1500" fileSize="${e.poids}">
        <media:title>${echapper(e.titre)}</media:title>
        <media:description>${echapper(e.description)}</media:description>
      </media:content>
    </item>`;

function reponseXml(c: { titre: string; page: string; description: string; chemin: string; date?: string; items: string }) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${echapper(c.titre)}</title>
    <link>${SITE.url}${c.page}</link>
    <description>${echapper(c.description)}</description>
    <language>fr-FR</language>
    <atom:link href="${SITE.url}${c.chemin}" rel="self" type="application/rss+xml" />
${c.date ? `    <lastBuildDate>${dateRss(c.date)}</lastBuildDate>\n` : ""}${c.items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}

// Rubrique → flux (et tableau Pinterest) qui la publie.
export function cleFluxDe(rubrique: string): CleFlux | undefined {
  return (Object.keys(FLUX) as CleFlux[]).find((cle) => FLUX[cle].rubriques.includes(rubrique));
}

// Épingles fraîches d'un flux dont la date est passée (src/lib/epingles.ts) ; une image manquante est signalée.
function epinglesDeFlux(cle: CleFlux) {
  return articlesDuFlux()
    .filter((fm) => FLUX[cle].rubriques.includes(fm.rubrique))
    .flatMap(epinglesDe)
    .filter(estPubliee)
    .flatMap((e) => {
      const fichier = path.join(process.cwd(), "public", e.image);
      if (!fs.existsSync(fichier)) {
        console.warn(`⚠ Flux ${cheminFlux(cle)} : épingle ${e.lien} écartée, pas d'image ${e.image}`);
        return [];
      }
      return [{ e, poids: fs.statSync(fichier).size }];
    });
}

export function reponseFlux(cle: CleFlux) {
  const flux = FLUX[cle];
  const elements = [
    ...articlesDeFlux(cle).map(({ fm, poids }) => ({
      titre: fm.title,
      lien: new URL(cheminArticle(fm), SITE.url).toString(),
      date: publication(fm),
      description: fm.description,
      image: new URL(pinArticle(fm), SITE.url).toString(),
      poids,
    })),
    ...epinglesDeFlux(cle).map(({ e, poids }) => ({
      titre: e.titre,
      lien: new URL(e.lien, SITE.url).toString(),
      date: e.publication,
      description: e.description,
      image: new URL(e.image, SITE.url).toString(),
      poids,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));
  return reponseXml({
    titre: `${SITE.name} : ${flux.titre}`,
    page: flux.page,
    description: `${flux.tableau} : les derniers comparatifs, avis et guides de ${SITE.name}.`,
    chemin: cheminFlux(cle),
    date: elements[0]?.date,
    items: elements.map(element).join("\n"),
  });
}

// Tableau « Kira et la bande » (/kira/feed.xml) : un lien unique par épingle, la page elle-même puis l'ancre de chaque
// chat sur cette page (#kira, #sucette…).
export const CHEMIN_FLUX_KIRA = "/kira/feed.xml";

export function fluxKiraDansHead() {
  return { "application/rss+xml": [{ url: CHEMIN_FLUX_KIRA, title: `${SITE.name} : Kira et la bande` }] };
}

export function reponseFluxKira() {
  return reponseXml({
    titre: `${SITE.name} : Kira et la bande`,
    page: CHEMIN_BANDE,
    description: `Kira et la bande : la chatte de Romain et les chats de sa famille, sur ${SITE.name}.`,
    chemin: CHEMIN_FLUX_KIRA,
    date: DATE_BANDE,
    items: EPINGLES_BANDE.map((e) => {
      const pin = `/pins/${e.slug}.jpg`;
      return element({
        titre: e.titreFlux,
        lien: new URL(`${CHEMIN_BANDE}${e.ancre ? `#${e.ancre}` : ""}`, SITE.url).toString(),
        date: DATE_BANDE,
        description: e.texte,
        image: new URL(pin, SITE.url).toString(),
        poids: fs.statSync(path.join(process.cwd(), "public", pin)).size,
      });
    }).join("\n"),
  });
}
