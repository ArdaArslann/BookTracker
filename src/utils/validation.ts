import type { BookInput } from "../interfaces/book";

export interface FieldErrors {
  title?: string;
  author?: string;
  notes?: string;
}

export function validateBookInput(input: BookInput): FieldErrors {
  const errors: FieldErrors = {};

  const title = input.title.trim();
  if (title.length === 0) {
    errors.title = "Title is required.";
  } else if (title.length > 200) {
    errors.title = "Title must be 200 characters or fewer.";
  }

  const author = input.author.trim();
  if (author.length === 0) {
    errors.author = "Author is required.";
  } else if (author.length > 120) {
    errors.author = "Author must be 120 characters or fewer.";
  }

  if (input.notes.trim().length > 1000) {
    errors.notes = "Notes must be 1000 characters or fewer.";
  }

  return errors;
}

export function hasFieldErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
