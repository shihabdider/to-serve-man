import type { CollectionKind } from "../domain/library";

/**
 * Prefix a site-relative path with Astro's deployment base.
 *
 * Examples:
 * - ("", "/to-serve-man/") -> "/to-serve-man/"
 * - ("guides/", "/to-serve-man") -> "/to-serve-man/guides/"
 * - ("wordmark.svg", "/") -> "/wordmark.svg"
 *
 * Template: normalize the base, normalize the path's leading edge, then join them.
 */
export function withBasePath(pathname: string, base = import.meta.env.BASE_URL): string {
  const baseSegment = base.replace(/^\/+|\/+$/gu, "");
  const baseRoot = baseSegment.length === 0 ? "/" : `/${baseSegment}/`;
  return `${baseRoot}${pathname.replace(/^\/+/, "")}`;
}

/**
 * Build an index or article path from a validated collection identity.
 *
 * Examples:
 * - ("guide") -> "<base>/guides/"
 * - ("recipe", "alignment") -> "<base>/recipes/alignment/"
 *
 * Template: branch on CollectionKind, then branch on the optional slug.
 */
export function collectionPath(
  kind: CollectionKind,
  slug?: string,
  base = import.meta.env.BASE_URL,
): string {
  let collectionSegment: "guides" | "recipes";
  switch (kind) {
    case "guide":
      collectionSegment = "guides";
      break;
    case "recipe":
      collectionSegment = "recipes";
      break;
  }

  const articleSegment = slug === undefined ? "" : `${slug}/`;
  return withBasePath(`${collectionSegment}/${articleSegment}`, base);
}
