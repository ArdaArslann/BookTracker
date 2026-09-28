import { useRef, useState } from "react";
import type { FormEvent } from "react";
import type { BookInput, BookStatus } from "../interfaces/book";
import { STATUS_LABEL } from "../interfaces/book";
import { validateBookInput, hasFieldErrors } from "../utils/validation";
import type { FieldErrors } from "../utils/validation";
import { RatingStars } from "./RatingStars";

interface BookFormProps {
  initialValue: BookInput;
  submitLabel: string;
  onSubmit: (input: BookInput) => void;
  onCancel: () => void;
}

const STATUS_OPTIONS: BookStatus[] = ["to-read", "reading", "read"];

export function BookForm({
  initialValue,
  submitLabel,
  onSubmit,
  onCancel,
}: BookFormProps) {
  const [value, setValue] = useState<BookInput>(initialValue);
  const [errors, setErrors] = useState<FieldErrors>({});
  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateBookInput(value);
    setErrors(nextErrors);

    if (hasFieldErrors(nextErrors)) {
      if (nextErrors.title) {
        titleRef.current?.focus();
      } else if (nextErrors.author) {
        authorRef.current?.focus();
      }
      return;
    }

    onSubmit({
      ...value,
      title: value.title.trim(),
      author: value.author.trim(),
      notes: value.notes.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl">
      <div className="mb-5">
        <label
          htmlFor="title"
          className="mb-1 block font-mono text-xs tracking-[0.15em] text-ink-soft uppercase"
        >
          Title
        </label>
        <input
          ref={titleRef}
          id="title"
          type="text"
          value={value.title}
          onChange={(e) => setValue({ ...value, title: e.target.value })}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "title-error" : undefined}
          className={
            "w-full border bg-paper-raised px-3 py-2 text-ink outline-none " +
            (errors.title
              ? "border-accent"
              : "border-rule focus:border-ink-blue")
          }
        />
        {errors.title && (
          <p id="title-error" className="mt-1 text-sm text-accent">
            {errors.title}
          </p>
        )}
      </div>

      <div className="mb-5">
        <label
          htmlFor="author"
          className="mb-1 block font-mono text-xs tracking-[0.15em] text-ink-soft uppercase"
        >
          Author
        </label>
        <input
          ref={authorRef}
          id="author"
          type="text"
          value={value.author}
          onChange={(e) => setValue({ ...value, author: e.target.value })}
          aria-invalid={Boolean(errors.author)}
          aria-describedby={errors.author ? "author-error" : undefined}
          className={
            "w-full border bg-paper-raised px-3 py-2 text-ink outline-none " +
            (errors.author
              ? "border-accent"
              : "border-rule focus:border-ink-blue")
          }
        />
        {errors.author && (
          <p id="author-error" className="mt-1 text-sm text-accent">
            {errors.author}
          </p>
        )}
      </div>

      <div className="mb-5">
        <span className="mb-1 block font-mono text-xs tracking-[0.15em] text-ink-soft uppercase">
          Status
        </span>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              aria-pressed={value.status === status}
              onClick={() => setValue({ ...value, status })}
              className={
                "border px-3 py-1.5 font-mono text-xs tracking-wide uppercase transition-colors " +
                (value.status === status
                  ? "border-accent bg-accent text-paper-raised"
                  : "border-rule text-ink-soft hover:border-ink-blue hover:text-ink-blue")
              }
            >
              {STATUS_LABEL[status]}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <span className="mb-1 block font-mono text-xs tracking-[0.15em] text-ink-soft uppercase">
          Rating
        </span>
        <RatingStars
          value={value.rating}
          onChange={(rating) => setValue({ ...value, rating })}
        />
      </div>

      <div className="mb-7">
        <label
          htmlFor="notes"
          className="mb-1 block font-mono text-xs tracking-[0.15em] text-ink-soft uppercase"
        >
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          value={value.notes}
          onChange={(e) => setValue({ ...value, notes: e.target.value })}
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={errors.notes ? "notes-error" : undefined}
          className={
            "w-full resize-y border bg-paper-raised px-3 py-2 text-ink outline-none " +
            (errors.notes
              ? "border-accent"
              : "border-rule focus:border-ink-blue")
          }
        />
        {errors.notes && (
          <p id="notes-error" className="mt-1 text-sm text-accent">
            {errors.notes}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="border border-accent bg-accent px-4 py-2 text-sm font-medium text-paper-raised hover:bg-accent-strong"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-rule px-4 py-2 text-sm font-medium text-ink-soft hover:border-ink-blue hover:text-ink-blue"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
