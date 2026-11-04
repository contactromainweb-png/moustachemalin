"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { SITE } from "@/lib/site";
import { espacesFines } from "@/lib/typo";

// Champs du formulaire, avec les noms attendus par un formulaire hébergé par Brevo : EMAIL, OPT_IN et le champ piège
// email_address_check, plus locale et html_type (champs cachés de ses formulaires). Aucun script tiers, aucun cookie :
// l'envoi passe par fetch ; sans JavaScript, le formulaire part normalement vers la page de Brevo.
const SUCCES = "C'est presque fini : confirmez votre inscription dans l'email que vous allez recevoir.";
const ERREUR = "L'inscription n'a pas abouti. Vérifiez votre adresse et réessayez.";

type Etat = "repos" | "envoi" | "succes" | "erreur";

export function FormulaireLettre({ action }: { action: string }) {
  const id = useId();
  const [etat, setEtat] = useState<Etat>("repos");

  const envoyer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const donnees = new FormData(e.currentTarget);
    // Champ piège rempli : c'est un robot. Il croit avoir réussi, et rien ne part.
    if (donnees.get("email_address_check")) {
      setEtat("succes");
      return;
    }
    setEtat("envoi");
    try {
      const reponse = await fetch(`${action}${action.includes("?") ? "&" : "?"}isAjax=1`, { method: "POST", body: donnees });
      const resultat: { success?: boolean } | null = await reponse.json().catch(() => null);
      setEtat(reponse.ok && resultat?.success !== false ? "succes" : "erreur");
    } catch {
      setEtat("erreur");
    }
  };

  return (
    <div>
      {etat === "succes" ? null : (
        <form action={action} method="post" onSubmit={envoyer} className="space-y-5">
          <div>
            <label htmlFor={`${id}-email`} className="block font-medium">
              Votre adresse e-mail
            </label>
            <input
              id={`${id}-email`}
              name="EMAIL"
              type="email"
              required
              autoComplete="email"
              placeholder="vous@exemple.fr"
              className="mt-2 min-h-13 w-full max-w-[32rem] rounded-full border-2 border-nuit bg-blanc px-6 text-body text-nuit"
            />
          </div>
          {/* Champ piège : invisible pour les visiteurs et les lecteurs d'écran, seuls les robots le remplissent. */}
          <div aria-hidden="true" className="absolute left-[-9999px] size-px overflow-hidden">
            <label htmlFor={`${id}-piege`}>Ne pas remplir ce champ</label>
            <input id={`${id}-piege`} name="email_address_check" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>
          <input type="hidden" name="locale" value="fr" />
          <input type="hidden" name="html_type" value="simple" />
          <div className="flex gap-3">
            <input
              id={`${id}-accord`}
              name="OPT_IN"
              type="checkbox"
              value="1"
              required
              className="mt-1 size-5 shrink-0 cursor-pointer accent-[#14213d]"
            />
            <label htmlFor={`${id}-accord`} className="max-w-[58ch]">
              {espacesFines("J'accepte de recevoir la lettre de Moustache Malin. Mes données ne servent qu'à cet envoi (voir ")}
              <Link href="/confidentialite/" className="underline decoration-2 underline-offset-4">
                la politique de confidentialité
              </Link>
              ).
            </label>
          </div>
          <button
            type="submit"
            disabled={etat === "envoi"}
            className="inline-flex min-h-13 cursor-pointer items-center rounded-full bg-accent px-7 font-medium text-on-accent transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97] disabled:cursor-wait disabled:opacity-70 motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            {etat === "envoi" ? "Envoi en cours…" : "Recevoir la checklist"}
          </button>
        </form>
      )}
      <div aria-live="polite" className="[&:not(:empty)]:mt-5">
        {etat === "succes" ? <p className="max-w-[58ch] font-semibold">{espacesFines(SUCCES)}</p> : null}
        {etat === "erreur" ? (
          <p className="max-w-[58ch] font-semibold">
            {espacesFines(ERREUR)} Si le problème continue, écrivez-nous à{" "}
            <a href={`mailto:${SITE.email}`} className="underline decoration-2 underline-offset-4">
              {SITE.email}
            </a>
            .
          </p>
        ) : null}
      </div>
    </div>
  );
}
