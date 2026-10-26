import Link from "next/link";
import { pageEnLigne } from "@/lib/site";
import { espacesFines } from "@/lib/typo";

type Props = { href: string; title: string; text: string };

// Encadré qui renvoie vers un autre article (souvent le comparatif adapté).
// Masqué tant que la page visée n'est pas écrite.
export function CalloutLink({ href, title, text }: Props) {
  if (!pageEnLigne(href)) return null;
  return (
    <aside className="reveal my-12">
      <Link
        href={href}
        className="group block bg-caramel-field px-5 py-7 text-on-caramel transition-transform hover:-translate-y-0.5 sm:px-8"
      >
        <span className="block font-display text-head">{espacesFines(title)}</span>
        <span className="mt-3 block max-w-[55ch]">{espacesFines(text)}</span>
        <span className="mt-5 inline-block font-medium underline underline-offset-4">Lire l&apos;article</span>
      </Link>
    </aside>
  );
}
