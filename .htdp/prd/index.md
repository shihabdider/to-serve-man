# To Serve Man Product PRD

## Purpose

To Serve Man is a static cookbook that helps cancer-genomics lab scientists develop practical, responsible habits for working with agentic AI. The maintainer should be able to author and revise substantive material as Markdown without changing presentation code.

## Current Direction

The library has two peer collections with deliberately different jobs:

- Guides are explanatory articles about principles, concepts, and practices.
- Recipes present directly reusable artifacts. Each Recipe begins with a brief author-written abstract and then contains exactly one complete prompt or agent skill in a copyable fenced block.

Alignment and Context Engineering are currently published Guides. Domain-Specific Languages and First Principles remain retained Guide drafts under `src/content/archive/guides/`; they are intentionally absent from collection indexes and public routes until the maintainer republishes them.

The Recipes collection publishes four reusable agent skills: Mom Test, a bundled How to Design Programs skill, Hidden-Decision-Driven Design, and a Domain-Specific Language interview skill.

## Users / Use Cases

- A lab scientist wants a Guide so they can understand an agentic-AI concept in the lab's working context.
- A lab scientist wants a Recipe so they can understand its intended use from a brief abstract and copy one complete prompt or skill from a single block.
- The maintainer wants to move or edit Markdown content without changing route or presentation components.
- A contributor wants collection rules that make it clear whether their contribution explains something or is itself a reusable artifact.

## Domain Terms and Data Definitions

Authored library material is one of:

- Published LibraryEntry:
  - GuideEntry: a validated Markdown entry whose body is explanatory article prose.
  - RecipeEntry: a validated Markdown entry whose body contains a brief Abstract followed by one fenced ArtifactBlock holding one complete Prompt or AgentSkill.
- ArchivedGuideDraft: retained Guide Markdown outside collection discovery, with no index entry or static route.

Every current LibraryEntry has:

- collection kind: Guide or Recipe;
- slug: lowercase kebab-case identity derived from its filename;
- title: nonempty readable text;
- author: nonempty contributor display name; and
- body: nonempty Markdown; for a Recipe, an abstract followed by one artifact block.

An ArticleReference has:

- kind: `guide` or `recipe`;
- name: the target entry's filename slug;
- optional section: a rendered heading ID; and
- optional custom text: the visible link label.

Its authored notation is `[[{guide|recipe}:name#section|custom text]]`. Kind and name are required; section and custom text are optional.

Examples:

- `guides/alignment.md` is a published Guide because it explains alignment.
- `archive/guides/first-principles.md` is an ArchivedGuideDraft and therefore has no public route.
- `recipes/mom-test.md` contains a short description followed by one complete agent skill in a fenced block.
- `recipes/htdp.md` bundles the HtDP skill and its companion methods into one complete artifact block.
- A tutorial containing several prompts is not a Recipe; it belongs in Guides or must be split into one Recipe per artifact.

## Desired Behaviors

- Moving a valid entry between collection directories changes its collection and static URL without requiring a route edit.
- Collection indexes discover entries automatically and sort them alphabetically.
- Guides render as readable articles with generated heading navigation where headings exist.
- Recipes use the same static collection and route machinery while presenting one reusable artifact each after a brief abstract.
- The existing article-tools adapter adds a copy control to the Recipe's artifact block and copies its complete text.
- An empty collection renders a valid empty state.
- Moving a Guide into `src/content/archive/guides/` removes its index entry and route without deleting its Markdown; moving it back republishes it.
- Reader navigation works without JavaScript; title filtering is progressive enhancement.
- Maintainer-authored Markdown changes are preserved exactly unless editorial revision is explicitly requested.
- Build-time article references become deployment-base-aware links; omitted custom text uses the target title.
- Malformed references, unknown targets, and missing target sections are reported by configured verification instead of publishing broken links.

## Functional Verification Checkpoints

- The Guides index lists Alignment and Context Engineering alphabetically.
- Domain-Specific Languages and First Principles remain on disk but have no generated Guide route or index entry.
- The Recipes index lists Domain-Specific Language (DSL), Hidden-Decision-Driven Design, How to Design Programs (HtDP), and Mom Test alphabetically.
- Each published Recipe renders its abstract before exactly one artifact block, and the block's copy control returns the complete skill text.
- No moved explanatory article remains below its old `/recipes/<slug>/` route.
- Adding one valid Markdown entry causes the static build to emit its index link and article route automatically.
- `[[guide:context-engineering]]` renders as a link labeled `Context Engineering`.
- `[[guide:context-engineering#the-dumb-zone|the dumb zone]]` renders with custom text and a validated heading fragment.
- Invalid kinds, slugs, targets, or sections block configured verification.
- `npm run verify` and TypeScript compilation pass.

## Unknowns That Matter

- None for the current Recipe authoring and copy behavior.

## Out of Scope / Non-goals

- A third top-level collection.
- A backend, accounts, browser editing, or runtime rendering.
- Publishing archived drafts before maintainer approval.
- Rewriting maintainer drafts during an archive or collection move.
- Redirects for article routes that were never publicly deployed.

## Notes

The site remains private and GitHub Pages publishing is deferred. Current published content uses shared `title`, `author`, and nonempty-body validation. Recipe structure is an editorial authoring invariant: a brief abstract followed by one copyable fenced artifact block. Prompt-versus-skill subtype metadata and installable packaging are unnecessary for the current direction. Archived Guide drafts remain ordinary Markdown but sit outside configured collection loaders.
