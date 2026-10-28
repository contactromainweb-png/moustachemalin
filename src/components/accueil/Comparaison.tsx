import Link from "next/link";
import { getProduct } from "@/lib/products";
import { pageEnLigne } from "@/lib/site";

// Scène 6 : « Comment nous comparons ». Un vrai comparatif se construit sous les yeux : la fiche technique d'un
// appareil se remplit, devient un tableau à trois colonnes, puis le badge « Notre choix » se pose sur le modèle
// retenu dans le comparatif des litières. Pendant ce temps, le critère du titre défile : sécurité, bruit,
// entretien, coût, et la ligne correspondante s'allume. Toutes les valeurs viennent des fiches produits
// (content/products) ; « Non précisé » quand le fabricant ne donne rien.

const CRITERES = [
  { mot: "sécurité", ligne: "Capteurs" },
  { mot: "bruit", ligne: "Bruit annoncé" },
  { mot: "entretien", ligne: "Bac à déchets" },
  { mot: "coût", ligne: "Consommables à racheter" },
];

// Le meilleur globalement, le meilleur pour plusieurs chats, le meilleur petit budget (comparatif des litières).
const ASINS = ["B0D9QGW2M6", "B0DG59SQ5P", "B0H1WVSVQ3"];
const COMPARATIF = "/litieres/litiere-autonettoyante/";

export function Comparaison() {
  const produits = ASINS.map(getProduct);
  const valeurs = (p: (typeof produits)[number]) => [
    p.specs.capteurs ?? "Non précisé",
    p.specs.bruit ?? "Non précisé",
    (p.specs.bacDechets ?? "Non précisé").replace(/ \(.*\)$/, ""),
    `${p.consommables.length} : ${p.consommables.map((c) => c.toLowerCase()).join(", ")}`,
  ];
  const nomCourt = (p: (typeof produits)[number]) => p.name.replace(/ litière autonettoyante ouverte/, "");
  const fiche = produits[0];
  const choix = 0;

  return (
    <section data-comparaison data-fond="lavande" aria-labelledby="titre-comparaison" className="group/comp relative overflow-x-clip">
      <div
        data-comparaison-scene
        className="mx-auto grid max-w-[90rem] gap-10 px-4 py-24 sm:px-8 lg:min-h-svh lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-16"
      >
        <div className="lg:col-span-5">
          <h2 id="titre-comparaison" className="font-display text-[clamp(2.75rem,1.4rem+5vw,6.5rem)]">
            <span className="sr-only">
              Nous comparons la sécurité, le bruit, l&apos;entretien et le coût.
            </span>
            <span aria-hidden="true">
              Nous comparons{" "}
              <span className="block">
                {/* Le critère défile (data-defile, posé par Mouvement) ; sans animation, seul le premier est affiché. */}
                <span data-critere-fenetre className="relative inline-grid overflow-hidden align-bottom">
                  {CRITERES.map((c, i) => (
                    <span
                      key={c.mot}
                      data-critere
                      className={`mot-serif col-start-1 row-start-1 pb-[0.12em] ${i ? "hidden group-data-[defile]/comp:block" : ""}`}
                    >
                      {i === 0 ? "la " : i === 1 ? "le " : i === 2 ? "l'" : "le "}
                      {c.mot}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          </h2>
          <p className="mt-8 max-w-[38ch] text-lead">
            Chaque appareil part de sa fiche technique : nous la relevons ligne par ligne, puis nous comparons les
            modèles critère par critère. Quand le fabricant ne dit rien, nous l&apos;écrivons.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {pageEnLigne(COMPARATIF) ? (
              <Link href={COMPARATIF} className="py-2 font-medium underline decoration-2 underline-offset-[6px]">
                Voir le comparatif complet
              </Link>
            ) : null}
            <Link href="/methode/" className="py-2 font-medium underline decoration-2 underline-offset-[6px]">
              Notre méthode
            </Link>
          </div>
        </div>

        <div data-comparaison-machine aria-hidden="true" className="relative lg:col-span-7">
          {/* 1. La fiche technique du premier appareil. */}
          <div
            data-fiche
            className="max-w-[26rem] rounded-[1.5rem] bg-blanc p-6 text-nuit shadow-[0_24px_60px_-28px_rgb(20_33_61/0.45)]"
          >
            <p className="text-small font-medium text-ink-soft">Fiche technique</p>
            <p className="font-display mt-1 text-[1.75rem]">{fiche.name}</p>
            <dl className="mt-4 divide-y divide-nuit/10">
              {[
                ["Type", fiche.specs.type],
                ["Bac à déchets", fiche.specs.bacDechets],
                ["Poids du chat", fiche.specs.poidsChat],
                ["Capteurs", fiche.specs.capteurs],
              ].map(([t, v]) => (
                <div key={t} data-fiche-ligne className="flex justify-between gap-4 py-2.5">
                  <dt className="text-ink-soft">{t}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* 2. Le tableau : trois modèles, quatre critères. 3. Le badge sur le modèle retenu.
              Téléphone : chaque critère devient un petit bloc, un modèle par ligne. */}
          <div
            data-tableau
            className="relative mt-6 overflow-hidden rounded-[1.5rem] bg-blanc text-nuit shadow-[0_24px_60px_-28px_rgb(20_33_61/0.45)] lg:group-data-[defile]/comp:absolute lg:group-data-[defile]/comp:inset-x-0 lg:group-data-[defile]/comp:top-[18%] lg:group-data-[defile]/comp:mt-0"
          >
            <div className="grid text-[1rem] leading-snug lg:grid-cols-[minmax(0,0.9fr)_repeat(3,minmax(0,1fr))]">
              <div className="max-lg:hidden lg:p-4 lg:pt-11" />
              {produits.map((p, i) => (
                <div
                  key={p.asin}
                  data-tableau-colonne={i === choix ? "choix" : undefined}
                  className="relative px-2.5 py-3 font-display text-[1.05rem] max-lg:hidden lg:p-4 lg:pt-11 lg:text-[1.35rem]"
                >
                  {nomCourt(p)}
                  {i === choix ? (
                    <span
                      data-badge
                      className="absolute left-3 top-2.5 rotate-[-6deg] rounded-full bg-accent px-3 py-1 font-sans text-small font-semibold text-on-accent shadow-md max-lg:hidden"
                    >
                      Notre choix
                    </span>
                  ) : null}
                </div>
              ))}
              {CRITERES.map((c, r) => (
                <div key={c.ligne} data-tableau-ligne className="contents">
                  <div data-ligne-fond className="border-t border-nuit/10 px-4 pb-1 pt-4 text-small font-medium text-ink-soft lg:p-4 lg:text-[1rem] lg:font-normal">
                    {c.ligne}
                  </div>
                  {produits.map((p) => (
                    <div key={p.asin} data-ligne-fond className="px-4 pb-2 last:pb-4 lg:border-t lg:border-nuit/10 lg:p-4">
                      <span className="font-medium lg:hidden">{nomCourt(p)} : </span>
                      {valeurs(p)[r]}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <p data-badge className="border-t border-nuit/10 bg-accent px-4 py-3 font-medium text-on-accent lg:hidden">
              Notre choix : {produits[choix].name}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
