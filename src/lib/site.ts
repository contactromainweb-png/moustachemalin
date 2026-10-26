// Informations générales du site, utilisées partout (header, footer, pages légales, SEO).
// Les valeurs marquées « À COMPLÉTER » sont provisoires : les remplacer avant la mise en ligne
// sur moustachemalin.fr (étape 7).

export const SITE = {
  name: "Moustache Malin",
  url: "https://moustachemalin.fr",
  tagline: "Le bon équipement pour un chat heureux, sans se tromper.",
  email: "contact@moustachemalin.fr", // À COMPLÉTER : adresse à créer
};

export const LEGAL = {
  editeur: "Prénom Nom (À COMPLÉTER)",
  statut: "Entrepreneur individuel (À COMPLÉTER)",
  adresse: "Adresse postale (À COMPLÉTER)",
  siret: "SIRET (À COMPLÉTER)",
  directeurPublication: "Prénom Nom (À COMPLÉTER)",
  hebergeur: {
    nom: "Netlify, Inc.",
    adresse: "101 2nd Street, San Francisco, CA 94105, États-Unis",
    site: "https://www.netlify.com",
  },
  miseAJour: "26 octobre 2026",
};

export const AMAZON_DISCLOSURE =
  "En tant que Partenaire Amazon, Moustache Malin réalise un bénéfice sur les achats remplissant les conditions requises.";

// Les rubriques du site (section 4 du cahier des charges).
export const RUBRIQUES = [
  { href: "/litieres/", label: "Litières" },
  { href: "/fontaines/", label: "Fontaines" },
  { href: "/repas/", label: "Repas" },
  { href: "/griffer-grimper/", label: "Griffer et grimper" },
  { href: "/sorties/", label: "Sorties" },
  { href: "/guides/", label: "Guides" },
];

// Seulement les rubriques dont la page existe déjà (voir ROUTES_EN_LIGNE dans next.config.ts).
// Une rubrique apparaît d'elle-même dans le menu dès que son dossier src/app/<rubrique>/ est créé.
export function rubriquesEnLigne() {
  const enLigne = (process.env.ROUTES_EN_LIGNE ?? "").split(",");
  return RUBRIQUES.filter((r) => enLigne.includes(r.href.replaceAll("/", "")));
}

export const PAGES_INFO = [
  { href: "/a-propos/", label: "À propos" },
  { href: "/methode/", label: "Notre méthode" },
  { href: "/affiliation/", label: "Affiliation" },
  { href: "/mentions-legales/", label: "Mentions légales" },
  { href: "/confidentialite/", label: "Confidentialité" },
];
