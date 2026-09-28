import { createContext, useContext } from "react";
import type { Book, BookInput } from "../interfaces/book";

export interface BooksContextValue {
  books: Book[];
  /** True when the stored data had to be dropped because it was corrupt. */
  hadCorruptData: boolean;
  /** Specific, English message from the last failed write, if any. */
  saveError: string | null;
  clearSaveError: () => void;
  addBook: (input: BookInput) => void;
  updateBook: (id: string, input: BookInput) => void;
  removeBook: (id: string) => void;
  getById: (id: string) => Book | undefined;
}

// Defined here (not in the .tsx provider file) so BooksContext.tsx only
// exports the BooksProvider component, as react-refresh/only-export-components
// requires for Fast Refresh compatibility.
export const BooksContext = createContext<BooksContextValue | null>(null);

export function useBooks(): BooksContextValue {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error("useBooks must be used within a BooksProvider");
  }
  return context;
}
