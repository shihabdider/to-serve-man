import { describe, expect, it } from "vitest";
import { collectionPath, withBasePath } from "./paths";

describe("withBasePath", () => {
  it.each([
    ["", "/to-serve-man/", "/to-serve-man/"],
    ["wordmark.svg", "/to-serve-man", "/to-serve-man/wordmark.svg"],
    ["/recipes/", "/to-serve-man/", "/to-serve-man/recipes/"],
    ["", "/", "/"],
    ["guides/", "/", "/guides/"],
  ])("joins %j to base %j", (pathname, base, expected) => {
    expect(withBasePath(pathname, base)).toBe(expected);
  });
});

describe("collectionPath", () => {
  it("maps both collection variants to their static indexes", () => {
    expect(collectionPath("guide", undefined, "/to-serve-man/")).toBe("/to-serve-man/guides/");
    expect(collectionPath("recipe", undefined, "/to-serve-man/")).toBe("/to-serve-man/recipes/");
  });

  it("maps a validated slug to its static article route", () => {
    expect(collectionPath("recipe", "variant-review-prompt", "/to-serve-man/"))
      .toBe("/to-serve-man/recipes/variant-review-prompt/");
  });
});
