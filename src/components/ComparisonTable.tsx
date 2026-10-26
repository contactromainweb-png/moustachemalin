import { AffiliateButton } from "@/components/AffiliateButton";
import { AmazonDisclosure } from "@/components/AmazonDisclosure";
import { getProduct, specLabel } from "@/lib/products";
import { espacesFines } from "@/lib/typo";

// Tableau comparatif. Ordinateur : un vrai tableau. Téléphone : une carte par produit, empilées.
// `columns` = les clés de "specs" à comparer, dans l'ordre voulu. Le titre est écrit dans l'article.
export function ComparisonTable({ asins, columns }: { asins: string[]; columns: string[] }) {
  const produits = asins.map(getProduct);
  const valeur = (specs: Record<string, string>, cle: string) => espacesFines(specs[cle] ?? "Non communiqué");

  return (
    <section id="tableau-comparatif" aria-label="Tableau comparatif" className="reveal mb-14 mt-8">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Comparaison des caractéristiques</caption>
          <thead>
            <tr className="bg-ink text-paper">
              <th scope="col" className="px-4 py-3 font-medium">
                Modèle
              </th>
              {columns.map((c) => (
                <th key={c} scope="col" className="px-4 py-3 font-medium">
                  {specLabel(c)}
                </th>
              ))}
              <th scope="col" className="px-4 py-3">
                <span className="sr-only">Lien Amazon</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {produits.map((p) => (
              <tr key={p.asin} className="align-top even:bg-field">
                <th scope="row" className="px-4 py-4 font-semibold">
                  <a href={`#${p.asin}`} className="underline-offset-4 hover:underline">
                    {p.name}
                  </a>
                </th>
                {columns.map((c) => (
                  <td key={c} className={`px-4 py-4 ${p.specs[c] ? "" : "text-ink-soft"}`}>
                    {valeur(p.specs, c)}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <AffiliateButton
                    asin={p.asin}
                    exemple={p.exemple}
                    label="Voir le prix"
                    className="min-h-11 whitespace-nowrap px-4"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {produits.map((p) => (
          <li key={p.asin} className="bg-field px-5 py-6">
            <h3 className="text-lead font-semibold">{p.name}</h3>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              {columns.map((c) => (
                <div key={c} className="contents">
                  <dt className="text-ink-soft">{specLabel(c)}</dt>
                  <dd className={p.specs[c] ? "" : "text-ink-soft"}>{valeur(p.specs, c)}</dd>
                </div>
              ))}
            </dl>
            <AffiliateButton asin={p.asin} exemple={p.exemple} className="mt-5 w-full" />
          </li>
        ))}
      </ul>
      <AmazonDisclosure className="mt-4" />
    </section>
  );
}
