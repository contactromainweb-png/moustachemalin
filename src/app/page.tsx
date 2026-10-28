import type { Metadata } from "next";
import { HeroAccueil } from "@/components/accueil/HeroAccueil";
import { Mouvement } from "@/components/accueil/Mouvement";
import { Soucis } from "@/components/accueil/Soucis";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Accueil vitrine : un vrai chat en plein écran, puis les petits soucis du quotidien et leurs articles.
// Tout le texte est dans le HTML ; vidéo, défilement fluide et animations s'ajoutent après l'affichage.
// Refonte en cours (refonte-design.md) : sections 3 à 6 à venir après validation de ces deux premières.
export default function Home() {
  return (
    <>
      <HeroAccueil />
      <Soucis />
      <Mouvement />
    </>
  );
}
