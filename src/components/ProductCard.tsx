import { AffiliateButton } from "@/components/AffiliateButton";
import { AmazonDisclosure } from "@/components/AmazonDisclosure";
import { AmazonLivePrice } from "@/components/AmazonLivePrice";
import { ProductVisual } from "@/components/ProductVisual";
import { ProsCons } from "@/components/ProsCons";
import { getProduct } from "@/lib/products";

// Fiche détaillée d'un produit, appelée par son ASIN depuis un article MDX : <ProductCard asin="B0..." />
export function ProductCard({ asin }: { asin: string }) {
  const p = getProduct(asin);
  return (
    <section id={p.asin} aria-labelledby={`titre-${p.asin}`} className="reveal mt-20 scroll-mt-8">
      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-10">
        <ProductVisual nom={p.nom} marque={p.marque} />
        <div>
          <h3 id={`titre-${p.asin}`} className="font-display text-head">
            {p.nom}
          </h3>
          <p className="mt-3">{p.resume}</p>
          <p className="mt-4">
            <strong className="font-semibold">Pour qui&#8239;:</strong> {p.pourQui}
          </p>
          <AmazonLivePrice asin={p.asin} />
          <AffiliateButton asin={p.asin} exemple={p.exemple} className="mt-6" />
          <AmazonDisclosure className="mt-3 max-w-[50ch]" />
        </div>
      </div>

      <div className="mt-10">
        <ProsCons pros={p.pointsForts} cons={p.pointsFaibles} />
      </div>

      <div className="mt-10 grid gap-8 bg-field px-5 py-6 sm:grid-cols-2 sm:px-8">
        <div>
          <h4 className="font-semibold">Entretien</h4>
          <p className="mt-2">{p.entretien}</p>
        </div>
        <div>
          <h4 className="font-semibold">Consommables à racheter</h4>
          <ul className="mt-2 space-y-1">
            {p.consommables.map((c) => (
              <li key={c.nom}>
                {c.nom} <span className="text-ink-soft">({c.frequence})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
