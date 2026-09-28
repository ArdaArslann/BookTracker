import { Link } from "react-router";

interface NotFoundNoticeProps {
  label: string;
  message: string;
}

export function NotFoundNotice({ label, message }: NotFoundNoticeProps) {
  return (
    <div className="flex flex-col items-start gap-4 border-y border-dashed border-rule py-16">
      <p className="font-mono text-xs tracking-[0.2em] text-ink-soft uppercase">
        {label}
      </p>
      <p className="text-ink">{message}</p>
      <Link
        to="/"
        className="border border-ink-blue px-4 py-2 text-sm font-medium text-ink-blue transition-colors hover:bg-ink-blue hover:text-paper-raised"
      >
        Back to list
      </Link>
    </div>
  );
}
