"use client";

import { lazy, Suspense, useSyncExternalStore } from "react";
import { JeuBalleAttente } from "@/components/JeuBalleAttente";

// Le mini-jeu de la balle (JeuBalle), chargé après la page, côté navigateur seulement (React.lazy, une fois la page
// hydratée). En attendant, une boîte de même hauteur (JeuBalleAttente) évite tout décalage. Sans JavaScript, rien ne
// s'affiche (data-avec-js). Importé par ClientCommun : voir la raison là-bas.
const Jeu = lazy(() => import("@/components/JeuBalle").then((m) => ({ default: m.JeuBalle })));

const sAbonner = () => () => {};

export function JeuBalleDiffere({ className = "" }: { className?: string }) {
  const attente = <JeuBalleAttente />;
  // false au rendu serveur et à l'hydratation, true ensuite : le jeu ne se charge qu'après.
  const monte = useSyncExternalStore(sAbonner, () => true, () => false);
  return (
    <div data-avec-js className={className}>
      {monte ? (
        <Suspense fallback={attente}>
          <Jeu />
        </Suspense>
      ) : (
        attente
      )}
    </div>
  );
}

