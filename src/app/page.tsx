import type { Metadata } from "next";
import { Chapitres } from "@/components/accueil/Chapitres";
import { DejaCompare } from "@/components/accueil/DejaCompare";
import { HeroAccueil } from "@/components/accueil/HeroAccueil";
import { MethodeDiagonale } from "@/components/accueil/MethodeDiagonale";
import { Mouvement } from "@/components/accueil/Mouvement";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Accueil vitrine « À hauteur de moustaches » : l'appartement vu à hauteur de chat.
// Tout le texte est dans le HTML ; vidéo, 3D et défilement fluide s'ajoutent ensuite, sur ordinateur seulement.
export default function Home() {
  return (
    <>
      <HeroAccueil />
      <Chapitres />
      <DejaCompare />
      <MethodeDiagonale />
      <Mouvement />
    </>
  );
}
