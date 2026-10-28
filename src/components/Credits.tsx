import credits from "../../content/credits.json";

type Credit = {
  fichier: string;
  auteur: string;
  source: string;
  url: string;
  licence: string;
};

// Liste des photos et vidéos utilisées, lue dans content/credits.json.
export function Credits() {
  const liste = credits as Credit[];
  if (liste.length === 0) {
    return <p>Aucune photo ni vidéo externe n&apos;est encore utilisée sur le site.</p>;
  }
  return (
    <ul className="mb-6 max-w-[65ch] space-y-2">
      {liste.map((c) => (
        <li key={c.fichier}>
          {c.fichier} : {c.auteur}
          {/* Photo personnelle (sans adresse source) : pas de lien. */}
          {c.url ? (
            <>
              ,{" "}
              <a href={c.url} className="text-caramel underline underline-offset-4" rel="noopener" target="_blank">
                {c.source}
              </a>
            </>
          ) : null}{" "}
          ({c.licence})
        </li>
      ))}
    </ul>
  );
}
