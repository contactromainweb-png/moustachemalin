import { readFile } from "node:fs/promises";
import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

// Image de partage par défaut (Open Graph, 1200 × 630), fabriquée à la construction du site avec les vraies polices :
// le symbole à gauche, « Moustache malin » en relief à droite, la promesse du site dessous.
// Polices TTF dans src/app/polices/og/ (next/og ne lit pas le WOFF2), produites par scripts/polices-og.mjs.
// Les articles ajoutent leur propre image verticale (Pinterest) quand ils en ont une : voir articleMetadata.
export const alt = "Logo Moustache Malin : une tête de chat orange aux six moustaches, qui fait un clin d'œil.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Lecture des polices et du symbole mise en cache : sans elle, la lecture de fichiers rendrait l'image dynamique
// (fabriquée à chaque visite) ; avec, elle est fabriquée une seule fois, à la construction du site.
// Les chemins en new URL(…, import.meta.url) font embarquer ces fichiers avec le code de la page.
async function fichiers() {
  "use cache";
  cacheLife("max");
  return Promise.all([
    readFile(new URL("./polices/og/bricolage-grotesque-800-88.ttf", import.meta.url), "base64"),
    readFile(new URL("./polices/og/instrument-serif-italique.ttf", import.meta.url), "base64"),
    readFile(new URL("./polices/og/dm-sans-400.ttf", import.meta.url), "base64"),
    readFile(new URL("../../public/brand/logo-mark.svg", import.meta.url), "base64"),
  ]);
}

export default async function Image() {
  const [titre64, serif64, texte64, symbole] = await fichiers();
  const [titre, serif, texte] = [titre64, serif64, texte64].map((b) => Buffer.from(b, "base64"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 80px",
          background: "#FAF7F2",
          color: "#14213D",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/svg+xml;base64,${symbole}`}
          alt=""
          width={300}
          height={315}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.92 }}>
            <span style={{ fontFamily: "Bricolage Grotesque", fontSize: 128, textShadow: "0 5px 0 #B9A6FF" }}>Moustache</span>
            <span
              style={{ fontFamily: "Instrument Serif", fontSize: 150, color: "#FF7A1A", textShadow: "0 5px 0 #B84A06" }}
            >
              malin
            </span>
          </div>
          <span style={{ fontFamily: "DM Sans", fontSize: 34, marginTop: 28, maxWidth: 640, lineHeight: 1.3 }}>
            {SITE.tagline}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage Grotesque", data: titre, weight: 800, style: "normal" },
        { name: "Instrument Serif", data: serif, weight: 400, style: "italic" },
        { name: "DM Sans", data: texte, weight: 400, style: "normal" },
      ],
    },
  );
}
