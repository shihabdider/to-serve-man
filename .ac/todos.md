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
- [x] P3 — Draft initial Recipes and contributor documentation
  - depends on: P1
  - outcome: three Recipe drafts and Git-based contribution guidance
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

## Current focus

Maintainer visual review of the P6 centered-book repair.

## Parallelization notes

- P6 was one integrated presentation repair because BaseLayout and global style write scopes overlap.
- Do not parallelize shared global styles, layouts, generated output, or cross-boundary presentation repairs.
