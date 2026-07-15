export const COLLECTION_KINDS = ["guide", "recipe"] as const;

export type CollectionKind = (typeof COLLECTION_KINDS)[number];

export interface LibraryEntry {
  readonly kind: CollectionKind;
  readonly slug: string;
  readonly title: string;
  readonly author: string;
  readonly body: string;
}

export interface LibraryEntryCandidate {
  readonly kind: CollectionKind;
  readonly slug: string;
  readonly title: string;
  readonly author: string;
  readonly body: string;
}

export class InvalidLibraryEntryError extends Error {
  readonly field: keyof LibraryEntryCandidate | "identity";

  constructor(field: keyof LibraryEntryCandidate | "identity", message: string) {
    super(message);
    this.name = "InvalidLibraryEntryError";
    this.field = field;
  }
}

function normalizedNonEmptyText(
  field: "title" | "author" | "body",
  value: string,
): string {
  const normalized = value.trim();
  if (normalized.length === 0) {
    throw new InvalidLibraryEntryError(field, `LibraryEntry ${field} must not be empty`);
  }
  return normalized;
}

/** Validate one primitive-backed candidate and return its normalized domain value. */
export function createLibraryEntry(candidate: LibraryEntryCandidate): LibraryEntry {
  const slug = candidate.slug.trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new InvalidLibraryEntryError("slug", `Invalid LibraryEntry slug: ${JSON.stringify(candidate.slug)}`);
  }

  return {
    kind: candidate.kind,
    slug,
    title: normalizedNonEmptyText("title", candidate.title),
    author: normalizedNonEmptyText("author", candidate.author),
    body: normalizedNonEmptyText("body", candidate.body),
  };
}

/** Reject duplicate collection/slug identities while preserving entry order. */
export function assertUniqueEntries(entries: readonly LibraryEntry[]): readonly LibraryEntry[] {
  const seen = new Set<string>();
  for (const entry of entries) {
    const identity = libraryEntryIdentity(entry);
    if (seen.has(identity)) {
      throw new InvalidLibraryEntryError("identity", `Duplicate LibraryEntry identity: ${identity}`);
    }
    seen.add(identity);
  }
  return entries;
}

export function libraryEntryIdentity(entry: Pick<LibraryEntry, "kind" | "slug">): string {
  return `${entry.kind}/${entry.slug}`;
}
