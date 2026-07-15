import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const entrySchema = z.object({
  title: z.string().trim().min(1),
  author: z.string().trim().min(1),
});

function entryId({ entry }: { entry: string }): string {
  const id = entry.replace(/\.md$/u, "");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(id)) {
    throw new Error(`Content filename must be a lowercase kebab-case slug: ${entry}`);
  }
  return id;
}

const guides = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/guides", generateId: entryId }),
  schema: entrySchema,
});

const recipes = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/recipes", generateId: entryId }),
  schema: entrySchema,
});

export const collections = { guides, recipes };
