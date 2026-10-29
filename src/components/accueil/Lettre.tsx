import Link from "next/link";

// Bloc E : lettre d'information et checklist offerte. MASQUÉ tant que NEXT_PUBLIC_NEWSLETTER_URL n'est pas renseignée
// (adresse d'envoi du formulaire de l'outil gratuit choisi par Romain), et à n'activer qu'après un essai complet
// d'inscription. La case de consentement est obligatoire. La page Confidentialité affiche sa section dès que la
// variable existe. Le nom du champ e-mail (EMAIL) suit Brevo ; à ajuster si un autre outil est choisi.
// Dans l'outil d'envoi : page de remerciement = https://moustachemalin.fr/lettre/merci/ (mot de Kira), et messages
// signés « Romain et Kira ».
const ACTION = process.env.NEXT_PUBLIC_NEWSLETTER_URL;

export function Lettre() {
  if (!ACTION) return null;
  return (
    <section data-fond="lavande" aria-labelledby="titre-lettre" className="px-4 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto grid max-w-[90rem] gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <h2 id="titre-lettre" className="reveal font-display text-[clamp(2.5rem,1.4rem+4vw,5rem)]">
            La checklist <span className="mot-serif">offerte</span>
          </h2>
          <p className="reveal mt-6 max-w-[40ch] text-lead">
            Recevez gratuitement la checklist&nbsp;: tout ce qu&apos;il faut pour accueillir un chat.
          </p>
        </div>
        <form action={ACTION} method="post" className="reveal space-y-5 lg:col-span-6 lg:self-end">
          <div>
            <label htmlFor="lettre-email" className="font-medium">
              Votre adresse e-mail
            </label>
            <input
              id="lettre-email"
              name="EMAIL"
              type="email"
              required
              autoComplete="email"
              placeholder="vous@exemple.fr"
              className="mt-2 min-h-13 w-full rounded-full border-2 border-nuit bg-blanc px-6 text-body text-nuit"
            />
          </div>
          <div className="flex gap-3">
            <input id="lettre-accord" name="OPT_IN" type="checkbox" value="1" required className="mt-1 size-5 shrink-0 accent-[#14213d]" />
            <label htmlFor="lettre-accord" className="max-w-[55ch]">
              J&apos;accepte de recevoir la checklist puis, au plus une fois par mois, les nouveaux comparatifs de Moustache
              Malin. Je peux me désinscrire à tout moment, en un clic. Détails sur la page{" "}
              <Link href="/confidentialite/" className="underline decoration-2 underline-offset-4">
                Confidentialité
              </Link>
              .
            </label>
          </div>
          <button
            type="submit"
            className="inline-flex min-h-13 items-center rounded-full bg-nuit px-7 font-medium text-blanc transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97]"
          >
            Recevoir la checklist
          </button>
        </form>
      </div>
    </section>
  );
}
