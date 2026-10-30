import { BoutonAction } from "@/components/BoutonAction";
import { RELIEF_TITRE } from "@/components/Logo";
import { tousLesArticles } from "@/lib/rubriques";
import { SITE } from "@/lib/site";
import { espacesFines } from "@/lib/typo";

// Scène 7 : grande section bleu nuit. Son bord supérieur forme un dôme léger qui s'aplatit en arrivant à l'écran
// (Mouvement anime son échelle verticale : transform seul, rien à repeindre).
// « Moustache malin » en très grand, comme le logo, et les comparatifs en boutons orange (ordinateur seulement : sur
// téléphone et tablette, le carrousel des articles les montre déjà). Le pied de page s'y colle (data-fin-pleine).
export function Fin() {
  const comparatifs = tousLesArticles().filter((a) => a.type === "comparatif");

  return (
    <section data-fin data-fin-pleine aria-labelledby="titre-fin" className="relative bg-nuit text-blanc">
      <div
        data-fin-courbe
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[calc(100%-1px)] h-[7vw] origin-bottom rounded-t-[50%_100%] bg-nuit"
      />
      <div className="px-4 pb-16 pt-16 sm:px-8 lg:pb-28 lg:pt-28">
        <div className="mx-auto max-w-[90rem]">
          <h2
            id="titre-fin"
            data-apparait
            className="font-display text-[clamp(4rem,1rem+11vw,15rem)] lg:whitespace-nowrap"
          >
            <span data-fin-mot className="inline-block" style={{ textShadow: RELIEF_TITRE.moustache }}>
              Moustache
            </span>{" "}
            <span data-fin-mot className="mot-serif inline-block text-accent" style={{ textShadow: RELIEF_TITRE.malin }}>
              malin
            </span>
          </h2>
          <p className="mt-8 max-w-[30ch] text-lead text-blanc/85">{SITE.tagline}</p>
          {comparatifs.length > 0 ? (
            <ul className="mt-10 flex flex-col items-start gap-4 max-lg:hidden sm:flex-row sm:flex-wrap">
              {comparatifs.map((a) => (
                <li key={a.href}>
                  <BoutonAction href={a.href}>{espacesFines(`Comparatif : ${a.titre.replace(/ :.*$/, "")}`)}</BoutonAction>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
