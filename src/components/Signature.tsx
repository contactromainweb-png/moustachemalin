import Link from "next/link";
import { formatDate } from "@/components/UpdatedDate";
import { AUTEUR } from "@/lib/site";

// Sous le titre de chaque article : « Par Romain · Mis à jour le … » (lien vers la page À propos).
export function Signature({ date, className = "" }: { date: string; className?: string }) {
  return (
    <p className={`text-small text-ink-soft ${className}`}>
      Par{" "}
      <Link href={AUTEUR.page} rel="author" className="font-medium text-ink underline decoration-2 underline-offset-4">
        {AUTEUR.nom}
      </Link>{" "}
      · Mis à jour le <time dateTime={date}>{formatDate(date)}</time>
    </p>
  );
}
