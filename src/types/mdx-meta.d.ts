// Les articles MDX exportent leur bloc --- sous le nom `frontmatter` (voir src/lib/articles.ts).
declare module "*.mdx" {
  export const frontmatter: import("@/lib/articles").Frontmatter;
}
