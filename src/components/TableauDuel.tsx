import { Children, isValidElement, type ReactElement, type ReactNode } from "react";

// Composants propres aux pages « duel » (deux produits face à face), passés par la page à son contenu MDX
// (<Contenu components={COMPOSANTS_DUEL} />) : rien ne change sur les autres articles.
// - table : le tableau Markdown « Critère | Produit A | Produit B ». Ordinateur et tablette (≥ 768 px) : un vrai
//   tableau. Téléphone : une carte par produit, avec chaque critère et sa valeur (comme les autres comparatifs).
// - h2 : chaque titre « ## » reçoit son ancre (ex. « Tableau comparatif » → #tableau-comparatif), même sur un
//   article trop court pour le sommaire, pour que les épingles Pinterest puissent y renvoyer.

type AvecEnfants = { children?: ReactNode };

// Lignes d'un tableau Markdown rendu par MDX : table > (thead | tbody) > tr > (th | td). On suit la structure, pas le
// type des éléments (tr, th, td passent par les composants de src/mdx-components.tsx) ; chaque cellule = son contenu.
function enfants(noeud: ReactNode) {
  const liste: ReactElement<AvecEnfants>[] = [];
  Children.forEach(noeud, (e) => {
    if (isValidElement<AvecEnfants>(e)) liste.push(e);
  });
  return liste;
}

function lignes(tableau: ReactNode): ReactNode[][] {
  return enfants(tableau).flatMap((section) =>
    enfants(section.props.children).map((ligne) =>
      enfants(ligne.props.children).map((c) => insecables(c.props.children)),
    ),
  );
}

// Espace insécable entre un nombre et son unité (« 20 cm », « 9,7 kg », « 6 capteurs ») : jamais coupés en fin de
// ligne dans les cartes étroites du téléphone.
const UNITE = /(\d) (?=(?:cm|kg|L|dB|GHz|mois|jours|ans|pouces|capteurs)\b)/g;
function insecables(noeud: ReactNode): ReactNode {
  if (typeof noeud === "string") return noeud.replace(UNITE, "$1\u00a0");
  if (Array.isArray(noeud)) return noeud.map(insecables);
  return noeud;
}

// Même calcul que plugins/remark-sommaire.mjs (ancres du sommaire).
function ancre(titre: string) {
  return titre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function texte(noeud: ReactNode): string {
  if (typeof noeud === "string" || typeof noeud === "number") return String(noeud);
  if (Array.isArray(noeud)) return noeud.map(texte).join("");
  if (isValidElement<AvecEnfants>(noeud)) return texte(noeud.props.children);
  return "";
}

function TableauDuel({ children }: AvecEnfants) {
  const [entete, ...corps] = lignes(children);
  if (!entete) return null;
  const [libelleCritere, ...produits] = entete;
  return (
    <div className="reveal mb-6 mt-8">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-caramel-field text-on-caramel">
              {entete.map((c, i) => (
                <th key={i} scope="col" className="px-4 py-3 font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {corps.map((ligne, i) => (
              <tr key={i} className="align-top even:bg-field">
                <th scope="row" className="px-4 py-3 font-semibold">
                  {ligne[0]}
                </th>
                {ligne.slice(1).map((c, j) => (
                  <td key={j} className="px-4 py-3">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden" aria-label={texte(libelleCritere) ? `Comparaison par ${texte(libelleCritere).toLowerCase()}` : undefined}>
        {produits.map((produit, p) => (
          <li key={p} className="bg-field px-5 py-6">
            <h3 className="text-lead font-semibold">{produit}</h3>
            <dl className="mt-4 grid grid-cols-[minmax(6.5rem,auto)_1fr] gap-x-4 gap-y-3">
              {corps.map((ligne, i) => (
                <div key={i} className="contents">
                  <dt className="text-ink-soft">{ligne[0]}</dt>
                  <dd>{ligne[p + 1]}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TitreAncre({ id, children, ...props }: AvecEnfants & { id?: string }) {
  return (
    <h2
      id={id ?? ancre(texte(children).replace(/\s+/g, " ").trim())}
      className="reveal font-display mb-6 mt-20 max-w-[22ch] scroll-mt-20 text-head first:mt-0"
      {...props}
    >
      {children}
    </h2>
  );
}

export const COMPOSANTS_DUEL = { table: TableauDuel, h2: TitreAncre } as unknown as Record<string, (p: object) => ReactElement | null>;
