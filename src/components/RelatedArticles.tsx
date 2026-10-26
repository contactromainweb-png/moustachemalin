import Link from "next/link";

export type Related = { href: string; titre: string; description: string };

// Maillage interne : liens vers les guides et comparatifs liés, en bas d'article.
export function RelatedArticles({ articles, titre = "À lire aussi" }: { articles: Related[]; titre?: string }) {
  return (
    <section aria-labelledby="a-lire-aussi" className="reveal my-14">
      <h2 id="a-lire-aussi" className="font-display mb-8 text-head">
        {titre}
      </h2>
      <ul className="space-y-3">
        {articles.map((a) => (
          <li key={a.href}>
            <Link
              href={a.href}
              className="group block bg-field px-5 py-5 transition-colors hover:bg-caramel-field hover:text-on-caramel sm:px-8"
            >
              <span className="text-lead font-semibold underline-offset-4 group-hover:underline">{a.titre}</span>
              <span className="mt-1 block max-w-[60ch]">{a.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
