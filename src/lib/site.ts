// Informations générales du site, utilisées partout (header, footer, pages légales, SEO).
// Les valeurs marquées « À COMPLÉTER » sont provisoires : les remplacer avant la mise en ligne
// sur moustachemalin.fr (étape 7).

export const SITE = {
  name: "Moustache Malin",
  url: "https://moustachemalin.fr",
  tagline: "Le bon équipement pour un chat heureux, sans se tromper.",
  email: "contact@moustachemalin.fr", // confirmée par Romain le 30/10/2026 (boîte à créer au branchement du domaine)
};

// Comptes du site sur les réseaux : liens du pied de page et `sameAs` du schema Organization. TikTok reste masqué tant
// que NEXT_PUBLIC_TIKTOK_URL est vide (variables d'environnement Netlify).
export const RESEAUX = [
  { nom: "Pinterest", url: "https://www.pinterest.fr/moustachemalin/" },
  { nom: "TikTok", url: process.env.NEXT_PUBLIC_TIKTOK_URL || "" },
].filter((r) => r.url) as { nom: "Pinterest" | "TikTok"; url: string }[];

// Logo carré pour les données structurées (Organization, éditeur des articles) : Google demande une image matricielle.
export const LOGO = { src: "/brand/icon-512.png", width: 512, height: 512 };

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
  photo: "/media/kira/kira-tete-yeux-bleus.jpg", // photo personnelle de Romain : tête de kira-assise-yeux-bleus, 800 × 800
};

// Mentions légales. SIRET et adresse : fiche officielle du SIREN 944 980 580 (recherche-entreprises.api.gouv.fr),
// validés par Romain le 30/10/2026, sans le numéro d'appartement ; à changer après sa modification de micro-entreprise.
// Pas de numéro de téléphone (aucun fourni par Romain : ligne retirée).
// Hébergeur : adresse et contact vérifiés le 30 octobre 2026 sur netlify.com (politique de confidentialité et
// conditions d'utilisation) ; Netlify ne publie pas de numéro de téléphone.
export const LEGAL = {
  editeur: "Romain Cahagne",
  statut: "entrepreneur individuel (micro-entreprise)",
  adresse: "53 rue François-René de Chateaubriand, 44600 Saint-Nazaire",
  siret: "944 980 580 00012",
  directeurPublication: "Romain Cahagne",
  hebergeur: {
    nom: "Netlify, Inc.",
    adresse: "101 2nd Street, San Francisco, CA 94105, États-Unis",
    email: "support@netlify.com",
    site: "https://www.netlify.com",
  },
  miseAJour: "1er novembre 2026", // pages Méthode et Affiliation
  miseAJourMentions: "1er novembre 2026", // pages Mentions légales et Confidentialité
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

// Menu principal : après les rubriques, les pages à part (affichées seulement si leur page existe).
export const MENU_PLUS = [{ href: "/la-bande-de-kira/", label: "La bande de Kira" }];

export function menuEnLigne() {
  return [...rubriquesEnLigne(), ...MENU_PLUS.filter((p) => pageEnLigne(p.href))];
}

export const PAGES_INFO = [
  { href: "/a-propos/", label: "À propos" },
  { href: "/la-bande-de-kira/", label: "La bande de Kira" },
  { href: "/checklist-arrivee-chat/", label: "La checklist à imprimer" },
  { href: "/methode/", label: "Notre méthode" },
  { href: "/affiliation/", label: "Affiliation" },
  { href: "/mentions-legales/", label: "Mentions légales" },
  { href: "/confidentialite/", label: "Confidentialité" },
  { href: "/contact/", label: "Contact" },
];
