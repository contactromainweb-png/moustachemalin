import type { Metadata } from "next";
import { CarnetChat, TitreCarnet } from "@/components/carnet/CarnetChat";
import type { IndexArticles } from "@/lib/badges";
import { produitsDeCategorie } from "@/lib/products";
import { tousLesArticles } from "@/lib/rubriques";

// Le carnet du chat (pack 8b) : tout est lu et écrit dans le navigateur du visiteur (src/lib/carnet.ts), rien n'en
// sort. Page cachée aux moteurs, hors du plan du site, hors flux, sans épingle, sans lien Amazon.
export const metadata: Metadata = {
  title: "Le carnet de ton chat",
  description: "Le carnet de ton chat : son équipement, tes listes et ce que tu as lu, gardés dans ton navigateur.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/carnet/" },
};

export default function Page() {
  // Pour les badges : le type et la rubrique de chaque article en ligne, par slug.
  const articles: IndexArticles = Object.fromEntries(
    tousLesArticles().map((a) => {
      const [rubrique, slug] = a.href.split("/").filter(Boolean);
      return [slug, { type: a.type, rubrique }];
    }),
  );
  // Pour la ligne « Distributeur : … » des valeurs retenues : le nom des modèles du comparatif.
  const distributeurs = Object.fromEntries(produitsDeCategorie("distributeur-croquettes-chat").map((p) => [p.asin, p.name]));

  return (
    <div className="mx-auto max-w-[90rem] px-4 pb-24 pt-12 sm:px-8 sm:pt-20">
      <TitreCarnet />
      {/* Hauteur réservée : la version avec profil remplace celle du rendu serveur sans faire bouger le pied de page. */}
      <div className="mt-8 min-h-[60rem] lg:mt-10 lg:min-h-[52rem]">
        <CarnetChat articles={articles} distributeurs={distributeurs} />
      </div>
    </div>
  );
}
