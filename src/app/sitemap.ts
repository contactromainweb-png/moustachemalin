import type { MetadataRoute } from "next";
import { frontmatter as aPropos } from "../../content/pages/a-propos.mdx";
import { cheminArticle } from "@/lib/articles";
import { articlesDuFlux } from "@/lib/rubriques";
import { LEGAL, SITE } from "@/lib/site";

// Date de mise à jour (lastmod) des pages qui en ont une vraie : les articles (updatedAt, sinon publishedAt), la page
// À propos (son updatedAt) et les pages légales (dates de LEGAL). Les autres pages (accueil, rubriques…) n'en ont pas :
// on n'invente aucune date.
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
function dateLegale(texte: string) {
  const m = texte.match(/^(\d{1,2})(?:er)? (\S+) (\d{4})$/);
  const mois = m ? MOIS.indexOf(m[2]) + 1 : 0;
  if (!m || !mois) throw new Error(`Date de LEGAL illisible pour le plan du site : « ${texte} »`);
  return `${m[3]}-${String(mois).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}

function datesConnues() {
  const dates = new Map<string, string>();
  for (const fm of articlesDuFlux()) dates.set(cheminArticle(fm), fm.updatedAt ?? fm.publishedAt);
  dates.set("/a-propos/", aPropos.updatedAt);
  dates.set("/methode/", dateLegale(LEGAL.miseAJour));
  dates.set("/affiliation/", dateLegale(LEGAL.miseAJour));
  dates.set("/mentions-legales/", dateLegale(LEGAL.miseAJourMentions));
  dates.set("/confidentialite/", dateLegale(LEGAL.miseAJourConfidentialite));
  return dates;
}

// Plan du site pour Google : toutes les pages existantes (liste calculée au build dans next.config.ts),
// sauf les pages d'exemple et les pages de confirmation (newsletter, contact), qui ne doivent pas être indexées.
export default function sitemap(): MetadataRoute.Sitemap {
  const dates = datesConnues();
  return (process.env.PAGES_EN_LIGNE ?? "")
    .split(",")
    .filter((chemin) => chemin && !chemin.startsWith("/exemples/") && !chemin.startsWith("/newsletter/") && !chemin.endsWith("/merci/"))
    .map((chemin) => {
      const jour = dates.get(chemin);
      return { url: new URL(chemin, SITE.url).toString(), ...(jour ? { lastModified: jour } : {}) };
    });
}
