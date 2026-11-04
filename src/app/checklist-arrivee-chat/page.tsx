import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ACTION_LETTRE, NewsletterForm } from "@/components/NewsletterForm";

const TITRE = "La checklist de l'arrivée d'un chat";

export const metadata: Metadata = {
  title: { absolute: "Checklist arrivée d'un chat à imprimer | Moustache Malin" },
  description: "La checklist de l'arrivée d'un chat, à imprimer : démarches, équipement, maison prête, premiers jours. Deux pages A4 à cocher, offertes.",
  alternates: { canonical: "/checklist-arrivee-chat/" },
};

const PAGES = [
  { src: "/media/cadeaux/checklist-page-1.jpg", alt: "Page 1 de la checklist : les démarches avant l'arrivée et l'équipement indispensable, à cocher." },
  { src: "/media/cadeaux/checklist-page-2.jpg", alt: "Page 2 de la checklist : la maison prête et sécurisée, les premiers jours, ce qui peut attendre et le mot de Kira." },
];

// Page du cadeau : aperçu des deux pages du PDF (des images, le PDF lui-même n'est donné qu'après l'inscription),
// le formulaire et le guide. Tant que la lettre n'est pas branchée, la page renvoie seulement vers le guide.
export default function Page() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 pb-16 pt-6 sm:px-8 lg:pt-10">
      <Breadcrumbs items={[{ label: TITRE, href: "/checklist-arrivee-chat/" }]} />
      <h1 className="font-display mt-10 max-w-[18ch] text-display">
        La <span className="mot-serif">checklist</span> de l&apos;arrivée d&apos;un chat
      </h1>
      <p className="mt-8 max-w-[52ch] text-lead">
        Deux pages A4 à imprimer et à cocher&nbsp;: les démarches, l&apos;équipement, la maison prête et les premiers jours.
      </p>

      <div className="mt-12 grid max-w-[60rem] gap-5 sm:grid-cols-2">
        {PAGES.map((p, i) => (
          <Image
            key={p.src}
            src={p.src}
            alt={p.alt}
            width={1192}
            height={1686}
            priority={i === 0}
            quality={80}
            sizes="(min-width: 1024px) 30rem, (min-width: 640px) 45vw, calc(100vw - 2rem)"
            className="w-full rounded-[1.25rem] ring-1 ring-ink/15"
          />
        ))}
      </div>

      <div className="max-w-[60rem]">
        <NewsletterForm variante="avant" />
        <p className="mt-10 max-w-[52ch]">
          {ACTION_LETTRE ? "Envie de tout lire d'abord ?" : "L'envoi par e-mail ouvre bientôt. En attendant, toute la liste est en ligne :"}{" "}
          <Link href="/guides/arrivee-chat-chaton-liste/" className="font-medium underline decoration-accent decoration-2 underline-offset-[6px]">
            le guide de l&apos;arrivée d&apos;un chat ou d&apos;un chaton
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
