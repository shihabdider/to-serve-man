# To Serve Man (a cookbook)

A small static cookbook of practical guides and recipes for cancer-genomics lab scientists who are new to agentic AI. Entries are ordinary Markdown so the substantive material can be revised without changing presentation code.

Guides are explanatory articles about principles, concepts, and practices. Each Recipe begins with a brief author-written abstract, followed by exactly one complete prompt or agent skill in a copyable fenced block. Recipes are meant to be easy to understand and copy, not to serve as installable package files.

The starter Guides are working drafts, intended to improve through use and maintainer review.

## How the site is built

[Astro](https://astro.build/) is used only at build time. It validates the content collections, renders each collection index and article route, and writes a static site to `dist/`. The deployed site consists of HTML, CSS, browser JavaScript, and assets; it does not require an application server.

Entry discovery is automatic. A valid Markdown file added directly to `src/content/guides/` or `src/content/recipes/` becomes part of its collection at the next build. Its filename supplies the stable URL slug, while its frontmatter supplies the displayed title and author.

Markdown can link between entries with `[[guide:name]]` or `[[recipe:name]]`. An optional `#section` and `|custom text` may follow the name. The build converts valid references to deployment-aware links and rejects malformed or missing targets; complete notation and examples are in the contribution guide.

## Local development

The project uses Node.js 24 (see `.node-version`) and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Astro. The development server watches source and content files for changes.

Available commands:

- `npm run dev` — start the local development server.
- `npm run check` — validate Astro, TypeScript, and content collection data.
- `npm run test` — run the domain contract tests once.
- `npm run build` — create the production static site in `dist/`.
- `npm run preview` — serve the built `dist/` output locally for a final check.
- `npm run verify` — run the required check, test, and production-build sequence.
- `npm run test:watch` — run the domain tests in watch mode while developing.

Run `npm run verify` before opening a pull request.

## Source organization

- `src/content/guides/` — explanatory Markdown articles.
- `src/content/recipes/` — a brief abstract followed by one copyable prompt or agent skill block per file.
- `src/content.config.ts` — content collection discovery and frontmatter/filename schema.
- `src/domain/` — framework-independent Library and Catalog contracts, with unit tests.
- `src/lib/content-library.ts` and `src/lib/article-links.ts` — boundaries for validated content entries and build-time links between them.
- `src/pages/` and nearby presentation directories — Astro routes, layouts, components, styles, and the small browser-side filter binding.
- `public/` — static assets copied into the build.
- `.github/workflows/` — pull-request verification and the deferred, manually triggered GitHub Pages deployment.
- `dist/` — generated production output; do not edit or commit it.

Presentation code consumes validated Library entries rather than parsing Markdown files directly. Content authors should normally need to work only in `src/content/`.

## GitHub Pages

The production target is:

<https://shihabdider.github.io/to-serve-man/>

Astro is configured with `https://shihabdider.github.io` as the site and `/to-serve-man` as the base path. Pull requests run the verification workflow. Pages publishing is intentionally deferred while the repository remains private: pushes to `main` do not deploy. The deployment workflow is manual-only until publication is explicitly approved.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the Git workflow, exact content schema and filename rules, and pre-submission checks.
