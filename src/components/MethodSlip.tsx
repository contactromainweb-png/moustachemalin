// Le parcours d'un comparatif, imprimé comme un ticket : chaque étape, ce qu'on y lit, et la source.
const ETAPES = [
  {
    titre: "La fiche technique",
    lignes: [
      ["Dimensions et poids accepté", "fabricant"],
      ["Capacité, autonomie, bruit annoncé", "fabricant"],
      ["Sécurité du chat (capteurs, arrêt)", "notice"],
    ],
  },
  {
    titre: "Le coût réel",
    lignes: [
      ["Consommables à racheter", "fabricant"],
      ["Entretien : temps et fréquence", "notice"],
    ],
  },
  {
    titre: "La vie avec l'appareil",
    lignes: [
      ["Service après-vente, garantie", "fabricant"],
      ["Tendances (pannes, bruit réel), si analysées", "retours d'acheteurs"],
    ],
  },
] as const;

export function MethodSlip() {
  return (
    <div className="my-12 bg-caramel-field px-4 py-10 sm:-mx-8 sm:px-8 lg:-mx-0">
      <div
        className="mx-auto max-w-[30rem] bg-paper px-5 pb-12 pt-6 text-ink sm:px-8"
        style={{
          clipPath:
            "polygon(0 0,100% 0,100% calc(100% - 12px),95% 100%,90% calc(100% - 12px),85% 100%,80% calc(100% - 12px),75% 100%,70% calc(100% - 12px),65% 100%,60% calc(100% - 12px),55% 100%,50% calc(100% - 12px),45% 100%,40% calc(100% - 12px),35% 100%,30% calc(100% - 12px),25% 100%,20% calc(100% - 12px),15% 100%,10% calc(100% - 12px),5% 100%,0 calc(100% - 12px))",
        }}
      >
        {ETAPES.map((etape) => (
          <section key={etape.titre} className="reveal mt-7 first:mt-0">
            <h3 className="font-semibold">{etape.titre}</h3>
            <ul className="mt-2 space-y-2">
              {etape.lignes.map(([quoi, source]) => (
                <li key={quoi} className="flex items-baseline gap-2">
                  <span>{quoi}</span>
                  <span
                    aria-hidden="true"
                    className="min-w-6 flex-1 translate-y-[-0.2em] self-end border-b-[3px] border-dotted border-ink-soft/50"
                  />
                  <span className="text-small text-ink-soft">{source}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <p className="-mx-5 mt-8 bg-ink px-5 py-3 text-paper sm:-mx-8 sm:px-8">
          Résultat : un choix par profil de chat, sans note inventée.
        </p>
      </div>
    </div>
  );
}
