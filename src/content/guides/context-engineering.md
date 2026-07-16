---
title: Context Engineering
author: Shihab Dider
---

LLM calls are pure, non-deterministic, autoregressive functions. For agentic use, this means that the only thing of consequence under our control when producing output, beyond model selection, is the context: the prompt sent to the model. Managing the context is therefore of utmost importance for producing accurate and reliable outputs.

## The Dumb Zone
The "dumb zone" refers to the now well-known phenomenon of inference degradation as the context exceeds a certain threshold. 40% seems to be a good rule of thumb (i.e., keep your context below 40% of the stated maximum supported context length). Though providers like to use recall as a measure of how much context the model can handle, in practice, recalling individual pieces of information from a large context is not synonymous with reasoning about those pieces, any more than recalling definitions from a dictionary constitutes rhetorical skill.

Importantly, anything added to the context (for example, the output of tool calls, skills, system prompts, files that were read, etc.) is included in the payload sent to the LLM. Thus, keeping context small also keeps costs small.

<div data-context-window></div>

## Compaction vs. Artifacts
How do you stay under 40%?

Three ways: new sessions, compaction, and artifacts.

Use new sessions when the previous context is no longer necessary, when working on something new, or when the previous context would pollute the new work.

Compaction refers to having the agent generate a summary of the current session and replace its context with the summary. It is useful when tool calls have used up most of the context but their contents are not strictly required for the next unit of work.

Artifacts are compaction with an additional step: exporting the summary to a document. This is useful for visibility and traceability. A compacted summary lives in an ephemeral, nearly invisible state. An artifact lives on disk as plain text and can be easily inspected (and modified) when needed. Agents have a tendency to leave a mess when they are allowed to export artifacts, so it is important to have a clear, well-defined architecture for artifact management.
