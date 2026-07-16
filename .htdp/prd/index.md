# To Serve Man Product PRD

## Purpose

To Serve Man is a static cookbook that helps cancer-genomics lab scientists develop practical, responsible habits for working with agentic AI. The maintainer should be able to author and revise substantive material as Markdown without changing presentation code.

## Current Direction

The library has two peer collections with deliberately different jobs:

- Guides are explanatory articles about principles, concepts, and practices.
- Recipes present directly reusable artifacts. Each Recipe begins with a brief author-written abstract and then contains exactly one complete prompt or agent skill in a copyable fenced block.

Alignment, Context Engineering, Domain-Specific Languages, and First Principles are Guides. The Recipes collection may remain empty until the maintainer contributes a real prompt or skill.

## Users / Use Cases

- A lab scientist wants a Guide so they can understand an agentic-AI concept in the lab's working context.
- A lab scientist wants a Recipe so they can understand its intended use from a brief abstract and copy one complete prompt or skill from a single block.
- The maintainer wants to move or edit Markdown content without changing route or presentation components.
- A contributor wants collection rules that make it clear whether their contribution explains something or is itself a reusable artifact.

## Domain Terms and Data Definitions

A LibraryEntry is one of:

- GuideEntry: a validated Markdown entry whose body is explanatory article prose.
- RecipeEntry: a validated Markdown entry whose body contains a brief Abstract followed by one fenced ArtifactBlock holding one complete Prompt or AgentSkill.

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

- `guides/alignment.md` is a Guide because it explains alignment.
- `guides/first-principles.md` is a Guide because it explains how LLMs work.
- A future Recipe may contain a short description followed by one complete reusable prompt in a fenced block.
- A future Recipe may contain a short description followed by one complete agent skill in a fenced block.
- A tutorial containing several prompts is not a Recipe; it belongs in Guides or must be split into one Recipe per artifact.

## Desired Behaviors

- Moving a valid entry between collection directories changes its collection and static URL without requiring a route edit.
- Collection indexes discover entries automatically and sort them alphabetically.
- Guides render as readable articles with generated heading navigation where headings exist.
- Recipes use the same static collection and route machinery while presenting one reusable artifact each after a brief abstract.
- The existing article-tools adapter adds a copy control to the Recipe's artifact block and copies its complete text.
- An empty collection renders a valid empty state.
- Reader navigation works without JavaScript; title filtering is progressive enhancement.
- Maintainer-authored Markdown changes are preserved exactly unless editorial revision is explicitly requested.
- Build-time article references become deployment-base-aware links; omitted custom text uses the target title.
- Malformed references, unknown targets, and missing target sections are reported by configured verification instead of publishing broken links.

## Functional Verification Checkpoints

- The Guides index lists Alignment, Context Engineering, Domain-Specific Languages, and First Principles alphabetically.
- Each current Guide opens below `/guides/<slug>/` and links back to Guides.
- No moved article remains below `/recipes/<slug>/`.
- The Recipes index loads and reports that no Recipes have been published while the collection is empty.
- Adding one valid Markdown entry causes the static build to emit its index link and article route automatically.
- A future Recipe renders its abstract before one artifact block, and the block's copy control returns the complete prompt or skill text.
- `[[guide:first-principles]]` renders as a link labeled `First Principles`.
- `[[guide:first-principles#generation-repeats-one-step|generation]]` renders with custom text and a validated heading fragment.
- Invalid kinds, slugs, targets, or sections block configured verification.
- `npm run verify` and TypeScript compilation pass.

## Unknowns That Matter

- None for the current Recipe authoring and copy behavior.

## Out of Scope / Non-goals

- A third top-level collection.
- A backend, accounts, browser editing, or runtime rendering.
- Inventing placeholder Recipes merely to populate the collection.
- Rewriting maintainer drafts during a collection move.
- Redirects for article routes that were never publicly deployed.

## Notes

The site remains private and GitHub Pages publishing is deferred. Current content uses shared `title`, `author`, and nonempty-body validation. Recipe structure is an editorial authoring invariant: a brief abstract followed by one copyable fenced artifact block. Prompt-versus-skill subtype metadata and installable packaging are unnecessary for the current direction.
