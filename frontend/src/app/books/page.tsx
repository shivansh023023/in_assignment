import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookCard } from '@/components/books/BookCard';
import PaginationControls from '@/components/books/PaginationControls';
import { getBooks, getUniqueGenres } from '@/lib/actions/book.actions';
import { PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { BookFilters } from '@/components/books/BookFilters';

function BookListSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i}>
                    <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                    <Skeleton className="h-6 w-3/4 mt-2" />
                    <Skeleton className="h-4 w-1/2 mt-1" />
                </div>
            ))}
        </div>
    )
}

async function BookList({ currentPage, query, genre }: { currentPage: number, query: string, genre: string }) {
    const { books, totalPages } = await getBooks({page: currentPage, query, genre});

    if (books.length === 0) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-headline mb-2">No Books Found</h2>
                <p className="text-muted-foreground">Try adjusting your search or filter.</p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8">
                {books.map((book) => (
                    <BookCard key={book._id.toString()} book={book} />
                ))}
            </div>
            {totalPages > 1 && (
                <PaginationControls totalPages={totalPages} currentPage={currentPage} />
            )}
        </>
    );
}

export default async function BooksPage({ searchParams }: {
  searchParams?: {
    page?: string;
    query?: string;
    genre?: string;
  };
}) {
  const currentPage = Number(searchParams?.page) || 1;
  const query = searchParams?.query || '';
  const genre = searchParams?.genre || '';
  const genres = await getUniqueGenres();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-headline font-bold">Explore Books</h1>
        <Button asChild>
          <Link href="/books/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Book
          </Link>
        </Button>
      </div>

      <BookFilters genres={genres} />

      <Suspense key={currentPage + query + genre} fallback={<BookListSkeleton />}>
        <BookList currentPage={currentPage} query={query} genre={genre} />
      </Suspense>
    </div>
  );
}
