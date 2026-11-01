import { CalculAutonomie, type Distributeur } from "@/components/outils/CalculAutonomie";
import { nombres } from "@/lib/filtres";
import { produitsDeCategorie } from "@/lib/products";

// Partie serveur du calculateur d'autonomie : la liste des distributeurs du comparatif et la contenance de leur
// réservoir, lue dans leur fiche (content/products/). Un modèle dont la fiche ne donne pas la contenance du seul
// réservoir à croquettes (par exemple un total croquettes + eau) n'est pas proposé.
export function AutonomieDistributeur() {
  const distributeurs: Distributeur[] = produitsDeCategorie("distributeur-croquettes-chat").flatMap((p) => {
    const capacite = p.specs.capacite;
    const [litres] = nombres(capacite?.split("(")[0]);
    if (!litres || /au total/i.test(capacite)) return [];
    return [{ asin: p.asin, nom: p.name, litres }];
  });
  return <CalculAutonomie distributeurs={distributeurs} />;
}
