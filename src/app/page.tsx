import type { Metadata } from "next";
import { Comparaison } from "@/components/accueil/Comparaison";
import { DerniersArticles } from "@/components/accueil/DerniersArticles";
import { Desintegration } from "@/components/accueil/Desintegration";
import { Fin } from "@/components/accueil/Fin";
import { HeroAccueil } from "@/components/accueil/HeroAccueil";
import { Lettre } from "@/components/accueil/Lettre";
import { Mouvement } from "@/components/accueil/Mouvement";
import { Mur } from "@/components/accueil/Mur";
import { Pelote } from "@/components/accueil/Pelote";
import { QuiEcrit } from "@/components/accueil/QuiEcrit";
import { SelonMonChat } from "@/components/accueil/SelonMonChat";
import { Soucis } from "@/components/accueil/Soucis";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Accueil vitrine (brief-da-spectaculaire.md), sept scènes : gros plan sur un chat, photo qui se désintègre en
// particules, les petits soucis du quotidien, la pelote et les articles, le mur de photos et son compteur, la
// comparaison qui se construit ; puis les blocs de confiance (selon mon chat, derniers articles, qui écrit ici,
// transparence, lettre masquée tant qu'elle n'est pas branchée), légers et sans WebGL ; enfin la grande section de
// fin. Tout le texte est dans le HTML ; défilement fluide, particules et animations s'ajoutent après l'affichage.
export default function Home() {
  return (
    <>
      <HeroAccueil />
      <Desintegration />
      <Soucis />
      <Pelote />
      <Mur />
      <Comparaison />
      <SelonMonChat />
      <DerniersArticles />
      <QuiEcrit />
      <Lettre />
      <Fin />
      <Mouvement />
    </>
  );
}
