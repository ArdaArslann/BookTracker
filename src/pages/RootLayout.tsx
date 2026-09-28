import { Outlet } from "react-router";
import { Layout } from "../components/Layout";
import { useBooks } from "../hooks/useBooks";
import type { BooksContextValue } from "../hooks/useBooks";

export type BooksOutletContext = BooksContextValue;

export function RootLayout() {
  const books = useBooks();

  return (
    <Layout>
      <Outlet context={books} />
    </Layout>
  );
}
