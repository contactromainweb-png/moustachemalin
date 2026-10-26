// Données structurées schema.org, lues par Google (invisibles pour le visiteur).
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Le remplacement de « < » empêche de fermer la balise script depuis le contenu.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}
