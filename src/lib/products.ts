import fs from "node:fs";
import path from "node:path";

// Un produit = un fichier content/products/<slug>.json. Les articles l'appellent par son ASIN :
// changer un lien ou une info dans le fichier la change partout sur le site.
export type Product = {
  asin: string; // identifiant Amazon (10 caractères)
  slug: string;
  name: string;
  brand: string;
  category: string; // ex. "litiere-autonettoyante"
  badge?: string; // ex. "Le meilleur globalement"
  specs: Record<string, string>; // clés libellées dans SPEC_LABELS
  pour: string; // pour qui
  pros: string[];
  cons: string[];
  entretien: string;
  consommables: string[];
  source: string; // d'où viennent les informations, avec la date de consultation
  exemple?: boolean; // true = produit fictif, jamais relié à Amazon
};

// Libellés affichés pour chaque clé de "specs". Une clé absente d'ici s'affiche telle quelle.
export const SPEC_LABELS: Record<string, string> = {
  type: "Type",
  volumeInterieur: "Volume intérieur",
  chambreLitiere: "Chambre à litière",
  bacDechets: "Bac à déchets",
  poidsChat: "Poids du chat",
  hauteurEntree: "Hauteur d'entrée",
  ouverture: "Ouverture",
  capteurs: "Capteurs",
  modes: "Modes",
  bruit: "Bruit",
  litiere: "Litière acceptée",
  wifi: "Wi-Fi",
  application: "Application",
  montage: "Montage",
  garantie: "Garantie",
  // Fontaines
  capacite: "Capacité",
  materiau: "Matériau",
  filtration: "Filtration",
  debit: "Débit",
  alimentation: "Alimentation",
  indicateurs: "Indicateurs",
  securite: "Sécurité",
  pompe: "Pompe",
};

export function specLabel(cle: string) {
  return SPEC_LABELS[cle] ?? cle;
}

const DOSSIER = path.join(process.cwd(), "content/products");

let cache: Map<string, Product> | null = null;

function tousLesProduits(): Map<string, Product> {
  if (cache) return cache;
  cache = new Map();
  for (const fichier of fs.readdirSync(DOSSIER)) {
    if (!fichier.endsWith(".json")) continue;
    const produit = JSON.parse(fs.readFileSync(path.join(DOSSIER, fichier), "utf8")) as Product;
    if (cache.has(produit.asin)) {
      throw new Error(`ASIN ${produit.asin} présent deux fois (dont ${fichier})`);
    }
    cache.set(produit.asin, produit);
  }
  return cache;
}

// Erreur au build si un article appelle un ASIN inconnu : mieux vaut un build cassé qu'un lien mort.
export function getProduct(asin: string): Product {
  const produit = tousLesProduits().get(asin);
  if (!produit) throw new Error(`Produit introuvable pour l'ASIN ${asin} (content/products/)`);
  return produit;
}
