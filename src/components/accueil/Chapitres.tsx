import Image from "next/image";
import Link from "next/link";
import { ScenePilote } from "@/components/accueil/ScenePilote";
import { CHAPITRES } from "@/lib/accueil";
import { pageEnLigne } from "@/lib/site";

const COLONNE = { 1: "lg:col-start-1", 2: "lg:col-start-2", 3: "lg:col-start-3", 4: "lg:col-start-4" } as const;

// Les quatre objets du chat, un écran chacun, sur l'aplat de sa couleur.
// Sans 3D (téléphone, mouvement réduit, appareil modeste) : la photo du chapitre remplit l'écran.
// Avec 3D (ordinateur) : la scène remplace la photo de fond, qui passe en petit dans la carte.
// La carte encre avance d'une colonne à chaque objet.
export function Chapitres() {
  return (
    <section aria-label="Les objets du chat" className="group/vitrine relative">
      <ScenePilote ids={CHAPITRES.map((c) => c.id)} />

      {CHAPITRES.map((c, i) => (
        <article
          key={c.id}
          id={c.id}
          aria-labelledby={`titre-${c.id}`}
          className={`${c.fond} relative flex h-svh min-h-[34rem] flex-col justify-end lg:grid lg:min-h-[40rem] lg:grid-cols-4 lg:items-center lg:gap-2.5 lg:px-2.5`}
        >
          {/* Téléphone : la photo occupe la place au-dessus de la carte. Ordinateur : tout l'écran. */}
          <div className="relative flex-1 lg:absolute lg:inset-0 group-data-[scene=on]/vitrine:hidden">
            <Image
              src={c.photo.src}
              alt={c.photo.alt}
              fill
              sizes="100vw"
              quality={70}
              className={`object-cover ${c.cadrage} lg:object-center`}
            />
          </div>

          <div
            data-carte
            style={{ "--i": i } as React.CSSProperties}
            className={`${COLONNE[c.colonne]} relative z-20 flex flex-col bg-ch-encre p-5 text-ch-creme lg:min-h-[52svh] lg:p-7`}
          >
            <h2 id={`titre-${c.id}`} className="font-display text-head lg:text-[clamp(2rem,1.4rem+1.2vw,2.75rem)]">
              {c.nom}
            </h2>
            <p className="mt-4 max-w-[34ch]">{c.fait}</p>
            <p className="mt-2 text-small text-ch-creme/80">{c.detail}</p>

            <div className="mt-6 hidden group-data-[scene=on]/vitrine:block">
              <Image
                src={c.photo.src}
                alt=""
                width={c.photo.width}
                height={c.photo.height}
                sizes="22vw"
                quality={70}
                className="aspect-[3/2] w-full object-cover"
              />
            </div>
            <p className="mt-3 text-small text-ch-creme/80">{c.photo.credit}</p>

            {c.lien && pageEnLigne(c.lien.href) ? (
              <div className="mt-auto pt-6">
                <Link
                  href={c.lien.href}
                  className="inline-flex min-h-12 w-full items-center justify-center bg-ch-creme px-4 text-center font-medium text-ch-encre transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                >
                  {c.lien.label}
                </Link>
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </section>
  );
}
