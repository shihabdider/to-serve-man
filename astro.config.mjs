import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  site: "https://shihabdider.github.io",
  base: "/to-serve-man",
  trailingSlash: "always",
});
