"use client";

import { useEffect, useRef, useState } from "react";

// Sommaire des longs articles, placé à la construction par plugins/remark-sommaire.mjs (titres et ancres).
// Téléphone : une barre repliée qui reste en haut de l'écran pendant la lecture et affiche la section en cours ;
// un appui la déplie. Ordinateur : la liste dépliée en haut de l'article. Dans les deux cas, la section en cours
// est surlignée. Sans JavaScript : les liens fonctionnent, seule la mise en valeur de la section manque.
type Titre = { id: string; titre: string };

export function Sommaire({ titres: json }: { titres: string }) {
  const titres: Titre[] = JSON.parse(json);
  const [actif, setActif] = useState<string | null>(null);
  const details = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    // Section en cours : le dernier titre passé sous le haut de l'écran (marge de la barre du sommaire).
    let attente = 0;
    const calculer = () => {
      attente = 0;
      let courant: string | null = null;
      for (const t of titres) {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top < 120) courant = t.id;
      }
      setActif(courant);
    };
    const auDefilement = () => {
      if (!attente) attente = requestAnimationFrame(calculer);
    };
    calculer();
    window.addEventListener("scroll", auDefilement, { passive: true });
    return () => {
      window.removeEventListener("scroll", auDefilement);
      cancelAnimationFrame(attente);
    };
  }, [json]); // eslint-disable-line react-hooks/exhaustive-deps -- `titres` est recalculé depuis `json`

  const enCours = titres.find((t) => t.id === actif);
  const liste = (fermer: boolean) => (
    <ol className="space-y-1">
      {titres.map((t) => (
        <li key={t.id}>
          <a
            href={`#${t.id}`}
            aria-current={t.id === actif ? "location" : undefined}
            onClick={fermer ? () => details.current?.removeAttribute("open") : undefined}
            className="block rounded-lg border-l-4 border-transparent px-3 py-2 transition-colors duration-150 hover:bg-field aria-[current]:border-accent aria-[current]:bg-field aria-[current]:font-semibold"
          >
            {t.titre}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <nav aria-label="Sommaire" className="my-10 max-lg:sticky max-lg:top-0 max-lg:z-20 max-lg:-mx-4 max-lg:sm:-mx-8">
      <details
        ref={details}
        className="group border-b border-ink/15 bg-paper/95 px-4 backdrop-blur-sm sm:px-8 lg:hidden"
      >
        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
          <span className="font-semibold">Sommaire</span>
          <span className="min-w-0 flex-1 truncate text-small text-ink-soft">{enCours?.titre ?? ""}</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="size-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3.5 6 4.5 4.5L12.5 6" />
          </svg>
        </summary>
        <div className="max-h-[65svh] overflow-y-auto pb-4">{liste(true)}</div>
      </details>

      <div className="rounded-[1.5rem] border border-ink/15 px-6 py-6 max-lg:hidden">
        <p className="mb-3 font-semibold">Sommaire</p>
        {liste(false)}
      </div>
    </nav>
  );
}
