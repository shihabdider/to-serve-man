import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";

const outputRoot = "dist";
const deploymentBase = "/to-serve-man/";
const expectedPages = [
  "index.html",
  "guides/index.html",
  "recipes/index.html",
  "recipes/alignment/index.html",
  "recipes/context-engineering/index.html",
  "recipes/domain-specific-languages/index.html",
];

function fail(message) {
  throw new Error(`Static build verification failed: ${message}`);
}

function filesBelow(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(path) : [path];
  });
}

for (const page of expectedPages) {
  if (!existsSync(join(outputRoot, page))) fail(`missing expected page ${page}`);
}

const outputFiles = filesBelow(outputRoot);
const htmlFiles = outputFiles.filter((file) => extname(file) === ".html");
const localReferencePattern = /(?:href|src)="([^"]+)"/gu;

for (const htmlFile of htmlFiles) {
  const html = readFileSync(htmlFile, "utf8");
  for (const [, reference] of html.matchAll(localReferencePattern)) {
    if (/^(?:#|https?:|mailto:|data:)/u.test(reference)) continue;
    if (!reference.startsWith(deploymentBase)) {
      fail(`${relative(outputRoot, htmlFile)} has a local reference without the deployment base: ${reference}`);
    }

    const pathWithinOutput = reference.slice(deploymentBase.length).split(/[?#]/u, 1)[0];
    const target = reference.endsWith("/")
      ? join(outputRoot, pathWithinOutput, "index.html")
      : join(outputRoot, pathWithinOutput);
    if (!existsSync(target)) {
      fail(`${relative(outputRoot, htmlFile)} references missing output ${reference}`);
    }
  }
}

const recipesIndex = readFileSync(join(outputRoot, "recipes/index.html"), "utf8");
for (const title of ["Alignment", "Context Engineering", "Domain-Specific Languages"]) {
  if (!recipesIndex.includes(`data-title="${title}"`)) fail(`recipes index is missing ${title}`);
}
if (!/<input[^>]*disabled[^>]*data-filter-input/iu.test(recipesIndex)) {
  fail("recipes index must keep the filter disabled until its client adapter loads");
}
if (!recipesIndex.includes("data-filter-input") || !recipesIndex.includes("type=\"module\"")) {
  fail("recipes index is missing the client-side title filter binding");
}
if (!recipesIndex.includes("title-filter__icon") || !recipesIndex.includes("placeholder=\"Search titles\"")) {
  fail("recipes index is missing the search-box treatment");
}
if (recipesIndex.includes("↗")) fail("recipes index still contains decorative entry arrows");

const cover = readFileSync(join(outputRoot, "index.html"), "utf8");
if (!cover.includes("wordmark.svg") || !cover.includes("site-main--cover") || !cover.includes("book-frame--cover")) {
  fail("cover does not contain the centered book and primary wordmark treatment");
}
if (!cover.includes("wordmark-subtitle\">(a cookbook)</span>")) {
  fail("cover is missing the visible cookbook subtitle");
}

const alignmentArticle = readFileSync(join(outputRoot, "recipes/alignment/index.html"), "utf8");
for (const expected of [
  "article-toc",
  "article-toc__item--depth-3",
  "data-article-tools",
  "href=\"#synthetic-example\"",
  "href=\"#immediate-intent\"",
  "href=\"/to-serve-man/recipes/\">Back to recipes",
]) {
  if (!alignmentArticle.includes(expected)) fail(`alignment article is missing ${expected}`);
}
if (!alignmentArticle.includes("Copy code to clipboard")) {
  fail("alignment article is missing the progressively enhanced code-copy binding");
}

for (const file of outputFiles.filter((candidate) => [".css", ".html", ".svg"].includes(extname(candidate)))) {
  if (/gradient\s*\(/iu.test(readFileSync(file, "utf8"))) {
    fail(`${relative(outputRoot, file)} contains a gradient`);
  }
}

console.log(`Verified ${htmlFiles.length} static pages, deployment-base links, catalog/filter output, article navigation/tools, and visual constraints.`);
