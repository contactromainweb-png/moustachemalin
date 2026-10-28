import Link from "next/link";

const LIENS = [
  { href: "/", label: "Accueil" },
  { href: "/methode/", label: "Notre méthode" },
  { href: "/a-propos/", label: "À propos" },
];

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 pt-16 sm:px-8 sm:pt-28">
      <h1 className="font-display max-w-[16ch] text-display">Page introuvable</h1>
      <p className="mt-8 max-w-[44ch] text-lead">
        Cette page n&apos;existe pas, ou pas encore : le site grandit rubrique par rubrique. En attendant, voici ce qui est déjà en ligne :
      </p>
      <ul className="mt-10 flex flex-wrap gap-3">
        {LIENS.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="inline-flex min-h-12 items-center bg-caramel-field px-6 text-on-caramel transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
