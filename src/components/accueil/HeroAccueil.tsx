import Image from "next/image";
import Link from "next/link";
import { HeroVideo } from "@/components/accueil/HeroVideo";
import { VIDEO_ACCUEIL } from "@/lib/medias";

// Les cinq aplats de la colonne de droite : chacun est la couleur du chapitre vers lequel il mène.
const NUANCIER = [
  { href: "#gamelle", label: "La gamelle", classe: "bg-ch-gamelle text-ch-encre" },
  { href: "#fontaine", label: "La fontaine", classe: "bg-ch-fontaine text-ch-encre" },
  { href: "#litiere", label: "La litière", classe: "bg-ch-litiere text-ch-encre" },
  { href: "#deja-compare", label: "Déjà comparé", classe: "bg-ch-articles text-ch-creme" },
  { href: "#methode", label: "Notre méthode", classe: "bg-ch-methode text-ch-creme" },
];

// Premier écran : la vidéo d'un chat (ordinateur) ou sa première image (téléphone), et le nuancier des chapitres.
// Sur ordinateur, la phrase d'introduction se pose sur la vidéo ; sur téléphone, elle passe sous le nuancier.
export function HeroAccueil() {
  const poster = VIDEO_ACCUEIL.poster;
  return (
    <section
      data-hero
      aria-labelledby="titre-accueil"
      className="grid gap-2.5 p-2.5 lg:h-[calc(100svh-4.75rem)] lg:min-h-[38rem] lg:grid-cols-12 lg:grid-rows-1"
    >
      <div className="relative h-[64svh] min-h-[26rem] overflow-hidden bg-field lg:col-span-10 lg:col-start-1 lg:row-start-1 lg:h-auto lg:min-h-0">
        <div data-hero-media className="absolute inset-0">
          <Image
            src={poster.src}
            alt={poster.alt}
            fill
            preload
            fetchPriority="high"
            quality={60}
            sizes="(min-width: 1024px) 83vw, 100vw"
            className="object-cover object-[70%_50%]"
          />
          <HeroVideo src={VIDEO_ACCUEIL.src} />
        </div>

        <div className="absolute left-0 top-0 bg-paper px-4 pb-4 pt-3 sm:px-6 lg:px-8 lg:pb-7 lg:pt-5">
          <h1 id="titre-accueil" className="font-display rise text-[clamp(2.75rem,12vw,4.5rem)] lg:text-display">
            À hauteur
            <br />
            de moustaches
          </h1>
        </div>

        <Link
          href="/litieres/litiere-autonettoyante/"
          className="absolute bottom-5 left-1/2 inline-flex min-h-12 -translate-x-1/2 items-center whitespace-nowrap bg-accent px-6 font-medium text-on-accent transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] lg:bottom-8 lg:left-auto lg:right-8 lg:translate-x-0 lg:px-7"
        >
          Lire le comparatif des litières
        </Link>
      </div>

      {/* Ordinateur : posée en bas à gauche de la vidéo (même case de la grille). Téléphone : sous le nuancier. */}
      <div className="order-last px-2 pb-4 pt-6 lg:order-none lg:col-span-5 lg:col-start-1 lg:relative lg:z-10 lg:row-start-1 lg:self-end lg:p-0">
        <div className="lg:bg-paper lg:px-8 lg:py-6">
          <p className="rise max-w-[36ch] text-lead lg:text-body" style={{ "--i": 1 } as React.CSSProperties}>
            Litières, fontaines, gamelles, arbres à chat : nous comparons l&apos;équipement du chat à partir des
            fiches techniques des fabricants.
          </p>
          <p className="mt-3 text-small text-ink-soft">{poster.credit}</p>
        </div>
      </div>

      <nav aria-label="Chapitres de la page" className="grid lg:col-span-2 lg:col-start-11 lg:row-start-1 lg:grid-rows-5">
        {NUANCIER.map((n) => (
          <a
            key={n.href}
            href={n.href}
            className={`${n.classe} group flex min-h-13 focus-visible:outline-current focus-visible:-outline-offset-[6px] items-center px-5 text-small lg:items-start lg:p-5`}
          >
            <span className="underline-offset-4 decoration-2 group-hover:underline">{n.label}</span>
          </a>
        ))}
      </nav>
    </section>
  );
}
