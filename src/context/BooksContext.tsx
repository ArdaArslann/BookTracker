import { useState } from "react";
import type { ReactNode } from "react";
import type { Book, BookInput } from "../interfaces/book";
import { BooksContext } from "../hooks/useBooks";
import type { BooksContextValue } from "../hooks/useBooks";
import * as bookStorage from "../services/bookStorage";

interface BooksProviderProps {
  children: ReactNode;
}

export function BooksProvider({ children }: BooksProviderProps) {
  const [{ books: initialBooks, corrupted: hadCorruptData }] = useState(bookStorage.load);
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [saveError, setSaveError] = useState<string | null>(null);

  function persist(next: Book[]) {
    try {
      bookStorage.save(next);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Couldn't save your book.",
      );
      return;
    }
    setBooks(next);
    setSaveError(null);
  }

  function addBook(input: BookInput) {
    const timestamp = new Date().toISOString();
    const book: Book = {
      id: crypto.randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
      ...input,
    };
    persist([...books, book]);
  }

  function updateBook(id: string, input: BookInput) {
    const timestamp = new Date().toISOString();
    persist(
      books.map((book) =>
        book.id === id ? { ...book, ...input, updatedAt: timestamp } : book,
      ),
    );
  }

  function removeBook(id: string) {
    persist(books.filter((book) => book.id !== id));
  }

  function getById(id: string) {
    return books.find((book) => book.id === id);
  }

  const value: BooksContextValue = {
    books,
    hadCorruptData,
    saveError,
    clearSaveError: () => setSaveError(null),
    addBook,
    updateBook,
    removeBook,
    getById,
  };

  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
}
