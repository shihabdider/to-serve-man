# Theory

## Purpose

To Serve Man (a cookbook) helps cancer-genomics lab scientists who are new to agentic AI develop practical, responsible working habits.

## Users

- Primary: lab scientists who do not yet know how to begin using agentic AI effectively.
- Secondary: more experienced lab members who want to share reusable workflows, prompts, and skills.
- Maintainer: the site owner, who wants to write and revise the substantive content directly.

## Problem evidence

- The PI is anxious about low AI adoption in the lab.
- Only three or four lab members currently use AI heavily.
- A team member asked for a shareable version of concepts previously taught face to face.
- Learning context engineering and the “dumb zone” changed that member’s behavior: they now clear context when response quality degrades.
- Two active users have complained about poor AI response quality. Improper workflows may contribute, but that cause and the practical impact have not yet been established.
- Current learning alternatives are largely self-directed web searches, Medium articles, vendor articles, and trial and error.

## Inertia and constraints

- Cost currently limits use; institutional API access is being pursued.
- Clinical data must not be exposed through unapproved endpoints.
- Some members do not know where to start or which practices to trust.
- Adoption must not come at the cost of scientific skill degradation.
- The website can address onboarding and practice, but cannot itself solve institutional access or data-governance policy.

## Software decision

The human approved shaping one bounded software response: a small static educational website. Existing generic resources are not sufficiently tailored to the lab’s context, vocabulary, and desired practices.

## Approved MVP

Appetite: one to two focused working days. The human approved assuming AI acceleration for implementation; no observed project-specific acceleration factor is available, and visual review and validation remain irreducible.

Build a minimal black-and-white static site with:

- Markdown-authored Guides for explanatory articles and Recipes that each begin with a brief author abstract followed by exactly one complete prompt or agent skill in a copyable fenced block.
- Peer Guides and Recipes collections selected through vertical tabs on the right edge, like cookbook index tabs.
- Alphabetical, independent entries with a title filter for the active collection; no authored ranking or sequential navigation.
- Automatic indexes and navigation generated from the content.
- Compact validated links between entries, authored as `[[{guide|recipe}:name#section|custom text]]` and rewritten to deployment-aware routes during the static build.
- Git-based contribution instructions for lab members.
- Draft Guides for Context Engineering, Alignment, Domain-Specific Languages, and First Principles.
- A custom title treatment whose readable Latin letters spell “TO SERVE MAN” while resembling the Kanamit glyphs from the referenced episode.
- Restrained pages without generic AI visual conventions, explanatory hero copy, or unnecessary components.

## Non-goals

- Backend services, accounts, comments, submission forms, or browser-based editing.
- AI chat or agent integration.
- A complete curriculum or complete custom font.
- Solving institutional API provisioning or clinical-data governance.
- Presenting provisional educational drafts as settled scientific guidance.

## Validation signals

- The maintainer can edit or add Markdown without changing presentation code.
- A contributed entry appears automatically, alphabetically, in the relevant tab and index.
- An authored article reference resolves to the intended entry and optional section, while malformed or broken references block verification.
- Filtering the active collection by title updates visible entries without a separate search page.
- The initial Guide articles provide a realistic demonstration and useful starting point for human revision.
- The maintainer approves the visual result as simple, personal, and recognizably connected to the episode.
- Later feedback from lab members can test whether the resource improves onboarding and working practice.

## Parked details

- Exact framework, file layout, hosting target, and deployment workflow belong to architecture.
- The precise editorial meaning and content of each initial Guide will remain revisable.
- Full-text or fuzzy search, richer taxonomy, and non-Git contribution workflows are outside the MVP.

## Publication-state and skill-recipe refinement

The maintainer refined the starter publication set without changing the static-site decision:

- Alignment and Context Engineering remain published Guides.
- Domain-Specific Languages and First Principles remain retained Markdown drafts but are excluded from collection discovery and public routes until the maintainer republishes them.
- Recipes now publish four concrete reusable agent skills: Mom Test, bundled HtDP, Hidden-Decision-Driven Design, and Domain-Specific Language.
- Archiving is a reversible editorial state, not deletion or a third reader-facing collection.

Validation adds two signals: archived drafts remain byte-preserved while producing no route or index entry, and each skill Recipe renders one abstract followed by exactly one copyable artifact block.
