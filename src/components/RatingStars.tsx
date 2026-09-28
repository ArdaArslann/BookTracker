interface RatingStarsProps {
  value: 1 | 2 | 3 | 4 | 5 | null;
  onChange?: (value: 1 | 2 | 3 | 4 | 5 | null) => void;
}

const RATINGS = [1, 2, 3, 4, 5] as const;

export function RatingStars({ value, onChange }: RatingStarsProps) {
  if (!onChange) {
    return (
      <span className="tabular font-mono text-sm text-ink">
        {value === null ? (
          <span className="text-ink-soft">&mdash;</span>
        ) : (
          <>
            {value}
            <span className="text-ink-soft">/5</span>
          </>
        )}
      </span>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Rating"
      className="tabular flex items-center gap-1 font-mono text-sm"
    >
      {RATINGS.map((rating) => (
        <button
          key={rating}
          type="button"
          role="radio"
          aria-checked={value === rating}
          aria-label={`${rating} out of 5`}
          onClick={() => onChange(value === rating ? null : rating)}
          className={
            "flex h-7 w-7 items-center justify-center border transition-colors " +
            (value === rating
              ? "border-accent bg-accent text-paper-raised"
              : "border-rule text-ink-soft hover:border-ink-blue hover:text-ink-blue")
          }
        >
          {rating}
        </button>
      ))}
      {value !== null && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="ml-2 text-xs text-ink-soft underline decoration-rule underline-offset-2 hover:text-accent"
        >
          clear
        </button>
      )}
    </div>
  );
}
