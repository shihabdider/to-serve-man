---
title: Alignment
author: Shihab Dider
---

> Starter draft: revise the examples and level of detail to match the lab's actual working style.

In this recipe, **alignment** means agreement about the scientist's immediate task. It is not the broad research area often called AI alignment. The practical question is simpler: does the agent understand what you intend to accomplish now, the boundaries of this pass, and the evidence that will count as done?

Agents are very good at filling gaps with plausible interpretations. That can create polished work aimed at the wrong target. A short task-level alignment step makes assumptions visible while they are still cheap to correct.

## The four parts of a task brief

### Immediate intent

State the question or decision behind the activity, not just the requested motion. "Write Python" describes an action. "Create a repeatable way to count rows per gene in this synthetic variant table so I can check the notebook's summary" explains why that action is useful.

Keep the intent local. You do not need to explain the lab's full research program to align one script-editing task.

### Constraints

Name boundaries that materially affect the result. Examples include the inputs that may be used, required software, columns that define an observation, output format, ordering rules, or a method that must remain unchanged for comparison.

Constraints should be testable when possible. "Keep it simple" invites interpretation. "Use the Python standard library, accept one TSV path, and write a two-column TSV sorted by gene label" is inspectable.

### Non-goals

List adjacent work that would look helpful but would expand or distort this task. For example, a row-counting pass might explicitly exclude biological interpretation, pathogenicity classification, visualization, optimization for a production pipeline, and redesign of the input schema.

A non-goal is not a statement that the adjacent work is unimportant. It says only that it belongs to another decision or work unit.

### Definition of done

Describe observable evidence, not a feeling of completion. Include the expected artifact and checks a scientist can inspect. "Done when the script runs" is weak. A stronger definition might require:

- a script with a documented input and output shape;
- a synthetic fixture containing repeated genes and a blank gene label;
- expected counts that can be checked by hand;
- a test or command showing those counts are reproduced; and
- a short note explaining the chosen handling of blank labels.

Definition of done does not mean that the scientific question is settled forever. It means the current pass has a clear stopping condition.

## Workflow

### 1. Write a compact alignment brief

Use the four parts above and point to the relevant source files. Prefer a few precise bullets over a long narrative. If a requirement is unknown, label it as an open question rather than letting the agent infer an answer.

### 2. Ask for a readback before work begins

Have the agent restate the intent, constraints, non-goals, and done conditions in its own words. Ask it to identify assumptions and conflicts. A readback reveals whether the same words mean the same thing to both of you.

Do not ask merely, "Do you understand?" An agent can answer yes without exposing its interpretation.

### 3. Resolve only questions that can change the approach

For the synthetic gene-count example, handling a blank gene label changes the output and should be decided before implementation. The name of a temporary variable probably does not require discussion. Ask the agent to separate blocking questions from choices it can make locally and report later.

### 4. Confirm the first checkpoint

Choose a small, inspectable first result. Before writing the complete script, the agent might show how it parsed the header and classify four synthetic rows into expected groups. Confirming that checkpoint tests the shared interpretation of the data.

### 5. Compare the result with the brief

At completion, review each done condition directly. A fluent explanation is not evidence that the output meets the contract. Run the named command, inspect the fixture, and compare the actual table with the expected counts.

If the goal changed during the work, update the brief explicitly. Do not quietly judge the original deliverable against a new expectation.

## Synthetic example

Suppose `synthetic-variants.tsv` contains six generated observations with columns `sample_id`, `gene`, and `depth`. The immediate intent is to create a tiny reference summary for checking a teaching notebook.

A task-level alignment brief could say:

```text
Immediate intent
Create a reproducible per-gene row count from synthetic-variants.tsv so the
counts shown in a teaching notebook can be checked independently.

Inputs and sources of truth
- examples/synthetic-variants.tsv
- examples/README.md for the column meanings

Constraints
- Use Python's standard library only.
- Count each input row once.
- Group a blank gene value under UNLABELED and explain that choice.
- Write TSV output sorted by gene label.

Non-goals
- Do not interpret the biological importance of a gene or observation.
- Do not add plots or alter the notebook.
- Do not generalize this into a production workflow.

Done when
- scripts/count-by-gene.py accepts an input and output path.
- The six-row fixture produces the hand-checked expected counts.
- The exact check command and observed result are recorded.
```

The synthetic example is intentionally small. Its purpose is to expose task meaning, not to imitate all of the complexity of a real analysis.

## Editable prompt

```text
Help me align one task before doing the work.

Immediate intent:
[What am I trying to learn, decide, or produce in this pass?]

Inputs and sources of truth:
- [File, schema, result, or instruction]

Constraints:
- [Boundary that changes the acceptable approach or output]

Non-goals:
- [Related work that is explicitly outside this pass]

Definition of done:
- [Artifact that must exist]
- [Check with an observable expected result]

Before making changes:
1. Restate my immediate intent in one or two sentences.
2. Restate the constraints, non-goals, and definition of done separately.
3. List assumptions you would otherwise make.
4. Ask only the questions whose answers could change your approach.
5. Propose the smallest useful first checkpoint.

Wait for my confirmation before proceeding. If later evidence changes the task,
stop and propose an updated brief instead of silently expanding the scope.
```

## Common repair moves

- **The output is impressive but irrelevant:** restate the immediate decision and remove deliverables that do not support it.
- **The agent keeps adding features:** strengthen the non-goals and require approval before scope changes.
- **You disagree about whether the task is finished:** replace subjective done language with an artifact, command, and expected observation.
- **Questions keep arriving mid-task:** add the missing source or constraint to the brief, then request another readback.
- **The brief has become longer than the work:** narrow the task. Alignment should reduce coordination cost, not become a separate project.

Task-level alignment is a short feedback loop: state the target, hear it reflected back, correct the interpretation, and evaluate the result against agreed evidence.
