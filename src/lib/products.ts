import fs from "node:fs";
import path from "node:path";

// Un produit = un fichier content/products/<nom>.json. Les articles l'appellent par son ASIN :
// changer un lien ou une info dans le fichier la change partout sur le site.
export type Product = {
  asin: string; // identifiant Amazon (10 caractères)
  nom: string;
  marque: string;
  categorie: string; // ex. "litiere-autonettoyante"
  resume: string; // une phrase
  pourQui: string;
  caracteristiques: Record<string, string>; // ex. { "Bac": "9 L", "Bruit": "faible" }
  pointsForts: string[];
  pointsFaibles: string[];
  entretien: string;
  consommables: { nom: string; frequence: string }[];
  exemple?: boolean; // true = produit fictif, jamais relié à Amazon
};

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
