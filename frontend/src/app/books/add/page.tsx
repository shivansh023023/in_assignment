import { BookForm } from "@/components/books/BookForm";
import { addBook } from "@/lib/actions/book.actions";

export default function AddBookPage() {
  return (
    <div className="container py-8">
      <BookForm type="Add" action={addBook} />
    </div>
  );
}
