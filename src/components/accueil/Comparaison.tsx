import Link from "next/link";
import { BoutonAction } from "@/components/BoutonAction";
import { pageEnLigne } from "@/lib/site";
import { espacesFines } from "@/lib/typo";

// « Ce qu'on vérifie avant de vous recommander un appareil » : les quatre critères de nos comparatifs, expliqués
// avec l'exemple des litières autonettoyantes, sans nom de produit. Simple apparition des cartes (CSS), aucune section
// bloquée au défilement. Téléphone : mêmes cartes, empilées.

const COMPARATIF = "/litieres/litiere-autonettoyante/";

// Icônes au trait, dessinées sur une grille de 24 px.
const CRITERES: { titre: string; texte: string; icone: React.ReactNode }[] = [
  {
    titre: "Sécurité",
    texte: "Combien de capteurs détectent le chat, et que se passe-t-il s'il entre pendant un nettoyage ?",
    icone: (
      <>
        <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z" />
        <path d="m8.8 12.2 2.2 2.2 4.3-4.6" />
      </>
    ),
  },
  {
    titre: "Bruit",
    texte: "Le niveau sonore annoncé par le fabricant, quand il le donne. Sinon, on le dit.",
    icone: (
      <>
        <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" />
        <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18.2 6.5a8 8 0 0 1 0 11" />
      </>
    ),
  },
  {
    titre: "Entretien",
    texte: "Tous les combien vider le bac à déchets, et ce qui se démonte pour le nettoyer.",
    icone: (
      <>
        <path d="M5 7.5h14M9.5 7.5V5h5v2.5" />
        <path d="M6.5 7.5 7.4 19a1.5 1.5 0 0 0 1.5 1.4h6.2a1.5 1.5 0 0 0 1.5-1.4l.9-11.5" />
        <path d="M10.3 11v5.5M13.7 11v5.5" />
      </>
    ),
  },
  {
    titre: "Coût réel",
    texte: "Le prix d'achat ne suffit pas : on liste les consommables à racheter (sacs, filtres…).",
    icone: (
      <>
        <path d="M6 3.5h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3v-17Z" />
        <path d="M9 8.5h6M9 12h6M9 15.5h3.5" />
      </>
    ),
  },
];

export function Comparaison() {
  return (
    <section data-fond="lavande" aria-labelledby="titre-comparaison" className="px-4 py-20 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[90rem]">
        <div className="max-w-[46rem]">
          <h2 id="titre-comparaison" data-apparait className="reveal font-display text-[clamp(2.5rem,1.4rem+4vw,5.5rem)]">
            Ce qu&apos;on <span className="mot-serif">vérifie</span> avant de vous recommander un appareil
          </h2>
          <p data-apparait className="reveal mt-6 text-lead">
            Exemple avec les litières autonettoyantes, notre comparatif le plus lu.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
          {CRITERES.map((c, i) => (
            <li
              key={c.titre}
              data-apparait
              style={{ "--i": i } as React.CSSProperties}
              className="reveal flex flex-col rounded-[1.5rem] bg-blanc p-6 text-nuit shadow-[0_24px_60px_-34px_rgb(20_33_61/0.45)] lg:p-8"
            >
              <svg
                aria-hidden="true"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-nuit"
              >
                {c.icone}
              </svg>
              <h3 className="font-display mt-6 text-[1.75rem] leading-tight">{c.titre}</h3>
              <p className="mt-3">{espacesFines(c.texte)}</p>
            </li>
          ))}
        </ul>

        <div data-apparait className="reveal mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
          {pageEnLigne(COMPARATIF) ? (
            <BoutonAction href={COMPARATIF}>Voir le comparatif des litières autonettoyantes</BoutonAction>
          ) : null}
          <Link href="/methode/" className="py-2 font-medium underline decoration-2 underline-offset-[6px]">
            Notre méthode en détail
          </Link>
        </div>
      </div>
    </section>
  );
}
