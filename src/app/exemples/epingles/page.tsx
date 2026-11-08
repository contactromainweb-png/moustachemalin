import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { epinglesDe, estPubliee, aujourdhui } from "@/lib/epingles";
import { cheminFlux, cleFluxDe, FLUX } from "@/lib/flux";
import { articlesDuFlux } from "@/lib/rubriques";

// Planche de contrôle des épingles fraîches (CLAUDE.md §11 ter) : les 36 visuels, jour par jour, avec le tableau
// Pinterest visé et le titre et la description qui partiront dans le flux. Cachée aux moteurs, hors plan du site.
export const metadata: Metadata = {
  title: "Planche des épingles",
  robots: { index: false, follow: false },
};

const dateLongue = (jour: string) =>
  new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${jour}T12:00:00Z`),
  );

export default function Page() {
  const epingles = articlesDuFlux()
    .flatMap(epinglesDe)
    .sort((a, b) => a.publication.localeCompare(b.publication) || a.fm.slug.localeCompare(b.fm.slug));
  const jours = [...new Set(epingles.map((e) => e.publication))];
  const publiees = epingles.filter(estPubliee).length;

  return (
    <div className="mx-auto max-w-[90rem] px-4 pb-24 pt-10 sm:px-8 lg:pt-20">
      <h1 className="font-display text-display max-w-[16ch]">Planche des épingles</h1>
      <p className="mt-6 max-w-[52ch] text-lead">
        {epingles.length} épingles fraîches, du {dateLongue(jours[0])} au {dateLongue(jours.at(-1)!)}. Chacune entre dans le
        flux de son tableau le jour indiqué, au build quotidien de 6 h.
      </p>
      <p className="mt-3 text-small text-ink-soft">
        Construit le {dateLongue(aujourdhui())} : {publiees} déjà dans les flux, {epingles.length - publiees} à venir.
      </p>

      {jours.map((jour) => (
        <section key={jour} className="mt-16" aria-labelledby={`jour-${jour}`}>
          <h2 id={`jour-${jour}`} className="font-display text-[clamp(1.5rem,1rem+1.5vw,2.25rem)] first-letter:uppercase">
            {dateLongue(jour)}
          </h2>
          <ul className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {epingles
              .filter((e) => e.publication === jour)
              .map((e) => {
                const cle = cleFluxDe(e.fm.rubrique);
                return (
                  <li key={e.image} className="flex flex-col gap-4">
                    <Image
                      src={e.image}
                      alt={`Épingle « ${e.accroche} »`}
                      width={1000}
                      height={1500}
                      unoptimized
                      loading="lazy"
                      className="w-full max-w-[24rem] rounded-[1rem] ring-1 ring-black/10"
                    />
                    <dl className="grid gap-1.5 text-small">
                      <div>
                        <dt className="inline font-semibold">Tableau : </dt>
                        <dd className="inline">
                          {cle ? `${FLUX[cle].tableau} (${cheminFlux(cle)})` : "aucun flux"}
                          {estPubliee(e) ? " · déjà dans le flux" : " · à venir"}
                        </dd>
                      </div>
                      <div>
                        <dt className="inline font-semibold">Variante : </dt>
                        <dd className="inline">{e.variante === "question" ? "A, question" : `B, à retenir (fond ${e.fond})`}</dd>
                      </div>
                      <div>
                        <dt className="inline font-semibold">Titre du flux : </dt>
                        <dd className="inline">{e.titre}</dd>
                      </div>
                      <div>
                        <dt className="inline font-semibold">Description : </dt>
                        <dd className="inline">{e.description}</dd>
                      </div>
                      <div>
                        <dt className="inline font-semibold">Lien : </dt>
                        <dd className="inline break-all">
                          <Link href={e.lien} className="underline decoration-accent underline-offset-2">
                            {e.lien}
                          </Link>
                        </dd>
                      </div>
                    </dl>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
    </div>
  );
}
