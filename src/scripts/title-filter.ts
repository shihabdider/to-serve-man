import {
  INITIAL_CATALOG_STATE,
  updateCatalog,
  viewCatalog,
  type CatalogItem,
  type CatalogState,
} from "../domain/catalog";
import { libraryEntryIdentity } from "../domain/library";

/** Translate one rendered list item back to the Catalog Policy boundary value. */
function readCatalogItem(element: HTMLElement): CatalogItem | undefined {
  const { kind, slug, title } = element.dataset;
  if (slug === undefined || title === undefined) return undefined;

  switch (kind) {
    case "guide":
    case "recipe":
      return { kind, slug, title };
    default:
      return undefined;
  }
}

/** Bind the imperative DOM shell for one statically rendered collection index. */
function bindTitleFilter(root: HTMLElement): void {
  const input = root.querySelector<HTMLInputElement>("[data-filter-input]");
  const status = root.querySelector<HTMLElement>("[data-filter-status]");
  const elements = [...root.querySelectorAll<HTMLElement>("[data-catalog-entry]")];
  if (input === null || status === null || elements.length === 0) return;

  const elementByIdentity = new Map<string, HTMLElement>();
  const entries: CatalogItem[] = [];

  for (const element of elements) {
    const entry = readCatalogItem(element);
    const identity = element.dataset.entryId;
    if (entry === undefined || identity === undefined) continue;
    entries.push(entry);
    elementByIdentity.set(identity, element);
  }

  let state: CatalogState = INITIAL_CATALOG_STATE;
  input.disabled = false;

  const render = (): void => {
    const view = viewCatalog(entries, state);
    const visibleIdentities = new Set(view.entries.map((entry) => libraryEntryIdentity(entry)));

    for (const [identity, element] of elementByIdentity) {
      element.hidden = !visibleIdentities.has(identity);
    }

    status.textContent = view.query.length === 0
      ? ""
      : view.hasMatches
        ? `${view.entries.length} matching ${view.entries.length === 1 ? "title" : "titles"}.`
        : "No matching titles.";
  };

  input.addEventListener("input", () => {
    state = updateCatalog(
      state,
      input.value.length === 0
        ? { type: "filter-cleared" }
        : { type: "filter-changed", query: input.value },
    );
    render();
  });

  if (input.value.length > 0) {
    state = updateCatalog(state, { type: "filter-changed", query: input.value });
    render();
  }
}

for (const root of document.querySelectorAll<HTMLElement>("[data-title-filter]")) {
  bindTitleFilter(root);
}
