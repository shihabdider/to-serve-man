---
title: First Principles
author: Shihab Dider
---

> Starter draft: this is a compact mental model, not a complete account of language-model research.

Large language models can look as though they understand, remember, and reason in the same way people do. A more useful starting point is simpler: an LLM is a system trained to predict what token is likely to come next, given the tokens currently in its context. Many surprising capabilities emerge from doing that prediction at enormous scale.

## Tokens are the model's basic input

An LLM does not read text directly as words or ideas. A tokenizer divides text into **tokens**: pieces that may be whole words, parts of words, punctuation, or other symbols. The model receives a sequence of token identifiers and produces scores for the token that might follow.

Tokenization helps explain why a model may handle two visually similar strings differently, struggle with exact character counting, or use more context for unfamiliar terminology. The model works with the tokenized representation, not with the page as a person sees it.

## Training compresses patterns into weights

During pretraining, the model sees many examples of text with part of each sequence hidden from prediction. It predicts the next token, compares that prediction with the observed token, and adjusts billions of numerical parameters called **weights**. Repeating this process teaches statistical patterns involving language, facts, styles, code, and common forms of reasoning.

The training material is not stored as a searchable library of complete documents inside the model. Information is distributed imperfectly across the weights. A model can reproduce a learned pattern without being able to identify its source, and it can generate a plausible continuation that was never present in the training data.

## Generation repeats one step

When responding, the model predicts a distribution of possible next tokens. A decoding procedure chooses one token, appends it to the context, and asks the model to predict again. The response grows through this repeated loop.

Settings such as temperature affect how conservative or varied those choices are, but they do not turn the model into a fact checker. A fluent answer and a well-supported answer are different things.

## Context is temporary working material

The model conditions each prediction on the tokens available in its current context window. Instructions, conversation history, selected files, retrieved passages, and tool results can all become part of that context. They are not automatically permanent memories, and material outside the context is not directly available during that prediction.

This is why clear instructions and relevant evidence can change performance dramatically without changing the model itself. It is also why stale, contradictory, or excessive context can make a session less reliable.

## The model and the harness are different layers

An LLM alone maps a token sequence to likely next tokens. A **harness** surrounds it with capabilities such as reading files, searching references, running code, calling tools, preserving project notes, or requesting another model turn.

When an agent edits a file or checks a database, the harness performs the action and returns the result to the model as new context. The model proposes and interprets; the surrounding software controls what can actually be observed or changed.

## Capability does not guarantee truth

Next-token training rewards plausible continuation, not direct agreement with reality. Models can therefore produce confident statements, citations, calculations, or explanations that are wrong. They may also be sensitive to wording, missing context, and patterns that differ from their training experience.

Treat important outputs as proposals to verify. Provide authoritative sources, ask the model to distinguish evidence from inference, use tools for calculations and retrieval, and check consequential claims against the underlying data.

## A practical mental model

For everyday work, remember six ideas:

1. Text is converted into tokens.
2. Training encodes patterns in numerical weights.
3. Generation predicts one token at a time.
4. The current context supplies temporary working material.
5. A harness adds tools and external state around the model.
6. Plausibility is not evidence of correctness.

This model leaves out many important details, but it is enough to explain why context, tools, verification, and carefully bounded tasks matter when working with an LLM.
