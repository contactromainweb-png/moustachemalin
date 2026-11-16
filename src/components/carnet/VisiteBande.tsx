"use client";

import { useEffect } from "react";
import { majCarnet } from "@/lib/carnet";

// Page /la-bande-de-kira/ : note la visite dans le carnet (badge « La bande »). Aucun rendu ; sans profil, rien.
export function VisiteBande() {
  useEffect(() => {
    majCarnet((c) => (c.bande ? c : { ...c, bande: true }));
  }, []);
  return null;
}
