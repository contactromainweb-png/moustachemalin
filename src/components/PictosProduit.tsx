import type { ReactNode } from "react";
import { nombres } from "@/lib/filtres";
import type { Product } from "@/lib/products";

// Fiches plus visuelles (pack de nuit 7), pour les litières seulement : une rangée de pastilles (icône + mot court)
// tirées des specs, puis une barre de repère (poids pour 10 L, ou bruit annoncé). Icônes maison en SVG inline,
// trait de 1,75 px, currentColor. Une spec absente n'affiche rien. Aucune photo ici : on ne montre pas le produit.
export const CATEGORIES_PICTOS = ["litiere-chat", "litiere-autonettoyante"];

type Picto = { icone: ReactNode; mot: string };

const I = {
  agglo: (
    <>
      <circle cx="9" cy="14" r="4" />
      <circle cx="15" cy="10" r="4" />
      <circle cx="16" cy="17" r="2.5" />
    </>
  ),
  grains: (
    <>
      <circle cx="6" cy="8" r="1.5" />
      <circle cx="12" cy="6" r="1.5" />
      <circle cx="18" cy="9" r="1.5" />
      <circle cx="8" cy="15" r="1.5" />
      <circle cx="15" cy="14" r="1.5" />
      <circle cx="11" cy="19" r="1.5" />
      <circle cx="18" cy="18" r="1.5" />
    </>
  ),
  feuille: (
    <>
      <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" />
      <path d="M5 19c3-4 6-7 10-9" />
    </>
  ),
  pierre: <path d="M4 16.5 7 8l6-3 6 4 1 7-5 3.5H8Z" />,
  sansParfum: (
    <>
      <path d="M12 4c3 4 5 6.5 5 9.5a5 5 0 0 1-10 0C7 10.5 9 8 12 4Z" />
      <path d="M4 4l16 16" />
    </>
  ),
  charbon: (
    <>
      <path d="m12 3 7.5 4.5v9L12 21l-7.5-4.5v-9Z" />
      <path d="m12 8 3.5 2v4L12 16l-3.5-2v-4Z" />
    </>
  ),
  compost: (
    <>
      <path d="M12 20v-7" />
      <path d="M12 13c0-4 3-6 7-6 0 4-3 6-7 6Z" />
      <path d="M12 15c0-3-2.5-5-6-5 0 3 2.5 5 6 5Z" />
      <path d="M6 20h12" />
    </>
  ),
  toilettes: (
    <>
      <path d="M7 4h5v6H7Z" />
      <path d="M5 10h14a7 7 0 0 1-7 7h0a7 7 0 0 1-7-7Z" />
      <path d="M9 17l-1 3h8l-1-3" />
    </>
  ),
  poubelle: (
    <>
      <path d="M4.5 7h15" />
      <path d="M9.5 7V4.5h5V7" />
      <path d="M6.5 7l1 13h9l1-13" />
      <path d="M10.5 11v5.5M13.5 11v5.5" />
    </>
  ),
  ouverte: (
    <>
      <path d="M3 12h18l-2 7H5Z" />
      <path d="M7 12c1-2 3-3 5-3s4 1 5 3" />
    </>
  ),
  fermee: (
    <>
      <path d="M4 19V12a8 8 0 0 1 16 0v7Z" />
      <path d="M9 19v-4a3 3 0 0 1 6 0v4" />
    </>
  ),
  appli: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2.5" />
      <path d="M11 17.5h2" />
    </>
  ),
  sansAppli: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2.5" />
      <path d="M4 4l16 16" />
    </>
  ),
  bac: (
    <>
      <path d="M4 8h16l-1.5 11h-13Z" />
      <path d="M8 8V5h8v3" />
    </>
  ),
  bruit: (
    <>
      <path d="M4 10v4h3.5L12 18V6L7.5 10Z" />
      <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5M18 7a7 7 0 0 1 0 10" />
    </>
  ),
  poids: (
    <>
      <path d="M8 8h8l3 12H5Z" />
      <circle cx="12" cy="5.5" r="2.5" />
    </>
  ),
};

const commence = (t: string | undefined, d: string) => !!t && t.toLowerCase().startsWith(d.toLowerCase());
const contient = (t: string | undefined, m: string) => !!t && t.toLowerCase().includes(m.toLowerCase());
const fr = (n: number) => String(Math.round(n * 10) / 10).replace(".", ",");

// Valeur minimale du poids accepté : « 1,5 à 8 kg » → 1,5 ; une phrase sans plage chiffrée en kg ne donne rien.
function poidsMini(t: string | undefined) {
  const m = t?.match(/(\d+(?:,\d+)?)\s*(?:à|-|–)\s*\d+(?:,\d+)?\s*kg/i) ?? t?.match(/dès\s*(\d+(?:,\d+)?)\s*kg/i);
  return m ? Number(m[1].replace(",", ".")) : null;
}

const maxi = (t: string | undefined) => {
  const n = nombres(t);
  return n.length ? Math.max(...n) : null;
};

function pictos(p: Product): Picto[] {
  const s = p.specs;
  const liste: (Picto | null)[] = [];
  if (p.category === "litiere-chat") {
    liste.push(
      commence(s.type, "Agglomérante")
        ? { icone: I.agglo, mot: "Agglomérante" }
        : commence(s.type, "Non agglomérante")
          ? { icone: I.grains, mot: "Non agglomérante" }
          : null,
      commence(s.origine, "Végétale")
        ? { icone: I.feuille, mot: "Végétale" }
        : commence(s.origine, "Minérale")
          ? { icone: I.pierre, mot: "Minérale" }
          : null,
      commence(s.parfum, "Sans") ? { icone: I.sansParfum, mot: "Sans parfum" } : null,
      contient(s.matiere, "charbon actif") ? { icone: I.charbon, mot: "Charbon actif" } : null,
    );
    const e = s.elimination;
    if (contient(e, "compost")) liste.push({ icone: I.compost, mot: "Compost" });
    if (contient(e, "toilettes") && !contient(e, "pas dans les toilettes")) liste.push({ icone: I.toilettes, mot: "Toilettes" });
    if (contient(e, "poubelle") || contient(e, "ordures")) liste.push({ icone: I.poubelle, mot: "Poubelle" });
  } else {
    const bac = nombres(s.bacDechets?.split("(")[0])[0];
    const db = maxi(s.bruit);
    const kg = poidsMini(s.poidsChat);
    liste.push(
      commence(s.type, "Ouverte") ? { icone: I.ouverte, mot: "Ouverte" } : commence(s.type, "Fermée") ? { icone: I.fermee, mot: "Fermée" } : null,
      commence(s.application, "Oui")
        ? { icone: I.appli, mot: "Appli" }
        : commence(s.application, "Non")
          ? { icone: I.sansAppli, mot: "Sans appli" }
          : null,
      bac !== undefined ? { icone: I.bac, mot: `Bac ${fr(bac)} L` } : null,
      db !== null ? { icone: I.bruit, mot: `${fr(db)} dB` } : null,
      kg !== null ? { icone: I.poids, mot: `Dès ${fr(kg)} kg` } : null,
    );
  }
  return liste.filter((x): x is Picto => x !== null);
}

// Poids d'un sac ramené à 10 L, lu dans « 10 L, 8,6 kg » ; null si le volume ou le poids manque.
function poidsPour10L(sac: string | undefined) {
  const l = sac?.match(/(\d+(?:,\d+)?)\s*L\b/);
  const kg = sac?.match(/(\d+(?:,\d+)?)\s*kg/);
  if (!l || !kg) return null;
  const v = (Number(kg[1].replace(",", ".")) / Number(l[1].replace(",", "."))) * 10;
  return { kg: v, environ: contient(sac, "environ") };
}

function Barre({ titre, part, legende, note }: { titre: string; part: number; legende: string; note?: string }) {
  return (
    <div className="max-w-[26rem]">
      <p className="text-small font-semibold">{titre}</p>
      <div aria-hidden="true" className="mt-2 h-3 overflow-hidden rounded-full bg-field">
        <div className="h-full rounded-full bg-lavande" style={{ width: `${Math.max(3, Math.min(100, part * 100))}%` }} />
      </div>
      <p className="mt-1.5 text-small">
        {legende}
        {note ? <span className="text-ink-soft"> · {note}</span> : null}
      </p>
    </div>
  );
}

export function PictosProduit({ p }: { p: Product }) {
  if (!CATEGORIES_PICTOS.includes(p.category)) return null;
  const liste = pictos(p);
  let barre: ReactNode = null;
  if (p.category === "litiere-chat") {
    const poids = poidsPour10L(p.specs.sac);
    barre = poids ? (
      <Barre
        titre="Poids pour 10 L"
        part={poids.kg / 12}
        legende={`${poids.environ ? "environ " : ""}${fr(poids.kg)} kg pour 10 L`}
        note="échelle de 0 à 12 kg"
      />
    ) : (
      <div>
        <p className="text-small font-semibold">Poids pour 10 L</p>
        <p className="mt-1 text-small text-ink-soft">poids non précisé</p>
      </div>
    );
  } else {
    const db = maxi(p.specs.bruit);
    barre =
      db !== null ? (
        <Barre titre="Bruit annoncé" part={(db - 30) / 30} legende={`${fr(db)} dB au plus`} note="plus court = plus discret" />
      ) : null;
  }
  if (!liste.length && !barre) return null;
  return (
    <div className="mt-8 space-y-5">
      {liste.length ? (
        <ul aria-label="En un coup d'œil" className="flex flex-wrap gap-2">
          {liste.map((x) => (
            <li key={x.mot} className="flex min-h-10 items-center gap-2 rounded-full bg-field px-3.5 text-small font-medium text-ink">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-5 shrink-0"
              >
                {x.icone}
              </svg>
              {x.mot}
            </li>
          ))}
        </ul>
      ) : null}
      {barre}
    </div>
  );
}
