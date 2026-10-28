import Image from "next/image";
import Link from "next/link";
import { BoutonAction } from "@/components/BoutonAction";
import { PHOTOS } from "@/lib/medias";
import { AUTEUR } from "@/lib/site";

// Blocs C et D : « Qui écrit ici » (texte de content/pages/qui-ecrit-ici.md, avec le portrait de Romain)
// puis « Comment on gagne notre vie » en bandeau orange.
export function QuiEcrit() {
  return (
    <>
      <section data-fond="page" aria-labelledby="titre-qui" className="px-4 pb-24 sm:px-8 lg:pb-32">
        <div className="mx-auto grid max-w-[90rem] items-center gap-10 rounded-[2rem] bg-field p-6 sm:p-10 lg:grid-cols-12 lg:gap-16 lg:p-16">
          {/* Portrait de Romain en rond, cadré sur le visage. */}
          <div className="reveal relative aspect-square w-40 overflow-hidden rounded-full bg-lavande sm:w-56 lg:col-span-4 lg:w-full lg:max-w-[22rem]">
            <Image
              src={PHOTOS.romain.src}
              alt={PHOTOS.romain.alt}
              fill
              quality={80}
              sizes="(min-width: 1024px) 22rem, (min-width: 640px) 14rem, 10rem"
              className="object-cover"
              style={{ objectPosition: PHOTOS.romain.position }}
            />
          </div>
          <div className="lg:col-span-8">
            <h2 id="titre-qui" className="reveal font-display text-[clamp(2.75rem,1.4rem+5vw,6rem)]">
              Qui écrit <span className="mot-serif">ici</span>
            </h2>
            <p className="reveal mt-8 text-lead font-semibold">Bonjour, moi c&apos;est Romain. Et voici Kira.</p>
            <p className="reveal mt-4 max-w-[60ch] text-lead">
              Kira, c&apos;est ma chatte&nbsp;: un peu plus d&apos;un an, fofolle, joueuse comme un petit chien, et fan de
              l&apos;eau qui coule du robinet. Avant elle, j&apos;ai eu beaucoup d&apos;autres chats. Le canapé griffé, la
              litière qui sent, le chat qui ne boit pas assez&nbsp;: je connais.
            </p>
            <p className="reveal mt-4 max-w-[60ch]">
              J&apos;en ai tiré une conviction&nbsp;: le bon équipement change vraiment la vie d&apos;un chat, et la vôtre.
              Ici, je fais le tri à votre place. Je ne teste pas en laboratoire, je le dis clairement&nbsp;: je décortique
              les fiches techniques et je vous dis pour quel chat chaque appareil est fait.
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
