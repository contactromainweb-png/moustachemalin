"use client";

// Point d'entrée client commun à toutes les pages (pack 9). La page 404 (not-found.tsx) fait partie du layout racine :
// ses composants client sont téléchargés avec chaque page du site, et chaque nouveau composant client à cet endroit
// créait un fichier JavaScript de plus (7 Ko, avec une copie de next/image) sur l'accueil et les articles. En passant
// par ce même module que le menu de l'en-tête, déjà chargé partout, le mini-jeu n'ajoute que son petit enveloppeur.
// Le symbole du logo y passe aussi (composant client) : ses tracés ne sont plus recopiés dans les données React.
export { JeuBalleDiffere } from "@/components/JeuBalleDiffere";
export { MenuTelephone } from "@/components/MenuTelephone";
export { SymboleLogo } from "@/components/SymboleLogo";
