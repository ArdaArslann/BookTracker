import { useNavigate, useOutletContext, useParams } from "react-router";
import { BookForm } from "../components/BookForm";
import { NotFoundNotice } from "../components/NotFoundNotice";
import type { BookInput } from "../interfaces/book";
import type { BooksOutletContext } from "./RootLayout";

export function EditBookPage() {
  const { id } = useParams<{ id: string }>();
  const { getById, updateBook } = useOutletContext<BooksOutletContext>();
  const navigate = useNavigate();

  const book = id ? getById(id) : undefined;

  if (!book) {
    return (
      <NotFoundNotice
        label="Entry not found"
        message="This book couldn't be found — it may already have been deleted."
      />
    );
  }

  function handleSubmit(input: BookInput) {
    updateBook(book!.id, input);
    void navigate("/");
  }

  return (
    <div>
      <h2 className="mb-6 font-mono text-xs tracking-[0.2em] text-ink-soft uppercase">
        Editing entry
      </h2>
      <BookForm
        initialValue={book}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
        onCancel={() => void navigate("/")}
      />
    </div>
  );
}
