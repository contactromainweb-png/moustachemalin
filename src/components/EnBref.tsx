import { espacesFines } from "@/lib/typo";

// Encadré « En bref » en haut d'un article : 3 ou 4 phrases qui répondent directement à la question
// (frontmatter `enBref`). Dans le MDX : <EnBref points={frontmatter.enBref} />. Rien si la liste est vide.
export function EnBref({ points }: { points?: string[] }) {
  if (!points?.length) return null;
  return (
    <aside aria-labelledby="en-bref" className="mb-12 rounded-[1.5rem] border-2 border-lavande px-5 py-6 sm:px-8">
      <h2 id="en-bref" className="font-display text-[1.75rem]">
        En bref
      </h2>
      <ul className="mt-4 space-y-3">
        {points.map((p) => (
          <li key={p} className="flex max-w-[65ch] gap-3">
            <span aria-hidden="true" className="mt-[0.6em] size-2 shrink-0 rounded-full bg-accent" />
            <span>{espacesFines(p)}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
