---
title: Domain-Specific Language (DSL)
author: Shihab Dider
---

A collaborative interview skill for developing a precise shared language around a problem before modeling, planning, or implementation begins.

````markdown
---
name: dsl
description: Develop a concise domain-specific language for a problem through concrete examples, term proposals, relationships, invariants, and counterexamples. Use when people or agents need shared vocabulary before modeling, planning, or implementation.
disable-model-invocation: true
---

# Domain-Specific Language

Use this skill to help a domain expert and an agent establish the smallest precise language needed to discuss a given problem. Here, a domain-specific language is a shared conceptual vocabulary: canonical terms, meanings, relationships, states, invariants, examples, and important distinctions. It does not imply a parser, programming language, schema, or software architecture.

Treat the human as the authority on domain meaning. Do not ask them to invent a glossary from a blank page. Elicit concrete situations, propose small language chunks, and let the human rename, split, merge, reject, or approve them.

## Language data

Use these conceptual forms to organize the result:

```text
DomainLanguage =
  Boundary
  + Term*
  + Relationship*
  + Invariant*
  + Scenario*
  + OpenQuestion*

Boundary =
  ProblemInScope
  + Participants
  + DesiredOutcome
  + Exclusions

Term =
  CanonicalName
  + Meaning
  + InclusionCriteria?
  + ExclusionCriteria?
  + Aliases*
  + Distinctions*
  + Examples*
  + Status

Relationship =
  SubjectTerm
  + Predicate
  + ObjectTerm
  + Cardinality?
  + Direction?
  + Condition?
  + TemporalOrder?

Invariant =
  Claim
  + Scope
  + SupportingExample
  + ViolatingExample?

Scenario =
  StartingConditions
  + Participants
  + Events
  + Outcome
  + LanguageCoverage

Status = observed | proposed | approved | disputed
```

These forms are thinking aids, not a required output syntax. Use a compact glossary or another representation when it communicates the approved language more clearly.

## Evidence inputs

Begin with the user's problem statement and any available examples, documents, conversations, interfaces, reports, forms, procedures, policies, or existing glossaries. When working in an established domain, inspect those sources before asking the human to repeat facts they already contain.

Existing names are evidence, not automatic truth. Record:

- synonyms that refer to the same concept;
- one word used for several different concepts;
- legacy terms that remain visible but should not be preferred;
- implementation or process names that do not describe the domain itself;
- disagreements between sources;
- missing names for distinctions that matter in practice.

## Interview loop

Work in small, reviewable cycles:

1. **Set the boundary.** Restate the problem in scope, who participates, the desired outcome, and what nearby concerns are excluded. Ask for correction.
2. **Elicit one concrete scenario.** Ask the human to walk through a recent, representative, or synthetic case from its starting conditions to its outcome.
3. **Extract candidate language.** Identify the nouns, verbs, roles, states, quantities, and rules needed to describe that scenario without relying on vague placeholders.
4. **Propose a small term batch.** Present no more than five closely related terms at once. For each term, give its proposed meaning, aliases, exclusions, and one example.
5. **Obtain correction or approval.** Ask the human to rename, merge, split, reject, or approve the batch. Do not silently treat unreviewed terms as settled.
6. **Record relationships.** State how approved terms relate, including direction, cardinality, conditions, ownership, containment, sequence, or lifecycle when those distinctions matter.
7. **State invariants.** Turn claims such as “always,” “never,” “only,” or “exactly one” into explicit rules with a supporting example and, where useful, a violating example.
8. **Stress-test the language.** Apply it to a second scenario, an edge case, and a counterexample. Add or revise terms only when the existing language cannot describe an important distinction cleanly.
9. **Resolve collisions.** Choose canonical names, retain useful aliases, and document terms that must remain disputed or context-qualified.
10. **Publish the language brief.** Return only approved language plus clearly marked open questions and source mappings.

Ask one question at a time unless a small cohesive batch is necessary to understand one scenario. Before asking, confirm that the answer could change a term, relationship, invariant, boundary, or example. If not, do not ask it.

## Term proposal format

Use this compact form during review:

```text
Term: <canonical name>
Meaning: <one-sentence domain meaning>
Includes: <what belongs, if unclear>
Excludes: <nearest concepts that do not belong>
Aliases: <other names found in use>
Relates to: <approved terms and relationship>
Example: <concrete use>
Status: proposed
```

Omit fields that add no useful distinction. Prefer ordinary domain language over invented jargon. Introduce a new term only when it removes ambiguity, names a recurring distinction, or makes an invariant expressible.

## Relationship and invariant checks

For each important relationship, test:

- whether it is one-to-one, one-to-many, many-to-many, or conditional;
- whether direction or ownership matters;
- whether it changes over time;
- whether absence is meaningful;
- whether two related terms can exist independently;
- whether the same statement remains true in edge cases.

For each invariant, distinguish:

- a rule of the domain from a current organizational habit;
- a true impossibility from a disallowed state;
- a definition from a policy that may change;
- an observed pattern from an approved claim.

Do not manufacture certainty. Mark unresolved claims as open questions or disputed language.

## Quality gate

A language brief is ready when:

- its boundary is explicit;
- every canonical term has one stable meaning in that boundary;
- overloaded words have been split or context-qualified;
- aliases do not masquerade as separate concepts;
- important relationships and invariants are stated;
- at least two scenarios can be described without hidden vocabulary;
- counterexamples expose no unresolved contradiction in approved terms;
- a new participant can distinguish each term from its nearest neighbor;
- disputed and unknown language is visibly separated from approved language.

If the language cannot pass this gate, return the smallest unresolved question rather than expanding into modeling or implementation.

## Output contract

Return a concise language brief containing:

1. boundary;
2. approved terms and definitions;
3. aliases and important distinctions;
4. approved relationships;
5. invariants and invalid statements or states;
6. representative scenarios and counterexamples;
7. source-name mappings when prior terminology exists;
8. open or disputed questions;
9. explicit human signoff status.

Keep the result durable and easy to revise. If the user names a destination, write or propose the brief there; otherwise present it directly.

## Boundaries

- Do not turn the language brief into a product plan, requirements list, task queue, architecture, database schema, API, class hierarchy, or implementation design.
- Do not equate repository identifiers with domain truth.
- Do not force every observed word into the final language.
- Do not invent formal grammar or executable syntax unless the user explicitly asks for that separate outcome.
- Do not continue into domain modeling until the language itself is approved.

## Influences

This skill adapts the shared-language phase of a domain-model interview and the data-definition discipline of How to Design Programs: define forms precisely, ground them in concrete examples, expose invalid cases, and obtain correction before building on them.
````
