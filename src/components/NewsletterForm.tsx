// Inscription à la lettre d'information. Désactivée par défaut : elle ne s'affiche que lorsque
// NEXT_PUBLIC_NEWSLETTER_URL contient l'adresse d'envoi de l'outil gratuit choisi (étape 8).
// Avant de l'activer : mettre à jour la page Confidentialité.
const ACTION = process.env.NEXT_PUBLIC_NEWSLETTER_URL;

export function NewsletterForm() {
  if (!ACTION) return null;
  return (
    <section aria-labelledby="newsletter" className="reveal my-14 bg-field px-5 py-8 sm:px-8">
      <h2 id="newsletter" className="font-display text-head">
        Les nouveaux comparatifs, par e-mail
      </h2>
      <p className="mt-3 max-w-[50ch]">Un message quand un comparatif sort ou change. Pas plus d&apos;un par mois.</p>
      <form action={ACTION} method="post" className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Adresse e-mail
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="vous@exemple.fr"
          className="min-h-12 flex-1 border-2 border-ink bg-paper px-4 text-body"
        />
        <button type="submit" className="min-h-12 bg-caramel-field px-6 text-on-caramel">
          S&apos;inscrire
        </button>
      </form>
    </section>
  );
}
