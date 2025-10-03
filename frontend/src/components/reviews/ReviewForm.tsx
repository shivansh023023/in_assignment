'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/books/StarRating';
import { addReview } from '@/lib/actions/review.actions';
import { useToast } from '@/hooks/use-toast';
import { FormState } from '@/lib/definitions';
import { Loader2 } from 'lucide-react';

const initialState: FormState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
       {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Submit Review
    </Button>
  );
}

export function ReviewForm({ bookId }: { bookId: string }) {
  const [rating, setRating] = useState(0);
  const [state, formAction] = useActionState(addReview, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: 'Success!',
          description: state.message,
        });
        formRef.current?.reset();
        setRating(0);
      } else if (!state.errors) {
        toast({
          title: 'Error',
          description: state.message,
          variant: 'destructive',
        });
      }
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="bookId" value={bookId} />
      <input type="hidden"name="rating" value={rating} />
      
      <div>
        <label className="font-medium mb-2 block">Your Rating</label>
        <StarRating rating={rating} onRatingChange={setRating} isEditable size={24} />
         {state.errors?.rating && (
            <p className="text-sm text-destructive mt-1">{state.errors.rating[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="reviewText" className="font-medium mb-2 block">Your Review</label>
        <Textarea id="reviewText" name="reviewText" placeholder="What did you think of the book?" rows={4} />
         {state.errors?.reviewText && (
            <p className="text-sm text-destructive mt-1">{state.errors.reviewText[0]}</p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
