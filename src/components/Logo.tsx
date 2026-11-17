import Link from "next/link";
import { SymboleLogo } from "@/components/ClientCommun";

// Logo Moustache Malin (piste D validée par Romain) : le symbole (public/brand/) + « Moustache » en grotesque 800
// et « malin » en serif italique orange, en vrai texte HTML avec les polices du site, légèrement en relief.
// fond="sombre" : sur un aplat bleu nuit (en-tête), moustaches et « Moustache » crème, quel que soit le thème.
// fond="theme" : sur le fond de la page (pied de page), bleu nuit en clair, crème en mode sombre.
// Relief : 2 px dans le logo ; dans les grands titres, la même ombre proportionnelle à la taille du texte (em).
export const RELIEF_MOUSTACHE = "0 2px 0 #b9a6ff";
const RELIEF_MALIN = "0 2px 0 #b84a06";
export const RELIEF_TITRE = { moustache: "0 0.035em 0 #b9a6ff", malin: "0 0.035em 0 #b84a06" };

export type Props = { fond: "sombre" | "theme"; taille: "entete" | "pied" };

const TAILLES = {
  entete: { symbole: "h-10 sm:h-12", texte: "text-[1.375rem] sm:text-[1.75rem]" },
  pied: { symbole: "h-9", texte: "text-[1.375rem]" },
};

export function Logo({ fond, taille }: Props) {
  const t = TAILLES[taille];
  return (
    // prefetch={false} : précharger l'accueil depuis chaque page téléchargeait aussi la photo de son premier écran
    // (36 Ko en priorité haute), en concurrence avec la photo de la page affichée (audit de novembre 2026, pack A).
    <Link href="/" prefetch={false} aria-label="Moustache Malin, accueil" className="logo-lien flex items-center gap-2.5 py-2">
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

// Le symbole du logo, en SVG inline (SymboleLogo.tsx, par le module client commun).
function Symbole({ fond, className }: { fond: Props["fond"]; className: string }) {
  // Les parties fixes et les dégradés sont écrits dans le logo de l'en-tête (fond sombre, toujours affiché) ; le pied
  // de page les reprend.
  return <SymboleLogo fond={fond} definitions={fond === "sombre"} className={className} />;
}
