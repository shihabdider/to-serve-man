# Iteration

## Current slice

Add compact validated links between Guide and Recipe Markdown entries.

## Customer-facing goal

Let authors link to another entry or one of its sections without hard-coding deployment paths or writing cumbersome Markdown URLs.

## Approved notation

`[[{guide|recipe}:name#section|custom text]]`

- `guide` or `recipe` and the filename-derived `name` are required.
- `#section` and `|custom text` are optional.
- Omitted custom text uses the target entry title.

## Scope

- Parse and resolve the approved notation during Markdown compilation.
- Rewrite references to deployment-base-aware ordinary links.
- Validate malformed notation and unknown targets during Markdown processing.
- Validate heading fragments against generated HTML during build-output verification.
- Ignore notation inside code, HTML, and existing Markdown links.
- Document examples and update the living PRD.

## Non-goals

- No runtime or client-side link resolver.
- No implicit collection guessing, backlinks, link graph UI, title-based identity, or automatic content rewriting.
- No changes to existing article prose.

## Acceptance checks

- Forms with and without the optional section and custom text parse according to the approved grammar.
- Default labels use target titles; custom labels override them.
- Generated URLs include the configured deployment base, collection path, slug, trailing slash, and optional fragment.
- Malformed, missing-target, and missing-section references block configured verification with source-oriented diagnostics.
- Literal examples in code and existing links remain unchanged.
- Contributor guidance documents the notation.
- Configured verification and TypeScript compilation pass.

## Status

Implemented and verified locally; ready for maintainer review.
