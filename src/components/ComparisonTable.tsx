import { AffiliateButton } from "@/components/AffiliateButton";
import { getProduct } from "@/lib/products";

// Tableau comparatif. Ordinateur : un vrai tableau. Téléphone : une carte par produit, empilées.
// `criteres` = les clés de "caracteristiques" à comparer, dans l'ordre voulu.
export function ComparisonTable({ asins, criteres }: { asins: string[]; criteres: string[] }) {
  const produits = asins.map(getProduct);

  return (
    <section aria-labelledby="tableau-comparatif" className="reveal my-14">
      <h2 id="tableau-comparatif" className="font-display mb-8 text-head">
        Le tableau comparatif
      </h2>

      <div className="hidden md:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Comparaison des caractéristiques</caption>
          <thead>
            <tr className="bg-ink text-paper">
              <th scope="col" className="px-4 py-3 font-medium">
                Modèle
              </th>
              {criteres.map((c) => (
                <th key={c} scope="col" className="px-4 py-3 font-medium">
                  {c}
                </th>
              ))}
              <th scope="col" className="px-4 py-3">
                <span className="sr-only">Lien Amazon</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {produits.map((p) => (
              <tr key={p.asin} className="even:bg-field">
                <th scope="row" className="px-4 py-4 font-semibold">
                  <a href={`#${p.asin}`} className="underline-offset-4 hover:underline">
                    {p.nom}
                  </a>
                </th>
                {criteres.map((c) => (
                  <td key={c} className="px-4 py-4">
                    {p.caracteristiques[c] ?? "non communiqué"}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <AffiliateButton asin={p.asin} exemple={p.exemple} label="Voir le prix" className="min-h-11 px-4" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {produits.map((p) => (
          <li key={p.asin} className="bg-field px-5 py-6">
            <h3 className="text-lead font-semibold">{p.nom}</h3>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              {criteres.map((c) => (
                <div key={c} className="contents">
                  <dt className="text-ink-soft">{c}</dt>
                  <dd>{p.caracteristiques[c] ?? "non communiqué"}</dd>
                </div>
              ))}
            </dl>
            <AffiliateButton asin={p.asin} exemple={p.exemple} className="mt-5 w-full" />
          </li>
        ))}
      </ul>
    </section>
  );
}
