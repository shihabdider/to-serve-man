---
title: Domain Model Interview
author: Shihab Dider
---

A schema-first interview skill for establishing shared domain language and turning concrete evidence into human-approved models and invariants.

````markdown
---
name: domain-model-interview
description: Shared-language and schema-first domain modeling method. Use to establish or derive project terminology, then turn domain evidence into human-approved schemas and invariants.
disable-model-invocation: true
---

# Domain Model Interview

Use this skill after one bounded problem or product scope has been approved. Treat the human as both an experienced programmer who can read schemas and the domain expert who decides what those schemas mean. Do not make them invent a model from a blank page. This skill owns shared domain language and domain structure; it does not form software modules or reopen the scope decision.

Here, DSL means the shared domain-specific language used by the human and agents and recorded in the project's language brief; it does not imply an executable parser or grammar.

## Required order

1. Establish or derive enough shared language for the current scope.
2. Obtain human approval of that language.
3. Model the approved concepts and relationships as schemas.
4. Draft the exact language-brief update alongside the approved model.

Do not model first and retrofit names afterward. If modeling exposes an overloaded, missing, or misleading term, return to the shared-language step and approve the correction before reusing it in later schemas.

## Evidence inputs

Start from the approved scope, current language brief, concrete examples, constraints, invalid states, and parked technical details.

In a brownfield repository, derive candidate language before asking the human to restate repository facts. Inspect domain-facing names and relationships in documentation, types, schemas, routes, commands, state, migrations, public interfaces, examples, and tests. Record aliases, collisions, legacy names, and representation-only names. Existing identifiers are evidence, not automatic domain truth.

## Shared-language phase

Build the smallest vocabulary needed to discuss the scope. Capture canonical nouns, verbs, lifecycle states, relationships, distinctions, aliases, and examples in small reviewable batches. A TypeScript-like schema is the default presentation:

```ts
type DomainLanguage = {
  terms: DomainTerm[];
  relationships: DomainRelationship[];
};

type DomainTerm = {
  canonicalName: string;
  meaning: string;
  aliases: string[];
  distinguishesFrom: string[];
  evidence: EvidenceRef[];
  status: "observed" | "proposed" | "approved";
};
```

Use the repository's established schema or type notation when it is clearer. Ask the human to rename, merge, split, or correct proposed terms. A term is ready only when both parties can use it consistently and know what nearby concept it excludes.

After each approved batch, maintain a concrete proposed language-brief update with the full name, optional abbreviation, meaning, aliases, important distinctions or relationships, and supporting evidence. Follow the existing language brief's style when one exists. Do not write the update automatically; present the exact change for review and apply it only after approval.

## Schema-first modeling phase

Assume the human is comfortable reading programmer-facing schemas. Present each proposed model chunk as a schema first, not as a paragraph that they must mentally translate into structure.

- Prefer the repository's type or schema notation; otherwise use concise TypeScript-like algebraic data types.
- Use approved DSL terms as type, field, relation, and variant names.
- Put short field meanings in comments when names are not sufficient.
- Keep prose after the schema limited to evidence, invariants the schema cannot express, uncertainty or alternatives, and one correction or signoff question.
- Treat the schema as a domain model, not an implementation commitment. Exclude framework, persistence, transport, and cache details unless they are part of the domain.
- Include identity, cardinality, lifecycle variants, invalid states, and cross-schema references where they matter.

Propose one schema chunk at a time with at most four immediate child concepts. Introduce a named intermediate concept when a node would exceed that budget. Never conceal unresolved meaning behind a generic map, string, metadata bag, or implementation type.

## Live recursive loop

1. Identify the smallest unresolved term or domain criterion that affects the model.
2. Inspect available human and code evidence before asking a question.
3. If language is unresolved, propose or revise a small DSL batch and obtain approval.
4. Propose one schema chunk using only approved terms.
5. Show supporting evidence, non-encodable invariants, uncertainty, and one correction or signoff question.
6. Record language and schema approval or correction in the technical decision ledger.
7. Recurse only into an approved non-leaf schema.
8. Stop when every leaf is primitive or a named primitive-backed domain type, and record cross-schema references without duplicating ownership.

## Brownfield treatment

Observed code is evidence, not automatic truth and not permission to redesign. Confirm mismatches between existing representation and intended behavior with the human. Prefer schemas that expose the confirmed current domain plus the bounded extension. Preserve public compatibility unless an approved architecture change says otherwise.

## Exit gate

Return the approved shared domain language, an exact proposed language-brief update, the approved recursive schemas, invariants, examples supporting the model, unresolved uncertainties, brownfield source-name mappings when applicable, and explicit signoff status. If shared language remains disputed, stop rather than modeling through ambiguity. If product scope is missing or changes, return to the scope decision rather than inventing it. Do not derive modules, events, views, effects, adapters, or implementation tasks in this skill.
````
