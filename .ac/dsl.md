# Domain-Specific Language (DSL)

Shared project vocabulary. These meanings guide artifacts and site structure without requiring matching code symbol names.

## Product terms

- To Serve Man (a cookbook)
  - The static educational website and repository described by this project.
- Agentic AI
  - Use of a language model through a harness that can manage context, use tools, and carry out multi-step work.
- Harness
  - The software environment surrounding a language model that supplies context, tools, and session controls.
- Context engineering
  - Deliberately selecting, structuring, and refreshing the information available to an agent during a task.
- Dumb zone
  - An informal project term for the stage at which accumulated, stale, or distracting context begins to reduce useful response quality.
- Alignment
  - For the initial Guide, explicitly aligning an agent with the scientist’s immediate intent, constraints, and definition of done; not the broad model-safety problem.
- Domain-Specific Language
  - For the initial Guide, shared domain vocabulary and concepts elicited through a domain interview; not a formal parser-oriented mini-language.
- Guide
  - A Markdown-authored explanatory article about a principle, concept, or practice.
- Recipe
  - A Markdown entry with a brief author-written abstract followed by one fenced block containing the complete prompt or agent skill; longer explanations and artifact bundles belong in Guides instead.
- Article reference
  - A compact Markdown link between Library entries, written as `[[{guide|recipe}:name#section|custom text]]`; kind and name are required, while section and custom text are optional.

## Architecture terms

- Branding
  - The canonical name, accessible Kanamit-inspired wordmark, typography, and global visual constraints.
- Library
  - The validated Guides and Recipes discovered from Markdown.
- LibraryEntry
  - A validated Guide or Recipe with route identity, title, attribution, and a nonempty Markdown body.
- Route identity
  - The unique pair of collection kind and URL-safe slug derived from a content filename.
- Catalog
  - The active collection, transient title query, and alphabetically derived visible entries.
- Content collection
  - A group of Markdown entries that the static build discovers and indexes automatically.
- Kanamit-inspired wordmark
  - A custom title treatment using recognizable Latin letters shaped to evoke the book glyphs in the episode; it is not a translated duplicate or a full alien alphabet.
- Static output
  - Build artifacts consisting only of HTML, CSS, browser JavaScript, and assets; no production application server or runtime rendering.
- Right-edge tab
  - A persistent ordinary link to Guides or Recipes, styled like a physical cookbook index tab.

## Parked terms

- Responsible use
  - Important future article/policy territory that the human has not yet shaped and that this MVP must not invent.

## Publication-state terms

- Published entry
  - A Guide or Recipe directly discovered by its configured content collection and therefore given an index entry and static route.
- Archived Guide draft
  - Retained Guide Markdown under `src/content/archive/guides/` that is intentionally excluded from collection discovery, indexes, article-link targets, and static routes until moved back to `src/content/guides/`.
- Skill Recipe
  - A Recipe whose single artifact block contains one complete agent skill; companion material may be embedded inside that same skill block rather than published as separate artifacts.
