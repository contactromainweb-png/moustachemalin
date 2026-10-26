// Données structurées schema.org, lues par Google (invisibles pour le visiteur).
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Le remplacement de « < » par son code JSON empêche de fermer la balise script depuis le contenu.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, String.raw`<`) }}
    />
  );
}
