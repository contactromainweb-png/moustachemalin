// Les articles MDX exportent `meta` (voir src/lib/articles.ts).
declare module "*.mdx" {
  export const meta: import("@/lib/articles").ArticleMeta;
}
