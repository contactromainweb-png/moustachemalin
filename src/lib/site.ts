// Informations générales du site, utilisées partout (header, footer, pages légales, SEO).
// Les valeurs marquées « À COMPLÉTER » sont provisoires : les remplacer avant la mise en ligne
// sur moustachemalin.fr (étape 7).

export const SITE = {
  name: "Moustache Malin",
  url: "https://moustachemalin.fr",
  tagline: "Le bon équipement pour un chat heureux, sans se tromper.",
  email: "contact@moustachemalin.fr", // À COMPLÉTER : adresse à créer
};

// Auteur des articles (signature « Par Romain » et données structurées Person, avec sa photo).
// Volontairement aucun lien vers d'autres sites (pas de sameAs) : demande de Romain.
export const AUTEUR = {
  nom: "Romain",
  page: "/a-propos/",
  photo: "/media/romain.jpg",
};

// Kira, la chatte de Romain et mascotte du site (encadrés « Le mot de Kira », page 404, confirmations).
// photo : chemin dans public/ quand Romain l'aura fournie (ex. "/media/kira.jpg"), sinon un rond neutre s'affiche.
export const KIRA: { photo: string | null } = {
  photo: null,
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
  { href: "/griffer-grimper/", label: "Griffer, grimper" },
  { href: "/sorties/", label: "Sorties" },
  { href: "/guides/", label: "Guides" },
  { href: "/outils/", label: "Outils" },
];

// Vrai si la page existe déjà sur le site (liste calculée au build dans next.config.ts).
// Les liens externes (https://…) sont toujours considérés comme en ligne.
export function pageEnLigne(href: string) {
  if (!href.startsWith("/")) return true;
  const chemin = href.split(/[?#]/)[0].replace(/\/?$/, "/");
  return (process.env.PAGES_EN_LIGNE ?? "").split(",").includes(chemin);
}

// Seulement les rubriques dont la page existe : une rubrique apparaît d'elle-même dans le menu
// dès que son dossier src/app/<rubrique>/ contient un page.tsx.
export function rubriquesEnLigne() {
  return RUBRIQUES.filter((r) => pageEnLigne(r.href));
}

export const PAGES_INFO = [
  { href: "/a-propos/", label: "À propos" },
  { href: "/methode/", label: "Notre méthode" },
  { href: "/affiliation/", label: "Affiliation" },
  { href: "/mentions-legales/", label: "Mentions légales" },
  { href: "/confidentialite/", label: "Confidentialité" },
];
