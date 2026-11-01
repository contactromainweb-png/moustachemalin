"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

// Menu dépliant du téléphone (<details>, utilisable sans JavaScript). L'en-tête reste en place d'une page à l'autre :
// sans ceci, le menu resterait ouvert par-dessus la nouvelle page. Il se ferme au clic sur un lien et à chaque
// changement d'adresse (retour arrière compris).
export function MenuTelephone({ children, className }: { children: ReactNode; className?: string }) {
  const menu = useRef<HTMLDetailsElement>(null);
  const chemin = usePathname();

  useEffect(() => {
    if (menu.current) menu.current.open = false;
  }, [chemin]);

  return (
    <details
      ref={menu}
      className={className}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a") && menu.current) menu.current.open = false;
      }}
    >
      {children}
    </details>
  );
}
