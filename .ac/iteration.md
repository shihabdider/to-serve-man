# Iteration

## Current slice

Archive two unfinished Guide drafts and publish four reusable skill Recipes.

## Customer-facing goal

Keep unfinished Domain-Specific Languages and First Principles articles private for continued editing while giving readers four complete, copyable agent skills.

## Scope

- Move the two unfinished Guides to `src/content/archive/guides/` without changing their bytes.
- Publish Mom Test and Hidden-Decision-Driven Design from the current Autocode source skills.
- Publish HtDP as one skill with its four companion methods embedded in the same artifact.
- Publish a new general Domain-Specific Language interview skill informed by Autocode's Domain Model Interview and the historical HtDP DSL guide.
- Update contributor guidance, living product context, and static-output verification.

## Non-goals

- No third reader-facing collection, draft routes, publication controls, schema fields, template changes, or runtime service.
- No rewriting the two archived Guide drafts.
- No installable skill packaging or multiple artifact blocks in one Recipe.

## Acceptance checks

- The archived Guide source hashes match their pre-move versions.
- Neither archived Guide appears in the Guides index or generated routes.
- The Recipes index lists all four skills alphabetically.
- Every Recipe renders its abstract before exactly one artifact block and retains the shared copy enhancement.
- HtDP's companion methods are present inside its one copied skill.
- The new DSL skill covers boundaries, terms, relationships, invariants, scenarios, counterexamples, and a human approval gate without expanding into modeling or implementation.
- Configured verification and TypeScript compilation pass.

## Status

Implemented and verified locally; ready for maintainer review.
