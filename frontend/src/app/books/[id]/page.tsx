import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getBookById } from '@/lib/actions/book.actions';
import { getSessionUser } from '@/lib/auth';
import { StarRating } from '@/components/books/StarRating';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Pencil } from 'lucide-react';

export default async function BookDetailsPage({ params }: { params: { id: string } }) {
  const book = await getBookById(params.id);
  const user = await getSessionUser();

  if (!book) {
    notFound();
  }

  const userHasReviewed = user && book.reviews.some(review => review.userId._id.toString() === user._id.toString());
  const isOwner = user && user._id.toString() === book.addedBy._id.toString();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-1">
          <Card className="overflow-hidden sticky top-24">
            <div className="aspect-[2/3] w-full relative">
              <Image
                src={book.coverImage}
                alt={`Cover of ${book.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                priority
                data-ai-hint="book cover"
              />
            </div>
            {isOwner && (
                <div className="absolute top-4 right-4">
                    <Button asChild size="icon">
                        <Link href={`/books/${book._id}/edit`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit Book</span>
                        </Link>
                    </Button>
                </div>
            )}
          </Card>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div>
            <h1 className="font-headline text-4xl lg:text-5xl font-bold">{book.title}</h1>
            <p className="text-xl text-muted-foreground mt-2">by {book.author}</p>

            <div className="flex items-center gap-4 mt-4 text-sm">
                <StarRating rating={book.averageRating} />
                <span className="text-muted-foreground">
                    {book.averageRating.toFixed(1)} average rating ({book.reviews.length} reviews)
                </span>
            </div>
          </div>

          <p className="text-lg leading-relaxed">{book.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
                <p className="font-semibold">Genre</p>
                <p className="text-muted-foreground">{book.genre}</p>
            </div>
            <div>
                <p className="font-semibold">Published Year</p>
                <p className="text-muted-foreground">{book.publishedYear}</p>
            </div>
            <div>
                <p className="font-semibold">Added By</p>
                <p className="text-muted-foreground">{book.addedBy.name}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-6">
            <h2 className="font-headline text-3xl font-bold">Reviews</h2>

            {user && !userHasReviewed && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Write a Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReviewForm bookId={book._id.toString()} />
                </CardContent>
              </Card>
            )}
             {!user && (
                <div className='p-6 border rounded-lg text-center bg-card'>
                    <p className='text-muted-foreground'>
                        <Link href={`/login?redirect=/books/${book._id}`} className='text-accent underline'>Log in</Link> to write a review.
                    </p>
                </div>
            )}

            {book.reviews.length > 0 ? (
              <div className="space-y-4">
                {book.reviews.map((review) => (
                  <ReviewCard key={review._id.toString()} review={review} currentUserId={user?._id.toString()} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to share your thoughts!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
