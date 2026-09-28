import type { Book, BookStatus } from "../interfaces/book";

// The only module allowed to touch window.localStorage directly.
export const STORAGE_KEY = "reading-list:books:v1";

const VALID_STATUSES: readonly BookStatus[] = ["to-read", "reading", "read"];
const VALID_RATINGS: readonly number[] = [1, 2, 3, 4, 5];

export class BookStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookStorageError";
  }
}

export interface LoadResult {
  books: Book[];
  /** True when a value existed under the storage key but had to be dropped
   * (invalid JSON, non-array shape, or entries that failed shape validation). */
  corrupted: boolean;
}

function isNonEmptyString(value: unknown, maxLength: number): boolean {
  return (
    typeof value === "string" && value.trim().length > 0 && value.length <= maxLength
  );
}

function isValidBook(value: unknown): value is Book {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    candidate.id.length > 0 &&
    isNonEmptyString(candidate.title, 200) &&
    isNonEmptyString(candidate.author, 120) &&
    typeof candidate.status === "string" &&
    VALID_STATUSES.includes(candidate.status as BookStatus) &&
    (candidate.rating === null ||
      (typeof candidate.rating === "number" &&
        VALID_RATINGS.includes(candidate.rating))) &&
    typeof candidate.notes === "string" &&
    candidate.notes.length <= 1000 &&
    typeof candidate.createdAt === "string" &&
    candidate.createdAt.length > 0 &&
    typeof candidate.updatedAt === "string" &&
    candidate.updatedAt.length > 0
  );
}

/**
 * Reads and validates the book list from localStorage. Never throws: missing
 * data, invalid JSON, a non-array value, or entries that fail shape
 * validation all fall back to an empty array (with invalid entries dropped
 * individually where the rest of the array is still usable). `corrupted` is
 * only true when there was data to lose, so the UI can tell a genuine
 * recovery apart from a fresh, empty list.
 */
export function load(): LoadResult {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // localStorage itself may be inaccessible (disabled, restricted context).
    return { books: [], corrupted: false };
  }

  if (raw === null) {
    return { books: [], corrupted: false };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { books: [], corrupted: true };
  }

  if (!Array.isArray(parsed)) {
    return { books: [], corrupted: true };
  }

  const books = parsed.filter(isValidBook);
  return { books, corrupted: books.length !== parsed.length };
}

/**
 * Writes the full book list to localStorage. Throws a BookStorageError with
 * a specific, English, user-facing message on failure (e.g. quota exceeded
 * or storage blocked in private browsing) instead of failing silently.
 */
export function save(books: Book[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } catch (error) {
    if (
      error instanceof DOMException &&
      (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED")
    ) {
      throw new BookStorageError(
        "Couldn't save your book: browser storage may be full.",
      );
    }

    throw new BookStorageError(
      "Couldn't save your book: browser storage is unavailable (it may be disabled or blocked, e.g. in private browsing).",
    );
  }
}
