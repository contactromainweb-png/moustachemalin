import type { ReactNode } from "react";
import { GOATCOUNTER, UMAMI_ID } from "@/lib/mesure";
import { SITE } from "@/lib/site";

// Sections de la page Confidentialité qui dépendent des outils réellement branchés (variables d'environnement) :
// elles décrivent toujours ce qui tourne vraiment sur le site, ni plus ni moins.
const NEWSLETTER = process.env.NEXT_PUBLIC_NEWSLETTER_URL;

function Section({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <>
      <h2 className="reveal font-display mb-6 mt-20 max-w-[22ch] text-head">{titre}</h2>
      {children}
    </>
  );
}

const p = "reveal mb-5 max-w-[65ch]";

export function MesureAudience() {
  const outil = UMAMI_ID
    ? { nom: "Umami Cloud", hebergement: "Umami Software, données hébergées dans l'Union européenne" }
    : GOATCOUNTER
      ? { nom: "GoatCounter", hebergement: "GoatCounter (Martin Tournoij, serveurs dans l'Union européenne)" }
      : null;

  return (
    <Section titre="Mesure d'audience">
      {outil ? (
        <>
          <p className={p}>
            Nous utilisons {outil.nom}, un outil de statistiques <strong className="font-semibold">sans cookie</strong> qui
            ne vous suit pas d&apos;un site à l&apos;autre et ne collecte <strong className="font-semibold">aucune donnée
            personnelle</strong>&nbsp;: il ne permet pas de vous identifier. Il compte les pages vues et, quand vous cliquez
            sur un bouton ou un lien vers Amazon, la page, le produit et son emplacement. Ces chiffres nous disent quels
            comparatifs sont utiles. Hébergement&nbsp;: {outil.hebergement}.
          </p>
          {UMAMI_ID ? <p className={p}>Ces statistiques sont conservées 6&nbsp;mois.</p> : null}
          <p className={p}>Aucune donnée n&apos;est vendue ni partagée à des fins publicitaires.</p>
        </>
      ) : (
        <p className={p}>
          Aucun outil de mesure d&apos;audience n&apos;est installé pour l&apos;instant. Si nous en ajoutons un, il
          fonctionnera sans cookie et cette page sera mise à jour avant sa mise en service.
        </p>
      )}
    </Section>
  );
}

export function LettreInformation() {
  if (!NEWSLETTER) return null;
  return (
    <Section titre="Lettre d'information">
      <ul className="reveal mb-5 max-w-[65ch] list-disc space-y-2 pl-5">
        <li><strong className="font-semibold">Données collectées&nbsp;:</strong> votre adresse e-mail seulement.</li>
        <li><strong className="font-semibold">Finalité&nbsp;:</strong> l&apos;envoi de la lettre et du cadeau.</li>
        <li><strong className="font-semibold">Base légale&nbsp;:</strong> votre consentement.</li>
        <li><strong className="font-semibold">Prestataire&nbsp;:</strong> Brevo (Sendinblue SAS, France), données hébergées dans l&apos;Union européenne.</li>
        <li><strong className="font-semibold">Durée de conservation&nbsp;:</strong> jusqu&apos;à votre désinscription.</li>
        <li>
          <strong className="font-semibold">Désinscription&nbsp;:</strong> par le lien présent dans chaque e-mail, ou en écrivant à{" "}
          <a href={`mailto:${SITE.email}`} className="underline decoration-2 underline-offset-4">{SITE.email}</a>.
        </li>
        <li><strong className="font-semibold">Droits d&apos;accès, de rectification et d&apos;effacement&nbsp;:</strong> à la même adresse.</li>
      </ul>
    </Section>
  );
}
