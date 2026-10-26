// Visuel neutre d'un produit, en attendant l'API Amazon : jamais d'image Amazon hébergée ici.
export function ProductVisual({ nom, marque, className = "" }: { nom: string; marque: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={`Visuel neutre : ${nom}`}
      className={`flex aspect-[4/3] flex-col justify-end bg-caramel-field p-5 text-on-caramel ${className}`}
    >
      <span className="font-display text-[clamp(1.75rem,1.2rem+2vw,2.75rem)]">{nom}</span>
      <span className="mt-1 text-small opacity-80">{marque}</span>
    </div>
  );
}
