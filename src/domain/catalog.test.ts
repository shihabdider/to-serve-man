import { describe, expect, it } from "vitest";
import type { LibraryEntry } from "./library";
import {
  alphabetizeEntries,
  filterEntries,
  INITIAL_CATALOG_STATE,
  normalizeCatalogQuery,
  updateCatalog,
  viewCatalog,
} from "./catalog";

function entry(title: string, slug = title.toLowerCase().replaceAll(" ", "-")): LibraryEntry {
  return { kind: "recipe", slug, title, author: "Lab Member", body: `${title} body` };
}

describe("normalizeCatalogQuery", () => {
  it.each([
    ["", ""],
    ["  Context  ", "context"],
    ["DOMAIN", "domain"],
  ])("normalizes %j to %j", (query, expected) => {
    expect(normalizeCatalogQuery(query)).toBe(expected);
  });
});

describe("updateCatalog", () => {
  it("starts with an empty query", () => {
    expect(INITIAL_CATALOG_STATE).toEqual({ query: "" });
  });

  it("handles every filter event without mutating prior state", () => {
    const initial = { query: "old" } as const;
    expect(updateCatalog(initial, { type: "filter-changed", query: "  New  " })).toEqual({ query: "new" });
    expect(updateCatalog(initial, { type: "filter-cleared" })).toEqual({ query: "" });
    expect(initial).toEqual({ query: "old" });
  });
});

describe("alphabetizeEntries", () => {
  it("handles empty and singleton collections", () => {
    const one = entry("Alignment");
    expect(alphabetizeEntries([])).toEqual([]);
    expect(alphabetizeEntries([one])).toEqual([one]);
  });

  it("orders by readable title without mutating input", () => {
    const input = [entry("Domain-Specific Languages"), entry("context Engineering"), entry("Alignment")];
    expect(alphabetizeEntries(input).map(({ title }) => title)).toEqual([
      "Alignment",
      "context Engineering",
      "Domain-Specific Languages",
    ]);
    expect(input.map(({ title }) => title)).toEqual([
      "Domain-Specific Languages",
      "context Engineering",
      "Alignment",
    ]);
  });
});

describe("filterEntries", () => {
  const entries = [entry("Domain-Specific Languages"), entry("Context Engineering"), entry("Alignment")];

  it("returns every entry alphabetically for an empty query", () => {
    expect(filterEntries(entries, "").map(({ title }) => title)).toEqual([
      "Alignment",
      "Context Engineering",
      "Domain-Specific Languages",
    ]);
  });

  it("matches a case-insensitive title substring", () => {
    expect(filterEntries(entries, "  ENGINEER  ").map(({ title }) => title)).toEqual(["Context Engineering"]);
  });

  it("represents no matches as an empty list", () => {
    expect(filterEntries(entries, "sequencing")).toEqual([]);
  });
});

describe("viewCatalog", () => {
  it("projects the normalized query, visible entries, and match state", () => {
    const entries = [entry("Context Engineering"), entry("Alignment")];
    expect(viewCatalog(entries, { query: "  CONTEXT " })).toEqual({
      query: "context",
      entries: [entries[0]],
      hasMatches: true,
    });
    expect(viewCatalog(entries, { query: "missing" })).toEqual({
      query: "missing",
      entries: [],
      hasMatches: false,
    });
  });
});
