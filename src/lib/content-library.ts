import { getCollection, render, type CollectionEntry } from "astro:content";
import {
  assertUniqueEntries,
  createLibraryEntry,
  type CollectionKind,
  type LibraryEntry,
} from "../domain/library";

type SourceEntry = CollectionEntry<"guides"> | CollectionEntry<"recipes">;

export interface LibraryDocument {
  readonly entry: LibraryEntry;
  readonly rendered: Awaited<ReturnType<typeof render>>;
}

function toLibraryEntry(kind: CollectionKind, source: SourceEntry): LibraryEntry {
  return createLibraryEntry({
    kind,
    slug: source.id,
    title: source.data.title,
    author: source.data.author,
    body: source.body ?? "",
  });
}

async function getSourceEntries(kind: CollectionKind): Promise<readonly SourceEntry[]> {
  switch (kind) {
    case "guide":
      return getCollection("guides");
    case "recipe":
      return getCollection("recipes");
  }
}

export async function getLibraryEntries(kind: CollectionKind): Promise<readonly LibraryEntry[]> {
  const sourceEntries = await getSourceEntries(kind);
  return assertUniqueEntries(sourceEntries.map((source) => toLibraryEntry(kind, source)));
}

export async function getLibraryDocument(
  kind: CollectionKind,
  slug: string,
): Promise<LibraryDocument | undefined> {
  const sourceEntries = await getSourceEntries(kind);
  const source = sourceEntries.find((candidate) => candidate.id === slug);
  if (source === undefined) return undefined;

  return {
    entry: toLibraryEntry(kind, source),
    rendered: await render(source),
  };
}
