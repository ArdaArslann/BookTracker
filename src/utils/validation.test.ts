import { describe, expect, it } from "vitest";
import type { BookInput } from "../interfaces/book";
import { hasFieldErrors, validateBookInput } from "./validation";

function makeInput(overrides: Partial<BookInput> = {}): BookInput {
  return {
    title: "Dune",
    author: "Frank Herbert",
    status: "to-read",
    rating: null,
    notes: "",
    ...overrides,
  };
}

describe("validateBookInput", () => {
  it("returns no errors for a fully valid input", () => {
    expect(validateBookInput(makeInput())).toEqual({});
  });

  it("requires a title", () => {
    expect(validateBookInput(makeInput({ title: "" }))).toEqual({
      title: "Title is required.",
    });
  });

  it("treats a whitespace-only title as empty", () => {
    expect(validateBookInput(makeInput({ title: "   " }))).toEqual({
      title: "Title is required.",
    });
  });

  it("requires an author", () => {
    expect(validateBookInput(makeInput({ author: "" }))).toEqual({
      author: "Author is required.",
    });
  });

  it("treats a whitespace-only author as empty", () => {
    expect(validateBookInput(makeInput({ author: "   " }))).toEqual({
      author: "Author is required.",
    });
  });

  it("accepts a title at exactly the 200-character cap", () => {
    const title = "a".repeat(200);
    expect(validateBookInput(makeInput({ title }))).toEqual({});
  });

  it("rejects a title over the 200-character cap", () => {
    const title = "a".repeat(201);
    expect(validateBookInput(makeInput({ title }))).toEqual({
      title: "Title must be 200 characters or fewer.",
    });
  });

  it("accepts an author at exactly the 120-character cap", () => {
    const author = "a".repeat(120);
    expect(validateBookInput(makeInput({ author }))).toEqual({});
  });

  it("rejects an author over the 120-character cap", () => {
    const author = "a".repeat(121);
    expect(validateBookInput(makeInput({ author }))).toEqual({
      author: "Author must be 120 characters or fewer.",
    });
  });

  it("accepts notes at exactly the 1000-character cap", () => {
    const notes = "a".repeat(1000);
    expect(validateBookInput(makeInput({ notes }))).toEqual({});
  });

  it("rejects notes over the 1000-character cap", () => {
    const notes = "a".repeat(1001);
    expect(validateBookInput(makeInput({ notes }))).toEqual({
      notes: "Notes must be 1000 characters or fewer.",
    });
  });

  it("reports multiple field errors at once", () => {
    expect(validateBookInput(makeInput({ title: "", author: "" }))).toEqual({
      title: "Title is required.",
      author: "Author is required.",
    });
  });
});

describe("hasFieldErrors", () => {
  it("is false for an empty errors object", () => {
    expect(hasFieldErrors({})).toBe(false);
  });

  it("is true when at least one field has an error", () => {
    expect(hasFieldErrors({ title: "Title is required." })).toBe(true);
  });
});
