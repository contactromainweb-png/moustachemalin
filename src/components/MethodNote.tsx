import Link from "next/link";
import { AmazonDisclosure } from "@/components/AmazonDisclosure";

// Encadré obligatoire en haut de chaque comparatif (section 2 du cahier des charges).
export function MethodNote() {
  return (
    <aside aria-label="Notre méthode" className="bg-field px-5 py-6 sm:px-8">
      <p>
        Nous n&apos;avons pas testé physiquement ces produits&#8239;: cette sélection repose sur l&apos;analyse des
        caractéristiques et des retours d&apos;acheteurs.{" "}
        <Link href="/methode/" className="text-caramel underline decoration-2 underline-offset-4 hover:text-ink">
          Comment nous comparons
        </Link>
      </p>
      <AmazonDisclosure className="mt-3" />
    </aside>
  );
}
