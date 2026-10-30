import Image from "next/image";
import { Portrait } from "@/components/KiraNote";
import { espacesFines } from "@/lib/typo";

// Petite galerie de Kira (page À propos) : photos personnelles de Romain, 1536 × 2048, jamais en plein écran.
// Ordinateur et tablette : trois photos côte à côte. Téléphone : elles défilent à l'horizontale.
// Textes fournis par Romain : aucune phrase de Kira, aucune habitude inventée (charte, CLAUDE.md section 11).
const PHOTOS: { src: string; alt: string; legende?: string }[] = [
  { src: "/media/kira/kira-joue-plumeau.jpg", alt: "Kira qui joue avec sa canne à plumes" },
  { src: "/media/kira/kira-sphinx-table.jpg", alt: "Kira posée en sphinx sur la table" },
  {
    src: "/media/kira/kira-joue-avec-romain.jpg",
    alt: "Kira qui joue avec Romain",
    legende: "Séance de jeu quotidienne.",
  },
];

export function KiraGalerie() {
  return (
    <section aria-label="Kira en photos" className="reveal my-12 max-w-[44rem]">
      <div className="mb-5 flex items-center gap-4">
        <Portrait />
        <p className="font-medium">Kira en photos</p>
      </div>
      {/* contain:inline-size : la rangée défile dans la page au lieu d'élargir la colonne qui la contient. */}
      <ul className="-mx-4 flex [contain:inline-size] snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0">
        {PHOTOS.map((p) => (
          <li key={p.src} className="w-[68vw] shrink-0 snap-start sm:w-auto">
            <figure>
              <Image
                src={p.src}
                alt={p.alt}
                width={1536}
                height={2048}
                sizes="(min-width: 768px) 14rem, (min-width: 640px) 30vw, 68vw"
                quality={80}
                className="aspect-[3/4] w-full rounded-[1.25rem] bg-field object-cover"
              />
              {p.legende ? (
                <figcaption className="mt-3 text-small text-ink-soft">{espacesFines(p.legende)}</figcaption>
              ) : null}
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
