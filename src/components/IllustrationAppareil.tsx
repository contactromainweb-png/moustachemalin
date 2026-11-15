import type { ReactNode } from "react";
import { LIBELLES, varianteIllustration, type Variante } from "@/lib/illustrations";
import type { Product } from "@/lib/products";

// Fiche produit : un dessin au trait GÉNÉRIQUE de l'appareil (pas une photo, aucune forme ni logo de marque), choisi
// d'après la catégorie et les specs (src/lib/illustrations.ts). SVG inline, aucun JavaScript, aucune image externe.
// Trait de 2 px en currentColor (bleu nuit en clair, crème en sombre) quelle que soit la taille affichée
// (vector-effect, voir .illustration dans globals.css), une ou deux touches de lavande et d'orange, fond bg-field.
// Le nom et la marque restent du texte HTML ; le cadre garde le format 4:3 de l'ancien visuel neutre (CLS 0).
const L = "fill-lavande";
const A = "fill-accent";

const sol = <path d="M14 104h132" opacity=".35" />;

const DESSINS: Record<Variante, ReactNode> = {
  "litiere-ouverte": (
    <>
      {sol}
      <path d="M38 64V50a6 6 0 0 1 6-6h72a6 6 0 0 1 6 6v14" />
      <path className={L} d="M32 64q12-14 30-8t26-6 40 14Z" />
      <path d="M26 64h108l-6 32a6 6 0 0 1-6 5H38a6 6 0 0 1-6-5Z" />
      <path d="M52 84h56" opacity=".5" />
      <circle className={A} cx="116" cy="84" r="3.5" />
    </>
  ),
  "litiere-fermee": (
    <>
      {sol}
      <path d="M30 101V64a50 46 0 0 1 100 0v37Z" />
      <path className={L} d="M58 101V78a22 22 0 0 1 44 0v23Z" />
      <path d="M44 40q36-26 72 0" opacity=".5" />
      <path d="M26 101h108" />
      <circle className={A} cx="80" cy="30" r="3.5" />
    </>
  ),
  "sac-boules": (
    <>
      {sol}
      <path d="M44 101l-6-62q32-8 64 0l-6 62Z" />
      <path d="M38 39l4-11h56l4 11" />
      <rect className={L} x="54" y="54" width="32" height="26" rx="4" />
      <circle cx="116" cy="98" r="5" />
      <circle cx="128" cy="97" r="6" />
      <circle className={A} cx="122" cy="88" r="5" />
    </>
  ),
  "sac-grains": (
    <>
      {sol}
      <path d="M44 101l-6-62q32-8 64 0l-6 62Z" />
      <path d="M38 39l4-11h56l4 11" />
      <rect className={L} x="54" y="54" width="32" height="26" rx="4" />
      <path d="M110 100h.1M116 98h.1M122 100h.1M128 97h.1M134 100h.1M119 94h.1M125 93h.1" strokeWidth="4" />
      <circle className={A} cx="131" cy="91" r="2.5" />
    </>
  ),
  fontaine: (
    <>
      {sol}
      <path d="M28 78h104l-8 23H36Z" />
      <path className={L} d="M38 84h84l-2 6H40Z" />
      <path d="M62 78V54a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v24" />
      <path d="M98 58h10a6 6 0 0 1 6 6v2" />
      <path className="stroke-lavande" d="M114 70q1 6-3 12" strokeWidth="3" />
      <circle className={A} cx="80" cy="64" r="3.5" />
    </>
  ),
  distributeur: (
    <>
      {sol}
      <rect x="44" y="18" width="56" height="58" rx="8" />
      <path className={L} d="M48 52h48v18a4 4 0 0 1-4 4H52a4 4 0 0 1-4-4Z" />
      <path d="M38 76h68v25H38Z" />
      <circle className={A} cx="72" cy="88" r="3.5" />
      <path d="M106 92h32q0 9-16 9t-16-9Z" />
    </>
  ),
  "distributeur-2-bols": (
    <>
      {sol}
      <rect x="52" y="18" width="56" height="58" rx="8" />
      <path className={L} d="M56 52h48v18a4 4 0 0 1-4 4H60a4 4 0 0 1-4-4Z" />
      <path d="M46 76h68v25H46Z" />
      <circle className={A} cx="80" cy="88" r="3.5" />
      <path d="M12 92h30q0 9-15 9t-15-9ZM118 92h30q0 9-15 9t-15-9Z" />
    </>
  ),
  "distributeur-gravite": (
    <>
      {sol}
      <rect x="58" y="12" width="44" height="54" rx="8" />
      <path className={L} d="M62 40h36v20a4 4 0 0 1-4 4H66a4 4 0 0 1-4-4Z" />
      <path d="M72 66v12h16V66" />
      <path d="M30 82h100q0 19-50 19T30 82Z" />
      <circle className={A} cx="112" cy="87" r="3" />
    </>
  ),
  "arbre-petit": (
    <>
      {sol}
      <path d="M22 101h116" />
      <path d="M70 101V58M60 58h44" />
      <path d="M28 99l36-30" strokeWidth="5" opacity=".25" />
      <path d="M28 99l36-30" />
      <rect x="92" y="76" width="36" height="25" rx="3" />
      <circle className={L} cx="110" cy="89" r="7" />
      <path d="M96 58v12" />
      <circle className={A} cx="96" cy="73" r="3.5" />
    </>
  ),
  "arbre-moyen": (
    <>
      {sol}
      <path d="M36 101h88" />
      <path d="M60 101V28M100 101V52" />
      <path d="M44 28h32M84 52h32M40 76h40" />
      <rect x="86" y="80" width="30" height="21" rx="3" />
      <circle className={L} cx="101" cy="91" r="6" />
      <path className="stroke-lavande" d="M44 76q18 12 36 0" strokeWidth="3" />
      <path d="M116 52v12" />
      <circle className={A} cx="116" cy="67" r="3.5" />
    </>
  ),
  "arbre-plafond": (
    <>
      <path d="M14 10h132" opacity=".35" />
      {sol}
      <path d="M60 12h40M80 12v92M60 104h40" />
      <path d="M80 30h32M48 54h32M80 80h30" />
      <path className="stroke-lavande" d="M82 30q14 10 28 0" strokeWidth="3" />
      <path d="M50 54v10" />
      <circle className={A} cx="50" cy="67" r="3.5" />
    </>
  ),
  "griffoir-poteau": (
    <>
      {sol}
      <path d="M50 101h60v-8H50Z" />
      <rect x="70" y="20" width="20" height="73" />
      <path d="M70 32h20M70 44h20M70 56h20M70 68h20M70 80h20" opacity=".5" />
      <path className={L} d="M64 20h32v-6H64Z" />
      <circle className={A} cx="104" cy="88" r="4" />
    </>
  ),
  "griffoir-l": (
    <>
      {sol}
      <rect x="38" y="20" width="22" height="81" rx="3" />
      <rect x="60" y="88" width="68" height="13" rx="3" />
      <path className="stroke-lavande" d="M44 32h10M44 44h10M44 56h10M44 68h10M44 80h10M72 94.5h48" strokeWidth="2.5" />
      <circle className={A} cx="112" cy="81" r="4" />
    </>
  ),
  "griffoir-plat": (
    <>
      {sol}
      <path d="M24 86l20-16h96l-20 16Z" />
      <path d="M24 86v14h96V86M120 100l20-16V70" />
      <path className="stroke-lavande" d="M44 82l14-10M60 82l14-10M76 82l14-10M92 82l14-10M108 82l14-10" strokeWidth="2.5" />
      <circle className={A} cx="60" cy="62" r="3.5" />
    </>
  ),
  "griffoir-tapis": (
    <>
      {sol}
      <path d="M18 101h86v-6H18Z" />
      <circle cx="118" cy="88" r="13" />
      <path d="M118 88a5 5 0 1 0 5-5" />
      <path className="stroke-lavande" d="M26 98h.1M36 98h.1M46 98h.1M56 98h.1M66 98h.1M76 98h.1M86 98h.1M96 98h.1" strokeWidth="3" />
      <circle className={A} cx="40" cy="80" r="3.5" />
    </>
  ),
  "chatiere-manuelle": (
    <>
      {sol}
      <path d="M30 104V12h100v92" />
      <rect x="56" y="56" width="48" height="44" rx="6" />
      <rect className={L} x="62" y="64" width="36" height="31" rx="3" />
      <path d="M62 64h36" />
      <circle className={A} cx="118" cy="56" r="3.5" />
    </>
  ),
  "chatiere-puce": (
    <>
      {sol}
      <path d="M30 104V12h100v92" />
      <rect x="54" y="44" width="52" height="56" rx="6" />
      <rect className={L} x="62" y="64" width="36" height="31" rx="3" />
      <path d="M62 64h36" />
      <rect x="72" y="49" width="16" height="10" rx="2" />
      <path d="M76 49v-3M84 49v-3M76 59v3M84 59v3" />
      <circle className={A} cx="98" cy="54" r="3" />
    </>
  ),
  neutre: (
    <>
      <ellipse className={L} cx="80" cy="74" rx="22" ry="18" />
      <ellipse cx="52" cy="50" rx="8" ry="11" />
      <ellipse cx="70" cy="36" rx="8" ry="11" />
      <ellipse cx="90" cy="36" rx="8" ry="11" />
      <ellipse className={A} cx="108" cy="50" rx="8" ry="11" />
    </>
  ),
};

export function IllustrationAppareil({ p, nom, marque }: { p: Product; nom: string; marque: string }) {
  const variante = varianteIllustration(p);
  return (
    <figure className="m-0">
      <div className="flex aspect-[4/3] flex-col overflow-hidden bg-field p-5 text-ink">
        <svg
          role="img"
          aria-label={`Illustration générique : ${LIBELLES[variante]} (pas une photo du produit)`}
          viewBox="10 6 140 102"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="illustration min-h-0 w-full flex-1"
          data-variante={variante}
        >
          {DESSINS[variante]}
        </svg>
        <span className="mt-3 font-display text-[clamp(1.25rem,1.1rem+0.6vw,1.5rem)] leading-tight">{nom}</span>
        <span className="mt-1 text-small text-ink-soft">{marque}</span>
      </div>
      <figcaption className="mt-2 text-small text-ink-soft">Illustration, pas une photo du produit</figcaption>
    </figure>
  );
}
