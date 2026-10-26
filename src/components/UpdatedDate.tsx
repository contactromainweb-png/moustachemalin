// Date de mise à jour visible. `date` au format AAAA-MM-JJ (ex. "2026-10-26").
export function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

export function UpdatedDate({ date, className = "" }: { date: string; className?: string }) {
  return (
    <p className={`text-small text-ink-soft ${className}`}>
      Mis à jour le <time dateTime={date}>{formatDate(date)}</time>
    </p>
  );
}
