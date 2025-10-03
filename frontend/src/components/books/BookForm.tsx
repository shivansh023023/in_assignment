'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormState, IBook } from '@/lib/definitions';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { deleteBook } from '@/lib/actions/book.actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


interface BookFormProps {
  type: 'Add' | 'Edit';
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  book?: IBook;
}

const initialState: FormState = {
  message: '',
  success: false,
};

function SubmitButton({ type }: { type: 'Add' | 'Edit' }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {type === 'Add' ? 'Add Book' : 'Save Changes'}
    </Button>
  );
}

function DeleteButton({ bookId }: { bookId: string }) {
    const { pending } = useFormStatus();
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={pending}>
                    {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Delete Book
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this book and all its reviews.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <form action={deleteBook.bind(null, bookId)}>
                        <AlertDialogAction type="submit">Continue</AlertDialogAction>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function BookForm({ type, action, book }: BookFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if(state.message && state.success) {
      toast({
        title: 'Success!',
        description: state.message,
      });
      if (state.redirectUrl) {
        router.push(state.redirectUrl);
      }
    } else if (state.message && !state.success && !state.errors) {
        toast({
            title: 'Error',
            description: state.message,
            variant: 'destructive'
        });
    }
  }, [state, toast, router]);


  return (
    <form ref={formRef} action={formAction}>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">{type} Book</CardTitle>
          <CardDescription>Fill in the details below to {type.toLowerCase()} a book to the collection.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" defaultValue={book?.title} />
                    {state.errors?.title && <p className="text-sm text-destructive">{state.errors.title[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" name="author" defaultValue={book?.author} />
                    {state.errors?.author && <p className="text-sm text-destructive">{state.errors.author[0]}</p>}
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="publishedYear">Published Year</Label>
                    <Input id="publishedYear" name="publishedYear" type="number" defaultValue={book?.publishedYear} />
                    {state.errors?.publishedYear && <p className="text-sm text-destructive">{state.errors.publishedYear[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="genre">Genre</Label>
                    <Input id="genre" name="genre" defaultValue={book?.genre} />
                    {state.errors?.genre && <p className="text-sm text-destructive">{state.errors.genre[0]}</p>}
                </div>
            </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={6} defaultValue={book?.description} />
             {state.errors?.description && <p className="text-sm text-destructive">{state.errors.description[0]}</p>}
          </div>
            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input id="coverImage" name="coverImage" defaultValue={book?.coverImage} />
              {state.errors?.coverImage && <p className="text-sm text-destructive">{state.errors.coverImage[0]}</p>}
            </div>
        </CardContent>
        <CardFooter className="flex justify-between">
            <div className='flex gap-2'>
                <Button variant="outline" asChild>
                    <Link href={book ? `/books/${book._id}` : '/books'}>Cancel</Link>
                </Button>
                {type === 'Edit' && book && <DeleteButton bookId={book._id.toString()} />}
            </div>
            <SubmitButton type={type} />
        </CardFooter>
      </Card>
    </form>
  );
}
