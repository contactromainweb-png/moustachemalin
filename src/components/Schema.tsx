import type { ReactNode } from "react";

// Schémas explicatifs des articles (pack 8a, CLAUDE.md §11 quater) : <Schema nom="…" /> dans un MDX.
// Chaque schéma ne reprend QUE des phrases déjà écrites dans l'article (aucun chiffre ni règle en plus), sans produit
// de marque (fontaine générique) ; le chat est une silhouette simple, jamais Kira. SVG inline, aucun JavaScript :
// <title> et <desc> pour les lecteurs d'écran, mots en vrai texte (police du site), trait en currentColor et touches
// de lavande et d'orange (clair et sombre). Largeur de 340 unités et texte à 15-16 : lisible sur téléphone à 200 %.
type Def = { titre: string; desc: string; legende: string; hauteur: number; dessin: ReactNode };

const L = "fill-lavande";
const A = "fill-accent";

// Texte sur plusieurs lignes (une ligne par élément), en vrai texte SVG.
function T({ x, y, l, gras, taille = 15, milieu }: { x: number; y: number; l: string[]; gras?: boolean; taille?: number; milieu?: boolean }) {
  return (
    <text x={x} y={y} fontSize={taille} fontWeight={gras ? 600 : 400} textAnchor={milieu ? "middle" : undefined} className="fill-current" stroke="none">
      {l.map((ligne, i) => (
        <tspan key={i} x={x} dy={i ? taille * 1.3 : 0}>
          {ligne}
        </tspan>
      ))}
    </text>
  );
}

// Pastille numérotée orange, chiffre bleu nuit (6:1 dans les deux modes).
function N({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <>
      <circle className={A} cx={x} cy={y} r="11" stroke="none" />
      <text x={x} y={y + 5} fontSize="14" fontWeight="700" textAnchor="middle" className="fill-nuit" stroke="none">
        {n}
      </text>
    </>
  );
}

// Cote : un trait avec deux butées.
const coteH = (x1: number, x2: number, y: number) => `M${x1} ${y}H${x2}M${x1} ${y - 6}v12M${x2} ${y - 6}v12`;
const coteV = (x: number, y1: number, y2: number) => `M${x} ${y1}V${y2}M${x - 6} ${y1}h12M${x - 6} ${y2}h12`;

// Petites icônes : tête de chat (32 × 32) et bac (40 × 20).
const tete = (x: number, y: number) => `M${x} ${y + 20}l2-20 8 7q6-3 12 0l8-7 2 20q0 12-16 12t-16-12Z`;
const bac = (x: number, y: number) => `M${x} ${y}h40l-4 20H${x + 4}Z`;

const SCHEMAS: Record<string, Def> = {
  "chatiere-mesures": {
    titre: "Les 3 mesures avant d'acheter une chatière",
    desc: "1 : l'épaisseur de la porte ou du mur. 2 : la largeur du chat aux épaules. 3 : le bas de l'ouverture à la hauteur du ventre du chat.",
    legende: "Les trois mesures à prendre avant d'acheter : la porte, le chat, puis la hauteur de pose.",
    hauteur: 372,
    dessin: (
      <>
        <rect x="44" y="18" width="28" height="90" className={L} />
        <path d={coteH(44, 72, 8)} />
        <N x={16} y={20} n={1} />
        <T x={112} y={56} gras l={["Épaisseur de la porte", "ou du mur"]} />

        <ellipse cx="58" cy="208" rx="30" ry="26" className={L} />
        <path d="M44 176l-2-20 9 8q7-3 14 0l9-8-2 20q0 14-14 14t-14-14Z" className={L} />
        <path d={coteH(28, 88, 192)} className="stroke-accent" strokeWidth="2.5" />
        <N x={16} y={144} n={2} />
        <T x={112} y={180} gras l={["Largeur du chat", "aux épaules"]} />

        <path d="M84 252v50M84 340v18M96 252v50M96 340v18M84 302h12M84 340h12" />
        <ellipse cx="44" cy="322" rx="28" ry="12" className={L} />
        <circle cx="70" cy="306" r="10" className={L} />
        <path d="M24 334v24M34 334v24M54 334v24M62 334v24M18 318q-12-6-6-22" />
        <path d="M30 340H96" className="stroke-accent" strokeWidth="2.5" strokeDasharray="5 5" />
        <path d="M8 358h110" opacity=".4" />
        <N x={16} y={268} n={3} />
        <T x={130} y={306} gras l={["Bas de l'ouverture", "à hauteur du ventre"]} />
      </>
    ),
  },
  "litiere-epaisseur": {
    titre: "Une couche de litière d'environ 3 cm",
    desc: "Coupe d'un bac à litière : au fond, une couche de litière d'environ 3 cm d'épaisseur.",
    legende: "Une couche d'environ 3 cm convient à beaucoup de chats. Certains fabricants de litière végétale conseillent davantage.",
    hauteur: 170,
    dessin: (
      <>
        <path d="M40 104H236L232 140H44Z" className={L} />
        <path d="M30 40L44 140H232L246 40" />
        <path d="M62 116h.1M90 124h.1M118 114h.1M150 126h.1M182 116h.1M208 124h.1" strokeWidth="4" className="stroke-nuit" />
        <path d={coteV(266, 104, 140)} className="stroke-accent" strokeWidth="2.5" />
        <T x={282} y={118} gras l={["environ", "3 cm"]} />
        <T x={138} y={84} milieu l={["bac à litière"]} />
      </>
    ),
  },
  "un-bac-plus-un": {
    titre: "Un bac par chat, plus un",
    desc: "1 chat : 2 bacs. 2 chats : 3 bacs. 3 chats : 4 bacs.",
    legende: "La règle « un bac par chat, plus un » : le bac en plus est en orange.",
    hauteur: 258,
    dessin: (
      <>
        {[1, 2, 3].map((n, r) => {
          const y = 14 + r * 84;
          return (
            <g key={n}>
              {Array.from({ length: n }, (_, i) => (
                <path key={i} d={tete(4 + i * 34, y)} className={L} />
              ))}
              <path d={`M114 ${y + 16}h22m-6-6 6 6-6 6`} />
              {Array.from({ length: n + 1 }, (_, i) => (
                <path key={i} d={bac(148 + i * 46, y + 8)} className={i === n ? A : undefined} />
              ))}
              <T x={4} y={y + 54} gras l={[n === 1 ? "1 chat" : `${n} chats`]} />
              <T x={148} y={y + 54} gras l={[`${n + 1} bacs`]} />
            </g>
          );
        })}
      </>
    ),
  },
  "ou-placer-bac": {
    titre: "Où placer le bac à litière",
    desc: "Plan d'une pièce : le bac dans un coin calme et aéré, loin des gamelles ; un bac dans un placard fermé est barré.",
    legende: "Un endroit calme et aéré, loin des gamelles, mais pas enfermé dans un placard où l'air ne circule pas.",
    hauteur: 250,
    dessin: (
      <>
        <rect x="4" y="8" width="332" height="234" rx="6" />
        <path d="M200 8h100" className="stroke-lavande" strokeWidth="7" />
        <path d={bac(230, 30)} className={L} />
        <path d="M282 34l5 5 10-11" className="stroke-accent" strokeWidth="3" />
        <T x={210} y={74} gras l={["Calme et aéré"]} />
        <ellipse cx="34" cy="44" rx="14" ry="7" />
        <ellipse cx="66" cy="44" rx="14" ry="7" />
        <T x={20} y={74} l={["gamelles"]} />
        <path d="M90 42H222" strokeDasharray="5 6" />
        <T x={156} y={34} milieu l={["loin"]} />
        <rect x="214" y="150" width="118" height="88" />
        <path d="M214 150l-28 18" />
        <path d={bac(254, 196)} />
        <path d="M262 180l24 30M286 180l-24 30" className="stroke-accent" strokeWidth="3" />
        <T x={20} y={180} gras l={["Pas dans un", "placard fermé"]} />
      </>
    ),
  },
  "filtre-trois-couches": {
    titre: "Le filtre en trois couches de la Catit Pixi",
    desc: "L'eau traverse trois couches : la fibre de coton retient les poils et débris, le charbon actif réduit les odeurs, la résine adoucit l'eau. Dessin générique, pas le produit.",
    legende: "Le trajet de l'eau dans le filtre triple (dessin générique, pas une photo du produit).",
    hauteur: 268,
    dessin: (
      <>
        <path d="M74 6c8 10 12 15 12 21a12 12 0 0 1-24 0c0-6 4-11 12-21Z" className={L} />
        <rect x="24" y="50" width="100" height="40" className={L} fillOpacity=".35" />
        <path d="M34 62q8-6 16 0t16 0 16 0 16 0 16 0M34 76q8-6 16 0t16 0 16 0 16 0 16 0" className="stroke-lavande" />
        <rect x="24" y="90" width="100" height="40" className="fill-nuit" />
        <rect x="24" y="130" width="100" height="40" />
        <path d="M40 146h.1M60 154h.1M80 144h.1M100 156h.1M50 160h.1M90 162h.1" strokeWidth="5" className="stroke-accent" />
        <path d="M74 176v24m-7-7 7 7 7-7" />
        <path d="M14 210h120l-10 40H24Z" />
        <path d="M22 222h104l-3 10H25Z" className={L} />
        <N x={150} y={70} n={1} />
        <T x={170} y={66} gras l={["Coton :", "poils et débris"]} />
        <N x={150} y={110} n={2} />
        <T x={170} y={106} gras l={["Charbon actif :", "odeurs"]} />
        <N x={150} y={150} n={3} />
        <T x={170} y={146} gras l={["Résine :", "adoucit l'eau"]} />
      </>
    ),
  },
  "griffoir-bien-place": {
    titre: "Un bon griffoir : assez haut, stable, bien placé",
    desc: "Un chat s'étire de tout son long contre un poteau à griffer posé sur une base large, juste à côté de l'accoudoir de canapé qu'il griffait.",
    legende: "Assez haut pour qu'il s'étire de tout son long, stable, et juste à côté de l'endroit abîmé.",
    hauteur: 290,
    dessin: (
      <>
        <path d="M8 280h324" opacity=".4" />
        <path d="M10 280V196a16 16 0 0 1 16-16h30a16 16 0 0 1 16 16v84" />
        <path d="M54 210l10 14M46 218l10 14M58 234l8 12" className="stroke-accent" strokeWidth="2.5" />
        <T x={10} y={30} gras l={["Juste à côté", "de l'endroit abîmé"]} />
        <rect x="100" y="80" width="18" height="186" />
        <path d="M100 110h18M100 140h18M100 170h18M100 200h18M100 230h18" opacity=".45" />
        <rect x="76" y="266" width="76" height="12" rx="3" className={L} />
        <path d="M134 262Q146 196 138 132" className="stroke-lavande" strokeWidth="20" />
        <circle cx="144" cy="116" r="14" className={L} />
        <path d="M134 108l-2-14 10 8M148 103l8-11 1 15" className={L} />
        <path d="M136 140l-12-50M140 138l-10-48" className="stroke-lavande" strokeWidth="6" />
        <path d="M140 262q34 4 30-36" className="stroke-lavande" strokeWidth="6" />
        <path d={coteV(196, 80, 266)} className="stroke-accent" strokeWidth="2.5" />
        <T x={210} y={120} gras l={["Assez haut :", "il s'étire de", "tout son long"]} />
        <T x={210} y={236} gras l={["Stable :", "il ne bouge pas"]} />
      </>
    ),
  },
};

export function Schema({ nom }: { nom: string }) {
  const s = SCHEMAS[nom];
  if (!s) throw new Error(`Schéma inconnu : ${nom} (src/components/Schema.tsx)`);
  const id = `schema-${nom}`;
  return (
    <figure className="reveal my-12 max-w-[34rem]">
      <svg
        role="img"
        aria-labelledby={`${id}-titre ${id}-desc`}
        viewBox={`0 0 340 ${s.hauteur}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-auto w-full font-sans text-ink"
      >
        <title id={`${id}-titre`}>{s.titre}</title>
        <desc id={`${id}-desc`}>{s.desc}</desc>
        {s.dessin}
      </svg>
      <figcaption className="mt-3 text-small text-ink-soft">{s.legende}</figcaption>
    </figure>
  );
}
