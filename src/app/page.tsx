import Link from "next/link";
import Bienvenue from "../../content/bienvenue.mdx";

// Accueil provisoire : la vraie vitrine (vidéo au scroll + scène 3D) arrive à l'étape 5.
export default function Home() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 pt-12 sm:px-8 sm:pt-24">
      <h1 className="font-display rise max-w-[16ch] text-display">Bien équiper son chat</h1>
      <div className="rise mt-10 max-w-[40ch] text-lead" style={{ "--i": 1 } as React.CSSProperties}>
        <Bienvenue />
      </div>
      <p className="rise mt-4 max-w-[52ch]" style={{ "--i": 2 } as React.CSSProperties}>
        Comparatifs de litières, fontaines, distributeurs et arbres à chat, fondés principalement sur les
        fiches techniques des fabricants. Quand nous les avons analysés, les retours d&apos;acheteurs servent
        à repérer des tendances. Les premiers articles arrivent très bientôt.
      </p>
      <Link
        href="/methode/"
        className="rise mt-10 inline-flex min-h-12 items-center bg-ink px-7 text-paper transition-transform hover:-translate-y-0.5 active:translate-y-0"
        style={{ "--i": 3 } as React.CSSProperties}
      >
        Voir comment nous comparons
      </Link>
    </div>
  );
}
