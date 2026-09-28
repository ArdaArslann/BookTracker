import type { BookStatus } from "../interfaces/book";
import { STATUS_LABEL } from "../interfaces/book";

const GLYPH: Record<BookStatus, string> = {
  "to-read": "○",
  reading: "●",
  read: "✓",
};

interface StatusGlyphProps {
  status: BookStatus;
}

export function StatusGlyph({ status }: StatusGlyphProps) {
  const isActive = status === "reading";

  return (
    <span
      className={
        "inline-flex items-center gap-1.5 font-mono text-sm " +
        (isActive ? "text-accent" : "text-ink-soft")
      }
    >
      <span aria-hidden="true">{GLYPH[status]}</span>
      <span className="tracking-wide uppercase">{STATUS_LABEL[status]}</span>
    </span>
  );
}
