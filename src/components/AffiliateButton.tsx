"use client";

import { mesurerClicAffilie, type Emplacement } from "@/lib/mesure";

// Bouton vers la fiche Amazon d'un produit. Le tag Partenaire vient de NEXT_PUBLIC_AMAZON_TAG
// (fichier .env.local en local, variables d'environnement sur Netlify).
const TAG = process.env.NEXT_PUBLIC_AMAZON_TAG;

export function amazonUrl(asin: string) {
  return avecTag(`https://www.amazon.fr/dp/${asin}`);
}

// Page des avis clients du produit sur Amazon, avec le même tag Partenaire.
export function amazonAvisUrl(asin: string) {
  return avecTag(`https://www.amazon.fr/product-reviews/${asin}/`);
}

function avecTag(adresse: string) {
  const url = new URL(adresse);
  if (TAG) url.searchParams.set("tag", TAG);
  return url.toString();
}

type Props = {
  asin: string;
  emplacement?: Emplacement;
  exemple?: boolean;
  label?: string;
  className?: string;
};

export function AffiliateButton({ asin, emplacement = "encadré", exemple, label = "Voir le prix sur Amazon", className = "" }: Props) {
  const classes = `inline-flex min-h-12 items-center justify-center bg-accent px-6 font-medium text-on-accent transition-transform hover:-translate-y-0.5 active:translate-y-0 ${className}`;

  // Un produit fictif ne mène nulle part.
  if (exemple) {
    return (
      <span className={`${classes} cursor-not-allowed opacity-70`} aria-disabled="true">
        {label} (exemple)
      </span>
    );
  }

  return (
    <a
      href={amazonUrl(asin)}
      rel="sponsored nofollow noopener"
      target="_blank"
      className={classes}
      onClick={() => {
        // Statistiques sans cookie (src/lib/mesure.ts) : page, produit et emplacement du bouton.
        mesurerClicAffilie(asin, emplacement);
        window.dispatchEvent(new CustomEvent("mm:clic-affilie", { detail: { asin, emplacement } }));
      }}
    >
      {label}
    </a>
  );
}

// Lien secondaire sous une fiche produit : les avis clients restent sur Amazon. Le site n'en affiche aucun, ni aucune
// note (cahier des charges, section 2). Même tag et même attribut rel que le bouton.
export function LienAvisAmazon({ asin, className = "" }: { asin: string; className?: string }) {
  return (
    <a
      href={amazonAvisUrl(asin)}
      rel="sponsored nofollow noopener"
      target="_blank"
      className={`flex min-h-11 w-fit items-center underline decoration-accent decoration-2 underline-offset-4
        transition-colors hover:text-ink-soft ${className}`}
      onClick={() => mesurerClicAffilie(asin, "avis")}
    >
      Lire les avis clients sur Amazon
    </a>
  );
}
