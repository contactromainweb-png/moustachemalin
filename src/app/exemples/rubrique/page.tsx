import type { Metadata } from "next";
import { RubriqueTemplate } from "@/components/RubriqueTemplate";

// Page d'exemple du modèle de rubrique, cachée aux moteurs de recherche et absente du menu.
export const metadata: Metadata = {
  title: "Exemple de rubrique",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <RubriqueTemplate
      titre="Exemples"
      intro="Cette rubrique d'exemple montre le modèle de page qui accueillera les comparatifs et les guides de chaque catégorie."
      articles={[
        {
          href: "/exemples/comparatif/",
          titre: "Exemple de comparatif",
          description: "Résumé rapide, tableau, fiches détaillées, guide d'achat et questions fréquentes.",
          type: "comparatif",
        },
        {
          href: "/exemples/guide/",
          titre: "Exemple de guide",
          description: "Une question, des réponses rassurantes, l'encadré vétérinaire et un encadré produit.",
          type: "guide",
        },
      ]}
    />
  );
}
