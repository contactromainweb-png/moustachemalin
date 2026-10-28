import type { Metadata } from "next";
import { Desintegration } from "@/components/accueil/Desintegration";
import { HeroAccueil } from "@/components/accueil/HeroAccueil";
import { Mouvement } from "@/components/accueil/Mouvement";
import { Soucis } from "@/components/accueil/Soucis";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Accueil vitrine (brief-da-spectaculaire.md) : gros plan sur un chat, photo qui se désintègre en particules,
// puis les petits soucis du quotidien et leurs articles. Tout le texte est dans le HTML ; défilement fluide,
// particules et animations s'ajoutent après l'affichage. Lot 1 : scènes 1 à 3 ; les scènes 4 à 7 suivront.
export default function Home() {
  return (
    <>
      <HeroAccueil />
      <Desintegration />
      <Soucis />
      <Mouvement />
    </>
  );
}
