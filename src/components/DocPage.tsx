import type { ReactNode } from "react";

// Mise en page simple des pages légales : une seule colonne de lecture.
type Props = { title: string; lead: string; updated: string; children: ReactNode };

export function DocPage({ title, lead, updated, children }: Props) {
  return (
    <div className="mx-auto max-w-[90rem] px-4 pt-10 sm:px-8 lg:pt-20">
      <h1 className="font-display rise max-w-[16ch] text-display">{title}</h1>
      <p className="rise mt-6 max-w-[38ch] text-lead" style={{ "--i": 1 } as React.CSSProperties}>
        {lead}
      </p>
      <div className="mt-16 max-w-[44rem] lg:ml-[20%]">
        {children}
        <p className="mt-16 text-small text-ink-soft">Mis à jour le {updated}</p>
      </div>
    </div>
  );
}
