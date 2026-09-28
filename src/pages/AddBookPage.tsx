import { useNavigate, useOutletContext } from "react-router";
import { BookForm } from "../components/BookForm";
import type { BookInput } from "../interfaces/book";
import type { BooksOutletContext } from "./RootLayout";

const EMPTY_INPUT: BookInput = {
  title: "",
  author: "",
  status: "to-read",
  rating: null,
  notes: "",
};

export function AddBookPage() {
  const { addBook } = useOutletContext<BooksOutletContext>();
  const navigate = useNavigate();

  function handleSubmit(input: BookInput) {
    addBook(input);
    void navigate("/");
  }

  return (
    <div>
      <h2 className="mb-6 font-mono text-xs tracking-[0.2em] text-ink-soft uppercase">
        New entry
      </h2>
      <BookForm
        initialValue={EMPTY_INPUT}
        submitLabel="Add book"
        onSubmit={handleSubmit}
        onCancel={() => void navigate("/")}
      />
    </div>
  );
}
