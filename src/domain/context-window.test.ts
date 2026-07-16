import { describe, expect, test } from "vitest";
import {
  CONTEXT_ITEM_KINDS,
  addContextItem,
  contextQuality,
  contextUsage,
  createContextWindow,
  qualityForUsage,
} from "./context-window";

describe("context window", () => {
  test("starts with a small system prompt and user message", () => {
    const window = createContextWindow();

    expect(window.items.map(({ kind }) => kind)).toEqual(["system", "user"]);
    expect(contextUsage(window)).toBe(12);
    expect(contextQuality(window)).toBe(100);
  });

  test("offers each context source named in the article", () => {
    expect(CONTEXT_ITEM_KINDS).toEqual(["system", "skill", "file", "tool", "user"]);
  });

  test("adds context without mutating the prior window", () => {
    const before = createContextWindow();
    const after = addContextItem(before, "tool");

    expect(contextUsage(before)).toBe(12);
    expect(contextUsage(after)).toBe(24);
    expect(after.items.at(-1)?.kind).toBe("tool");
  });

  test("does not exceed the context window", () => {
    let window = createContextWindow();
    while (contextUsage(window) <= 88) window = addContextItem(window, "tool");

    const unchanged = addContextItem(window, "tool");
    expect(unchanged).toBe(window);
    expect(contextUsage(window)).toBeLessThanOrEqual(100);
  });
});

describe("illustrative output quality", () => {
  test("holds steady through 40% and degrades above it", () => {
    expect(qualityForUsage(0)).toBe(100);
    expect(qualityForUsage(40)).toBe(100);
    expect(qualityForUsage(41)).toBeLessThan(100);
    expect(qualityForUsage(100)).toBe(10);
  });

  test("degrades non-linearly as context pressure grows", () => {
    const earlyLoss = qualityForUsage(40) - qualityForUsage(60);
    const middleLoss = qualityForUsage(60) - qualityForUsage(80);
    const lateLoss = qualityForUsage(80) - qualityForUsage(100);

    expect(earlyLoss).toBeLessThan(middleLoss);
    expect(middleLoss).toBeLessThan(lateLoss);
  });
});
