import Link from "next/link";

// Encadré obligatoire en haut de chaque comparatif (section 2 du cahier des charges).
// Par défaut : le comparatif repose sur les fiches techniques des fabricants.
// `retoursAnalyses` : à ajouter seulement si des retours d'acheteurs ont vraiment été analysés.
// La mention Amazon est placée à part dans l'article (<AmazonDisclosure />).
export function MethodNote({ retoursAnalyses = false }: { retoursAnalyses?: boolean }) {
  return (
    <aside aria-label="Notre méthode" className="mb-4 bg-field px-5 py-6 sm:px-8">
      <p className="max-w-[70ch]">
        Nous n&apos;avons pas testé physiquement ces produits&#8239;: ce comparatif repose sur les fiches techniques
        des fabricants{retoursAnalyses ? ", complétées par l’analyse des retours d’acheteurs" : ""}.{" "}
        <Link href="/methode/" className="text-caramel underline decoration-2 underline-offset-4 hover:text-ink">
          Comment nous comparons
        </Link>
      </p>
    </aside>
  );
}
