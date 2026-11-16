import Link from "next/link";
import { Fragment } from "react";
import { JsonLd } from "@/components/JsonLd";
import { pageEnLigne } from "@/lib/site";
import { espacesFines } from "@/lib/typo";

export type Question = { q: string; a: string };

// Liens internes dans une réponse, écrits comme en Markdown : [texte](/chemin/). Sur la page, un vrai lien (même
// style que les liens des articles ; texte seul si la page n'est pas encore en ligne) ; dans le schema FAQPage, le
// texte seul.
const LIEN = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;
const sansLiens = (a: string) => a.replace(LIEN, "$1");

function reponse(a: string) {
  const morceaux = a.split(LIEN);
  if (morceaux.length === 1) return espacesFines(a);
  // split avec 2 groupes : texte, libellé, chemin, texte, libellé, chemin…, texte
  return morceaux.map((m, i) => {
    if (i % 3 === 0) return <Fragment key={i}>{espacesFines(m)}</Fragment>;
    if (i % 3 === 2) return null;
    const href = morceaux[i + 1];
    if (!pageEnLigne(href)) return <Fragment key={i}>{espacesFines(m)}</Fragment>;
    return (
      <Link
        key={i}
        href={href}
        className="text-caramel underline decoration-2 underline-offset-4 transition-colors hover:text-ink"
      >
        {espacesFines(m)}
      </Link>
    );
  });
}

// Questions fréquentes en accordéon (fonctionne sans JavaScript) + schema FAQPage pour Google.
export function FAQ({ items, titre = "Questions fréquentes" }: { items: Question[]; titre?: string }) {
  return (
    <section aria-labelledby="faq" className="reveal my-14">
      <h2 id="faq" className="font-display mb-8 scroll-mt-20 text-head">
        {titre}
      </h2>
      <div className="space-y-3">
        {items.map(({ q, a }) => (
          <details key={q} className="group bg-field">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 px-5 py-4 text-lead sm:px-8 [&::-webkit-details-marker]:hidden">
              {espacesFines(q)}
              <span
                aria-hidden="true"
                className="size-3 shrink-0 -translate-y-1 rotate-45 border-b-2 border-r-2 border-current transition-transform group-open:translate-y-0.5 group-open:-rotate-135"
              />
            </summary>
            <p className="max-w-[65ch] px-5 pb-6 sm:px-8">{reponse(a)}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: sansLiens(a) },
          })),
        }}
      />
    </section>
  );
}
