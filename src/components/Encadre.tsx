import type { ReactNode } from "react";

// Encadrés de lecture, dans un article MDX : <Encadre type="retenir">…</Encadre> (ou "attention", "astuce").
// Aussi enregistré sous le nom <Callout> (même composant). Le titre (« À retenir »…) est affiché par le composant.
// Ils mettent en valeur une idée clé DÉJÀ écrite dans l'article (aucun contenu nouveau), 2 à 4 fois par article.
// Jamais pour un conseil de soin (c'est le rôle de VetNotice) ni pour une phrase de Kira (KiraNote). Seule exception :
// « attention » peut reprendre un signe d'urgence déjà écrit qui renvoie au vétérinaire (guide litière qui sent).
const TYPES = {
  retenir: {
    titre: "À retenir",
    fond: "bg-lavande/45",
    icone: (
      <>
        <path d="M9 18h6M10 21h4" />
        <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1.1 1.3 1.1 2.2h5c0-.9.5-1.7 1.1-2.2A6 6 0 0 0 12 3Z" />
      </>
    ),
  },
  attention: {
    titre: "Attention",
    fond: "bg-accent/20",
    icone: (
      <>
        <path d="M10.3 4.2 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9.5v4.5M12 17h.01" />
      </>
    ),
  },
  astuce: {
    titre: "Astuce",
    fond: "bg-field",
    icone: (
      <path d="M12 3.5l2.1 5.4 5.4 2.1-5.4 2.1-2.1 5.4-2.1-5.4-5.4-2.1 5.4-2.1L12 3.5ZM18.5 15.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z" />
    ),
  },
};

export function Encadre({ type, children }: { type: keyof typeof TYPES; children: ReactNode }) {
  const t = TYPES[type];
  return (
    <aside className={`reveal my-10 flex gap-4 rounded-[1.5rem] px-5 py-6 sm:px-7 ${t.fond}`}>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blanc text-nuit">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="size-6"
        >
          {t.icone}
        </svg>
      </span>
      <div className="min-w-0 [&>p:last-child]:mb-0 [&>p]:mb-3">
        <p className="mb-2 font-semibold">{t.titre}</p>
        {children}
      </div>
    </aside>
  );
}
