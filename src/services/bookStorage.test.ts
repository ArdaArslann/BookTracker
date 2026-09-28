import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Book } from "../interfaces/book";
import { BookStorageError, STORAGE_KEY, load, save } from "./bookStorage";

function makeBook(overrides: Partial<Book> = {}): Book {
  return {
    id: "book-1",
    title: "Dune",
    author: "Frank Herbert",
    status: "to-read",
    rating: null,
    notes: "",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("bookStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe("load", () => {
    it("returns an empty, non-corrupted result when nothing is stored", () => {
      expect(load()).toEqual({ books: [], corrupted: false });
    });

    it("returns the stored books when the value is valid", () => {
      const book = makeBook();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([book]));

      expect(load()).toEqual({ books: [book], corrupted: false });
    });

    it("falls back to an empty array and flags corruption on invalid JSON", () => {
      window.localStorage.setItem(STORAGE_KEY, "{not json");

      expect(load()).toEqual({ books: [], corrupted: true });
    });

    it("falls back to an empty array and flags corruption when the value is not an array", () => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: "an array" }));

      expect(load()).toEqual({ books: [], corrupted: true });
    });

    it("drops entries with an invalid shape and flags corruption", () => {
      const validBook = makeBook({ id: "book-1" });
      const missingTitle = { ...makeBook({ id: "book-2" }), title: "" };
      const badStatus = { ...makeBook({ id: "book-3" }), status: "archived" };
      const badRating = { ...makeBook({ id: "book-4" }), rating: 6 };
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([validBook, missingTitle, badStatus, badRating, "not-a-book"]),
      );

      expect(load()).toEqual({ books: [validBook], corrupted: true });
    });

    it("does not flag corruption when every stored entry is valid", () => {
      const books = [makeBook({ id: "book-1" }), makeBook({ id: "book-2" })];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(books));

      expect(load()).toEqual({ books, corrupted: false });
    });
  });

  describe("save", () => {
    it("writes the full book list as JSON under the storage key", () => {
      const books = [makeBook()];

      save(books);

      expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)!)).toEqual(books);
    });

    it("throws a specific BookStorageError when storage quota is exceeded", () => {
      const setItemSpy = vi
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw new DOMException("quota exceeded", "QuotaExceededError");
        });

      expect(() => save([makeBook()])).toThrow(BookStorageError);
      expect(() => save([makeBook()])).toThrow(
        "Couldn't save your book: browser storage may be full.",
      );

      setItemSpy.mockRestore();
    });

    it("throws a specific BookStorageError for other write failures", () => {
      const setItemSpy = vi
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw new Error("storage blocked");
        });

      expect(() => save([makeBook()])).toThrow(BookStorageError);
      expect(() => save([makeBook()])).toThrow(/unavailable/);

      setItemSpy.mockRestore();
    });
  });
});
