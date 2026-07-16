import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import type { CollectionKind } from "../domain/library";
import { collectionPath } from "./paths";

export interface ArticleLinkTarget {
  readonly kind: CollectionKind;
  readonly slug: string;
  readonly title: string;
}

export interface ArticleLinkReference {
  readonly kind: CollectionKind;
  readonly slug: string;
  readonly section?: string;
  readonly label?: string;
}

interface MarkdownNode {
  readonly type: string;
  value?: string;
  url?: string;
  children?: MarkdownNode[];
}

interface MarkdownFile {
  readonly path?: string;
}

export interface ArticleLinkOptions {
  readonly contentRoot?: string;
  readonly base?: string;
}

export class InvalidArticleLinkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidArticleLinkError";
  }
}

const SLUG_PATTERN = "[a-z0-9]+(?:-[a-z0-9]+)*";
const REFERENCE_PATTERN = new RegExp(
  `^(guide|recipe):(${SLUG_PATTERN})(?:#(${SLUG_PATTERN}))?(?:\\|(.+))?$`,
  "u",
);
const SKIPPED_NODE_TYPES = new Set(["code", "html", "inlineCode", "link", "linkReference"]);

function collectionDirectory(kind: CollectionKind): "guides" | "recipes" {
  return kind === "guide" ? "guides" : "recipes";
}

function readTitle(markdown: string, path: string): string {
  const frontmatter = markdown.match(/^(?:\uFEFF)?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u);
  if (frontmatter === null) {
    throw new InvalidArticleLinkError(`Cannot index article without YAML frontmatter: ${path}`);
  }

  const data: unknown = parseYaml(frontmatter[1]);
  if (typeof data !== "object" || data === null || !("title" in data)) {
    throw new InvalidArticleLinkError(`Cannot index article without a title: ${path}`);
  }

  const title = (data as { readonly title?: unknown }).title;
  if (typeof title !== "string" || title.trim().length === 0) {
    throw new InvalidArticleLinkError(`Cannot index article with an invalid title: ${path}`);
  }
  return title.trim();
}

/** Load the stable collection identity and title used to resolve authored links. */
export function loadArticleLinkTargets(contentRoot = "src/content"): readonly ArticleLinkTarget[] {
  const targets: ArticleLinkTarget[] = [];

  for (const kind of ["guide", "recipe"] as const) {
    const directory = resolve(contentRoot, collectionDirectory(kind));
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith(".md")) continue;

      const slug = entry.name.slice(0, -3);
      if (!new RegExp(`^${SLUG_PATTERN}$`, "u").test(slug)) {
        throw new InvalidArticleLinkError(`Cannot index article with an invalid slug: ${entry.name}`);
      }

      const path = resolve(directory, entry.name);
      targets.push({ kind, slug, title: readTitle(readFileSync(path, "utf8"), path) });
    }
  }

  return targets;
}

/** Parse the canonical [[kind:name#section|custom text]] notation. */
export function parseArticleLink(token: string): ArticleLinkReference {
  if (!token.startsWith("[[") || !token.endsWith("]]")) {
    throw new InvalidArticleLinkError(`Malformed article link: ${token}`);
  }

  const match = token.slice(2, -2).match(REFERENCE_PATTERN);
  if (match === null) {
    throw new InvalidArticleLinkError(
      `Malformed article link ${token}; expected [[{guide|recipe}:name#section|custom text]]`,
    );
  }

  const label = match[4]?.trim();
  if (match[4] !== undefined && label?.length === 0) {
    throw new InvalidArticleLinkError(`Article link has empty custom text: ${token}`);
  }

  return {
    kind: match[1] as CollectionKind,
    slug: match[2],
    ...(match[3] === undefined ? {} : { section: match[3] }),
    ...(label === undefined ? {} : { label }),
  };
}

/** Resolve a parsed reference to a deployment-base-aware URL and readable label. */
export function resolveArticleLink(
  reference: ArticleLinkReference,
  targets: readonly ArticleLinkTarget[],
  base = "/",
): { readonly href: string; readonly label: string } {
  const target = targets.find(
    (candidate) => candidate.kind === reference.kind && candidate.slug === reference.slug,
  );
  if (target === undefined) {
    throw new InvalidArticleLinkError(
      `Unknown article link target: ${reference.kind}:${reference.slug}`,
    );
  }

  const articlePath = collectionPath(target.kind, target.slug, base);
  return {
    href: reference.section === undefined ? articlePath : `${articlePath}#${reference.section}`,
    label: reference.label ?? target.title,
  };
}

function textNode(value: string): MarkdownNode {
  return { type: "text", value };
}

function linkNodes(
  value: string,
  targets: readonly ArticleLinkTarget[],
  base: string,
): MarkdownNode[] {
  const nodes: MarkdownNode[] = [];
  let cursor = 0;

  while (cursor < value.length) {
    const start = value.indexOf("[[", cursor);
    if (start === -1) {
      nodes.push(textNode(value.slice(cursor)));
      break;
    }

    if (start > cursor) nodes.push(textNode(value.slice(cursor, start)));
    const end = value.indexOf("]]", start + 2);
    if (end === -1) {
      throw new InvalidArticleLinkError(`Unterminated article link: ${value.slice(start)}`);
    }

    const token = value.slice(start, end + 2);
    const resolved = resolveArticleLink(parseArticleLink(token), targets, base);
    nodes.push({
      type: "link",
      url: resolved.href,
      children: [textNode(resolved.label)],
    });
    cursor = end + 2;
  }

  return nodes;
}

function transformNode(
  node: MarkdownNode,
  targets: readonly ArticleLinkTarget[],
  base: string,
): void {
  if (SKIPPED_NODE_TYPES.has(node.type) || node.children === undefined) return;

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index];
    if (child.type === "text" && child.value?.includes("[[") === true) {
      const replacements = linkNodes(child.value, targets, base);
      node.children.splice(index, 1, ...replacements);
      index += replacements.length - 1;
      continue;
    }
    transformNode(child, targets, base);
  }
}

/** Astro remark plugin that resolves validated article-link notation at build time. */
export function remarkArticleLinks(options: ArticleLinkOptions = {}) {
  const contentRoot = options.contentRoot ?? "src/content";
  const base = options.base ?? "/";

  return (tree: MarkdownNode, file: MarkdownFile): void => {
    try {
      transformNode(tree, loadArticleLinkTargets(contentRoot), base);
    } catch (error) {
      const source = file.path === undefined ? "Markdown content" : file.path;
      const message = error instanceof Error ? error.message : String(error);
      throw new InvalidArticleLinkError(`${source}: ${message}`);
    }
  };
}
