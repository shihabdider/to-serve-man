# Iteration

## Current slice

Implement the maintainer-approved centered-book mock and second visual feedback repair.

## Customer-facing goal

Make the site read as a physical cookbook resting on a contrasting surface, with tabs visibly attached to the book rather than the viewport and with a comfortable, navigable article reading experience.

## Context

- The maintainer approved an ASCII mock showing a centered book/page with the collection tabs protruding beyond its right edge.
- Follow-up feedback identified low-contrast tab hover behavior, an overly prominent subtitle, small article and TOC text, missing subsection links, and ambiguous copy-success feedback.
- The Content Library, Catalog Policy, static route model, and Markdown bodies remain unchanged.

## Scope

- Place cover and content surfaces in a centered, bounded book frame over a contrasting outer backdrop.
- Attach color-coded sticky collection tabs to the book frame's right edge, remove their inner seam, and visually embed the active tab into the open page.
- Keep tab text dark and legible over a darker same-hue hover fill.
- Increase the TOC-to-content gap while shifting the reading measure modestly toward the tab edge.
- Increase subtitle spacing and reduce its visual contrast.
- Increase article, attribution, code, and table-of-contents type sizes.
- Include both depth-two and depth-three Markdown headings in the TOC, with depth-three entries visibly indented beneath their parent sections.
- Replace the copy glyph with a checkmark after successful copying.

## Non-goals

- No content schema, Markdown body, route, filter-semantic, backend, or dependency changes.
- No inferred heading hierarchy beyond rendered Markdown heading depth.
- No active-section tracking or client-side article router.

## Acceptance checks

- The book frame is centered with backdrop visible around it and tabs protruding from the frame rather than the viewport.
- Cover and article pages preserve the approved geometry at desktop and mobile widths without horizontal overflow.
- Guides and Recipes use distinct muted cookbook-tab colors; exposed tab borders remain complete, the inner seam is absent, and hover retains dark text.
- The article grid gives the TOC more separation while reducing excess space between the reading measure and tabs.
- Subtitle is separated from the mark and rendered in a quieter tone.
- TOC includes and clearly indents depth-three headings; body and TOC text are comfortably readable.
- Copy success displays a checkmark and remains announced accessibly.
- Configured verification and the available TypeScript compiler pass.

## Status

Implemented and verified locally; ready for maintainer visual feedback.
