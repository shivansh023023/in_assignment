import { notFound, redirect } from 'next/navigation';
import { getBookById } from '@/lib/actions/book.actions';
import { getSessionUser } from '@/lib/auth';
import { BookForm } from '@/components/books/BookForm';
import { updateBook } from '@/lib/actions/book.actions';


export default async function EditBookPage({ params }: { params: { id: string } }) {
  const user = await getSessionUser();
  const book = await getBookById(params.id);

  if (!book) {
    notFound();
  }

  if (!user || user._id.toString() !== book.addedBy._id.toString()) {
    redirect(`/books/${params.id}`);
  }

  const updateBookWithId = updateBook.bind(null, params.id);

  return (
    <div className="container py-8">
      <BookForm type="Edit" action={updateBookWithId} book={book} />
    </div>
  );
}
