import type { ReactNode } from "react";

// Pictos des badges du carnet : SVG inline maison, 24 × 24, trait de 1,75 px, currentColor (comme PictosProduit).
// Aucun emoji, aucune Kira.
const P: Record<string, ReactNode> = {
  // Premier comparatif : deux colonnes côte à côte
  comparatif: (
    <>
      <rect x="3.5" y="5" width="7" height="14" rx="1.5" />
      <rect x="13.5" y="5" width="7" height="14" rx="1.5" />
      <path d="M6 9h2M6 12h2M16 9h2M16 12h2" />
    </>
  ),
  // Tour du propriétaire : une maison
  tour: (
    <>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v9h12v-9" />
      <path d="M10 19v-5h4v5" />
    </>
  ),
  // Quiz : bulle et point d'interrogation
  quiz: (
    <>
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-4 3v-3H6a2 2 0 0 1-2-2Z" />
      <path d="M10 9a2 2 0 1 1 3 1.7c-.7.4-1 .8-1 1.5" />
      <path d="M12 14.5v.01" />
    </>
  ),
  // Diagnostic : liste cochée
  diagnostic: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="m8 9 1.5 1.5L12 8M8 15l1.5 1.5L12 14M14 9.5h2M14 15.5h2" />
    </>
  ),
  // Calculs : calculatrice
  calculs: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 12h1M11.5 12h1M15 12h1M8 16h1M11.5 16h1M15 16h1" />
    </>
  ),
  // La bande : trois têtes de chat simplifiées
  bande: (
    <>
      <path d="M3 15v-4l2 1.5h2L9 11v4a3 3 0 0 1-6 0Z" />
      <path d="M15 15v-4l2 1.5h2l2-1.5v4a3 3 0 0 1-6 0Z" />
      <path d="M9 10V6l2 1.5h2L15 6v4a3 3 0 0 1-6 0Z" />
    </>
  ),
  // L'essentiel : étoile
  essentiel: <path d="m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.4l-4.8 2.5.9-5.4-3.9-3.8 5.4-.8Z" />,
};

export function PictoBadge({ id, className = "" }: { id: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {P[id]}
    </svg>
  );
}
