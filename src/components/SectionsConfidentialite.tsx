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
    ? { nom: "Umami Cloud", hebergement: "Umami Software (serveurs dans l'Union européenne)" }
    : GOATCOUNTER
      ? { nom: "GoatCounter", hebergement: "GoatCounter (Martin Tournoij, serveurs dans l'Union européenne)" }
      : null;

  return (
    <Section titre="Mesure d'audience">
      {outil ? (
        <>
          <p className={p}>
            Nous utilisons {outil.nom}, un outil de statistiques <strong className="font-semibold">sans cookie</strong> qui
            ne vous suit pas d&apos;un site à l&apos;autre et ne permet pas de vous identifier. Il compte les pages vues et,
            quand vous cliquez sur un bouton vers Amazon, la page, le produit et l&apos;emplacement du bouton. Ces chiffres
            nous disent quels comparatifs sont utiles. Hébergement&nbsp;: {outil.hebergement}.
          </p>
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
        Si vous demandez la checklist, votre adresse e-mail est enregistrée chez notre outil d&apos;envoi, uniquement pour
        vous envoyer la checklist puis, au plus une fois par mois, les nouveaux comparatifs. Base légale&nbsp;: votre
        consentement, donné en cochant la case du formulaire.
      </p>
      <p className={p}>
        Chaque message contient un lien de désinscription en un clic. Votre adresse est supprimée dès votre
        désinscription, et au plus tard trois ans après le dernier message ouvert.
      </p>
    </Section>
  );
}
