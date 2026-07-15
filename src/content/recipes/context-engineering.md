---
title: Context Engineering
author: Shihab Dider
---

> Starter draft: adapt this recipe as the lab develops its own examples and working conventions.

An agent does not work from everything you know. It works from the finite context currently available to it: your instructions, the conversation, selected files, tool results, and any summaries made along the way. Context engineering is the practice of choosing and maintaining that working set deliberately.

At its core, a language model is autoregressive: it predicts the next token from the tokens currently in context. It does not carry a separate, durable working memory outside that input. A harness can add files, tool results, and summaries, but those additions still become part of the model's finite working context. Thinking of context like allocated memory is useful up to a point. Unlike a clean out-of-memory error, a crowded session may keep responding while becoming less coherent, less attentive to constraints, or more likely to follow stale material.

More context is not automatically better. A complete notebook history, several old plans, and a long trail of corrections can crowd the current objective. Important facts may become hard to distinguish from stale or merely adjacent material. The aim is not to keep context as small as possible; it is to keep it relevant, structured, and current enough for the next decision.

## Recognize the informal "dumb zone"

The **dumb zone** is an informal name for the point at which accumulated context appears to reduce the usefulness of the agent's responses. It is not a measured threshold, and it does not mean that the model has suddenly become unintelligent. You might be entering it when the agent:

- forgets a constraint that it previously followed;
- returns to an approach that was already rejected;
- repeatedly patches symptoms instead of reconsidering the task;
- confuses an old file, result, or hypothesis with the current one;
- produces a hand-wavy summary after a long sequence of detailed tool outputs; or
- needs increasingly elaborate corrections to make the same kind of progress.

These signs are diagnostic clues, not proof. Similar behavior can come from an ambiguous request, missing evidence, a tool failure, or a genuinely difficult scientific question. First ask whether one of those explanations fits. If the context itself has become noisy or contradictory, another corrective paragraph in the same session may make matters worse.

## A practical workflow

### 1. Define one bounded work unit

Write down the immediate question and the artifact you want next. "Analyze the variants" is too open-ended. A bounded task might be: "Using the synthetic table in `examples/variants.tsv`, calculate per-gene row counts and explain how missing gene labels are handled."

Also record what is not part of this work unit. Interpretation, visualization, and pipeline integration might all be valuable while still being non-goals for this pass.

### 2. Assemble the working context

Give the agent the smallest coherent set of sources needed to begin:

- the task brief and acceptance checks;
- the relevant data dictionary or file schema;
- the current code or notebook section;
- decisions that must be preserved; and
- one or two representative examples, including an edge case.

Point to source files instead of pasting many partial copies into the conversation. Keep durable decisions in a small project file so they survive a session change. Load additional references when the work reaches them rather than front-loading every possibly useful document.

### 3. Work in checkpoints

Ask the agent to pause at natural boundaries: after inspecting inputs, after proposing an approach, and after producing a testable result. At each checkpoint, compare the result with the stated objective and source evidence. Correct a wrong assumption before it propagates through more work.

For a synthetic variant-count task, a useful first checkpoint could contain the observed columns, assumptions about blank gene labels, and counts from three hand-checkable rows. That is easier to inspect than a complete script plus report built on an unnoticed schema mistake.

### 4. Refresh deliberately

When progress degrades, stop and prepare a handoff rather than asking the same context to repair itself indefinitely. Have the agent draft a concise handoff, then inspect it yourself. Correct omissions and remove claims that are not supported by the files.

A useful handoff contains:

1. the immediate objective;
2. the current state of the artifact;
3. source files and evidence actually used;
4. decisions made and reasons that still matter;
5. constraints and non-goals;
6. checks already run and their results;
7. unresolved questions; and
8. the next concrete action.

Start a fresh session with that reviewed handoff and only the sources needed for the next action. A refresh is not failure or lost work. It is maintenance of the agent's working environment.

### 5. Re-establish evidence after the refresh

Do not assume a concise handoff is complete. Ask the new session to inspect the named sources, restate the task, and identify any mismatch before editing. Re-run a small known check. Continue only when the handoff, files, and observed results agree.

## Editable prompt

Copy this into a project note and replace the bracketed text. Delete sections that do not apply rather than filling them with guesses.

```text
You are helping with one bounded work unit.

Immediate objective:
[What question should this pass answer?]

Deliverable:
[What file, table, explanation, or decision should exist next?]

Sources of truth:
- [Relevant file, schema, or prior result]
- [Relevant file, schema, or prior result]

Current decisions:
- [Decision that must be preserved, with a short reason]

Constraints:
- [Required method, tool, format, or boundary]

Non-goals for this pass:
- [Tempting adjacent work that should not be attempted]

Definition of done:
- [Observable check]
- [Observable check]

First inspect the named sources and restate the objective, constraints,
and any ambiguity you see. Do not edit until I confirm that readback.
Work in small checkpoints and cite the file or result behind important claims.

If the history becomes contradictory, repeated corrections stop improving the
result, or a source of truth is missing, stop. Prepare a handoff with the
objective, current state, evidence, decisions, checks, open questions, and next
action. Do not continue the task in the same session after preparing it.
```

## A lightweight context check

Before each substantial step, ask:

- Is the immediate objective still explicit?
- Are current sources distinguishable from old attempts?
- Can the agent name the evidence behind its important assumptions?
- Is durable state recorded outside the chat?
- Would a fresh reader know the next action from the latest checkpoint?

Context engineering does not guarantee a correct analysis. It makes the working state easier to inspect, refresh, and hand to another session before confusion becomes the dominant part of the task.
