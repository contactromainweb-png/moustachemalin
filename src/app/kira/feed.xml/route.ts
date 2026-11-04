import { reponseFluxKira } from "@/lib/flux";

// Flux RSS du tableau Pinterest « Kira et la bande » (src/lib/flux.ts), généré au build comme /feed.xml.
export function GET() {
  return reponseFluxKira();
}
