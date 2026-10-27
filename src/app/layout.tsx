import type { Metadata } from "next";
import { Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { IMAGE_PARTAGE } from "@/lib/medias";
import { SITE } from "@/lib/site";
import "./globals.css";

// Polices Google, hébergées par le site lui-même (aucune requête vers Google).
const display = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  subsets: ["latin"],
});

const text = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
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
    images: [IMAGE_PARTAGE],
  },
  twitter: { card: "summary_large_image", images: [IMAGE_PARTAGE.url] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${display.variable} ${text.variable} antialiased`}>
      <body className="flex min-h-svh flex-col">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
        >
          Aller au contenu
        </a>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              { "@type": "Organization", "@id": `${SITE.url}/#organisation`, name: SITE.name, url: SITE.url, email: SITE.email },
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
      </body>
    </html>
  );
}
