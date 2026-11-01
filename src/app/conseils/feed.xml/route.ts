import { reponseFlux } from "@/lib/flux";

// Flux RSS de la rubrique (src/lib/flux.ts), généré au build comme /feed.xml.
export function GET() {
  return reponseFlux("conseils");
}
