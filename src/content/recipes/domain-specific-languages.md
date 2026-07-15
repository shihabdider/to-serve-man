---
title: Domain-Specific Languages
author: Shihab Dider
---

> Starter draft: the interview pattern is reusable, but every vocabulary and model in this article should be replaced or corrected for the task at hand.

A domain-specific language can be as simple as a shared, precise vocabulary for one area of work. In this recipe it does **not** mean designing parser syntax or inventing a programming language. It means using an agent-led domain interview to make the scientist's concepts, relationships, invariants, and examples explicit before asking the agent to analyze data or change software.

This matters because familiar words often hide different models. Does "variant" mean an allele in a reference context, one row emitted by a caller, an observation in one sample, or a reviewed record assembled from several sources? An agent can produce coherent work while switching silently among those meanings. A small agreed language gives both participants something concrete to correct.

## What the interview should produce

Keep the result lightweight. For one bounded task, capture:

- **Boundary:** the workflow or question this vocabulary describes.
- **Concepts:** the important things, with short definitions and representative attributes.
- **Relationships:** how those things are connected.
- **Invariants:** statements that must remain true for the model to make sense.
- **Examples:** concrete instances that demonstrate the intended meaning.
- **Counterexamples and open questions:** cases that do not fit yet or terms that still need a decision.
- **Preferred language:** terms to use consistently and overloaded terms to avoid.

This is a working model, not a comprehensive ontology. If the list keeps expanding, narrow the boundary.

## Agent-led, scientist-corrected

The agent leads the interview by asking focused questions, reflecting answers as a small model, and looking for ambiguous relationships or edge cases. The scientist remains the domain authority. The agent should propose structure rather than ask the scientist to design data types from scratch, and every proposal should be easy to correct.

A productive rhythm is:

1. the scientist supplies one real-shaped but synthetic example;
2. the agent names a few candidate concepts from that example;
3. the scientist corrects their meanings;
4. the agent proposes relationships and invariants;
5. the scientist tests them with another example or counterexample; and
6. the agent updates a concise shared-language note.

Ask one question at a time when an answer may change the next question. A prewritten questionnaire often misses the distinctions revealed by the scientist's previous answer.

## Interview workflow

### 1. Set a narrow boundary

Name the activity the language needs to support. "Cancer genomics" is far too broad. "Describe the values needed to review quality flags in a synthetic small-variant call table" is a workable interview boundary.

Also state the next use of the model: clarifying a prompt, naming columns, reviewing an analysis plan, or preparing a coding task. The intended use determines which distinctions matter now.

### 2. Begin with a concrete scenario

Use a small synthetic example instead of abstract definitions. For example:

```text
Analysis run RUN-042 used reference build GRCh38.
Generated sample SYN-01 has an observation at chr7:140453136 A>T.
The row reports total depth 80 and alternate depth 31.
A review step adds the quality flag low-mapping-confidence.
```

Ask what each noun refers to, which details give it identity, and which details can change. The coordinate alone is not enough to interpret the observation if the reference context is missing. A quality flag may describe an assessment rather than a property intrinsic to the allele. Those distinctions are easier to discuss around an example than around a blank schema.

### 3. Build one small concept map

The agent might propose the following first pass:

- **Analysis Run:** one configured execution that produces observations and declares a reference context.
- **Synthetic Sample:** a generated sample identifier included in an analysis run.
- **Variant Observation:** an alternate allele reported for one synthetic sample by one analysis run, at a location in the run's reference context.
- **Depth Measurement:** total and alternate read counts attached to an observation.
- **Quality Assessment:** a review record that may attach zero or more named flags to an observation.

Then make relationships explicit:

- an Analysis Run declares one reference context for these observations;
- an Analysis Run includes one or more Synthetic Samples;
- a Variant Observation belongs to one Analysis Run and one Synthetic Sample;
- a Depth Measurement describes one Variant Observation; and
- a Quality Assessment evaluates one Variant Observation.

These are proposals for the bounded example, not universal scientific truths. The scientist should rename, split, combine, or reject concepts that do not match the actual workflow.

### 4. State and challenge invariants

An invariant is a claim that should hold across every valid example inside the chosen boundary. Candidate invariants for the synthetic model might be:

- every Variant Observation has a declared reference build through its Analysis Run;
- every Variant Observation belongs to exactly one Synthetic Sample within that run;
- total depth and alternate depth are non-negative integers;
- alternate depth does not exceed total depth; and
- every Quality Assessment records which observation it evaluates.

Challenge each invariant with an edge case. Can one row contain several alternate alleles? Can the same observation receive assessments from two review passes? Is a missing depth value invalid, unknown, or simply outside this model? The answer may change a concept or expose an open question. Do not force a tidy rule when the workflow genuinely has multiple cases.

### 5. Test a second example and a counterexample

Use another synthetic sample or a missing measurement to see whether the language still works. Also record a counterexample such as:

```text
"chr7:140453136" without a reference build, sample, reference allele,
or alternate allele is not a complete Variant Observation in this model.
```

Counterexamples are valuable because they show where ordinary shorthand is too ambiguous for the current task.

### 6. Approve a small language brief

Ask the agent to return the boundary, concepts, relationships, invariants, examples, and unresolved questions in plain Markdown. The scientist reviews it for domain meaning. Once approved for the task, use the same terms in prompts, file schemas, code names, and checks. If later evidence does not fit, reopen the relevant part of the interview instead of quietly bending the definitions.

## Editable interview prompt

```text
Act as a domain interviewer for this bounded task, not as the domain authority.
Help me develop a small shared vocabulary before proposing analysis or code.

Interview boundary:
[The specific workflow or question we are describing]

What the result will be used for:
[Prompt, analysis plan, schema review, coding task, or handoff]

Starting synthetic example:
[One concrete scenario with generic identifiers and values]

Lead the interview one focused question at a time. Start from the example.
After each answer, update only the relevant part of a compact model containing:
- concepts and short definitions;
- relationships between concepts;
- candidate invariants;
- examples and counterexamples;
- ambiguous terms and open questions.

When you propose a concept or invariant, explain which part of my example
suggested it and ask me to correct it. Do not present your proposal as settled
domain truth. Keep the boundary narrow and park adjacent topics.

Before finishing, test the model against a second example and at least one
counterexample. Then produce a plain-language Markdown brief for my approval.
Do not design parser syntax or begin implementation unless I ask in a later task.
```

## Signs the language is useful

The interview has done enough when a colleague can use the brief to answer questions such as:

- Which entity owns this measurement?
- What gives this record its identity?
- Which relationships are one-to-one or one-to-many in this workflow?
- What must be present for an example to be valid?
- Which familiar shorthand is too ambiguous here?
- What case remains unresolved rather than silently assumed?

The value is not specialized notation. It is a shared set of distinctions that lets a scientist notice when an agent's otherwise plausible plan is built on the wrong domain model.
