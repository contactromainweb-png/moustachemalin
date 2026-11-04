import type { Metadata } from "next";
import Script from "next/script";
import { Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { GOATCOUNTER, UMAMI_ID } from "@/lib/mesure";
import { AUTEUR, LOGO, RESEAUX, SITE } from "@/lib/site";
import "./globals.css";

// Polices Google, hébergées par le site lui-même (aucune requête vers Google).
// Titres : Bricolage Grotesque, réduite à la seule variante utilisée (graisse 800, largeur 88 %) : 20 Ko au lieu
// de 76, dessin identique (voir scripts/police-titres.mjs). Texte : DM Sans, réduite aux graisses 400 à 600 : 22 Ko au
// lieu de 36, mêmes largeurs de texte (voir scripts/police-texte.mjs).
// Mots mis en valeur dans les titres : Instrument Serif italique (classe .mot-serif).
const display = localFont({
  src: "./polices/bricolage-grotesque-800-88.woff2",
  variable: "--font-bricolage",
  weight: "800",
  style: "normal",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "88%" }],
});

const serif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

const text = localFont({
  src: "./polices/dm-sans-400-600.woff2",
  variable: "--font-dm-sans",
  weight: "400 600",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} : l'équipement pour chat, sans se tromper`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.tagline,
  openGraph: {
    siteName: SITE.name,
    locale: "fr_FR",
    type: "website",
    // Image de partage : src/app/opengraph-image.tsx (ajoutée automatiquement par Next).
  },
  twitter: { card: "summary_large_image" },
  // Grandes vignettes autorisées dans Google (Discover, Images). Une page noindex remplace ce bloc par le sien.
  robots: { index: true, follow: true, "max-image-preview": "large" },
  // Balises de vérification : vides tant que le domaine n'est pas branché. Google Search Console se vérifie de
  // préférence par DNS chez OVH (rien à mettre ici) ; sinon, coller le code dans la variable Netlify
  // NEXT_PUBLIC_GOOGLE_VERIFICATION. Bing Webmaster Tools : import depuis Search Console, ou code dans
  // NEXT_PUBLIC_BING_VERIFICATION.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION } : undefined,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${display.variable} ${serif.variable} ${text.variable} antialiased`}>
      <head>
        {/* Fil RSS des articles (src/app/feed.xml/route.ts). Ici plutôt que dans metadata.alternates, que le canonical
            de chaque page remplace. */}
        <link rel="alternate" type="application/rss+xml" title={`${SITE.name} : les articles`} href="/feed.xml" />
      </head>
      <body className="flex min-h-svh flex-col">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-caramel-field focus:px-4 focus:py-3 focus:text-on-caramel"
        >
          Aller au contenu
        </a>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${SITE.url}/#organisation`,
                name: SITE.name,
                url: SITE.url,
                email: SITE.email,
                logo: { "@type": "ImageObject", url: `${SITE.url}${LOGO.src}`, width: LOGO.width, height: LOGO.height },
                founder: { "@id": `${SITE.url}${AUTEUR.page}#auteur` },
                sameAs: RESEAUX.map((r) => r.url),
              },
              {
                "@type": "Person",
                "@id": `${SITE.url}${AUTEUR.page}#auteur`,
                name: AUTEUR.nom,
                url: `${SITE.url}${AUTEUR.page}`,
                image: `${SITE.url}${AUTEUR.photo}`,
                worksFor: { "@id": `${SITE.url}/#organisation` },
              },
              {
                "@type": "WebSite",
                name: SITE.name,
                url: SITE.url,
                inLanguage: "fr-FR",
                publisher: { "@id": `${SITE.url}/#organisation` },
              },
            ],
          }}
        />
        <SiteHeader />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        {/* Statistiques sans cookie (src/lib/mesure.ts) : chargées après la page, seulement si un compte est branché. */}
        {UMAMI_ID ? (
          <Script src="https://cloud.umami.is/script.js" data-website-id={UMAMI_ID} strategy="lazyOnload" />
        ) : null}
        {GOATCOUNTER ? (
          <Script
            src="https://gc.zgo.at/count.js"
            data-goatcounter={`https://${GOATCOUNTER}.goatcounter.com/count`}
            strategy="lazyOnload"
          />
        ) : null}
      </body>
    </html>
  );
}
