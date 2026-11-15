import type { ReactNode } from "react";
import { pictosProduit, type Barre, type Icone } from "@/lib/pictos";
import type { Product } from "@/lib/products";

// Fiches plus visuelles (pack de nuit 7, étendu à toutes les catégories au pack 8a) : une rangée de pastilles
// (icône + mot court) tirées des specs, puis une barre de repère. Les règles sont dans src/lib/pictos.ts.
// Icônes maison en SVG inline, 24 × 24, trait de 1,75 px, currentColor. Une spec absente n'affiche rien.
const I: Record<Icone, ReactNode> = {
  agglo: (
    <>
      <circle cx="9" cy="14" r="4" />
      <circle cx="15" cy="10" r="4" />
      <circle cx="16" cy="17" r="2.5" />
    </>
  ),
  grains: (
    <>
      <circle cx="6" cy="8" r="1.5" />
      <circle cx="12" cy="6" r="1.5" />
      <circle cx="18" cy="9" r="1.5" />
      <circle cx="8" cy="15" r="1.5" />
      <circle cx="15" cy="14" r="1.5" />
      <circle cx="11" cy="19" r="1.5" />
      <circle cx="18" cy="18" r="1.5" />
    </>
  ),
  feuille: (
    <>
      <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" />
      <path d="M5 19c3-4 6-7 10-9" />
    </>
  ),
  pierre: <path d="M4 16.5 7 8l6-3 6 4 1 7-5 3.5H8Z" />,
  sansParfum: (
    <>
      <path d="M12 4c3 4 5 6.5 5 9.5a5 5 0 0 1-10 0C7 10.5 9 8 12 4Z" />
      <path d="M4 4l16 16" />
    </>
  ),
  charbon: (
    <>
      <path d="m12 3 7.5 4.5v9L12 21l-7.5-4.5v-9Z" />
      <path d="m12 8 3.5 2v4L12 16l-3.5-2v-4Z" />
    </>
  ),
  compost: (
    <>
      <path d="M12 20v-7" />
      <path d="M12 13c0-4 3-6 7-6 0 4-3 6-7 6Z" />
      <path d="M12 15c0-3-2.5-5-6-5 0 3 2.5 5 6 5Z" />
      <path d="M6 20h12" />
    </>
  ),
  toilettes: (
    <>
      <path d="M7 4h5v6H7Z" />
      <path d="M5 10h14a7 7 0 0 1-7 7h0a7 7 0 0 1-7-7Z" />
      <path d="M9 17l-1 3h8l-1-3" />
    </>
  ),
  poubelle: (
    <>
      <path d="M4.5 7h15" />
      <path d="M9.5 7V4.5h5V7" />
      <path d="M6.5 7l1 13h9l1-13" />
      <path d="M10.5 11v5.5M13.5 11v5.5" />
    </>
  ),
  ouverte: (
    <>
      <path d="M3 12h18l-2 7H5Z" />
      <path d="M7 12c1-2 3-3 5-3s4 1 5 3" />
    </>
  ),
  fermee: (
    <>
      <path d="M4 19V12a8 8 0 0 1 16 0v7Z" />
      <path d="M9 19v-4a3 3 0 0 1 6 0v4" />
    </>
  ),
  appli: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2.5" />
      <path d="M11 17.5h2" />
    </>
  ),
  sansAppli: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2.5" />
      <path d="M4 4l16 16" />
    </>
  ),
  bac: (
    <>
      <path d="M4 8h16l-1.5 11h-13Z" />
      <path d="M8 8V5h8v3" />
    </>
  ),
  bruit: (
    <>
      <path d="M4 10v4h3.5L12 18V6L7.5 10Z" />
      <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5M18 7a7 7 0 0 1 0 10" />
    </>
  ),
  poids: (
    <>
      <path d="M8 8h8l3 12H5Z" />
      <circle cx="12" cy="5.5" r="2.5" />
    </>
  ),
  goutte: <path d="M12 3.5c3.5 4.5 6 7.5 6 10.5a6 6 0 0 1-12 0c0-3 2.5-6 6-10.5Z" />,
  inox: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 15l7-7M11 17l6-6" />
    </>
  ),
  plastique: (
    <>
      <path d="M9 3h6v3l2 3v11H7V9l2-3Z" />
      <path d="M7 13h10" />
    </>
  ),
  sansFil: (
    <>
      <rect x="3.5" y="7.5" width="15" height="9" rx="2" />
      <path d="M21 10.5v3M7 10.5v3M10.5 10.5v3" />
    </>
  ),
  secteur: (
    <>
      <path d="M9 3v5M15 3v5" />
      <path d="M6.5 8h11v3a5.5 5.5 0 0 1-11 0Z" />
      <path d="M12 16.5V21" />
    </>
  ),
  reserve: (
    <>
      <rect x="6" y="3" width="12" height="13" rx="2.5" />
      <path d="M6 11h12M9 16v3h6v-3" />
    </>
  ),
  repas: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l1.5-2.5h7L17 8h3v11H4Z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  sansCourant: (
    <>
      <path d="M13 3 6 13h5l-1 8 7-10h-5Z" />
      <path d="M4 4l16 16" />
    </>
  ),
  bol: (
    <>
      <path d="M3.5 11h17a8.5 8.5 0 0 1-17 0Z" />
      <path d="M8 8.5c1.5-1 6.5-1 8 0" />
    </>
  ),
  hauteur: (
    <>
      <path d="M12 3v18M8.5 6.5 12 3l3.5 3.5M8.5 17.5 12 21l3.5-3.5" />
    </>
  ),
  sol: (
    <>
      <path d="M3 15l6-6h12l-6 6Z" />
      <path d="M3 19h12" />
    </>
  ),
  plafond: (
    <>
      <path d="M3 4h18M12 4v16M8 20h8" />
    </>
  ),
  ancre: (
    <>
      <path d="M12 3v15M5 12a7 7 0 0 0 14 0" />
      <path d="M3 21h18" />
    </>
  ),
  vertical: (
    <>
      <rect x="9" y="3" width="6" height="15" rx="1" />
      <path d="M6 21h12M9 8h6M9 13h6" />
    </>
  ),
  formeL: <path d="M6 3h4v13h10v4H6Z" />,
  plat: (
    <>
      <path d="M3 14l4-4h14l-4 4Z" />
      <path d="M3 14v4h14v-4M17 18l4-4v-4" />
    </>
  ),
  tapis: (
    <>
      <path d="M3 17h12v-3H3Z" />
      <circle cx="18" cy="14" r="3" />
    </>
  ),
  sisal: (
    <>
      <path d="M5 6c4 2 10 2 14 0M5 12c4 2 10 2 14 0M5 18c4 2 10 2 14 0" />
    </>
  ),
  carton: (
    <>
      <rect x="3.5" y="6" width="17" height="12" rx="1.5" />
      <path d="M3.5 12c1.5-2 3-2 4.25 0s2.75 2 4.25 0 3-2 4.25 0 2.75 2 4.25 0" />
    </>
  ),
  feutre: (
    <>
      <rect x="3.5" y="6" width="17" height="12" rx="1.5" />
      <path d="M7 10h.01M12 10h.01M17 10h.01M9.5 14h.01M14.5 14h.01" />
    </>
  ),
  reversible: (
    <>
      <path d="M4 9h13l-3-3M20 15H7l3 3" />
    </>
  ),
  clapet: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 8h8v8H8Z" />
    </>
  ),
  puce: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" />
    </>
  ),
  sansPile: (
    <>
      <rect x="7" y="5" width="10" height="16" rx="2" />
      <path d="M10 3h4M4 4l16 16" />
    </>
  ),
  piles: (
    <>
      <rect x="7" y="5" width="10" height="16" rx="2" />
      <path d="M10 3h4M12 10v4M10 12h4" />
    </>
  ),
  chats: (
    <>
      <path d="M5 20v-7l-1-6 4 3h4l4-3-1 6v7Z" />
      <path d="M9 15h.01M13 15h.01" />
    </>
  ),
};

function BarreRepere({ barre }: { barre: Barre }) {
  if ("vide" in barre)
    return (
      <div>
        <p className="text-small font-semibold">{barre.titre}</p>
        <p className="mt-1 text-small text-ink-soft">{barre.vide}</p>
      </div>
    );
  const debut = barre.debut * 100;
  const largeur = Math.max(3, (barre.fin - barre.debut) * 100);
  return (
    <div className="max-w-[26rem]">
      <p className="text-small font-semibold">{barre.titre}</p>
      <div aria-hidden="true" className="relative mt-2 h-3 overflow-hidden rounded-full bg-field">
        <div
          className="absolute inset-y-0 rounded-full bg-lavande"
          style={{ left: `${debut}%`, width: `${Math.min(100 - debut, largeur)}%` }}
        />
      </div>
      <p className="mt-1.5 text-small">
        {barre.legende}
        <span className="text-ink-soft"> · {barre.note}</span>
      </p>
    </div>
  );
}

export function PictosProduit({ p }: { p: Product }) {
  const { pastilles, barre } = pictosProduit(p);
  if (!pastilles.length && !barre) return null;
  return (
    <div className="mt-8 space-y-5">
      {pastilles.length ? (
        <ul aria-label="En un coup d'œil" className="flex flex-wrap gap-2">
          {pastilles.map((x) => (
            <li key={x.mot} className="flex min-h-10 items-center gap-2 rounded-full bg-field px-3.5 text-small font-medium text-ink">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-5 shrink-0"
              >
                {I[x.icone]}
              </svg>
              {x.mot}
            </li>
          ))}
        </ul>
      ) : null}
      {barre ? <BarreRepere barre={barre} /> : null}
    </div>
  );
}
