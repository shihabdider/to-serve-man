---
title: Mom Test
author: Shihab Dider
---

A question-quality skill for gathering concrete, unbiased evidence in a live product-discovery conversation.

````markdown
---
name: mom-test
description: Hidden question-quality policy for the Product Discoverer role. Use only when a role explicitly references this skill to gather concrete, unbiased evidence from a live customer conversation.
disable-model-invocation: true
---

# Mom Test Question Quality

Use this skill inside one live product-discovery conversation. It governs how questions are asked; it does not decide when problem discovery is complete or what the bounded product slice contains.

This package adapts the interview principles from Rob Fitzpatrick's *The Mom Test*: https://www.momtestbook.com/.

## Three rules

1. Talk about the human's life and work, not the proposed idea.
2. Ask about specific past behavior or present facts, not generic opinions or hypothetical future behavior.
3. Talk less and listen more.

## Question gate

Before asking a question, confirm all of the following:

- The answer could change the software decision, problem evidence, or active completion criterion.
- The question requests a concrete event, behavior, constraint, cost, alternative, or commitment.
- It does not ask for approval, compliments, feature ideas, or predictions about future use.
- The evidence ledger does not already contain the answer.
- If similar ground was covered, the question names the contradiction or exact missing fact that requires follow-up.

If a question fails this gate, do not ask it. Use existing evidence, park the detail, or stop with the unresolved criterion.

## Handling weak evidence

- Turn generic claims such as "usually" or "always" into one recent concrete example.
- Deflect compliments and return to observed behavior.
- Treat feature requests as clues; ask what happened the last time the underlying need arose.
- Ask about time, money, reputation, access, or another real commitment instead of accepting polite enthusiasm as validation.
- Prefer silence and a short follow-up over explaining or selling the proposed solution.

## Output contribution

Return concise evidence entries with the claim, supporting observation, source answer, affected criterion, and any contradiction or uncertainty. Do not manufacture certainty when the conversation provides none.
````
