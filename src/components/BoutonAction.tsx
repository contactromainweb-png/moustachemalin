import Link from "next/link";

// Appel à l'action : pilule orange, texte bleu nuit (6,1:1), flèche dans son propre rond.
// Au survol (souris seulement), la flèche avance ; à l'appui, le bouton s'enfonce légèrement.
export function BoutonAction({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`group inline-flex min-h-13 items-center gap-4 rounded-full bg-accent py-2 pl-6 pr-2 font-medium text-on-accent transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97] ${className}`}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-nuit text-blanc transition-transform duration-200 ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}
