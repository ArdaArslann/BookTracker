import { NotFoundNotice } from "../components/NotFoundNotice";

export function NotFoundPage() {
  return (
    <NotFoundNotice
      label="Page not found"
      message="There's no page at this address."
    />
  );
}
