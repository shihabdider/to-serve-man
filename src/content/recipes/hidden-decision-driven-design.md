---
title: Hidden-Decision-Driven Design
author: Shihab Dider
---

An architecture skill for organizing modules around difficult, volatile decisions rather than framework layers or workflow phases.

````markdown
---
name: hidden-decision-driven-design
description: Hidden volatility-led module design policy for the Product Architect role. Use only when explicitly referenced to turn an approved model and project evidence into stable contracts and change-tested work packages.
disable-model-invocation: true
---

# Hidden-Decision-Driven Design

Use this skill after domain meaning and the relevant greenfield or brownfield constraints are approved. It owns module formation, stable contracts, independent work packages, integration seams, and change-impact simulation. It does not reopen product discovery or implement the design.

## Hidden-decision inventory

List difficult or mutable decisions before naming modules. For each decision, record:

- what could change and why;
- volatility source, such as policy, user expectation, data interpretation, dependency, environment, persistence, performance, security, or scale;
- current evidence and uncertainty;
- owner and review needs;
- tests or observations that protect the decision.

Do not use workflow phases, files, commands, screens, framework layers, or call order as primary module boundaries. Cluster decisions only when they change together and share an owner. Split decisions with different rates of change, authorities, or tests.

## Module contract

For each decision cluster, define:

- the secret the module hides and stable responsibility callers may rely on;
- public vocabulary and boundary-data meanings;
- invariants, public operations, and explicit error or uncertainty states;
- owned policy and configuration;
- allowed dependencies and forbidden leaks;
- compatibility obligations and boundary tests;
- the existing brownfield owner or the approved new owner.

A caller should not need private representation, provider, persistence, sequencing, or policy knowledge to use the contract.

## Work packages and integration

Create independent module work packages only after contracts stabilize. Each package names one owner, primary write scope, dependencies, examples, checks, and a stable integration seam. Mark packages as parallel only when dependencies and write scopes are disjoint enough for separate worktrees. Name merge order and integration evidence.

## Change-impact simulation

Test at least:

1. one likely policy or vocabulary change that should localize;
2. one data, artifact, dependency, or protocol replacement;
3. one legitimate cross-cutting product change;
4. one separate-worktree integration;
5. for brownfield work, one proposed architecture deviation.

Revise boundaries when the same private decision leaks across modules, independent packages need overlapping private edits, or a plausible localized change requires broad coordination.

## Exit gate

Return hidden decisions, owner modules, stable contracts, work packages, dependencies, integration seams, simulation results, and residual uncertainties. Require explicit human architecture approval before implementation handoff.
````
