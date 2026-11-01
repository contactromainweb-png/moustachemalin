import Link from "next/link";
import { AspectBouton } from "@/components/BoutonAction";
import type { ArticleLien } from "@/components/RubriqueTemplate";
import { TitreSerif } from "@/components/TitreSerif";
import { pageEnLigne } from "@/lib/site";
import { espacesFines } from "@/lib/typo";

// Icône de chaque outil (slug de sa page), au trait, sur une grille de 24 px comme celles de l'accueil.
const ICONES: Record<string, React.ReactNode> = {
  "combien-eau-chat": (
    <>
      <path d="M12 3.5c3.2 4 5.5 7.2 5.5 10.2a5.5 5.5 0 0 1-11 0c0-3 2.3-6.2 5.5-10.2Z" />
      <path d="M9.4 14.2a2.7 2.7 0 0 0 2.6 2.6" />
    </>
  ),
  // Un calendrier : combien de jours tient le réservoir.
  "autonomie-distributeur-croquettes": (
    <>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
      <path d="M8 3.5v4M16 3.5v4M4 10h16M8.5 14h.01M12 14h.01M15.5 14h.01M8.5 17h.01M12 17h.01" />
    </>
  ),
  // Une pièce marquée de l'euro : le coût réel.
  "cout-litiere-autonettoyante": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15 8.6a4 4 0 1 0 0 6.8M7.5 11h5.5M7.5 13.2h5" />
    </>
  ),
  // Deux bacs à litière vus de face : le nombre de bacs.
  "combien-de-litieres": (
    <>
      <path d="M2.5 11.5h8.5l-1.2 6H3.7l-1.2-6Z" />
      <path d="M13 11.5h8.5l-1.2 6h-6.1l-1.2-6Z" />
      <path d="M5 9c.8-.7 2.2-.7 3 0M15.5 9c.8-.7 2.2-.7 3 0" />
    </>
  ),
};

// Icône générique : une calculatrice.
const CALCULATRICE = (
  <>
    <rect x="5.5" y="3.5" width="13" height="17" rx="2" />
    <path d="M8.5 7.5h7M9 12h.01M12 12h.01M15 12h.01M9 15.5h.01M12 15.5h.01M15 15.5h.01" />
  </>
);

export function IconeOutil({ slug, className = "size-8" }: { slug: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {ICONES[slug] ?? CALCULATRICE}
    </svg>
  );
}

const slugDe = (href: string) => href.split("/").filter(Boolean).pop() ?? "";

// Page /outils/ : une grande carte par outil, cliquable en entière, avec son icône, son titre, une phrase et un vrai
// bouton orange. Une colonne sur téléphone, deux sur ordinateur.
export function CartesOutils({ articles }: { articles: ArticleLien[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {articles.map((a) => (
        <li key={a.href} className="reveal">
          <Link
            href={a.href}
            className="group flex h-full flex-col rounded-[1.75rem] bg-lavande px-6 pb-7 pt-6 text-nuit transition-transform duration-200 ease-[var(--ease-out)] active:scale-[0.99] sm:px-8"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-blanc">
              <IconeOutil slug={slugDe(a.href)} />
            </span>
            <span className="mt-6 block font-display text-[1.75rem] leading-tight">
              <TitreSerif titre={a.titre} mot={a.motSerif} />
            </span>
            <span className="mt-3 block">{espacesFines(a.description)}</span>
            <span className="mt-auto pt-7">
              <AspectBouton>Calculer maintenant</AspectBouton>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// Dans un article MDX, encadré coloré qui envoie vers un outil :
// <EncadreOutil href="/outils/combien-eau-chat/" titre="…" texte="…" bouton="Calculer combien d'eau il lui faut" />
// Masqué tant que la page de l'outil n'existe pas.
export function EncadreOutil({ href, titre, texte, bouton }: { href: string; titre: string; texte: string; bouton: string }) {
  if (!pageEnLigne(href)) return null;
  return (
    <aside className="reveal my-12 flex flex-col gap-5 rounded-[1.75rem] bg-lavande px-5 py-7 text-nuit sm:flex-row sm:items-start sm:px-8">
      <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-blanc">
        <IconeOutil slug={slugDe(href)} />
      </span>
      <div>
        <p className="font-display text-[1.6rem] leading-tight">{espacesFines(titre)}</p>
        <p className="mt-3 max-w-[52ch]">{espacesFines(texte)}</p>
        <Link href={href} className="group mt-6 inline-flex">
          <AspectBouton>{espacesFines(bouton)}</AspectBouton>
        </Link>
      </div>
    </aside>
  );
}
