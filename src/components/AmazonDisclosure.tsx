import { AMAZON_DISCLOSURE } from "@/lib/site";

// Mention obligatoire du programme Partenaires Amazon (section 2 du cahier des charges).
// À placer près des liens affiliés, et présente dans le footer de chaque page.
export function AmazonDisclosure({ className = "" }: { className?: string }) {
  return <p className={`text-small text-ink-soft ${className}`}>{AMAZON_DISCLOSURE}</p>;
}
