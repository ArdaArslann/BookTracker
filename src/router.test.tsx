import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { routes } from "./router";
import { BooksProvider } from "./context/BooksContext";
import { STORAGE_KEY } from "./services/bookStorage";
import type { Book } from "./interfaces/book";

function renderAt(initialEntry: string) {
  const router = createMemoryRouter(routes, { initialEntries: [initialEntry] });
  return render(
    <BooksProvider>
      <RouterProvider router={router} />
    </BooksProvider>,
  );
}

function seedStorage(books: Book[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

const now = new Date().toISOString();

describe("Reading List routes", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("lists the seeded books on the home route", () => {
    seedStorage([
      {
        id: "seed-1",
        title: "Piranesi",
        author: "Susanna Clarke",
        status: "read",
        rating: 5,
        notes: "",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "seed-2",
        title: "Project Hail Mary",
        author: "Andy Weir",
        status: "to-read",
        rating: null,
        notes: "",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    renderAt("/");

    expect(
      screen.getByRole("heading", { name: /reading list/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Piranesi")).toBeInTheDocument();
    expect(screen.getByText("Project Hail Mary")).toBeInTheDocument();
  });

  it("shows validation errors and blocks submit when required fields are empty", async () => {
    const user = userEvent.setup();
    renderAt("/add");

    await user.click(screen.getByRole("button", { name: /add book/i }));

    expect(await screen.findByText("Title is required.")).toBeInTheDocument();
    expect(screen.getByText("Author is required.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /new entry/i })).toBeInTheDocument();
  });

  it("adds a book and returns to the list", async () => {
    const user = userEvent.setup();
    renderAt("/add");

    await user.type(screen.getByLabelText(/title/i), "Dune");
    await user.type(screen.getByLabelText(/author/i), "Frank Herbert");
    await user.click(screen.getByRole("button", { name: /add book/i }));

    expect(
      await screen.findByRole("heading", { name: /reading list/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Dune")).toBeInTheDocument();
  });

  it("shows a not-found notice for an unknown edit id", () => {
    renderAt("/edit/does-not-exist");

    expect(screen.getByText(/entry not found/i)).toBeInTheDocument();
  });

  it("shows a not-found notice for an unmatched route", () => {
    renderAt("/nowhere");

    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });

  it("shows the empty state when no books are stored", () => {
    renderAt("/");

    expect(screen.getByText(/ledger is empty/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /add a book/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  it("renders the add form pristine, with no errors and the default status selected", () => {
    renderAt("/add");

    expect(screen.getByLabelText(/title/i)).toHaveValue("");
    expect(screen.getByLabelText(/author/i)).toHaveValue("");
    expect(screen.getByLabelText(/notes/i)).toHaveValue("");
    expect(
      screen.getByRole("button", { name: "To Read" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
  });

  it("prefills the edit form with the existing book's values", async () => {
    seedStorage([
      {
        id: "seed-1",
        title: "Piranesi",
        author: "Susanna Clarke",
        status: "read",
        rating: 4,
        notes: "Loved the atmosphere.",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    renderAt("/edit/seed-1");

    expect(
      await screen.findByRole("heading", { name: /editing entry/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toHaveValue("Piranesi");
    expect(screen.getByLabelText(/author/i)).toHaveValue("Susanna Clarke");
    expect(screen.getByLabelText(/notes/i)).toHaveValue(
      "Loved the atmosphere.",
    );
    expect(screen.getByRole("button", { name: "Read" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.getByRole("radio", { name: "4 out of 5" }),
    ).toHaveAttribute("aria-checked", "true");
  });

  it("shows validation errors on the edit form and keeps the user on the page", async () => {
    const user = userEvent.setup();
    seedStorage([
      {
        id: "seed-1",
        title: "Piranesi",
        author: "Susanna Clarke",
        status: "read",
        rating: null,
        notes: "",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    renderAt("/edit/seed-1");

    await user.clear(await screen.findByLabelText(/title/i));
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(await screen.findByText("Title is required.")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /editing entry/i }),
    ).toBeInTheDocument();
  });

  it("removes a book on delete confirmation, but leaves it when cancelled", async () => {
    const user = userEvent.setup();
    seedStorage([
      {
        id: "seed-1",
        title: "Dune",
        author: "Frank Herbert",
        status: "to-read",
        rating: null,
        notes: "",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    renderAt("/");

    function findConfirmText() {
      return screen.queryByText(
        (_, element) =>
          element?.tagName.toLowerCase() === "p" &&
          (element.textContent ?? "").includes("Delete") &&
          (element.textContent ?? "").includes("Dune") &&
          (element.textContent ?? "").includes("undone"),
      );
    }

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(findConfirmText()).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByText("Dune")).toBeInTheDocument();
    expect(findConfirmText()).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(screen.queryByText("Dune")).not.toBeInTheDocument();
    expect(screen.getByText(/ledger is empty/i)).toBeInTheDocument();
  });

  it("persists add, edit, and delete to real localStorage through the UI", async () => {
    const user = userEvent.setup();
    renderAt("/add");

    await user.type(screen.getByLabelText(/title/i), "Dune");
    await user.type(screen.getByLabelText(/author/i), "Frank Herbert");
    await user.click(screen.getByRole("button", { name: /add book/i }));

    await screen.findByText("Dune");
    let stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!) as Book[];
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({ title: "Dune", author: "Frank Herbert" });
    const bookId = stored[0].id;

    await user.click(screen.getByRole("link", { name: "Edit" }));
    const titleInput = await screen.findByLabelText(/title/i);
    await user.clear(titleInput);
    await user.type(titleInput, "Dune Messiah");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await screen.findByText("Dune Messiah");
    stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!) as Book[];
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(bookId);
    expect(stored[0].title).toBe("Dune Messiah");

    await user.click(screen.getByRole("button", { name: "Delete" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));

    await screen.findByText(/ledger is empty/i);
    stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!) as Book[];
    expect(stored).toEqual([]);
  });

  it("shows a dismissible corrupt-data notice when localStorage holds invalid JSON", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(STORAGE_KEY, "{not valid json");

    renderAt("/");

    const notice = screen.getByRole("status");
    expect(
      within(notice).getByText(/couldn't be read and was reset/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/ledger is empty/i)).toBeInTheDocument();

    await user.click(within(notice).getByRole("button", { name: /dismiss notice/i }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  describe("save-error banner", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("does not appear after a successful save", async () => {
      const user = userEvent.setup();
      renderAt("/add");

      await user.type(screen.getByLabelText(/title/i), "Dune");
      await user.type(screen.getByLabelText(/author/i), "Frank Herbert");
      await user.click(screen.getByRole("button", { name: /add book/i }));

      await screen.findByText("Dune");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("appears with a specific message on a real save failure, and can be dismissed", async () => {
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("quota exceeded", "QuotaExceededError");
      });
      const user = userEvent.setup();
      renderAt("/add");

      await user.type(screen.getByLabelText(/title/i), "Dune");
      await user.type(screen.getByLabelText(/author/i), "Frank Herbert");
      await user.click(screen.getByRole("button", { name: /add book/i }));

      const alert = await screen.findByRole("alert");
      expect(alert).toHaveTextContent(
        "Couldn't save your book: browser storage may be full.",
      );

      // Regression guard: a failed write must not leave a phantom item in
      // memory or storage, even though the form still navigates to "/".
      expect(screen.queryByText("Dune")).not.toBeInTheDocument();
      expect(screen.getByText(/ledger is empty/i)).toBeInTheDocument();
      expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();

      await user.click(
        within(alert).getByRole("button", { name: /dismiss error/i }),
      );
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });
});
