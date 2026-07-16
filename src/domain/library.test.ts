import { describe, expect, it } from "vitest";
import {
  assertUniqueEntries,
  createLibraryEntry,
  InvalidLibraryEntryError,
  libraryEntryIdentity,
  type LibraryEntryCandidate,
} from "./library";

const validCandidate: LibraryEntryCandidate = {
  kind: "recipe",
  slug: "variant-review-prompt",
  title: "Variant Review Prompt",
  author: "Shihab Dider",
  body: "Review the supplied synthetic variants and report unsupported claims.",
};

describe("createLibraryEntry", () => {
  it("accepts and trims every text field", () => {
    expect(createLibraryEntry({
      ...validCandidate,
      slug: "  variant-review-prompt  ",
      title: "  Variant Review Prompt  ",
      author: "  Shihab Dider  ",
      body: "  Useful body.  ",
    })).toEqual({ ...validCandidate, body: "Useful body." });
  });

  it.each([
    ["slug", ""],
    ["slug", "Variant Review Prompt"],
    ["slug", "nested/context"],
    ["title", "   "],
    ["author", "\n"],
    ["body", "\t"],
  ] as const)("rejects an invalid %s", (field, value) => {
    expect(() => createLibraryEntry({ ...validCandidate, [field]: value })).toThrow(InvalidLibraryEntryError);
  });
});

describe("entry identity and uniqueness", () => {
  it("combines collection kind and slug", () => {
    expect(libraryEntryIdentity(validCandidate)).toBe("recipe/variant-review-prompt");
  });

  it("preserves an empty or unique list", () => {
    const guide = createLibraryEntry({ ...validCandidate, kind: "guide" });
    const recipe = createLibraryEntry(validCandidate);
    expect(assertUniqueEntries([])).toEqual([]);
    expect(assertUniqueEntries([guide, recipe])).toEqual([guide, recipe]);
  });

  it("rejects duplicate identities in the same collection", () => {
    const entry = createLibraryEntry(validCandidate);
    expect(() => assertUniqueEntries([entry, { ...entry }])).toThrow(/Duplicate LibraryEntry identity/);
  });
});
