import Link from "next/link";
import { BoutonAction } from "@/components/BoutonAction";
import { AUTEUR } from "@/lib/site";

// Blocs C et D : « Qui écrit ici » (texte de content/pages/qui-ecrit-ici.md, sans les passages
// « À VALIDER PAR ROMAIN ») puis « Comment on gagne notre vie » en bandeau orange.
// La photo de Romain n'est pas encore fournie : un médaillon neutre (son initiale) tient sa place.
export function QuiEcrit() {
  return (
    <>
      <section data-fond="page" aria-labelledby="titre-qui" className="px-4 pb-24 sm:px-8 lg:pb-32">
        <div className="mx-auto grid max-w-[90rem] items-center gap-10 rounded-[2rem] bg-field p-6 sm:p-10 lg:grid-cols-12 lg:gap-16 lg:p-16">
          {/* Emplacement photo : à remplacer par le portrait de Romain dès qu'il l'aura fourni. */}
          <div
            aria-hidden="true"
            className="reveal flex aspect-square w-40 items-center justify-center rounded-full bg-lavande text-nuit sm:w-56 lg:col-span-4 lg:w-full lg:max-w-[22rem]"
          >
            <span className="mot-serif text-[clamp(5rem,3rem+8vw,12rem)] leading-none">R</span>
          </div>
          <div className="lg:col-span-8">
            <h2 id="titre-qui" className="reveal font-display text-[clamp(2.75rem,1.4rem+5vw,6rem)]">
              Qui écrit <span className="mot-serif">ici</span>
            </h2>
            <p className="reveal mt-8 text-lead font-semibold">Bonjour, moi c&apos;est Romain.</p>
            <p className="reveal mt-4 max-w-[60ch] text-lead">
              J&apos;ai lancé Moustache Malin avec une idée simple&nbsp;: vous éviter de passer des heures à comparer des
              fiches produits pour finalement acheter le mauvais appareil.
            </p>
            <p className="reveal mt-4 max-w-[60ch]">
              Je ne teste pas les produits en laboratoire, et je le dis clairement. Je fais le travail de fond à votre
              place&nbsp;: je lis les fiches techniques ligne par ligne, je compare les modèles critère par critère, et je
              vous dis pour quel chat chaque appareil est fait.
            </p>
            <BoutonAction href={AUTEUR.page} className="reveal mt-8">
              En savoir plus sur moi et sur notre méthode
            </BoutonAction>
          </div>
        </div>
      </section>

      <section data-fond="orange" aria-labelledby="titre-transparence" className="px-4 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-[90rem] gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <h2 id="titre-transparence" className="reveal font-display text-head lg:col-span-5">
            Comment on gagne notre <span className="mot-serif">vie</span>
          </h2>
          <div className="lg:col-span-7">
            <p className="reveal max-w-[55ch] text-lead">
              Quand vous achetez via nos liens, Amazon nous reverse une petite commission,{" "}
              <strong className="font-semibold">sans aucun surcoût pour vous</strong>. Aucune marque ne paie pour
              apparaître ou pour monter dans nos classements.
            </p>
            <Link
              href="/affiliation/"
              className="reveal mt-6 inline-flex min-h-11 items-center gap-2 font-medium underline decoration-2 underline-offset-[6px]"
            >
              Tout savoir sur l&apos;affiliation <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
