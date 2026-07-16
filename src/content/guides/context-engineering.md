---
title: Context Engineering
author: Shihab Dider
---

LLM calls are pure, non-deterministic, autoregressive functions. This means, as far as agentic use goes, the only thing which is of consequence when producing output (as far is it is the only thing under our control, beyond model selection) is the context, the prompt sent to the model. Managing the context is therefore of utmost importance to produce accurate and reliable outputs. 

## The Dumb Zone
The "dumb zone" refers to the now well known phenomenon of inference degredation as the context goes over a certain threshold. 40% seems to be a good rule of thumb (i.e keep your context below 40% of the stated maximum supported context length). Though providers like to use recall as a measure of how much context the model can handle, in practice, recall of singular pieces of information from a large context is not synonymous with reasoning about those pieces. 

Importantly, anything which is added to the context (for example, the output of tool calls, skill files, system prompts, read files etc.) is included in the payload sent to the LLM. Thus keeping context small also keeps costs small.

<div data-context-window></div>

## Compaction vs. Artifacts
How to achieve staying under 40%? Three ways: new sessions, compaction, and artifacts. New sessions are relatively straightforward. Use them when the previous context is no longer necessary, when working on something new, or when the previous context would pollute the new work.

Compaction refers to having the agent generate a summary of the current session and replace its context with the summary. Useful when tool calls have used up most of the context but whose contents are not strictly required for the next unit of work. 

Artifacts are compaction with an additional step: exporting the summary to a document. This is useful for visibility and traceability. A compacted summary is one which lives in an emphemeral, nearly invisible state. An artifact lives on disk as plain text and can be easily inspected (and modified) when needed.
