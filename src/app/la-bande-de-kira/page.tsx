import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { StagePage } from "@/components/StagePage";
import { ancreCousin, BANDE } from "@/lib/bande";
import { fluxKiraDansHead } from "@/lib/flux";
import { PHOTOS } from "@/lib/medias";
import { espacesFines } from "@/lib/typo";

export const metadata: Metadata = {
  title: "La bande de Kira : Kira et ses cousins",
  description:
    "Kira, la chatte de Romain, et les chats de sa famille qui passent une tête sur Moustache Malin : Sucette, Black Pearl, Rebelle, Imotep et Chichoune.",
  alternates: { canonical: "/la-bande-de-kira/", types: fluxKiraDansHead() },
};

// Kira en grand (à droite sur ordinateur, juste après l'introduction sur téléphone), puis une carte par cousin :
// photo, prénom, chez qui il vit, une phrase de Romain sur son caractère (données et règles : src/lib/bande.ts).
// Le texte sur Kira reprend celui de Romain (À propos, « Qui écrit ici ») : rien n'est inventé.
export default function Page() {
  return (
    <StagePage
      title="La bande de Kira"
      lead="Kira, ma chatte, et les chats de ma famille, qui passent parfois une tête sur le site."
      stageWord="Kira"
      photo={PHOTOS.kiraAssise}
      portrait
    >
      <h2 id="kira" className="font-display scroll-mt-8 text-head">Kira</h2>
      <p className="mt-4 max-w-[60ch] text-lead">
        {espacesFines(
          "Kira, c'est ma chatte : un peu plus d'un an, fofolle, joueuse comme un petit chien, et fan de l'eau qui coule du robinet. C'est la seule de la bande qui a son mot à dire sur le site.",
        )}
      </p>

      <h2 className="font-display mt-20 text-head">
        Ses <span className="mot-serif">cousins</span>
      </h2>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2">
        {BANDE.map((c) => (
          <li key={c.prenom} id={ancreCousin(c.prenom)} className="reveal scroll-mt-8 overflow-hidden rounded-[1.5rem] bg-field">
            <div className="relative aspect-[4/3]">
              <Image
                src={c.photo.src}
                alt={c.photo.alt}
                fill
                quality={80}
                sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 100vw"
                className="object-cover"
                style={c.photo.position ? { objectPosition: c.photo.position } : undefined}
              />
            </div>
            <div className="px-5 pb-6 pt-5">
              <h3 className="font-display text-[1.75rem] leading-tight">{c.prenom}</h3>
              <p className="mt-1 text-small font-medium text-ink-soft">{c.chezQui}</p>
              <p className="mt-3">{espacesFines(c.phrase)}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Texte de Romain : aucun chat de la bande n'a testé de produit (CLAUDE.md §11). */}
      <p className="mt-16 max-w-[60ch]">
        {espacesFines(
          "Aucun chat de la bande n'a testé de produit pour nos comparatifs. Le jour où Kira testera un appareil pour de vrai, on le dira clairement, photos à l'appui.",
        )}
      </p>
      <ul className="mt-4 flex flex-wrap gap-x-8">
        {[
          { href: "/methode/", label: "Notre méthode" },
          { href: "/a-propos/", label: "Qui écrit ici" },
        ].map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="inline-flex min-h-11 items-center font-medium underline decoration-accent decoration-2 underline-offset-[6px]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </StagePage>
  );
}
