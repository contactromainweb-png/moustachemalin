import type { MDXComponents } from "mdx/types";
import Link from "next/link";

// Mise en forme des textes écrits en MDX (dossier content/).
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
    if (href.startsWith("/")) return <Link href={href} className={className} {...props} />;
    return <a href={href} className={className} rel="noopener" target="_blank" {...props} />;
  },
  blockquote: (props) => (
    <blockquote className="reveal my-10 bg-field px-6 py-6 text-lead sm:px-8" {...props} />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
