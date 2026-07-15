# Contributing

Guides and Recipes are maintained as Markdown. A content contribution should normally add or edit one file under `src/content/`; no route, index, layout, or navigation edit is needed.

## Choose a collection

- Add a **Guide** to `src/content/guides/` when the entry mainly explains a principle.
- Add a **Recipe** to `src/content/recipes/` when the entry gives a reusable practice, workflow, prompt, skill, or set of checks.

Entries are peers. Do not add rank, sequence, previous/next, template, or page-style metadata.

## File and schema rules

Put each article directly in its collection directory. Nested directories are not discovered.

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

The filename without `.md` is the article's URL slug. Treat a published filename as stable: renaming it changes the URL. Discuss a rename with the maintainer before making it.

Every article must begin with YAML frontmatter containing the two supported fields:

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

For example, `src/content/recipes/variant-table-checks.md` will be published at `/to-serve-man/recipes/variant-table-checks/` after it is merged and deployed.

## Write the article

Use ordinary Markdown headings, paragraphs, lists, links, block quotes, and fenced code blocks. Keep the source easy for another lab member to revise. If a prompt is meant to be copied and adapted, put it in a fenced code block and mark editable values clearly.

Before submitting, read the rendered page as well as the source. Check heading order, code wrapping, links, and whether the title and attribution appear as expected.

## Git workflow

Start from an up-to-date `main` branch and create a short-lived branch:

```sh
git switch main
git pull --ff-only
git switch -c content/short-article-name
npm ci
```

Add or edit the Markdown file, then run the checks below. Commit only source changes, not `dist/` or `.astro/` output.

```sh
git add src/content/recipes/short-article-name.md
git commit -m "Add short article name recipe"
git push -u origin content/short-article-name
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

A contribution is not ready while any of these commands fails. Fix content-schema and Markdown errors in the article. If a failure appears unrelated to your content or would require changing presentation, domain, build, or workflow code, report the command and full diagnostic in the pull request instead of broadening the contribution.

For visual review during editing:

```sh
npm run dev
```

For a final review of the production output:

```sh
npm run build
npm run preview
```

Follow the URL printed by Astro. Confirm that the article appears in the correct collection, its title is in alphabetical order, its article link opens, and a distinctive substring of its title works with the collection filter.

## Pull-request checklist

- [ ] The file is directly under `src/content/guides/` or `src/content/recipes/`.
- [ ] The filename matches the lowercase kebab-case rule and is intended to be a stable URL.
- [ ] Frontmatter contains nonempty `title` and `author` values.
- [ ] The Markdown body is nonempty and renders clearly.
- [ ] No generated `dist/` or `.astro/` files are included.
- [ ] `npm run verify` passes, or the pull request records an unrelated blocking diagnostic.
- [ ] The rendered entry appears and links correctly in its collection.
