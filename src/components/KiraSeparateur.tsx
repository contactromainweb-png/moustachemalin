// Petite Kira assise entre deux sections d'un article (pack 8a) : purement décorative (alt vide), 56 px, centrée dans
// un fin trait horizontal. Aucune bulle, aucun texte, aucune animation, aucun JavaScript. Placée au build par
// plugins/remark-bandes.mjs : 2 au plus par article, jamais à côté d'un produit, d'un bouton Amazon, d'un Mot de
// Kira, d'un encadré santé, du tableau, d'un quiz ou d'un test (Kira ne recommande jamais un produit).
export function KiraSeparateur() {
  return (
    <div aria-hidden="true" className="flex items-center gap-5 py-6">
      <span className="h-px flex-1 bg-ink/20" />
      {/* eslint-disable-next-line @next/next/no-img-element -- petit SVG statique, pas de redimensionnement utile */}
      <img src="/kira/kira-assise.svg" alt="" width={56} height={56} loading="lazy" decoding="async" className="size-14" />
      <span className="h-px flex-1 bg-ink/20" />
    </div>
  );
}
