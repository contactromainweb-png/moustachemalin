import Link from "next/link";
import { Portrait } from "@/components/KiraNote";
import { tousLesArticles } from "@/lib/rubriques";
import { pageEnLigne } from "@/lib/site";
import { espacesFines } from "@/lib/typo";

// Page 404 : Kira prend la parole (charte « La voix de Kira », CLAUDE.md section 11), puis les pages toujours en
// place : l'accueil, chaque comparatif en ligne et les guides.
export default function NotFound() {
  const liens = [
    { href: "/", label: "Accueil" },
    ...tousLesArticles()
      .filter((a) => a.type === "comparatif")
      .map((a) => ({ href: a.href, label: a.titre.split(" : ")[0] })),
    { href: "/guides/", label: "Les guides" },
  ].filter((l) => pageEnLigne(l.href));

  return (
    <div className="mx-auto max-w-[90rem] px-4 pb-24 pt-16 sm:px-8 sm:pt-28">
      <Portrait taille="size-20 sm:size-24" prioritaire />
      <h1 className="font-display mt-8 max-w-[16ch] text-display">
        Kira est passée <span className="mot-serif">par là</span>
      </h1>
      <p className="mt-8 max-w-[52ch] text-lead">
        {espacesFines(
          "Cette page a disparu. On soupçonne Kira de l'avoir prise pour un de ses jouets… et pour une fois, elle ne l'a pas rapportée. Pendant qu'on négocie, voici ce qui est toujours en place :",
        )}
      </p>
      <ul className="mt-10 flex flex-wrap gap-3">
        {liens.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="inline-flex min-h-12 items-center bg-caramel-field px-6 text-on-caramel transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {espacesFines(l.label)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
