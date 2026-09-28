export type BookStatus = "to-read" | "reading" | "read";

export interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  rating: 1 | 2 | 3 | 4 | 5 | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type BookInput = Pick<
  Book,
  "title" | "author" | "status" | "rating" | "notes"
>;

export const STATUS_LABEL: Record<BookStatus, string> = {
  "to-read": "To Read",
  reading: "Reading",
  read: "Read",
};
