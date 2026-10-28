import Link from "next/link";
import { AffiliateButton } from "@/components/AffiliateButton";
import { AmazonDisclosure } from "@/components/AmazonDisclosure";
import { getProduct } from "@/lib/products";
import { pageEnLigne } from "@/lib/site";
import { espacesFines } from "@/lib/typo";

type Props = { asin: string; comparatif: { href: string; titre: string } };

// Encadré produit des guides : un appareil, et le comparatif complet où il est expliqué
// (lien masqué tant que le comparatif n'est pas écrit).
export function ProductBox({ asin, comparatif }: Props) {
  const p = getProduct(asin);
  return (
    <aside aria-label={`Équipement : ${p.name}`} className="reveal my-12 bg-field px-5 py-6 sm:px-8">
      <p className="text-lead font-semibold">{p.name}</p>
      <p className="mt-2 max-w-[55ch]">{espacesFines(p.pour)}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <AffiliateButton asin={p.asin} emplacement="encadré" exemple={p.exemple} />
        {pageEnLigne(comparatif.href) ? (
          <Link href={comparatif.href} className="text-caramel underline decoration-2 underline-offset-4 hover:text-ink">
            {comparatif.titre}
          </Link>
        ) : null}
      </div>
      <AmazonDisclosure className="mt-4" />
    </aside>
  );
}
