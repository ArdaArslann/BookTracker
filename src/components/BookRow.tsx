import { useState } from "react";
import { Link } from "react-router";
import type { Book } from "../interfaces/book";
import { StatusGlyph } from "./StatusGlyph";
import { RatingStars } from "./RatingStars";

interface BookRowProps {
  book: Book;
  onDelete: (id: string) => void;
}

export function BookRow({ book, onDelete }: BookRowProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  if (isConfirming) {
    return (
      <li className="flex flex-col gap-3 border-b border-rule py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink">
          Delete &ldquo;{book.title}&rdquo;? This can&apos;t be undone.
        </p>
        <div className="flex shrink-0 gap-2 font-mono text-xs tracking-wide uppercase">
          <button
            type="button"
            onClick={() => onDelete(book.id)}
            className="border border-accent px-3 py-1.5 text-accent hover:bg-accent hover:text-paper-raised"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => setIsConfirming(false)}
            className="border border-rule px-3 py-1.5 text-ink-soft hover:border-ink-blue hover:text-ink-blue"
          >
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-2 border-b border-rule py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <p className="truncate text-base font-medium text-ink">
          {book.title}
        </p>
        <p className="text-sm text-ink-soft">{book.author}</p>
        {book.notes && (
          <p className="mt-1 max-w-prose text-sm text-ink-soft italic">
            {book.notes}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
        <StatusGlyph status={book.status} />
        <RatingStars value={book.rating} />
        <div className="flex gap-3 font-mono text-xs tracking-wide uppercase">
          <Link
            to={`/edit/${book.id}`}
            className="text-ink-blue underline decoration-rule underline-offset-2 hover:decoration-ink-blue"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setIsConfirming(true)}
            className="text-accent underline decoration-rule underline-offset-2 hover:decoration-accent"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
