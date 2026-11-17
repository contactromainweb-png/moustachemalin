"use client";

// Le symbole du logo en SVG inline (pack 9), pour pouvoir l'animer : exactement les tracés de public/brand/logo-mark.svg
// (les fichiers restent pour le favicon, le manifeste et les e-mails). Seuls changent selon le fond : la couleur des
// moustaches (bleu nuit en clair, crème en sombre) et l'ombre au sol (absente en sombre) ; fond="theme" suit le thème
// du système en CSS (classes .logo-moustaches-theme et .logo-ombre, globals.css).
// Clin d'œil et frémissement des moustaches au survol et au focus du lien (globals.css, .logo-lien).
// Poids de la page : composant client sans état ni effet (rendu en HTML, mais ses tracés ne sont pas recopiés dans
// les données React de chaque page). Les parties fixes (tête, oreilles, œil droit, nez, bouche) et les dégradés ne
// sont écrits qu'une fois, dans le logo de l'en-tête (`definitions`) ; le pied de page les reprend par <use>. L'œil
// gauche et les moustaches, animés, restent de vrais tracés dans chaque logo. L'œil gauche ne touche aucune partie
// fixe tracée après lui dans le fichier d'origine : l'ordre de dessin ne change pas le rendu.
const TETE = "M40 80 L34 22 L80 52 Q100 46 120 52 L166 22 L160 80 Q176 108 168 136 Q154 180 100 182 Q46 180 32 136 Q24 108 40 80 Z";

export function SymboleLogo({
  fond,
  definitions = false,
  className = "",
}: {
  fond: "sombre" | "theme";
  definitions?: boolean;
  className?: string;
}) {
  const sombre = fond === "sombre";
  const moustaches = sombre ? { stroke: "#FAF7F2" } : { className: "logo-moustaches-theme" };
  return (
    <svg viewBox="0 0 200 210" width={200} height={210} aria-hidden="true" className={className}>
      {definitions ? (
        <defs>
          <linearGradient id="mm-logo-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFA155" />
            <stop offset="1" stopColor="#F0640A" />
          </linearGradient>
          <linearGradient id="mm-logo-n" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#D3C6FF" />
            <stop offset="1" stopColor="#9C84F5" />
          </linearGradient>
          {/* La tête, sans couleur : tracée deux fois (ombre décalée, puis dégradé). */}
          <path id="mm-logo-t" d={TETE} />
          <g id="mm-logo-fixe">
            <use href="#mm-logo-t" transform="translate(0 10)" fill="#B84A06" />
            <use href="#mm-logo-t" fill="url(#mm-logo-g)" />
            <path d="M48 70 L45 38 L74 56 Z" fill="#FFD2A8" opacity="0.75" />
            <path d="M152 70 L155 38 L126 56 Z" fill="#FFD2A8" opacity="0.75" />
            <ellipse cx="80" cy="74" rx="34" ry="13" transform="rotate(-18 80 74)" fill="#FFFFFF" opacity="0.22" />
            <path d="M116 102 Q128 92 140 102" fill="none" stroke="#14213D" strokeWidth="5" strokeLinecap="round" />
            <path d="M88 118 Q100 112 112 118 Q107 129 100 132 Q93 129 88 118 Z" fill="url(#mm-logo-n)" />
            <path
              d="M100 132 V139 M100 139 Q92 149 84 142 M100 139 Q108 149 116 142"
              fill="none"
              stroke="#14213D"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          </g>
        </defs>
      ) : null}
      {sombre ? null : <ellipse className="logo-ombre" cx="100" cy="200" rx="62" ry="6" fill="#14213D" opacity="0.16" />}
      <use href="#mm-logo-fixe" />
      <g className="logo-oeil-ouvert">
        <ellipse cx="72" cy="101" rx="13" ry="9.5" fill="#8EC9FF" stroke="#14213D" strokeWidth="4" />
        <ellipse cx="72" cy="101" rx="3" ry="7.5" fill="#14213D" />
        <circle cx="76.5" cy="97" r="2.6" fill="#FFFFFF" />
      </g>
      {/* Œil gauche fermé : même arc que l'œil droit, centré sur 72, 101. Caché au repos. */}
      <path className="logo-oeil-ferme" d="M60 102 Q72 92 84 102" fill="none" stroke="#14213D" strokeWidth="5" strokeLinecap="round" />
      <g strokeWidth="5" strokeLinecap="round" {...moustaches}>
        <path className="logo-moustaches-g" d="M62 122 L8 108 M62 131 L4 132 M62 140 L10 158" />
        <path className="logo-moustaches-d" d="M138 122 L192 108 M138 131 L196 132 M138 140 L190 158" />
      </g>
    </svg>
  );
}
