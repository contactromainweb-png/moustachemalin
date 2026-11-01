import { getProduct } from "@/lib/products";
import { espacesFines } from "@/lib/typo";

// « Consommables à prévoir » dans un comparatif : pour chaque modèle, ce qu'il faudra racheter (d'après sa fiche
// produit, content/products) et un lien vers sa fiche, où se trouve le bouton Amazon. Aucun prix, aucun nouveau lien
// affilié ici. Dans le MDX : <Consommables asins={frontmatter.products} />
export function Consommables({ asins }: { asins: string[] }) {
  const produits = asins.map(getProduct);
  const aucun = produits.every((p) => p.consommables.length === 0);

  return (
    <section aria-labelledby="consommables" className="reveal my-14">
      <h2 id="consommables" className="font-display mb-6 scroll-mt-20 text-head">
        Consommables à prévoir
      </h2>
      {aucun ? (
        <p>
          {espacesFines(
            "D'après les fiches des fabricants, aucun de ces modèles ne demande de consommable à racheter. Il suffit de les entretenir comme indiqué sur chaque fiche.",
          )}
        </p>
      ) : (
        <>
          <p className="mb-6 max-w-[60ch]">
            {espacesFines(
              "Le prix d'achat ne dit pas tout : voici ce qu'il faudra racheter avec chaque modèle, d'après les fiches des fabricants. « Voir la fiche » vous ramène au modèle et à son bouton Amazon.",
            )}
          </p>
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {produits.map((p) => (
              <li key={p.asin} className="grid gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] sm:items-baseline sm:gap-6">
                <span className="font-semibold">{espacesFines(p.name)}</span>
                <span>{p.consommables.length ? espacesFines(p.consommables.join(", ")) : "Aucun consommable annoncé"}</span>
                <a href={`#${p.asin}`} className="font-medium underline decoration-2 underline-offset-[6px]">
                  Voir la fiche
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
