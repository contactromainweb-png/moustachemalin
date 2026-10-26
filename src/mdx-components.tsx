import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { AffiliateButton } from "@/components/AffiliateButton";
import { AmazonDisclosure } from "@/components/AmazonDisclosure";
import { CalloutLink } from "@/components/CalloutLink";
import { ComparisonTable } from "@/components/ComparisonTable";
import { FAQ } from "@/components/FAQ";
import { MethodNote } from "@/components/MethodNote";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ProductBox } from "@/components/ProductBox";
import { ProductCard } from "@/components/ProductCard";
import { ProsCons } from "@/components/ProsCons";
import { RelatedArticles } from "@/components/RelatedArticles";
import { TopPicks } from "@/components/TopPicks";
import { VetNotice } from "@/components/VetNotice";
import { pageEnLigne } from "@/lib/site";

// Mise en forme des textes écrits en MDX (dossier content/).
// Les composants listés en bas sont utilisables directement dans un article, sans import.
const components: MDXComponents = {
  h2: (props) => (
    <h2 className="reveal font-display mb-6 mt-20 max-w-[22ch] text-head first:mt-0" {...props} />
  ),
  h3: (props) => <h3 className="reveal mb-3 mt-10 text-lead font-semibold" {...props} />,
  p: (props) => <p className="reveal mb-5 max-w-[65ch]" {...props} />,
  ul: (props) => <ul className="reveal mb-6 max-w-[65ch] list-disc space-y-2 pl-6 marker:text-caramel" {...props} />,
  ol: (props) => <ol className="reveal mb-6 max-w-[65ch] list-decimal space-y-2 pl-6 marker:text-caramel" {...props} />,
  strong: (props) => <strong className="font-semibold" {...props} />,
  a: ({ href = "", ...props }) => {
    const className =
      "text-caramel underline decoration-2 underline-offset-4 hover:text-ink transition-colors";
    if (href.startsWith("/")) {
      // Lien vers une page pas encore écrite : on garde le texte, sans lien.
      if (!pageEnLigne(href)) return <span>{props.children}</span>;
      return <Link href={href} className={className} {...props} />;
    }
    return <a href={href} className={className} rel="noopener" target="_blank" {...props} />;
  },
  blockquote: (props) => (
    <blockquote className="reveal my-10 bg-field px-6 py-6 text-lead sm:px-8" {...props} />
  ),
  // Tableaux Markdown (| … |) : de vrais tableaux, lisibles sur téléphone (défilement horizontal).
  table: (props) => (
    <div className="reveal mb-6 max-w-[44rem] overflow-x-auto">
      <table className="w-full border-collapse text-left" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-ink text-paper" {...props} />,
  tr: (props) => <tr className="even:bg-field" {...props} />,
  th: (props) => <th className="px-4 py-3 font-medium" {...props} />,
  td: (props) => <td className="px-4 py-3" {...props} />,
  // Séparateur « --- » : un simple espace, pas de trait.
  hr: () => <div aria-hidden="true" className="h-12" />,
  em: (props) => <em className="text-ink-soft" {...props} />,
  AffiliateButton,
  // Placée seule dans un article : un peu d'air avant le texte qui suit.
  AmazonDisclosure: (props: { className?: string }) => <AmazonDisclosure className="mb-10" {...props} />,
  CalloutLink,
  ComparisonTable,
  FAQ,
  MethodNote,
  NewsletterForm,
  ProductBox,
  ProductCard,
  ProsCons,
  RelatedArticles,
  TopPicks,
  VetNotice,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
