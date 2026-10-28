import Link from "next/link";

// Appel à l'action : pilule orange, texte bleu nuit (6,1:1), flèche dans son propre rond.
// Sur un aplat orange ou lavande, la section fournit d'autres couleurs (variables --cta-*, voir globals.css).
// Au survol (souris seulement), la flèche avance ; à l'appui, le bouton s'enfonce légèrement.
export function BoutonAction({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`group inline-flex min-h-13 items-center gap-4 rounded-full bg-[var(--cta-fond,var(--color-accent))] py-2 pl-6 pr-2 font-medium text-[var(--cta-texte,var(--color-on-accent))] transition-[transform,background-color,color] duration-150 ease-[var(--ease-out)] active:scale-[0.97] ${className}`}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--cta-rond,var(--color-nuit))] text-[var(--cta-fleche,var(--color-blanc))] transition-transform duration-200 ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}
