import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";

const outputRoot = "dist";
const deploymentBase = "/to-serve-man/";
const expectedPages = [
  "index.html",
  "guides/index.html",
  "recipes/index.html",
  "guides/alignment/index.html",
  "guides/context-engineering/index.html",
  "guides/domain-specific-languages/index.html",
  "guides/first-principles/index.html",
];
const movedArticleSlugs = ["alignment", "context-engineering", "domain-specific-languages"];

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
for (const slug of movedArticleSlugs) {
  if (existsSync(join(outputRoot, "recipes", slug, "index.html"))) {
    fail(`moved Guide still has a Recipe route: ${slug}`);
  }
}

const outputFiles = filesBelow(outputRoot);
const htmlFiles = outputFiles.filter((file) => extname(file) === ".html");
const localReferencePattern = /(href|src)="([^"]+)"/gu;

for (const htmlFile of htmlFiles) {
  const html = readFileSync(htmlFile, "utf8");
  for (const [, attribute, reference] of html.matchAll(localReferencePattern)) {
    if (/^(?:https?:|mailto:|data:)/u.test(reference)) continue;

    let target;
    let fragment;
    if (attribute === "href" && reference.startsWith("#")) {
      target = htmlFile;
      fragment = reference.slice(1);
    } else {
      if (!reference.startsWith(deploymentBase)) {
        fail(`${relative(outputRoot, htmlFile)} has a local reference without the deployment base: ${reference}`);
      }

      const [pathAndQuery, rawFragment] = reference.split("#", 2);
      const pathname = pathAndQuery.split("?", 1)[0];
      const pathWithinOutput = pathname.slice(deploymentBase.length);
      target = pathname.endsWith("/")
        ? join(outputRoot, pathWithinOutput, "index.html")
        : join(outputRoot, pathWithinOutput);
      fragment = attribute === "href" ? rawFragment : undefined;
      if (!existsSync(target)) {
        fail(`${relative(outputRoot, htmlFile)} references missing output ${reference}`);
      }
    }

    if (fragment !== undefined && fragment.length > 0) {
      if (extname(target) !== ".html") {
        fail(`${relative(outputRoot, htmlFile)} links to a fragment on non-HTML output: ${reference}`);
      }
      const decodedFragment = decodeURIComponent(fragment);
      if (!readFileSync(target, "utf8").includes(`id="${decodedFragment}"`)) {
        fail(`${relative(outputRoot, htmlFile)} references missing section ${reference}`);
      }
    }
  }
}

const guidesIndex = readFileSync(join(outputRoot, "guides/index.html"), "utf8");
for (const title of ["Alignment", "Context Engineering", "Domain-Specific Languages", "First Principles"]) {
  if (!guidesIndex.includes(`data-title="${title}"`)) fail(`guides index is missing ${title}`);
}
if (!/<input[^>]*disabled[^>]*data-filter-input/iu.test(guidesIndex)) {
  fail("guides index must keep the filter disabled until its client adapter loads");
}
if (!guidesIndex.includes("data-filter-input") || !guidesIndex.includes("type=\"module\"")) {
  fail("guides index is missing the client-side title filter binding");
}
if (!guidesIndex.includes("title-filter__icon") || !guidesIndex.includes("placeholder=\"Search titles\"")) {
  fail("guides index is missing the search-box treatment");
}
if (guidesIndex.includes("↗")) fail("guides index still contains decorative entry arrows");

const recipesIndex = readFileSync(join(outputRoot, "recipes/index.html"), "utf8");
if (!recipesIndex.includes("No recipes have been published.")) {
  fail("empty recipes index is missing its empty state");
}
for (const title of ["Alignment", "Context Engineering", "Domain-Specific Languages"]) {
  if (recipesIndex.includes(`data-title="${title}"`)) fail(`recipes index still contains moved Guide ${title}`);
}

const cover = readFileSync(join(outputRoot, "index.html"), "utf8");
if (!cover.includes("wordmark.svg") || !cover.includes("site-main--cover") || !cover.includes("book-frame--cover")) {
  fail("cover does not contain the centered book and primary wordmark treatment");
}
if (!cover.includes("wordmark-subtitle\">(a cookbook)</span>")) {
  fail("cover is missing the visible cookbook subtitle");
}

const contextGuide = readFileSync(join(outputRoot, "guides/context-engineering/index.html"), "utf8");
for (const expected of [
  "article-toc",
  "data-article-tools",
  "data-context-window",
  "href=\"#the-dumb-zone\"",
  "href=\"#compaction-vs-artifacts\"",
  "href=\"/to-serve-man/guides/\">Back to guides",
]) {
  if (!contextGuide.includes(expected)) fail(`context engineering Guide is missing ${expected}`);
}

const domainLanguageGuide = readFileSync(join(outputRoot, "guides/domain-specific-languages/index.html"), "utf8");
if (!domainLanguageGuide.includes("article-toc__item--depth-3")) {
  fail("domain-specific language Guide is missing nested article navigation");
}

const articleScript = outputFiles
  .filter((candidate) => extname(candidate) === ".js")
  .map((candidate) => readFileSync(candidate, "utf8"))
  .join("\n");
for (const expected of ["Copy code to clipboard", "Chat context illustration", "Illustrative output quality"]) {
  if (!articleScript.includes(expected)) fail(`article enhancement bundle is missing ${expected}`);
}

for (const file of outputFiles.filter((candidate) => [".css", ".html", ".svg"].includes(extname(candidate)))) {
  if (/gradient\s*\(/iu.test(readFileSync(file, "utf8"))) {
    fail(`${relative(outputRoot, file)} contains a gradient`);
  }
}

console.log(`Verified ${htmlFiles.length} static pages, deployment-base links, catalog/filter output, article navigation/tools, and visual constraints.`);
