import { useState } from "react";
import { useOutletContext } from "react-router";
import { BookRow } from "../components/BookRow";
import { EmptyState } from "../components/EmptyState";
import { CorruptDataNotice } from "../components/CorruptDataNotice";
import type { BooksOutletContext } from "./RootLayout";

export function BookListPage() {
  const { books, removeBook, hadCorruptData } = useOutletContext<BooksOutletContext>();
  // hadCorruptData reflects a real bookStorage.load() parse/shape failure on
  // mount; kept in local state so the user can dismiss it independently.
  const [showCorruptNotice, setShowCorruptNotice] = useState(hadCorruptData);

  return (
    <>
      {showCorruptNotice && (
        <CorruptDataNotice onDismiss={() => setShowCorruptNotice(false)} />
      )}

      {books.length === 0 ? (
        <EmptyState />
      ) : (
        <ul>
          {books.map((book) => (
            <BookRow key={book.id} book={book} onDelete={removeBook} />
          ))}
        </ul>
      )}
    </>
  );
}
