import { FormulaireLettre } from "@/components/FormulaireLettre";
import { espacesFines } from "@/lib/typo";

// Inscription à la lettre et cadeau (checklist de l'arrivée d'un chat). Ne s'affiche que lorsque
// NEXT_PUBLIC_NEWSLETTER_URL contient l'adresse d'envoi du formulaire hébergé par Brevo : variable vide, aucun
// formulaire. Dans Brevo : page après inscription = /newsletter/confirmez/, page après confirmation = /newsletter/merci/.
// `avant` : version mise en avant (aplat lavande), `bloc` : version discrète, en bas des articles.
export const ACTION_LETTRE = process.env.NEXT_PUBLIC_NEWSLETTER_URL;
export const TITRE_LETTRE = "Recevez la checklist de l'arrivée d'un chat";
export const TEXTE_LETTRE =
  "La liste complète, à imprimer : démarches, équipement, premiers jours. Puis nos nouveaux guides et comparatifs, une à deux fois par mois. Désinscription en un clic.";

export function NewsletterForm({ titre = TITRE_LETTRE, variante = "bloc" }: { titre?: string; variante?: "bloc" | "avant" }) {
  if (!ACTION_LETTRE) return null;
  return (
    <section
      aria-label={espacesFines(titre)}
      className={`reveal my-14 rounded-[1.5rem] px-5 py-8 sm:px-8 ${variante === "avant" ? "bg-lavande text-nuit sm:py-10" : "bg-field"}`}
    >
      <h2 className="font-display text-head">{espacesFines(titre)}</h2>
      <p className="mb-6 mt-3 max-w-[58ch]">{espacesFines(TEXTE_LETTRE)}</p>
      <FormulaireLettre action={ACTION_LETTRE} />
    </section>
  );
}
