import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./router";
import { BooksProvider } from "./context/BooksContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BooksProvider>
      <RouterProvider router={router} />
    </BooksProvider>
  </StrictMode>,
);
