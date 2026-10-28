import Link from "next/link";
import { pageEnLigne } from "@/lib/site";
import { espacesFines } from "@/lib/typo";

export type Related = { href: string; label: string };

// Maillage interne en bas d'article. Les pages pas encore écrites sont masquées ;
// si aucune n'existe, toute la section (titre compris) disparaît.
export function RelatedArticles({
  links,
  titre = "À lire aussi",
  id = "a-lire-aussi",
}: {
  links: Related[];
  titre?: string;
  id?: string;
}) {
  const enLigne = links.filter((l) => pageEnLigne(l.href));
  if (enLigne.length === 0) return null;

  return (
    <section aria-labelledby={id} className="reveal my-14">
      <h2 id={id} className="font-display mb-8 text-head">
        {titre}
      </h2>
      <ul className="space-y-3">
        {enLigne.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="block bg-field px-5 py-5 text-lead font-semibold underline-offset-4 transition-colors hover:bg-caramel-field hover:text-on-caramel hover:underline sm:px-8"
            >
              {espacesFines(l.label)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
