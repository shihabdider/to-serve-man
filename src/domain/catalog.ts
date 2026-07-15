import type { LibraryEntry } from "./library";

export type CatalogItem = Pick<LibraryEntry, "kind" | "slug" | "title">;

export interface CatalogState {
  readonly query: string;
}

export type CatalogEvent =
  | { readonly type: "filter-changed"; readonly query: string }
  | { readonly type: "filter-cleared" };

export interface CatalogView {
  readonly query: string;
  readonly entries: readonly CatalogItem[];
  readonly hasMatches: boolean;
}

export const INITIAL_CATALOG_STATE: CatalogState = { query: "" };

/** Normalize user-entered title-filter text for stable comparisons. */
export function normalizeCatalogQuery(query: string): string {
  return query.trim().toLocaleLowerCase("en");
}

/** Pure state transition for filter events. */
export function updateCatalog(_state: CatalogState, event: CatalogEvent): CatalogState {
  switch (event.type) {
    case "filter-changed":
      return { query: normalizeCatalogQuery(event.query) };
    case "filter-cleared":
      return INITIAL_CATALOG_STATE;
  }
}

/** Return a new alphabetical list without mutating the input. */
export function alphabetizeEntries(entries: readonly CatalogItem[]): readonly CatalogItem[] {
  return [...entries].sort((left, right) => {
    const byTitle = left.title.localeCompare(right.title, "en", { sensitivity: "base", numeric: true });
    if (byTitle !== 0) return byTitle;
    return `${left.kind}/${left.slug}`.localeCompare(`${right.kind}/${right.slug}`, "en");
  });
}

/** Return alphabetized entries whose titles contain the normalized query. */
export function filterEntries(entries: readonly CatalogItem[], query: string): readonly CatalogItem[] {
  const normalizedQuery = normalizeCatalogQuery(query);
  const matches = normalizedQuery.length === 0
    ? entries
    : entries.filter((entry) => normalizeCatalogQuery(entry.title).includes(normalizedQuery));
  return alphabetizeEntries(matches);
}

/** Project current state and entries into renderable catalog data. */
export function viewCatalog(entries: readonly CatalogItem[], state: CatalogState): CatalogView {
  const query = normalizeCatalogQuery(state.query);
  const visibleEntries = filterEntries(entries, query);
  return {
    query,
    entries: visibleEntries,
    hasMatches: visibleEntries.length > 0,
  };
}
