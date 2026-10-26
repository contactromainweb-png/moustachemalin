import { AffiliateButton } from "@/components/AffiliateButton";
import { AmazonDisclosure } from "@/components/AmazonDisclosure";
import { getProduct } from "@/lib/products";

type Pick = { asin: string; label: string };

// Résumé rapide : 3 choix maximum. Le premier est mis en avant, les deux autres à côté.
export function TopPicks({ picks }: { picks: Pick[] }) {
  if (picks.length === 0 || picks.length > 3) throw new Error("TopPicks : entre 1 et 3 choix");
  const [premier, ...autres] = picks.map((pick) => ({ ...pick, produit: getProduct(pick.asin) }));

  return (
    <section aria-labelledby="resume-rapide" className="reveal my-14">
      <h2 id="resume-rapide" className="font-display mb-8 text-head">
        Le résumé rapide
      </h2>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="flex flex-col justify-between gap-8 bg-caramel-field px-5 py-8 text-on-caramel sm:px-8">
          <div>
            <h3 className="font-display text-head">{premier.label}</h3>
            <p className="mt-4 text-lead">{premier.produit.nom}</p>
            <p className="mt-2 max-w-[48ch] opacity-90">{premier.produit.resume}</p>
          </div>
          <div>
            <AffiliateButton asin={premier.asin} exemple={premier.produit.exemple} />
            <a href={`#${premier.asin}`} className="mt-4 block underline underline-offset-4">
              Lire la fiche détaillée
            </a>
          </div>
        </div>
        {autres.length > 0 ? (
          <div className="grid gap-3">
            {autres.map((pick) => (
              <div key={pick.asin} className="flex flex-col justify-between gap-6 bg-field px-5 py-6 sm:px-8">
                <div>
                  <h3 className="text-lead font-semibold">{pick.label}</h3>
                  <p className="mt-1">{pick.produit.nom}</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <AffiliateButton asin={pick.asin} exemple={pick.produit.exemple} />
                  <a href={`#${pick.asin}`} className="underline underline-offset-4">
                    La fiche
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <AmazonDisclosure className="mt-4" />
    </section>
  );
}
