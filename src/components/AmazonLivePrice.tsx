// Prix et image en direct depuis l'API Creators d'Amazon (accessible après 10 ventes en 30 jours).
// Désactivé par défaut : tant que NEXT_PUBLIC_AMAZON_API_ACTIVE ne vaut pas "true", il n'affiche rien.
// À brancher plus tard (étape 8). Ne jamais écrire de prix en dur à la place.
export function AmazonLivePrice({ asin }: { asin: string }) {
  if (process.env.NEXT_PUBLIC_AMAZON_API_ACTIVE !== "true") return null;
  return <span data-asin={asin} />;
}
