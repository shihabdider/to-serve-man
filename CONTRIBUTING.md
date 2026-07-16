# Contributing

Guides and Recipes are maintained as Markdown. A content contribution should normally add or edit one file under `src/content/`; no route, index, layout, or navigation edit is needed.

## Choose a collection

- Add a **Guide** to `src/content/guides/` when the entry explains a principle, concept, or practice.
- Add a **Recipe** to `src/content/recipes/` when the entry presents one directly reusable prompt or one agent skill.

A Recipe has two parts in order: a brief author-written abstract describing the artifact and its intended use, then one fenced block containing the complete prompt or skill. Do not bundle multiple artifacts or turn the abstract into a tutorial; put longer explanatory material in a Guide instead. The Recipes collection may remain empty until there is a real artifact to contribute.

Entries are peers. Do not add rank, sequence, previous/next, template, or page-style metadata.

## Archive a Guide draft

Move a Guide that should remain editable but unpublished to `src/content/archive/guides/`. Files there retain ordinary Guide frontmatter and Markdown, but collection discovery ignores them, so they do not appear in the Guides index and receive no static route. Move the file back to `src/content/guides/` when it is ready to publish. Do not link published entries to an archived draft.

## File and schema rules

Put each published entry directly in its collection directory. Nested directories are not discovered; `src/content/archive/guides/` deliberately uses that boundary to retain unpublished drafts.

A filename must:

- end in `.md`;
- use only lowercase ASCII letters and digits within words;
- separate words with single hyphens;
- have no spaces, underscores, leading/trailing hyphens, or consecutive hyphens; and
- match `^[a-z0-9]+(?:-[a-z0-9]+)*\.md$` exactly.

Valid examples:

- `context-engineering.md`
- `variant-table-checks.md`
- `batch-qc-2.md`

Invalid examples:

- `Context-Engineering.md`
- `variant_table_checks.md`
- `variant table checks.md`
- `variant--table.md`
- `checks/variant-table.md`

The filename without `.md` is the entry's URL slug. Treat a published filename as stable: renaming it changes the URL. Discuss a rename with the maintainer before making it.

Every entry must begin with YAML frontmatter containing the two supported fields:

```yaml
---
title: A Readable Article Title
author: Contributor Display Name
---
```

The exact content contract is:

- `title` is required and must be a nonempty string after surrounding whitespace is removed;
- `author` is required and must be a nonempty string after surrounding whitespace is removed; and
- the Markdown body after the frontmatter is required and must contain non-whitespace text.

Use conventional readable text for the title and the contributor's requested display name for the author. Do not add fields for slugs, routes, ordering, templates, or styling; collection and filename determine the route, and presentation is shared by all entries.

For example, `src/content/recipes/variant-review-prompt.md` will be published at `/to-serve-man/recipes/variant-review-prompt/` after it is merged and deployed.

## Write the entry

For a Guide, use ordinary Markdown headings, paragraphs, lists, links, block quotes, and fenced code blocks. Keep the source easy for another lab member to revise.

For a Recipe, write one short prose abstract first. Follow it with exactly one fenced block containing the complete prompt or agent skill:

````md
---
title: Variant Review Prompt
author: Contributor Display Name
---

This prompt asks an agent to review a synthetic variant table and separate
source-supported observations from unsupported claims.

```text
[Complete prompt or skill content]
```
````

Mark editable values clearly. If the artifact itself contains triple-backtick fences, wrap it in a longer outer fence so it still renders as one block. Do not add prose after the artifact, a second code block, variations, or unrelated checks. Split distinct artifacts into distinct Recipe files.

The site adds a copy control to rendered fenced blocks automatically. Review the page and confirm that copying returns the complete artifact text. For Guides, also check heading order, code wrapping, and links. For every entry, confirm that the title and attribution appear as expected.

## Link between entries

Use the compact article-link notation instead of hard-coding collection URLs:

```md
[[guide:context-engineering]]
[[guide:context-engineering#the-dumb-zone]]
[[recipe:mom-test|the Mom Test skill]]
[[guide:context-engineering#the-dumb-zone|the dumb zone]]
```

The canonical form is `[[{guide|recipe}:name#section|custom text]]`:

- `guide` or `recipe` is required and identifies the target collection;
- `name` is required and is the target Markdown filename without `.md`;
- `#section` is optional and uses the rendered lowercase kebab-case heading ID; and
- `|custom text` is optional and replaces the target article title as the visible label.

The builder converts the notation to a deployment-base-aware link. Malformed notation and unknown articles fail the Markdown build. `npm run verify` also rejects links to missing sections. Article-link notation is ignored inside fenced code, inline code, and existing Markdown links, so examples can be shown literally.

## Git workflow

Start from an up-to-date `main` branch and create a short-lived branch:

```sh
git switch main
git pull --ff-only
git switch -c content/short-entry-name
npm ci
```

Add or edit the Markdown file, then run the checks below. Commit only source changes, not `dist/` or `.astro/` output.

```sh
git add src/content/recipes/short-entry-name.md
git commit -m "Add short entry name recipe"
git push -u origin content/short-entry-name
```

Use `src/content/guides/...` instead when contributing a Guide. If you do not have permission to push branches to the repository, push the branch to your fork. Open a pull request describing what the entry helps a reader do and any parts where you especially want editorial review.

For an edit to an existing entry, use the same workflow and keep its filename unchanged unless a URL change was agreed in advance.

## Checks

Run the complete public verification command:

```sh
npm run verify
```

It runs, in order:

1. `npm run check` — validates the Astro/TypeScript project, content frontmatter, and filename-derived IDs;
2. `npm run test` — runs the Library and Catalog contract tests; and
3. `npm run build` — validates every body through the Content Library and renders the production static site.

A contribution is not ready while any of these commands fails. Fix content-schema and Markdown errors in the entry. If a failure appears unrelated to your content or would require changing presentation, domain, build, or workflow code, report the command and full diagnostic in the pull request instead of broadening the contribution.

For visual review during editing:

```sh
npm run dev
```

For a final review of the production output:

```sh
npm run build
npm run preview
```

Follow the URL printed by Astro. Confirm that the entry appears in the correct collection, its title is in alphabetical order, its link opens, and a distinctive substring of its title works with the collection filter.

## Pull-request checklist

- [ ] The file is directly under `src/content/guides/` or `src/content/recipes/`.
- [ ] The filename matches the lowercase kebab-case rule and is intended to be a stable URL.
- [ ] Frontmatter contains nonempty `title` and `author` values.
- [ ] The Markdown body is nonempty and renders clearly.
- [ ] No generated `dist/` or `.astro/` files are included.
- [ ] `npm run verify` passes, or the pull request records an unrelated blocking diagnostic.
- [ ] The rendered entry appears and links correctly in its collection.
