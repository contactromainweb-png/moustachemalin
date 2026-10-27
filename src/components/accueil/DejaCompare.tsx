import Image from "next/image";
import Link from "next/link";
import { PHOTOS } from "@/lib/medias";
import { articlesDeRubrique } from "@/lib/rubriques";
import { PAGES_INFO, pageEnLigne, RUBRIQUES, rubriquesEnLigne } from "@/lib/site";

type Ligne = { genre: string; titre: string; valeur: string; href: string };

// Tout ce qui est en ligne, calculé au build : articles, rubriques, puis pages qui expliquent le site.
// Un nouvel article apparaît ici dès que sa page existe.
function lignes(): Ligne[][] {
  const articles = RUBRIQUES.flatMap((r) =>
    articlesDeRubrique(r.href.replaceAll("/", "")).map((a) => ({
      genre: a.type === "comparatif" ? "Comparatif" : "Guide",
      titre: a.titre,
      valeur: r.label,
      href: a.href,
    })),
  );
  const rubriques = rubriquesEnLigne().map((r) => {
    const n = articlesDeRubrique(r.href.replaceAll("/", "")).length;
    return { genre: "Rubrique", titre: r.label, valeur: `${n} article${n > 1 ? "s" : ""}`, href: r.href };
  });
  const pages = PAGES_INFO.filter((p) => ["/methode/", "/affiliation/", "/a-propos/"].includes(p.href) && pageEnLigne(p.href)).map(
    (p) => ({ genre: "Page", titre: p.label, valeur: "", href: p.href }),
  );
  return [articles, rubriques, pages].filter((g) => g.length > 0);
}

function Fleche() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1">
      <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

export function DejaCompare() {
  const photo = PHOTOS.chatCartons;
  return (
    <section
      id="deja-compare"
      aria-labelledby="titre-deja-compare"
      className="bg-ch-articles px-4 py-24 text-ch-creme sm:px-8 lg:px-2.5 lg:py-32"
    >
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-2.5">
        <h2 id="titre-deja-compare" className="reveal font-display text-head lg:col-span-12 lg:px-[3vw] lg:[text-indent:3vw]">
          Ce que nous avons
          <br />
          déjà comparé
        </h2>


        <div className="mt-14 lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:mt-24 lg:pr-[3vw]">
          {lignes().map((groupe, g) => (
            <ul key={g} className={g > 0 ? "mt-11" : ""}>
              {groupe.map((l) => (
                <li key={l.href} className="reveal">
                  <Link
                    href={l.href}
                    className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 py-3 [grid-template-areas:'genre_valeur'_'titre_titre'] lg:grid-cols-[7.5rem_minmax(0,1fr)_7rem] lg:[grid-template-areas:'genre_titre_valeur']"
                  >
                    <span className="text-small text-ch-creme/80 [grid-area:genre]">{l.genre}</span>
                    <span className="mt-1 decoration-2 underline-offset-4 [grid-area:titre] group-hover:underline lg:mt-0">
                      {l.titre}
                    </span>
                    <span className="flex items-center justify-end gap-3 text-small text-ch-creme/80 [grid-area:valeur]">
                      {l.valeur}
                      <Fleche />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>

        <figure className="reveal ml-auto mt-16 w-[60%] lg:col-span-4 lg:col-start-1 lg:row-start-2 lg:ml-0 lg:mt-0 lg:w-auto lg:self-end lg:pl-[3vw]">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 1024px) 30vw, 60vw"
            quality={70}
            className="aspect-[4/5] w-full object-cover object-[68%_50%]"
          />
          <figcaption className="mt-2 text-small text-ch-creme/80">{photo.credit}</figcaption>
        </figure>
      </div>
    </section>
  );
}
