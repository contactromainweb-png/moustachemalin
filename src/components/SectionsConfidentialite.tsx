import type { ReactNode } from "react";
import { GOATCOUNTER, UMAMI_ID } from "@/lib/mesure";

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
    ? { nom: "Umami Cloud", hebergement: "Umami Software" }
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
    <Section titre="La lettre d'information">
      <p className={p}>
        Si vous demandez la checklist, seule votre adresse e-mail est collectée, avec votre accord. Elle est enregistrée
        chez Brevo (Sendinblue SAS, entreprise française), notre outil d&apos;envoi, uniquement pour vous envoyer la
        checklist puis, au plus une fois par mois, les nouveaux comparatifs. La base légale de ce traitement est votre
        consentement, donné en cochant la case du formulaire.
      </p>
      <p className={p}>
        Chaque message contient un lien de désinscription en un clic. Votre adresse est supprimée dès votre
        désinscription, et au plus tard trois ans après le dernier message ouvert.
      </p>
    </Section>
  );
}
