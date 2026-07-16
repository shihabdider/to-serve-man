# Todos

Human-readable iteration task DAG for the approved MVP and direct feedback repairs.

- `[x]` means the iteration is complete.
- `[ ]` means the iteration is pending.
- `depends on` names prerequisite iterations.

## Iteration DAG

- [x] D01 — Validate the problem and approve one bounded MVP
  - depends on: none
  - outcome: static educational website approved with a one-to-two-day appetite
  - unlocks: A01
- [x] A01 — Approve domain model, module contracts, work packages, and integration seams
  - depends on: D01
  - outcome: Astro static architecture and P1 through P4 approved for autonomous implementation
  - unlocks: P1
- [x] P1 — Build foundation and stable contracts
  - depends on: A01
  - outcome: static build, content library, catalog policy, tests, and deployment workflow
  - unlocks: P2, P3
- [x] P2 — Implement Branding and Static Site presentation
  - depends on: P1
  - outcome: wordmark, layouts, pages, tabs, and title-filter adapter
  - unlocks: P4
- [x] P3 — Draft initial educational articles and contributor documentation
  - depends on: P1
  - outcome: three article drafts, now classified as Guides, and Git-based contribution guidance
  - unlocks: P4
- [x] P4 — Integrate and verify the complete MVP
  - depends on: P2, P3
  - outcome: six-page static build passed engineering and responsive checks
  - unlocks: P5
- [x] P5 — Apply first annotated visual and article-navigation feedback
  - depends on: P4
  - outcome: two-line branding, simplified index, article contents/back navigation, and readable copyable code blocks
  - unlocks: P6
- [x] P6 — Implement the approved centered-book refinement
  - depends on: P5
  - outcome: bounded book surface, colored embedded tabs with complete exposed borders, rebalanced article spacing, corrected subtitle contrast, larger article type, indented subsection TOC, and copy-success checkmark
  - checks: configured verification, compiler, desktop/mobile browser checks, hover/copy/TOC interactions
  - unlocks: P7
- [x] P7 — Reclassify explanatory articles as Guides and reserve Recipes for single artifacts
  - depends on: P6
  - outcome: three existing articles moved to Guides, Recipes reserved for one prompt or skill per file, and routes/docs/checks updated
  - unlocks: P8
- [x] P8 — Clarify the Recipe abstract-and-copy-block format
  - depends on: P7
  - outcome: Recipe authoring guidance now requires a brief author abstract followed by one copyable prompt or skill block; installable packaging is explicitly unnecessary
  - unlocks: P9
- [x] P9 — Add validated build-time links between Markdown entries
  - depends on: P8
  - outcome: approved notation resolves during Markdown compilation with target/title validation, output fragment checks, focused tests, and contributor guidance

## Current focus

Maintainer review of the completed P9 build-time article-reference implementation.

## Parallelization notes

- P6 was one integrated presentation repair because BaseLayout and global style write scopes overlap.
- Do not parallelize shared global styles, layouts, generated output, or cross-boundary presentation repairs.
- P7 is one small integrated move because content paths, documentation, and route assertions describe the same taxonomy change.
- P8 changes only product vocabulary and authoring guidance because the existing Markdown copy adapter already satisfies the requested interaction.
- P9 is one integrated Content Library extension because parsing, target resolution, Markdown transformation, and final fragment checks implement one stable authoring contract.
