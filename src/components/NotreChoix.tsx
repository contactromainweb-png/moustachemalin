import { AffiliateButton, LienAvisAmazon } from "@/components/AffiliateButton";
import { AmazonDisclosure } from "@/components/AmazonDisclosure";
import { getProduct } from "@/lib/products";
import { espacesFines } from "@/lib/typo";

// Encadré compact d'un guide problème (CLAUDE.md §5) : 1 ou 2 produits de son comparatif pilier, dans le style de
// TopPicks, sur fond clair (il suit souvent un CalloutLink caramel). Nom, « Pour qui » (champ `pour` du JSON
// produit), bouton Amazon et lien vers les avis clients ; aucun prix, aucune note. Un ASIN absent de
// content/products/ fait échouer le build (getProduct).
export function NotreChoix({
  asins,
  titre = "Notre choix pour régler ce problème",
}: {
  asins: string[];
  titre?: string;
}) {
  if (asins.length === 0 || asins.length > 2) throw new Error("NotreChoix : 1 ou 2 produits");
  const produits = asins.map((asin) => ({ asin, produit: getProduct(asin) }));

  return (
    <section aria-label={espacesFines(titre)} className="reveal my-12">
      <div className="bg-field px-5 py-7 sm:px-8">
        <p className="font-display text-head">{espacesFines(titre)}</p>
        <ul className={`mt-6 grid gap-6 ${produits.length > 1 ? "lg:grid-cols-2" : ""}`}>
          {produits.map(({ asin, produit }) => (
            <li key={asin} className="flex flex-col justify-between gap-5">
              <div>
                <p className="text-lead font-semibold">{produit.name}</p>
                <p className="mt-2 max-w-[48ch] text-ink-soft">
                  <span className="font-medium">Pour qui&#8239;: </span>
                  {espacesFines(produit.pour)}
                </p>
              </div>
              <div>
                <AffiliateButton emplacement="notre-choix" asin={asin} exemple={produit.exemple} />
                {produit.exemple ? null : <LienAvisAmazon asin={asin} className="text-small" />}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <AmazonDisclosure className="mt-4" />
    </section>
  );
}
