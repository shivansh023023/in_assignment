'use server'

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import dbConnect from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import type { FormState } from '@/lib/definitions';
import { ObjectId } from 'mongodb';

const ReviewSchema = z.object({
  rating: z.coerce.number().min(1, "Rating is required.").max(5),
  reviewText: z.string().min(1, "Review text cannot be empty."),
  bookId: z.string(),
});

export async function addReview(prevState: FormState, formData: FormData): Promise<FormState> {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, message: 'You must be logged in to post a review.' };
  }

  const validatedFields = ReviewSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid data provided.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { rating, reviewText, bookId } = validatedFields.data;

  try {
    const { db } = await dbConnect();

    const existingReview = await db.collection('reviews').findOne({ 
        bookId: new ObjectId(bookId), 
        userId: new ObjectId(user._id)
    });

    if (existingReview) {
        return { success: false, message: 'You have already reviewed this book.' };
    }

    const newReview = {
        bookId: new ObjectId(bookId),
        userId: new ObjectId(user._id),
        rating,
        reviewText,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    await db.collection('reviews').insertOne(newReview);

    revalidatePath(`/books/${bookId}`);
    return { success: true, message: 'Review added successfully.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to add review.' };
  }
}

export async function deleteReview(reviewId: string, bookId: string) {
    const user = await getSessionUser();
    if (!user) {
        throw new Error('Authentication required.');
    }

    try {
        const { db } = await dbConnect();
        const review = await db.collection('reviews').findOne({ _id: new ObjectId(reviewId) });
        if(!review) {
            throw new Error('Review not found.');
        }

        if(review.userId.toString() !== user._id.toString()) {
            throw new Error('You are not authorized to delete this review.');
        }

        await db.collection('reviews').deleteOne({ _id: new ObjectId(reviewId) });
        revalidatePath(`/books/${bookId}`);
    } catch (error) {
        console.error(error);
        throw new Error('Failed to delete review.');
    }
}
