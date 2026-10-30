// Informations générales du site, utilisées partout (header, footer, pages légales, SEO).
// Les valeurs marquées « À COMPLÉTER » sont provisoires : les remplacer avant la mise en ligne
// sur moustachemalin.fr (étape 7).

export const SITE = {
  name: "Moustache Malin",
  url: "https://moustachemalin.fr",
  tagline: "Le bon équipement pour un chat heureux, sans se tromper.",
  email: "contact@moustachemalin.fr", // confirmée par Romain le 30/10/2026 (boîte à créer au branchement du domaine)
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

// Mentions légales. Pas de numéro de téléphone (aucun fourni par Romain : ligne retirée).
// Hébergeur : adresse et contact vérifiés le 30 octobre 2026 sur netlify.com (politique de confidentialité et
// conditions d'utilisation) ; Netlify ne publie pas de numéro de téléphone.
export const LEGAL = {
  editeur: "Romain Cahagne",
  statut: "entrepreneur individuel (micro-entreprise)",
  adresse: "Adresse postale (À COMPLÉTER)",
  siret: "SIRET (À COMPLÉTER)",
  directeurPublication: "Romain Cahagne",
  hebergeur: {
    nom: "Netlify, Inc.",
    adresse: "101 2nd Street, San Francisco, CA 94105, États-Unis",
    email: "support@netlify.com",
    site: "https://www.netlify.com",
  },
  miseAJour: "26 octobre 2026", // pages Méthode et Affiliation
  miseAJourMentions: "30 octobre 2026", // pages Mentions légales et Confidentialité
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
