'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { StarRating } from "@/components/books/StarRating";
import { deleteReview } from "@/lib/actions/review.actions";
import { IReview } from "@/lib/definitions";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { format } from 'date-fns';
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export function ReviewCard({ review, currentUserId }: { review: IReview; currentUserId?: string }) {
  const [isPending, startTransition] = useTransition();
  const avatarImage = PlaceHolderImages.find(p => p.id === 'profile-avatar');

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this review?')) {
        startTransition(() => {
            deleteReview(review._id.toString(), review.bookId.toString());
        });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={avatarImage?.imageUrl} alt={review.userId.name} />
            <AvatarFallback>{review.userId.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{review.userId.name}</p>
            <p className="text-xs text-muted-foreground">{format(new Date(review.createdAt), "MMMM d, yyyy")}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size={16} />
      </CardHeader>
      <CardContent>
        <p className="text-foreground/90">{review.reviewText}</p>
      </CardContent>
      {currentUserId === review.userId._id.toString() && (
        <CardFooter className="flex justify-end">
          <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isPending}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
