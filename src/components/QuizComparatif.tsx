import { QuizJeu } from "@/components/QuizJeu";
import { getProduct } from "@/lib/products";
import { quizPour } from "@/lib/quiz";

// Quiz d'un comparatif, placé juste avant « ## Tableau comparatif » :
// <QuizComparatif categorie="litiere-chat" asins={frontmatter.products} />
// Les règles (src/lib/quiz.ts) sont calculées ici, au build, sur les seuls produits de la page ; le navigateur ne
// reçoit que les ASIN retenus par chaque réponse. L'ordre de `asins` (celui du tableau) départage les égalités.
export function QuizComparatif({ categorie, asins }: { categorie: string; asins: string[] }) {
  return <QuizJeu quiz={quizPour(categorie, asins.map(getProduct))} />;
}
