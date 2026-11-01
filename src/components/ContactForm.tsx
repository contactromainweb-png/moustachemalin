"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SITE } from "@/lib/site";

// Formulaire de contact (page /contact/), reçu par Netlify Forms, sans cookie. Il est envoyé au fichier statique
// public/__forms.html, qui déclare le même formulaire « contact » pour la détection de Netlify (le site passe par
// l'adaptateur Next.js : une page générée par Next ne peut pas recevoir l'envoi). Netlify ne renvoie pas vers
// /contact/merci/ dans ce cas : le formulaire est donc envoyé en arrière-plan, puis la page de remerciement s'ouvre.
// Sans JavaScript, l'envoi fonctionne aussi, mais se termine sur la page de confirmation de Netlify.
// Anti-spam : filtre de Netlify + champ piège « adresse-postale », caché aux visiteurs et rempli seulement par les
// robots. Pas de reCAPTCHA (cookies).
export const SUJETS = ["Question sur un produit", "Suggestion d'article", "Partenariat", "Autre"];

const champ = "mt-2 block w-full rounded-[0.75rem] border-2 border-ink/25 bg-paper px-4 text-body focus:border-ink";

export function ContactForm() {
  const router = useRouter();
  const [etat, setEtat] = useState<"pret" | "envoi" | "erreur">("pret");

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEtat("envoi");
    try {
      const donnees = new URLSearchParams(new FormData(e.currentTarget) as unknown as Record<string, string>);
      const reponse = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: donnees.toString(),
      });
      if (!reponse.ok) throw new Error(String(reponse.status));
      router.push("/contact/merci/");
    } catch {
      setEtat("erreur");
    }
  }

  return (
    <form name="contact" method="POST" action="/__forms.html" onSubmit={envoyer} className="space-y-6">
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
        disabled={etat === "envoi"}
        className="inline-flex disabled:opacity-60 min-h-12 items-center rounded-full bg-accent px-7 font-semibold text-on-accent transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97]"
      >
        {etat === "envoi" ? "Envoi en cours…" : "Envoyer le message"}
      </button>
      {etat === "erreur" ? (
        <p role="alert" className="font-medium">
          Le message n&apos;est pas parti. Réessayez dans un instant, ou écrivez directement à
          {SITE.email}.
        </p>
      ) : null}
    </form>
  );
}
