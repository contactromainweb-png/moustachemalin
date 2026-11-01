// Formulaire de contact (page /contact/), reçu par Netlify Forms : un simple formulaire HTML, sans JavaScript ni
// cookie. Il est envoyé au fichier statique public/__forms.html, qui déclare le même formulaire « contact » pour la
// détection de Netlify (le site passe par l'adaptateur Next.js : une page générée par Next ne peut pas recevoir
// l'envoi). Netlify renvoie ensuite vers /contact/merci/. Anti-spam : filtre de Netlify + champ piège
// « adresse-postale », caché aux visiteurs et rempli seulement par les robots. Pas de reCAPTCHA (cookies).
export const SUJETS = ["Question sur un produit", "Suggestion d'article", "Partenariat", "Autre"];

const champ = "mt-2 block w-full rounded-[0.75rem] border-2 border-ink/25 bg-paper px-4 text-body focus:border-ink";

export function ContactForm() {
  return (
    <form name="contact" method="POST" action="/__forms.html" className="space-y-6">
      <input type="hidden" name="form-name" value="contact" />
      <p className="hidden">
        <label>
          Ne remplissez pas ce champ : <input name="adresse-postale" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div>
        <label htmlFor="contact-prenom" className="font-medium">
          Prénom <span className="font-normal text-ink-soft">(facultatif)</span>
        </label>
        <input id="contact-prenom" name="prenom" type="text" autoComplete="given-name" className={`${champ} min-h-12`} />
      </div>

      <div>
        <label htmlFor="contact-email" className="font-medium">
          E-mail
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="vous@exemple.fr"
          className={`${champ} min-h-12`}
        />
      </div>

      <div>
        <label htmlFor="contact-sujet" className="font-medium">
          Sujet
        </label>
        <select id="contact-sujet" name="sujet" required className={`${champ} min-h-12`}>
          {SUJETS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="font-medium">
          Message
        </label>
        <textarea id="contact-message" name="message" required rows={7} className={`${champ} py-3`} />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="contact-consentement"
          name="consentement"
          type="checkbox"
          value="oui"
          required
          className="mt-1 size-5 shrink-0 accent-[var(--color-accent)]"
        />
        <label htmlFor="contact-consentement">
          J&apos;accepte que mes données soient utilisées pour me répondre.{" "}
          <a href="/confidentialite/" className="underline underline-offset-4">
            En savoir plus
          </a>
        </label>
      </div>

      <button
        type="submit"
        className="inline-flex min-h-12 items-center rounded-full bg-accent px-7 font-semibold text-on-accent transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97]"
      >
        Envoyer le message
      </button>
    </form>
  );
}
