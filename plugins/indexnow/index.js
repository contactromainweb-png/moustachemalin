/* eslint-disable @typescript-eslint/no-require-imports -- extension Netlify en CommonJS */
// Extension de build Netlify (déclarée dans netlify.toml) : après un déploiement de production réussi, signale à
// Bing (protocole IndexNow) les pages nouvelles ou modifiées par ce déploiement.
//
// DÉSACTIVÉE tant que le domaine n'est pas branché : elle ne fait rien si
//   - la variable d'environnement Netlify INDEXNOW ne vaut pas « on »,
//   - ou si l'adresse principale du site (variable URL fournie par Netlify) n'est pas https://moustachemalin.fr.
// Clé : fichier public/<clé>.txt, servi à la racine du site (Bing le lit pour vérifier que l'envoi vient de nous).
//
// Pages envoyées : celles dont un fichier a changé entre le déploiement précédent et celui-ci (articles de content/,
// pages de src/app/). Si l'historique manque, ou si un fichier partagé change (composants, styles…), tout le plan du
// site est envoyé. Une erreur ici ne bloque jamais le déploiement.
const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const DOMAINE = "https://moustachemalin.fr";
const CLE = "cc057bd7bba47274dff5817c331d98bb";

// Fichier modifié → adresse de la page, ou null (fichier sans page propre).
function adresse(fichier) {
  let m = fichier.match(/^content\/([^/]+)\/([^/]+)\.mdx$/);
  if (m && !["pages", "rubriques", "exemples"].includes(m[1])) return `/${m[1]}/${m[2]}/`;
  m = fichier.match(/^content\/rubriques\/([^/]+)\.mdx$/);
  if (m) return `/${m[1]}/`;
  m = fichier.match(/^content\/pages\/([^/]+)\.mdx$/);
  if (m) return `/${m[1]}/`;
  m = fichier.match(/^src\/app\/(.*?)\/?page\.tsx$/);
  if (m) return m[1] ? `/${m[1]}/` : "/";
  return null;
}

function toutLePlan(publie) {
  const plan = fs.readFileSync(path.join(publie, "server/app/sitemap.xml.body"), "utf8");
  return [...plan.matchAll(/<loc>(.*?)<\/loc>/g)].map((x) => new URL(x[1]).pathname);
}

module.exports = {
  async onSuccess({ constants, utils }) {
    try {
      if (process.env.INDEXNOW !== "on" || process.env.CONTEXT !== "production") return;
      if (process.env.URL !== DOMAINE) {
        console.log(`IndexNow : adresse principale ${process.env.URL}, envoi désactivé.`);
        return;
      }

      const avant = process.env.CACHED_COMMIT_REF;
      const apres = process.env.COMMIT_REF;
      let pages = null;
      if (avant && apres && avant !== apres) {
        const changes = execSync(`git diff --name-only ${avant} ${apres}`, { encoding: "utf8" }).split("\n").filter(Boolean);
        const pagesSeules = changes.every((f) => adresse(f) || f.startsWith("public/media/") || f.endsWith(".md"));
        if (pagesSeules) pages = [...new Set(changes.map(adresse).filter(Boolean))];
      }
      if (pages === null) {
        try {
          pages = toutLePlan(constants.PUBLISH_DIR);
        } catch {
          console.log("IndexNow : plan du site introuvable, rien n'est envoyé.");
          return;
        }
      }
      if (pages.length === 0) return console.log("IndexNow : aucune page modifiée.");

      const reponse = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host: new URL(DOMAINE).host,
          key: CLE,
          keyLocation: `${DOMAINE}/${CLE}.txt`,
          urlList: pages.map((p) => `${DOMAINE}${p}`),
        }),
      });
      console.log(`IndexNow : ${pages.length} page(s) envoyée(s), réponse ${reponse.status}.`);
    } catch (erreur) {
      utils.status.show({ title: "IndexNow", summary: `Envoi impossible : ${erreur.message}` });
    }
  },
};
