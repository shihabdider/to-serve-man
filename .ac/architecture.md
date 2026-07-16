# Architecture

## Approval status

Approved for autonomous implementation of P1 through P4.

## Project condition

- Greenfield: no application source, manifest, tests, Git metadata, or established conventions existed at architecture time.
- The approved boundary uses Astro only as a build-time static compiler. Production output is plain HTML, CSS, JavaScript, and assets with no application server or runtime rendering.
- The repository will target `shihabdider/to-serve-man` and GitHub Pages at `https://shihabdider.github.io/to-serve-man/`.

## Approved domain model

### Cookbook

The compound product model has three immediate concepts:

1. Branding — the canonical name and visual identity.
2. Library — the authored educational entries.
3. Catalog — collection selection and title filtering over the Library.

Responsible-use editorial policy is deliberately not modeled in this slice. The human intends to shape it later as an important article and does not yet want broad policy invented.

### Branding

- Canonical name: `To Serve Man (a cookbook)`, used for metadata and accessible naming.
- Display mark: a custom SVG whose stylized but recognizable Latin letters spell `TO SERVE MAN` and evoke the Kanamit glyphs.
- Visual rules: monochrome, minimal, no gradients, no generic AI UI conventions, and no decorative retro mannerisms.

Invariants:

- The wordmark is the primary visible cover title.
- No plain-English duplicate appears beside it as a translation.
- Assistive technology and browser metadata receive the canonical name.
- Alien-inspired lettering is limited to the title; reading text uses a conventional face.

### Library

The Library contains two peer collections:

- Guides — explanatory articles about principles, concepts, or practices.
- Recipes — directly reusable artifacts; each Recipe begins with a brief author-written abstract followed by exactly one complete prompt or agent skill in a copyable fenced block.

Each LibraryEntry has:

- Route identity — a collection kind plus URL-safe slug derived from the Markdown filename.
- Title — conventional readable text.
- Attribution — contributor display name.
- Body — nonempty Markdown that may contain prose, headings, lists, code blocks, prompts, or skill instructions.

Invariants:

- `guide` and `recipe` are the only collection kinds in this slice.
- A collection-kind and slug pair is unique.
- Invalid filenames, duplicate identities, missing titles, missing attribution, or empty bodies fail validation/build.
- Published filenames are treated as stable because renaming changes the URL.
- Adding a valid Markdown file publishes it automatically.
- Entries cannot select custom templates or page-level styling.
- Guide bodies are explanatory article prose.
- Recipe bodies contain two ordered parts: a brief prose abstract and one fenced artifact block containing a complete prompt or agent skill. Longer tutorials, trailing prose, and multiple artifact blocks belong in Guides or separate Recipes.

Initial Guide meanings:

- Context Engineering — manage finite working context, recognize the “dumb zone,” and refresh context deliberately.
- Alignment — state the scientist’s immediate intent, constraints, and definition of done for an agent.
- Domain-Specific Languages — use a domain-interview process to elicit shared vocabulary, concepts, relationships, invariants, and examples before work begins.

### Catalog

- Active collection — Guide or Recipe, selected through persistent right-edge tabs.
- Filter query — transient reader-entered text.
- Visible entries — derived from the active collection, matched case-insensitively by title, and sorted alphabetically.

Invariants:

- Collections and entries have no prescribed reading sequence or rank metadata.
- Filtering does not mutate content or URLs.
- Clearing the query restores the full alphabetical active collection.
- No full-text index, fuzzy matching, search-results page, client router, or previous/next links exist in the MVP.

## Presentation model

- `/` is a sparse cover led by the wordmark.
- `/guides/` and `/recipes/` are static collection indexes.
- `/guides/<slug>/` and `/recipes/<slug>/` are static article pages.
- Persistent right-edge tabs are ordinary links styled as cookbook index tabs.
- Collection indexes contain a title-filter input and alphabetical entries.
- Article pages contain title, attribution, and rendered Markdown.
- A small wordmark links to the cover; there is no top navigation bar.
- Static navigation and articles work without JavaScript; only title filtering requires browser JavaScript.

## Functional core and imperative shell

### Pure core

- Validated LibraryEntry values.
- Alphabetical comparison and case-insensitive title matching.
- CatalogState containing the filter query.
- Pure update/projection behavior from filter events and entries to visible entries.

### Imperative shell

- Astro content loaders read Markdown and emit static pages.
- Astro templates render ordered entries and article bodies.
- A tiny browser adapter listens to filter input and updates visible entries.
- Filesystem, DOM, process, and GitHub interactions remain outside the pure core.

## Hidden decisions and module contracts

### Content Library

Secret: Markdown location, frontmatter schema, Astro collection APIs, and validation.

Stable contract:

- Expose validated Guide and Recipe LibraryEntry values.
- Expose collection-aware route identity without raw filesystem or frontmatter details.
- Fail explicitly on invalid content.

Allowed dependencies: Astro content APIs and domain types.

Forbidden leaks: templates and catalog logic may not inspect raw frontmatter, collection storage paths, or Markdown filenames directly.

Boundary checks: valid entry loading, required-field failures, route generation, and complete static build.

### Catalog Policy

Secret: title normalization, alphabetical comparison, and filter semantics.

Stable contract:

- Alphabetize entries by readable title.
- Match entries against a case-insensitive title query.
- Return input-independent derived lists without mutation or I/O.

Allowed dependencies: LibraryEntry boundary values only.

Forbidden leaks: no DOM, Astro, filesystem, route, or deployment knowledge.

Boundary checks: alphabetical order, case-insensitive substring matching, clearing, no-match behavior, and input immutability.

### Branding

Secret: title lettering, design tokens, typography, and global visual constraints.

Stable contract:

- Supply the accessible wordmark asset and global visual variables/styles.
- Preserve title accessibility while avoiding a visible translated duplicate.

Forbidden leaks: pages do not recreate glyph paths or private color/type values.

Boundary checks: SVG accessible naming, no accidental gradient use, and human visual review.

### Static Site

Secret: routes, layouts, content rendering, persistent tab composition, and browser binding.

Stable contract:

- Emit the approved static route set from Content Library values.
- Render Branding assets and Catalog Policy results.
- Keep all non-filter navigation functional without client JavaScript.

Dependencies: Content Library, Catalog Policy, Branding.

Forbidden leaks: no direct content-file parsing or reimplementation of catalog matching/sorting.

Boundary checks: static build, route/link checks, keyboard semantics, narrow/wide viewport review, and filter integration.

### Pages Deployment

Secret: GitHub Pages permissions, artifact upload/deploy sequence, public URL, and base path.

Stable contract:

- Pull requests run public verification commands without deployment.
- Pushes to `main` verify, build, and deploy the static output.
- Manual workflow dispatch is available.
- Failed checks prevent deployment.

Dependencies: repository public check/build scripts only.

Forbidden leaks: content and presentation modules do not know GitHub Actions internals.

Boundary checks: local verification, workflow syntax review, and eventual GitHub Actions evidence after a remote is created.

## Build and deployment boundary

- Astro output mode: static.
- Site: `https://shihabdider.github.io`.
- Base path: `/to-serve-man`.
- Public URL: `https://shihabdider.github.io/to-serve-man/`.
- CI/CD uses current official GitHub Pages actions and deploys `dist/` after checks.
- The local project can initialize Git, but creating the GitHub repository, enabling Pages, and first push are external operations unless separately delegated.

## Work packages

### P1 — Foundation and contracts

Owner: build and domain foundation.

Scope: project manifest/lockfile, Astro static configuration, content schema, Catalog Policy core, unit tests, public verification scripts, GitHub workflow, and Git initialization.

Dependencies: approved architecture only.

Integration seam: validated LibraryEntry and Catalog Policy contracts.

### P2 — Branding and presentation

Owner: customer-facing static site.

Scope: wordmark, global CSS, layouts, pages, right-edge tabs, and browser filter adapter.

Dependencies: P1 contracts.

Forbidden overlap: content files, contributor prose, package manifest, and workflow.

### P3 — Editorial starter set

Owner: initial authored content.

Scope: three educational Markdown drafts, README, and contribution documentation. The drafts are now classified as Guides.

Dependencies: P1 content schema.

Forbidden overlap: templates, styles, wordmark, package manifest, and workflow.

### P4 — Integration and verification

Owner: primary implementer.

Scope: integrate P2 and P3, run all checks/builds, inspect responsive and keyboard behavior, and repair boundary-level defects.

Dependencies: P1, P2, and P3.

P2 and P3 may run concurrently in the same worktree only with their named disjoint write scopes. Merge/integration order is P1, then P2 plus P3, then P4.

## Change-impact simulations

- Add or revise one article: only a Markdown file changes; automatic discovery, routes, indexes, and tabs remain untouched. Localized as intended.
- Replace the wordmark or adjust monochrome tokens: Branding changes; content and catalog policy remain untouched. Localized as intended.
- Change from title substring filtering to full-text search: Catalog Policy and Static Site integration change; Content Library may need a new stable searchable-text field. This is a future architecture/product change, not an accidental leak.
- Replace GitHub Pages with another static host: Pages Deployment and host URL/base configuration change; content, catalog, and branding remain untouched. Localized as intended.
- Add a third collection: Library vocabulary, route generation, tabs, and catalog selection all legitimately change. This is a cross-cutting product-model change requiring renewed approval.
- Integrate P2 and P3 separately: P2 relies only on the approved LibraryEntry contract; P3 supplies conforming Markdown. No shared private file is required after P1.
- Replace Astro: Static Site and Content Library adapters change while Markdown bodies, domain meanings, Catalog Policy, and Branding assets can remain. The framework decision is localized as far as practical.

No unresolved boundary leak was found.

## Residual uncertainties and watchpoints

- Exact wordmark quality and overall visual character require human review; implementation must not treat first-pass lettering as final approval.
- Responsible-use policy remains intentionally unmodeled and must not be inferred from the initial articles.
- The repository remote and GitHub Pages settings do not yet exist locally.
- If Astro’s current content API or official action versions differ during implementation, adapt inside Content Library or Pages Deployment without changing public contracts.

## Construction handoff

Implementation may proceed when it:

- stays within P1 through P4;
- preserves the approved model and forbidden leaks;
- runs the public verification/build commands before feedback;
- routes changed content meaning or product scope back to the human;
- reports external GitHub setup still required after local CI/CD files are complete.

## Implementation evidence

- P1 through P4 were implemented locally against the approved module contracts.
- The Catalog Policy boundary was narrowed to a `CatalogItem` projection so the browser adapter can reuse sorting and matching without fabricating complete LibraryEntry bodies; this is a non-breaking contract refinement.
- Title filtering is progressive enhancement: static navigation and articles work without JavaScript, the filter is disabled in static HTML, and the adapter enables it after binding.
- The cover uses the approved monochrome wordmark as white lettering on a near-black field, while content pages retain the restrained paper-and-ink presentation.
- Verification evidence: Astro reports zero diagnostics; 28 unit tests pass; six expected static pages build; generated routes, deployment-base links, assets, filter binding, and no-gradient constraints pass a build-output check; the TypeScript compiler passes; desktop and mobile browser checks found no horizontal overflow; keyboard focus, title filtering, and JavaScript-disabled navigation were exercised successfully.
- At initial implementation the Guides collection was empty and produced non-blocking Astro warnings; later content work populated it.
- The local repository is initialized on `main` but has no commit or GitHub remote. Live Pages deployment still requires creating `shihabdider/to-serve-man`, pushing, and selecting GitHub Actions as the Pages source.

## Visual feedback repair

### Approved feedback outcome

The maintainer's annotated review refined the existing Branding and Static Site presentation contracts without changing module boundaries, content data, deployment, or production runtime.

### Branding refinement

- The custom display mark now arranges `TO SERVE` on the first line and `MAN` on the second.
- `(a cookbook)` is a separate visible subtitle on both the cover and small content-page mark.
- The canonical accessible and metadata name remains `To Serve Man (a cookbook)`.

### Static Site refinement

- Right-edge collection links remain ordinary static links. Their shared edge is now visible, and the active paper-colored tab overlays that edge so the selected collection reads as the open page.
- Collection title filtering retains the Catalog Policy contract and browser adapter; presentation now uses an accessible bordered search field with an inline icon and a divider-free entry list.
- Article routes receive rendered Markdown heading metadata from the existing Content Library adapter. ArticleLayout projects depth-two headings into a sticky table of contents and derives a back-to-collection link from the existing collection path contract.
- Code-copy controls are progressive enhancement over rendered Markdown `pre > code` blocks. Without JavaScript the code remains readable and scrollable; with JavaScript the adapter adds an accessible copy button and uses the Clipboard API with a restrictive-browser fallback.

### Change-impact evidence

- Adding or revising Markdown still changes no presentation code; article contents are derived automatically from rendered headings.
- Changing filter semantics still remains localized to Catalog Policy and its browser adapter; search-box styling does not leak into the core.
- Replacing the wordmark remains localized to Branding.
- Adding a third collection would still be cross-cutting and remains outside this repair.
- No new framework, storage model, API style, runtime service, or dependency was introduced.

### Verification evidence

- Astro reports zero errors, warnings, or hints; 28 unit tests pass; six static pages build; build-output checks cover base-path links, catalog/filter output, article navigation/tools, and visual constraints; TypeScript compilation passes.
- Browser checks exercised title filtering, back navigation, sticky contents, readable code colors, successful code copying, and desktop/mobile page widths without horizontal overflow.

## Centered book refinement

### Approved presentation geometry

- The outer viewport is a neutral backdrop rather than the book itself.
- A centered `book-frame` reserves one column for a bounded cover/page surface and one narrow column for tabs that protrude from its right edge.
- The frame has responsive outer gutters and an 88rem maximum book width. Cover and page surfaces retain a viewport-height minimum while longer articles extend normally.
- Collection tabs are sticky within the frame, not fixed to the viewport. The active paper-colored tab removes its inner border and merges into the open page.

### Article navigation refinement

- ArticleLayout projects rendered Markdown headings at depths two and three into the existing TOC.
- Heading depth remains presentation metadata supplied by Astro render output; Markdown authors do not maintain separate navigation data.
- Depth-three entries receive an explicit indented style under depth-two section entries.

### Browser enhancement refinement

- The existing copy adapter keeps the same accessible status labels and exact-text behavior.
- A successful copy state changes the icon geometry from overlapping sheets to a checkmark instead of relying on a dark fill alone.

### Change-impact and verification

- Centered-book geometry and tab attachment remain owned by BaseLayout and global Branding/Static Site styles.
- TOC hierarchy remains localized to ArticleLayout; content schema and article bodies are unchanged.
- Browser checks confirmed contrasting tab hover colors, sticky attached tabs, 14 TOC entries including 9 indented subsections on Alignment, a visible copy checkmark, and no desktop/mobile horizontal overflow.
- Configured verification, 28 unit tests, six-page static build, build-output assertions, and TypeScript compilation pass.

## Tab and article spacing correction

### Tab embedding correction

- Guides and Recipes use distinct muted cookbook-tab colors with dark labels and darker same-hue hover fills.
- Tab boxes use physical borders because vertical writing mode changes the meaning of logical border properties. Top, right, and bottom borders remain explicit; the left border is removed so each tab enters the book edge without a boxed-button seam.
- The active tab uses a physical negative left margin to extend into the page while retaining all three exposed borders. This also restores the previously missing exposed horizontal border.

### Article spacing correction

- The wide article grid increases the TOC-to-content gap, reduces the empty trailing column, and shifts the reading measure modestly toward the tab edge.
- At the 2000px browser check, the TOC-to-article gap is 72px and the article center sits 40px right of the complete frame center; narrow layouts continue to collapse to one column.

## Private remote and deferred publishing

### Approved repository state

- The canonical remote is `shihabdider/to-serve-man`.
- The repository is private until the maintainer explicitly approves publication.
- GitHub Pages publishing is deferred. The deployment workflow remains available only through `workflow_dispatch`; pushes to `main` do not deploy.
- `.ac/construction/` is worktree-private role state and is excluded from Git history.

### Future publication handoff

Publishing later requires an explicit maintainer decision to make the required repository/Pages access changes and restore the `main` push trigger in `.github/workflows/deploy.yml`. The existing Astro site/base-path configuration and manual deployment workflow remain ready for that later step.


## Guide and Recipe taxonomy refinement

### Approved feedback outcome

The maintainer reclassified the existing educational articles as Guides and reserved Recipes for directly reusable prompts and skills. This changes content placement and route identity without adding a collection, framework, schema field, template, or runtime behavior.

### Content invariants

- Alignment, Context Engineering, and Domain-Specific Languages belong to Guides because they explain ideas and practices.
- First Principles remains a Guide.
- A Recipe file starts with a brief author-written abstract describing one prompt or agent skill, followed by that complete artifact in one fenced block. It does not contain a tutorial, trailing prose, or several artifacts.
- The existing `title`, `author`, and nonempty-body content contract remains in force. The abstract-plus-artifact shape is an editorial authoring invariant; prompt-versus-skill subtype metadata and installable packaging are not required.
- The Recipes collection may be empty.

### Brownfield extension seam and route impact

The change reuses the existing content collection boundary: moving Markdown between `src/content/recipes/` and `src/content/guides/` changes the collection kind consumed by the existing static route generators. Slugs remain stable, but the three moved articles intentionally change from `/recipes/<slug>/` to `/guides/<slug>/`. Publishing is still deferred, so redirects are not introduced for unpublished routes. The maintainer's in-progress edits to Alignment must be preserved byte-for-byte during the move.

Repository and contribution documentation must state the refined taxonomy and Recipe structure. Build-output verification must expect the Guide routes, an empty Recipes index, and article navigation back to Guides while continuing to protect filtering, article tools, deployment-base links, and visual constraints.

### Change-impact evidence

- Moving the three files and adjusting route-level build assertions touches Content Library data and public verification only; route templates, Catalog Policy, Branding, and deployment stay unchanged.
- Adding a future Guide remains a Markdown-only change.
- Adding the first Recipe remains a Markdown-only change: its abstract renders as prose, its single fenced artifact renders with the existing copy control, and no installable-file packaging or subtype-specific metadata is needed.
- A third collection or a new Recipe subtype in the domain model remains a cross-cutting product change.

### P7 work package

Owner: content taxonomy and verification.

Scope: preserve and move the three current article files to Guides; retain First Principles as a Guide; update repository guidance and living product context; update build-output expectations; run configured verification and compiler checks.

Dependencies: completed P1 through P6 and this maintainer-approved taxonomy.

Forbidden changes: no rewriting the maintainer's Alignment draft, new content subtype, new framework, new route template, redirects, or Recipe example invented without maintainer content.

Integration seam: existing Markdown collection directories and static Guide/Recipe route generators.


### P7 implementation evidence

- Alignment, Context Engineering, and Domain-Specific Languages moved to `src/content/guides/`; the maintainer's Alignment draft retained the same SHA-256 across the move.
- First Principles remains in Guides, and Recipes is empty without a placeholder artifact.
- README, contributor guidance, path examples, domain fixtures, and build-output checks now use the refined taxonomy.
- Astro's ignored content cache required clearing after the final Recipe source was removed; a fresh cache and production build emit seven pages with no stale Recipe article routes.
- Configured verification passes: Astro reports zero diagnostics, 28 tests pass, seven static pages and deployment-base links verify, and the TypeScript compiler passes.


## Recipe presentation clarification

### Approved feedback outcome

Recipes are not intended to be installable package files. Each Recipe is a reader-facing Markdown page with a brief abstract written by the author, followed by the complete prompt or skill in one fenced block that can be copied easily.

### Structure and ownership

- Content Library retains the shared `title`, `author`, and nonempty-body contract. The two-part Recipe shape is maintained through authoring guidance until concrete evidence justifies AST-level validation.
- Static Site retains shared article rendering. Ordinary Markdown renders the abstract, while the existing article-tools adapter progressively adds a copy button to the one fenced artifact block and copies its exact text content.
- A Recipe may not contain multiple artifact blocks, variations, a long tutorial, or prose after the artifact. Distinct artifacts become distinct Recipes; extended explanation becomes a Guide.
- No new subtype, dependency, route, template, download, or install behavior is introduced.

### Change-impact evidence

This clarification changes product vocabulary, the living PRD, and contributor examples only. The existing Markdown renderer and copy adapter already provide the approved customer-facing behavior, so production code and collection schema remain unchanged. The Recipes collection remains empty until the maintainer authors a concrete artifact.


## Build-time article references

### Approved notation and behavior

The maintainer approved `[[{guide|recipe}:name#section|custom text]]` for links between Markdown entries. Collection kind and filename-derived name are required. The heading section and custom visible text are optional. Without custom text, the target entry's current title is used.

Examples:

- `[[guide:first-principles]]`
- `[[guide:first-principles#generation-repeats-one-step]]`
- `[[recipe:variant-review-prompt|the variant review prompt]]`
- `[[guide:first-principles#generation-repeats-one-step|how generation works]]`

### Content Library extension

Secret: notation parsing, target-title indexing, Markdown-AST transformation, and diagnostic wording.

Stable contract:

- Resolve an explicit `guide` or `recipe` plus lowercase kebab-case slug against files in the existing content collections.
- Emit a deployment-base-aware ordinary Markdown link, optionally with a lowercase kebab-case heading fragment.
- Use custom text when supplied and the target title otherwise.
- Fail Markdown processing on malformed notation, unknown targets, invalid slugs, empty custom text, and unterminated references.
- Leave fenced code, inline code, HTML, and existing Markdown links unchanged so notation can be demonstrated literally.

The adapter uses Astro's official unified Markdown processor and a local remark plugin. YAML frontmatter parsing is build-time-only and supplies target titles without exposing raw frontmatter to page templates. The pure parser and resolver remain independently testable from the filesystem/Markdown AST shell.

### Static-output validation

Build-output verification owns final fragment integrity because rendered heading IDs are an output concern. It validates same-page and cross-page local fragments against IDs in generated HTML, in addition to its existing deployment-base and target-file checks. A missing section therefore blocks configured verification.

### Change-impact evidence

- Renaming a title updates default link labels without changing authored references.
- Renaming a filename or heading causes references to fail rather than silently publish broken navigation.
- Moving an entry between Guides and Recipes requires updating the explicit kind in references, matching the intentional route-identity change.
- Ordinary external Markdown links and article rendering remain unchanged.
- A future notation change stays localized to the Article Reference parser, tests, authoring guidance, and output validation contract.

### P9 work package

Owner: Content Library article-reference adapter and static-output validation.

Scope: local parser/resolver and remark adapter, Astro processor integration, build-output fragment checks, tests, contributor notation documentation, living PRD update, and configured verification.

Dependencies: existing collection directories, route path helper, shared Markdown renderer, and official Astro unified Markdown processor.

Forbidden changes: no runtime router, client-side link resolution, raw URL authoring requirement, implicit collection guessing, content rewrites, or new collection.


### P9 implementation evidence

- `src/lib/article-links.ts` owns strict notation parsing, collection/slug resolution, target-title lookup, base-aware URL generation, and the remark AST adapter.
- Astro uses the official unified Markdown processor at build time; `yaml` reads target frontmatter titles, while templates remain isolated from raw frontmatter and filesystem details.
- Eleven focused tests cover complete and optional forms, malformed notation, unknown targets, title/default and custom labels, deployment bases, catalog loading, multiple references, skipped code/existing links, and source-path diagnostics.
- Static-output verification now checks local heading fragments against generated HTML IDs as well as target files and deployment bases. Existing TOC links exercise this check in the production output.
- Configured verification passes: Astro reports zero diagnostics, 39 tests pass, seven static pages build and verify, and the TypeScript compiler passes.

## Archived Guide drafts and published skill Recipes

### Approved editorial state

- Published entries remain the only LibraryEntries consumed by Content Library and Static Site.
- An Archived Guide Draft is retained under `src/content/archive/guides/`, outside the direct-file glob used by the `guides` collection. It has no route identity, index entry, or article-link target until moved back into `src/content/guides/`.
- Skill Recipes reuse the existing Recipe contract: one short prose abstract followed by exactly one fenced artifact block. HtDP companion methods are embedded inside its one outer skill block rather than becoming separate Recipe artifacts.
- The new Domain-Specific Language skill is editorial content, not a new runtime DSL, parser, collection, or domain type.

### Brownfield seam and compatibility

The change uses existing Markdown collection directories, shared article rendering, copy enhancement, and static-output checks. No schema field, loader, route template, browser state, framework, or dependency changed. The two archived files retained their pre-move SHA-256 hashes.

Published article references cannot resolve to archived drafts because the existing Article Reference target loader indexes direct collection files only. Contributor guidance therefore forbids links from published entries to archived drafts.

### P10 work package and evidence

Owner: editorial publication state and skill content.

Scope: archive Domain-Specific Languages and First Principles; add Mom Test, bundled HtDP, Hidden-Decision-Driven Design, and Domain-Specific Language Recipes; update documentation, living product context, and build-output verification.

Verification confirms nine static pages: two published Guides, four Recipes, two collection indexes, and the cover. Archived Guide routes and titles are absent; every Recipe renders one abstract before exactly one artifact block; HtDP contains all four companion methods; 45 tests, Astro diagnostics, build-output checks, and TypeScript compilation pass. Browser checks confirmed the four alphabetical Recipe titles, one HtDP copy control, embedded companion text, and no horizontal overflow.

### Change-impact evidence

- Republishing one archived Guide requires only moving its unchanged Markdown back to `src/content/guides/` and updating any intentionally changed verification expectations.
- Revising a skill changes one Recipe Markdown file; shared rendering and copy behavior remain unchanged.
- Adding draft visibility to the reader interface would require a new product and collection decision and remains outside this change.
- Replacing Recipe packaging or introducing installable skill files would change the Recipe contract and remains cross-cutting.
