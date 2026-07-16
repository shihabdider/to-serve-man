import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import {
  InvalidArticleLinkError,
  loadArticleLinkTargets,
  parseArticleLink,
  remarkArticleLinks,
  resolveArticleLink,
  type ArticleLinkTarget,
} from "./article-links";

const targets: readonly ArticleLinkTarget[] = [
  { kind: "guide", slug: "first-principles", title: "First Principles" },
  { kind: "recipe", slug: "variant-review-prompt", title: "Variant Review Prompt" },
];

const temporaryRoots: string[] = [];

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function contentFixture(): string {
  const root = mkdtempSync(join(tmpdir(), "article-links-"));
  temporaryRoots.push(root);
  mkdirSync(join(root, "guides"));
  mkdirSync(join(root, "recipes"));
  writeFileSync(
    join(root, "guides", "first-principles.md"),
    "---\ntitle: First Principles\nauthor: Lab Member\n---\n\nBody.\n",
  );
  writeFileSync(
    join(root, "recipes", "variant-review-prompt.md"),
    "---\ntitle: 'Variant Review Prompt'\nauthor: Lab Member\n---\n\nAbstract.\n",
  );
  return root;
}

describe("article-link notation", () => {
  it("parses the collection, slug, optional section, and optional custom text", () => {
    expect(parseArticleLink("[[guide:first-principles]]")).toEqual({
      kind: "guide",
      slug: "first-principles",
    });
    expect(parseArticleLink("[[recipe:variant-review-prompt#usage|review workflow]]")).toEqual({
      kind: "recipe",
      slug: "variant-review-prompt",
      section: "usage",
      label: "review workflow",
    });
  });

  it.each([
    "[[first-principles]]",
    "[[guides:first-principles]]",
    "[[guide:First-Principles]]",
    "[[guide:first-principles#Usage]]",
    "[[guide:first-principles|   ]]",
  ])("rejects malformed notation %s", (token) => {
    expect(() => parseArticleLink(token)).toThrow(InvalidArticleLinkError);
  });

  it("resolves a base-aware route and defaults to the article title", () => {
    expect(resolveArticleLink(
      parseArticleLink("[[guide:first-principles#generation-repeats-one-step]]"),
      targets,
      "/to-serve-man",
    )).toEqual({
      href: "/to-serve-man/guides/first-principles/#generation-repeats-one-step",
      label: "First Principles",
    });
  });

  it("uses custom text and rejects an unknown target", () => {
    expect(resolveArticleLink(
      parseArticleLink("[[recipe:variant-review-prompt|the review prompt]]"),
      targets,
      "/",
    )).toEqual({
      href: "/recipes/variant-review-prompt/",
      label: "the review prompt",
    });
    expect(() => resolveArticleLink(
      parseArticleLink("[[guide:missing-guide]]"),
      targets,
    )).toThrow(/Unknown article link target/);
  });
});

describe("article-link catalog and remark adapter", () => {
  it("loads titles and collection identities from Markdown frontmatter", () => {
    expect(loadArticleLinkTargets(contentFixture())).toEqual([
      { kind: "guide", slug: "first-principles", title: "First Principles" },
      { kind: "recipe", slug: "variant-review-prompt", title: "Variant Review Prompt" },
    ]);
  });

  it("converts multiple references while leaving code and existing links alone", () => {
    const transform = remarkArticleLinks({ contentRoot: contentFixture(), base: "/cookbook" });
    const tree = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{
            type: "text",
            value: "Read [[guide:first-principles]] and [[recipe:variant-review-prompt|this prompt]].",
          }],
        },
        { type: "inlineCode", value: "[[guide:first-principles]]" },
        {
          type: "link",
          url: "/existing/",
          children: [{ type: "text", value: "[[guide:first-principles]]" }],
        },
      ],
    };

    transform(tree, { path: "source.md" });

    expect(tree.children[0]).toEqual({
      type: "paragraph",
      children: [
        { type: "text", value: "Read " },
        {
          type: "link",
          url: "/cookbook/guides/first-principles/",
          children: [{ type: "text", value: "First Principles" }],
        },
        { type: "text", value: " and " },
        {
          type: "link",
          url: "/cookbook/recipes/variant-review-prompt/",
          children: [{ type: "text", value: "this prompt" }],
        },
        { type: "text", value: "." },
      ],
    });
    expect(tree.children[1]).toEqual({ type: "inlineCode", value: "[[guide:first-principles]]" });
    expect(tree.children[2]).toEqual({
      type: "link",
      url: "/existing/",
      children: [{ type: "text", value: "[[guide:first-principles]]" }],
    });
  });

  it("reports malformed and unterminated references with their source path", () => {
    const transform = remarkArticleLinks({ contentRoot: contentFixture() });
    expect(() => transform(
      { type: "root", children: [{ type: "text", value: "[[first-principles]]" }] },
      { path: "guide.md" },
    )).toThrow(/guide\.md: Malformed article link/);
    expect(() => transform(
      { type: "root", children: [{ type: "text", value: "[[guide:first-principles" }] },
      { path: "guide.md" },
    )).toThrow(/guide\.md: Unterminated article link/);
  });
});
