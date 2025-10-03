import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/books/StarRating';
import type { IBook } from '@/lib/definitions';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function BookCard({ book }: { book: IBook }) {
  const coverImage = PlaceHolderImages.find(p => p.id.startsWith('book-cover-')) || PlaceHolderImages.find(p => p.id === 'book-cover-default');
  
  return (
    <Link href={`/books/${book._id}`} className="group block">
        <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="p-0">
            <div className="aspect-[2/3] w-full relative overflow-hidden rounded-t-lg">
                <Image
                    src={book.coverImage || coverImage?.imageUrl || ''}
                    alt={`Cover of ${book.title}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    data-ai-hint="book cover"
                />
            </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <CardTitle className="font-headline text-xl leading-tight mb-1 group-hover:text-accent transition-colors">
                    {book.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{book.author}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <StarRating rating={book.averageRating || 0} size={16} />
                {book.averageRating > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">({(book.averageRating || 0).toFixed(1)})</span>
                )}
            </CardFooter>
        </Card>
    </Link>
  );
}
