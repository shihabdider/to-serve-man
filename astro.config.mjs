import { unified } from "@astrojs/markdown-remark";
import { defineConfig } from "astro/config";
import { remarkArticleLinks } from "./src/lib/article-links.ts";

const base = "/to-serve-man";

export default defineConfig({
  output: "static",
  site: "https://shihabdider.github.io",
  base,
  trailingSlash: "always",
  markdown: {
    processor: unified({
      remarkPlugins: [[remarkArticleLinks, { contentRoot: "src/content", base }]],
    }),
  },
});
