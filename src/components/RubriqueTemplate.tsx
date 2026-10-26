import Link from "next/link";
import { StagePage, type StagePhoto } from "@/components/StagePage";
import { espacesFines } from "@/lib/typo";

export type ArticleLien = { href: string; titre: string; description: string; type: "comparatif" | "guide" };

type Props = {
  titre: string;
  intro: string;
  articles: ArticleLien[];
  photo?: StagePhoto;
};

// Page de rubrique : introduction courte, liens vers les articles, photo d'ambiance qui reste en place.
export function RubriqueTemplate({ titre, intro, articles, photo }: Props) {
  return (
    <StagePage title={titre} lead={intro} photo={photo} stageWord={titre}>
      <h2 className="font-display mb-8 text-head">Les articles</h2>
      <ul className="space-y-3">
        {articles.map((a) => (
          <li key={a.href} className="reveal">
            <Link
              href={a.href}
              className="group block bg-field px-5 py-6 transition-colors hover:bg-caramel-field hover:text-on-caramel sm:px-8"
            >
              <span className="block font-display text-head">
                {espacesFines(a.titre)}
              </span>
              <span className="mt-2 block max-w-[55ch]">{espacesFines(a.description)}</span>
              <span className="mt-4 block font-medium underline underline-offset-4">
                {a.type === "comparatif" ? "Lire le comparatif" : "Lire le guide"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </StagePage>
  );
}
