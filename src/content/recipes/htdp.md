---
title: How to Design Programs (HtDP)
author: Shihab Dider
---

A data-first construction skill that discovers layered implementation wishes, designs examples and templates before bodies, verifies each layer, and abstracts only after concrete work passes.

````markdown
---
name: htdp
description: How to Design Programs construction method for one bounded implementation target, using data-first compiler-driven layered wishes, examples and templates before bodies, checks between layers, and post-concrete abstraction.
disable-model-invocation: true
---

# HtDP Construction Skill

This is a standalone HtDP skill for constructing one bounded implementation target. The surrounding task context owns target selection, permitted scope, human interaction, workspace isolation, delegation, persistence, and check configuration.

Use this skill only for the supplied implementation target. Do not advance to another target.

## Method contract

1. Confirm the target, allowed scope, relevant data definitions, existing architecture seam, and required checks from the task and project context.
2. Discover compiler-driven layered wishes for the target. See **Compiler-Driven Wish Discovery** below.
3. Before any body logic, record functional examples and a data-derived template/skeleton for each wish.
4. Implement one wish at a time from the numerically highest remaining layer toward layer 0. See **Wish Implementation** below.
5. Run compiler/tests or configured checks after each wish and between layers before moving to the next lower layer.
6. After all concrete wishes pass, run a post-concrete abstraction review. See **Post-Concrete Abstraction** below.
7. Run required final verification and return a completed or blocked result with changes, evidence, risks, and integration notes.

## Boundaries

- Do not call Pi-specific `htdp` tools or any harness-native executor primitive.
- Do not create `.htdp` state, require `.htdp` formats, or introduce HtDP project-management artifacts.
- Do not require custom helper CLIs such as `type-map`, `fn-body`, `err-group`, `diff-tool`, or `diff-check`.
- Do not own pair/autonomous modes, PRDs, worktree orchestration, direct subagent dispatch, or commit policy.
- Use ordinary codebase tools, the project compiler and test commands, `git`, and the project's configured verification command when available and relevant.
- If you are a delegated worker, never delegate again or contact the human; return a blocked result to the coordinating agent.

## Optional architecture method

For approved app-shaped or stateful work, use **Optional Functional Core / Imperative Shell Architecture** below. Do not impose that architecture on brownfield seams or unapproved targets.

## Stuck-loop escalation

Stop instead of looping when retries repeat the same failure, oscillate between known failure states, require work outside scope, expose an unresolved behavior/data/architecture decision, or exhaust the agreed retry budget. Return the smallest useful blocked result: current wish/layer, evidence, attempts, last diagnostics, and the decision or help needed.

## Compiler-Driven Wish Discovery

Use this section to derive the private wish graph for one supplied implementation target.

### Inputs

- Target behavior or fix from the task.
- Permitted files/modules and required checks.
- Existing data definitions, types, tests, and comparable code.
- Approved architecture context, including optional functional core/shell decisions.

### Procedure

1. Identify the data definition change that makes the target expressible.
   - In brownfield code, preserve existing conventions and seams.
   - If a required model or architecture decision is unresolved, stop and report the question.
2. Encode the smallest compiler-visible data/type/signature change that represents the target.
3. Add top-down stubs only where needed so the program remains compilable or the next compiler diagnostic is meaningful.
4. Run the compiler or closest symbolic check.
5. Treat each in-scope diagnostic, missing function, failing example, or uncovered data-processing case as a wish candidate.
6. For untyped or weakly typed code, derive candidates from the data shape and comparable code using search, tests, and call-site inspection.
7. For every wish, record:
   - stable name, signature or interface, target file, and primary write scope;
   - purpose statement;
   - data definitions it consumes or produces;
   - functional examples before body logic;
   - data-derived template/skeleton before body logic;
   - dependencies on other wishes;
   - required local checks.
8. Assign dependency layers.
   - Layer 0 is the top-level target/caller layer and is implemented last.
   - A wish's dependencies must be in a numerically higher layer.
   - Start implementation at the highest numbered non-passing layer and descend to layer 0.

### Examples before bodies

Derive examples from the data, not from guessed implementation code:

- variants/enums: one example per variant;
- booleans: true and false;
- intervals/numbers/strings: boundary and representative interior cases;
- optional/nullables: present and absent;
- collections: empty, single, multiple, and order-sensitive cases when relevant;
- recursive/self-referential data: base and recursive cases;
- error/invalid states: accepted failure shape when in scope;
- functional-core work: event traces from initial model through update/effects/view.

### Data-derived templates/skeletons

Make the control shape visible before writing bodies:

- destructure or branch by variant/tag;
- include boundary checks for intervals and validation;
- include present/absent branches for optionals;
- include collection folds/maps/loops and empty cases;
- include base/recursive structure for recursive data;
- include event/effect/view cases for functional-core state machines.

### Layer gate

Before moving from one layer to the next lower layer, run the compiler and relevant tests/checks for all wishes completed in the current layer. If failures remain in scope, repair the same layer; if failures change the target, scope, data model, or architecture, stop and escalate.

## Wish Implementation

Use this section for one wish at a time. If given a layer, select exactly one non-passing wish from the highest remaining layer unless the task has already assigned a narrower wish.

### Pre-body checklist

Do not write body logic until these are present for the wish:

- purpose statement;
- signature or interface shape;
- relevant data definitions/types;
- functional examples derived from the data;
- data-derived template/skeleton;
- dependencies and local checks.

If any item is missing, fill the missing design material first or return to wish discovery. Do not compensate by guessing inside the body.

### Implementation loop

1. Read only the files needed for the wish, nearby conventions, and relevant tests.
2. Convert the examples to executable tests when the project test style supports it; otherwise keep them as explicit check cases in the wish/result and add the closest available executable evidence.
3. Fill the body by following the template/skeleton case by case.
4. Keep the implementation concrete and minimal. Prefer plain data and pure functions when the architecture permits.
5. For functional-core wishes, keep `update`, `view`, `init`, and helpers pure; return effects as data.
6. Run the local compiler/test command after the body is filled.
7. Repair only failures in the assigned wish's scope.
8. Record PASS/FAIL evidence for the wish before selecting another wish.

### Between-layer checks

After all wishes in the current highest layer pass, run the compiler and relevant configured checks before descending to the next lower layer. Do not start layer 0 while a higher-layer failure remains.

Use the project's full configured verification command for final verification and for layer gates when the task requires the complete check set. Otherwise, use the smallest compiler or test command that gives reliable evidence, then include it in the result.

### Stuck-loop rules

Stop and return a blocked result when:

- the same diagnostic or test failure repeats after a focused repair;
- repairs oscillate between known states;
- a fix requires files or decisions outside the assigned scope;
- examples contradict each other or the observed code contract;
- the compiler reveals a model or architecture decision not present in the target context;
- retry budget is exhausted.

A blocked result should include the wish, layer, last command, last diagnostics, attempted repairs, and the exact decision or context needed from the primary agent or human.

## Optional Functional Core / Imperative Shell Architecture

Use this section only when the task or project context has selected it for app-shaped or stateful work. If the selection is missing and the choice would affect the implementation, stop and return the architecture question to the coordinating agent.

### Purpose

Make logical state explicit and testable as data:

```text
Model + Event -> update -> Model + Effect[]
Model -> view -> View
```

The functional core is pure. The imperative shell owns runtime mutation, I/O, framework integration, and external resources.

### Core definitions

- `Model`: one compound value containing the logical changing state inside the selected boundary.
- `Event`: closed set of inputs that may change the model.
- `Effect`: data descriptions of external work requested by the core.
- `update`: pure transition from `Model` and `Event` to next `Model` plus `Effect[]`.
- `view`: pure projection from `Model` to interface/view data.
- `init`: optional pure initializer from startup data to initial `Model` plus `Effect[]`.

The core must not perform I/O, hold hidden mutable state, access runtime handles, or call adapters directly.

### Shell responsibilities

- Store the current model and run the event loop.
- Render `View` values through an interface adapter.
- Decode external input into `Event` values.
- Interpret `Effect` data through effect adapters.
- Feed effect results back as `Event` values.

### Wish order

Derive wishes in this order, then layer them so dependencies are implemented first and top-level wiring is layer 0:

1. `Model`, `Event`, `Effect`, and `View` data definitions.
2. Constructors, validators, and primitive domain helpers.
3. Pure `init` when startup behavior matters.
4. Pure `update` transition cases and helper transitions.
5. Pure `view` projections.
6. Interface adapter translations.
7. Effect adapter translations.
8. Runtime/main wiring last.

### Examples and templates

- Use event traces as examples: initial model, event, expected next model, effects, and view when relevant.
- Derive update templates from event variants and nested model data.
- Derive view templates from model variants and output states.
- Derive adapter templates at translation boundaries only; do not duplicate core transition logic in shell tests.

### Brownfield guardrail

When existing code already owns architecture, reuse its seam unless a human-approved architecture change is part of the target. Functional core/shell guidance may be applied locally only where it fits the existing seam without broad rewrites.

## Post-Concrete Abstraction

Run this section only after all concrete wishes for the target pass their checks.

### Goal

Apply the HtDP abstraction recipe to actual code that now exists. Do not invent abstractions for hypothetical future work.

### Procedure

1. Review changed concrete functions and nearby functions that process the same data definitions.
2. Compare their examples, templates, and control flow.
3. Identify shared structure and mark the actual differences.
4. Extract a helper or higher-order function only when it makes the program simpler to read, test, or maintain.
5. Rewrite the concrete functions as calls to the abstraction.
6. Run the relevant compiler/tests again.
7. Keep the abstraction only if checks pass and the resulting code is clearer.

### Valid outcomes

- `abstraction-applied`: clear concrete duplication was removed and checks passed.
- `no-duplication-found`: no useful abstraction exists; this is a successful result.
- `blocked`: a possible abstraction crosses module boundaries, changes public contracts, or requires an unapproved architecture decision.

### Guardrails

- Do not abstract before concrete implementations exist.
- Do not hide simple case logic behind generic machinery.
- Do not introduce broad service layers, adapters, class hierarchies, or framework patterns as part of this pass.
- Revert or abandon an abstraction if it makes diagnostics harder, weakens tests, expands scope, or changes behavior.
````
