import Image from "next/image";
import Link from "next/link";
import { PHOTOS, type Photo } from "@/lib/medias";

// Comment un comparatif est fabriqué, en trois temps (résumé de la page /methode/).
// Ordinateur : trois photos de tailles différentes qui descendent en diagonale, le texte dans les vides.
// Téléphone : largeurs alternées (100 %, 62 % à droite, 78 % à gauche).

function Etape({
  photo,
  cadre,
  classePhoto,
  classeTexte,
  sizes,
  ouverture,
  children,
}: {
  photo: Photo;
  cadre: string;
  classePhoto: string;
  classeTexte: string;
  sizes: string;
  ouverture: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <figure className={`reveal ${classePhoto}`}>
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes={sizes}
          quality={70}
          className={`w-full object-cover ${cadre}`}
        />
        <figcaption className="mt-2 text-small text-ch-creme/80">{photo.credit}</figcaption>
      </figure>
      <div className={`reveal mt-5 max-w-[36ch] lg:mt-0 ${classeTexte}`}>
        <p>
          <strong className="font-semibold">{ouverture}</strong> {children}
        </p>
      </div>
    </>
  );
}

export function MethodeDiagonale() {
  return (
    <section
      id="methode"
      data-fin-pleine
      aria-labelledby="titre-methode"
      className="bg-ch-methode px-4 py-24 text-ch-creme sm:px-8 lg:px-2.5 lg:py-32"
    >
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-2.5">
        <div className="lg:col-span-6 lg:col-start-7 lg:pr-[3vw]">
          <h2 id="titre-methode" className="reveal font-display text-head">
            Comment nous comparons
          </h2>
          <p className="reveal mt-6 max-w-[40ch] text-lead">
            Nous ne testons pas les produits nous-mêmes : nous lisons ce que les fabricants publient, et nous le
            disons en haut de chaque comparatif.
          </p>
        </div>
      </div>

      {/* Premier temps : portrait à gauche, texte à sa droite. */}
      <div className="mt-14 lg:mt-20 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-2.5">
        <Etape
          photo={PHOTOS.chatCarton}
          cadre="aspect-[3/4] object-[50%_50%]"
          classePhoto="lg:col-span-4 lg:col-start-1 lg:pl-[3vw]"
          classeTexte="lg:col-span-3 lg:col-start-5"
          sizes="(min-width: 1024px) 31vw, 100vw"
          ouverture="D'abord, la fiche technique."
        >
          Dimensions, poids accepté, capacité, bruit annoncé : nous relevons ce que publie le fabricant, et ce que
          dit la notice sur la sécurité du chat.
        </Etape>
      </div>

      {/* Deuxième temps : carré au centre, plus bas que le portrait ; texte à sa droite. */}
      <div className="mt-14 flex flex-col items-end lg:mt-[calc(max(260px,26vw)-((100vw-130px)/3+30px-3vw)*4/3-2.5rem)] lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-2.5">
        <Etape
          photo={PHOTOS.chatSoleil}
          cadre="aspect-square object-[38%_80%]"
          classePhoto="w-[62%] lg:col-span-3 lg:col-start-6 lg:w-auto"
          classeTexte="self-start lg:col-span-3 lg:col-start-9"
          sizes="(min-width: 1024px) 24vw, 62vw"
          ouverture="Ensuite, le coût réel."
        >
          Un appareil bon marché dont les recharges coûtent cher n&apos;est pas un petit budget. Nous listons les
          consommables à racheter et le temps d&apos;entretien.
        </Etape>
      </div>

      {/* Troisième temps : paysage à droite, encore plus bas ; texte à sa gauche. */}
      <div className="mt-14 lg:mt-[180px] lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-2.5">
        <Etape
          photo={PHOTOS.chatCanape}
          cadre="aspect-[16/10] object-[50%_60%]"
          classePhoto="w-[78%] lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:w-auto lg:pr-[3vw]"
          classeTexte="lg:col-span-3 lg:col-start-4 lg:row-start-1 lg:justify-self-end"
          sizes="(min-width: 1024px) 40vw, 78vw"
          ouverture="Enfin, la vie avec l'appareil."
        >
          Garantie, service après-vente, bruit et place en appartement. Quand nous les avons analysés, les retours
          d&apos;acheteurs servent à repérer des tendances, sans jamais être cités.
        </Etape>
        <p className="reveal mt-8 lg:col-span-3 lg:col-start-4 lg:row-start-2 lg:justify-self-end lg:w-full lg:max-w-[36ch]">
          <Link
            href="/methode/"
            className="inline-flex min-h-12 items-center bg-ch-creme px-6 font-medium text-ch-encre transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          >
            Lire notre méthode complète
          </Link>
        </p>
      </div>
    </section>
  );
}
