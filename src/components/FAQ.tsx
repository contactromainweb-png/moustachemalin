import { JsonLd } from "@/components/JsonLd";
import { espacesFines } from "@/lib/typo";

export type Question = { q: string; a: string };

// Questions fréquentes en accordéon (fonctionne sans JavaScript) + schema FAQPage pour Google.
export function FAQ({ items, titre = "Questions fréquentes" }: { items: Question[]; titre?: string }) {
  return (
    <section aria-labelledby="faq" className="reveal my-14">
      <h2 id="faq" className="font-display mb-8 text-head">
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
            <p className="max-w-[65ch] px-5 pb-6 sm:px-8">{espacesFines(a)}</p>
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
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }}
      />
    </section>
  );
}
