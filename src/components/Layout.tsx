import type { ReactNode } from "react";
import { Link } from "react-router";
import { useBooks } from "../hooks/useBooks";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { saveError, clearSaveError } = useBooks();

  return (
    <div className="min-h-screen bg-paper">
      <div className="relative mx-auto max-w-3xl px-6 py-10 sm:px-10">
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-10 hidden w-px bg-accent-soft sm:left-16 sm:block"
        />

        <header className="mb-8 flex items-baseline justify-between gap-4 border-b border-rule pb-4 sm:pl-12">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            Reading List
          </h1>
          <Link
            to="/add"
            className="shrink-0 border border-accent px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-paper-raised"
          >
            + Add
          </Link>
        </header>

        {saveError && (
          <div
            role="alert"
            className="mb-6 flex items-start justify-between gap-4 border border-accent-soft bg-accent-soft/60 px-4 py-3 text-sm text-accent-strong sm:ml-12"
          >
            <p>{saveError}</p>
            <button
              type="button"
              onClick={clearSaveError}
              aria-label="Dismiss error"
              className="shrink-0 font-mono text-xs tracking-wide uppercase text-accent-strong underline decoration-accent-soft underline-offset-2 hover:text-accent"
            >
              Dismiss
            </button>
          </div>
        )}

        <main className="sm:pl-12">{children}</main>
      </div>
    </div>
  );
}
