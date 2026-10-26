"use client";

// Bouton vers la fiche Amazon d'un produit. Le tag Partenaire vient de NEXT_PUBLIC_AMAZON_TAG
// (fichier .env.local en local, variables d'environnement sur Netlify).
const TAG = process.env.NEXT_PUBLIC_AMAZON_TAG;

export function amazonUrl(asin: string) {
  const url = new URL(`https://www.amazon.fr/dp/${asin}`);
  if (TAG) url.searchParams.set("tag", TAG);
  return url.toString();
}

type Props = {
  asin: string;
  exemple?: boolean;
  label?: string;
  className?: string;
};

export function AffiliateButton({ asin, exemple, label = "Voir le prix sur Amazon", className = "" }: Props) {
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
        // Suivi des clics : un outil de statistiques sans cookie pourra écouter cet événement.
        window.dispatchEvent(new CustomEvent("mm:clic-affilie", { detail: { asin } }));
      }}
    >
      {label}
    </a>
  );
}
