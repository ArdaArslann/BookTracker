interface CorruptDataNoticeProps {
  onDismiss: () => void;
}

export function CorruptDataNotice({ onDismiss }: CorruptDataNoticeProps) {
  return (
    <div
      role="status"
      className="mb-6 flex items-start justify-between gap-4 border border-accent-soft bg-accent-soft/60 px-4 py-3 text-sm text-accent-strong"
    >
      <p>
        Your saved list couldn&apos;t be read and was reset. This ledger now
        starts blank &mdash; sorry about that.
      </p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notice"
        className="shrink-0 font-mono text-xs tracking-wide uppercase text-accent-strong underline decoration-accent-soft underline-offset-2 hover:text-accent"
      >
        Dismiss
      </button>
    </div>
  );
}
