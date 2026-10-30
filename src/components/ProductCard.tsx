import { AffiliateButton, LienAvisAmazon } from "@/components/AffiliateButton";
import { AmazonDisclosure } from "@/components/AmazonDisclosure";
import { AmazonLivePrice } from "@/components/AmazonLivePrice";
import { ProductVisual } from "@/components/ProductVisual";
import { ProsCons } from "@/components/ProsCons";
import { getProduct } from "@/lib/products";
import { espacesFines } from "@/lib/typo";

// Fiche détaillée d'un produit, appelée par son ASIN : <ProductCard asin="B0..." />
// Le titre (### Nom : rôle) est écrit dans l'article, juste au-dessus. Sans ce titre (fiche placée directement sous
// un titre ##, comme dans un avis), niveau={3} garde une hiérarchie de titres sans saut.
export function ProductCard({ asin, niveau = 4 }: { asin: string; niveau?: 3 | 4 }) {
  const p = getProduct(asin);
  const Titre = niveau === 3 ? "h3" : "h4";
  return (
    <section id={p.asin} aria-label={`Fiche : ${p.name}`} className="reveal mb-10 mt-6 scroll-mt-8">
      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-10">
        <ProductVisual nom={p.name} marque={p.brand} />
        <div className="flex flex-col justify-between gap-6">
          <p>
            <strong className="font-semibold">Pour qui&#8239;:</strong> {espacesFines(p.pour)}
          </p>
          <div>
            <AmazonLivePrice asin={p.asin} />
            <AffiliateButton asin={p.asin} emplacement="fiche" exemple={p.exemple} />
            {p.exemple ? null : <LienAvisAmazon asin={p.asin} className="mt-2" />}
            <AmazonDisclosure className="mt-3 max-w-[50ch]" />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ProsCons pros={p.pros} cons={p.cons} niveau={niveau} />
      </div>

      <div className="mt-8 grid gap-8 bg-field px-5 py-6 sm:grid-cols-2 sm:px-8">
        <div>
          <Titre className="font-semibold">Entretien</Titre>
          <p className="mt-2">{espacesFines(p.entretien)}</p>
        </div>
        <div>
          <Titre className="font-semibold">Consommables à racheter</Titre>
          <ul className="mt-2 space-y-1">
            {p.consommables.map((c) => (
              <li key={c}>{espacesFines(c)}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-3 text-small text-ink-soft">Source&#8239;: {espacesFines(p.source)}</p>
    </section>
  );
}
