import { FormulaireLettre } from "@/components/FormulaireLettre";
import { ACTION_LETTRE, TEXTE_LETTRE } from "@/components/NewsletterForm";
import { espacesFines } from "@/lib/typo";

// Section de l'accueil, avant « Qui écrit ici » : la checklist offerte contre une inscription à la lettre.
// Masquée tant que NEXT_PUBLIC_NEWSLETTER_URL n'est pas renseignée (voir NewsletterForm).
export function Lettre() {
  if (!ACTION_LETTRE) return null;
  return (
    <section data-fond="lavande" aria-labelledby="titre-lettre" className="px-4 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto grid max-w-[90rem] gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <h2 id="titre-lettre" className="reveal font-display text-[clamp(2.5rem,1.4rem+4vw,5rem)]">
            Recevez la <span className="mot-serif">checklist</span> de l&apos;arrivée d&apos;un chat
          </h2>
          <p className="reveal mt-6 max-w-[44ch] text-lead">{espacesFines(TEXTE_LETTRE)}</p>
        </div>
        <div className="reveal lg:col-span-6 lg:self-end">
          <FormulaireLettre action={ACTION_LETTRE} />
        </div>
      </div>
    </section>
  );
}
