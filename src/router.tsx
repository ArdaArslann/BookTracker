import { createBrowserRouter, type RouteObject } from "react-router";
import { RootLayout } from "./pages/RootLayout";
import { BookListPage } from "./pages/BookListPage";
import { AddBookPage } from "./pages/AddBookPage";
import { EditBookPage } from "./pages/EditBookPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <BookListPage /> },
      { path: "add", element: <AddBookPage /> },
      { path: "edit/:id", element: <EditBookPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
