import { Link } from "react-router";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 border-y border-dashed border-rule py-20 text-center">
      <p className="font-mono text-xs tracking-[0.2em] text-ink-soft uppercase">
        Page 1 &mdash; no entries yet
      </p>
      <p className="max-w-sm text-ink-soft">
        Your ledger is empty. Add the first book you want to read, are
        reading, or have finished.
      </p>
      <Link
        to="/add"
        className="mt-2 border border-accent px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-paper-raised"
      >
        Add a book
      </Link>
    </div>
  );
}
