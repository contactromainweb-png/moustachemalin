import Link from "next/link";

// Logo Moustache Malin (piste D validée par Romain) : le symbole (public/brand/) + « Moustache » en grotesque 800
// et « malin » en serif italique orange, en vrai texte HTML avec les polices du site, légèrement en relief.
// fond="sombre" : sur un aplat bleu nuit (en-tête), moustaches et « Moustache » crème, quel que soit le thème.
// fond="theme" : sur le fond de la page (pied de page), bleu nuit en clair, crème en mode sombre.
// Relief : 2 px dans le logo ; dans les grands titres, la même ombre proportionnelle à la taille du texte (em).
export const RELIEF_MOUSTACHE = "0 2px 0 #b9a6ff";
const RELIEF_MALIN = "0 2px 0 #b84a06";
export const RELIEF_TITRE = { moustache: "0 0.035em 0 #b9a6ff", malin: "0 0.035em 0 #b84a06" };

type Props = { fond: "sombre" | "theme"; taille: "entete" | "pied" };

const TAILLES = {
  entete: { symbole: "h-10 sm:h-12", texte: "text-[1.375rem] sm:text-[1.75rem]" },
  pied: { symbole: "h-9", texte: "text-[1.375rem]" },
};

export function Logo({ fond, taille }: Props) {
  const t = TAILLES[taille];
  return (
    <Link href="/" aria-label="Moustache Malin, accueil" className="flex items-center gap-2.5 py-2">
      <Symbole fond={fond} className={`${t.symbole} w-auto shrink-0`} />
      <span aria-hidden="true" className={`${t.texte} whitespace-nowrap leading-none`}>
        <span
          className={`font-display ${fond === "sombre" ? "text-blanc" : "text-ink"}`}
          style={{ textShadow: RELIEF_MOUSTACHE }}
        >
          Moustache
        </span>{" "}
        <MotMalin />
      </span>
    </Link>
  );
}

// « malin » du logo, aussi repris dans les grands titres « Moustache malin » (pied de page, fin de l'accueil).
export function MotMalin({ className = "", relief = RELIEF_MALIN }: { className?: string; relief?: string }) {
  return (
    <span className={`font-serif text-[1.12em] font-normal italic text-[#ff7a1a] ${className}`} style={{ textShadow: relief }}>
      malin
    </span>
  );
}

// Le symbole est un fichier SVG (dégradés internes) : balise img simple, pas d'optimisation d'image à faire.
function Symbole({ fond, className }: { fond: Props["fond"]; className: string }) {
  if (fond === "sombre") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src="/brand/logo-mark-dark.svg" alt="" width={200} height={210} className={className} />;
  }
  return (
    <picture className="shrink-0">
      <source srcSet="/brand/logo-mark-dark.svg" media="(prefers-color-scheme: dark)" />
      <img src="/brand/logo-mark.svg" alt="" width={200} height={210} className={className} />
    </picture>
  );
}
