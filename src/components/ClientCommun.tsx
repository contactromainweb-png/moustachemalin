"use client";

// Point d'entrée client commun à toutes les pages (pack 9), importé par l'en-tête et le logo, déjà chargés partout.
// Le symbole du logo y passe (composant client) : ses tracés ne sont plus recopiés dans les données React de chaque page.
export { MenuTelephone } from "@/components/MenuTelephone";
export { SymboleLogo } from "@/components/SymboleLogo";
