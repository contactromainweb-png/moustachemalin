import Link from "next/link";

// Encadré obligatoire en haut de chaque comparatif (section 2 du cahier des charges).
// Par défaut : le comparatif repose sur les fiches techniques des fabricants.
// `avis` : sur une page avis (un seul produit), « cet avis repose sur… » ; `duel` : sur une page duel (deux produits
// face à face), « cette comparaison repose sur… » (les deux vérifiés au build : scripts/controle-titres.mjs).
// `retoursAnalyses` : à ajouter seulement si des retours d'acheteurs ont vraiment été analysés.
// La mention Amazon est placée à part dans l'article (<AmazonDisclosure />).
export function MethodNote({
  avis = false,
  duel = false,
  retoursAnalyses = false,
}: {
  avis?: boolean;
  duel?: boolean;
  retoursAnalyses?: boolean;
}) {
  const sujet = duel ? "cette comparaison" : avis ? "cet avis" : "ce comparatif";
  return (
    <aside aria-label="Notre méthode" className="mb-4 bg-field px-5 py-6 sm:px-8">
      <p className="max-w-[70ch]">
        Nous n&apos;avons pas testé physiquement ces produits&#8239;: {sujet} repose sur les fiches techniques des
        fabricants{retoursAnalyses ? ", complétées par l’analyse des retours d’acheteurs" : ""}.{" "}
        <Link href="/methode/" className="text-caramel underline decoration-2 underline-offset-4 hover:text-ink">
          Comment nous comparons
        </Link>
      </p>
    </aside>
  );
}
