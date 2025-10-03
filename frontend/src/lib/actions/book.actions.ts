'use server'

import dbConnect from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { IBook, FormState } from '@/lib/definitions'
import { ObjectId } from 'mongodb'
import { PlaceHolderImages } from '../placeholder-images'

const BOOKS_PER_PAGE = 5;

export async function getBooks(page = 1, query = '', genre = '') {
    const { db } = await dbConnect();

    const skip = (page - 1) * BOOKS_PER_PAGE;
    
    const filter: any = {};
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: 'i' } },
            { author: { $regex: query, $options: 'i' } },
        ];
    }
    if(genre){
        filter.genre = genre;
    }

    try {
        const booksPipeline = [
            { $match: filter },
            { $skip: skip },
            { $limit: BOOKS_PER_PAGE },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'bookId',
                    as: 'reviews'
                }
            },
            {
                $addFields: {
                    averageRating: { $ifNull: [ { $avg: '$reviews.rating' }, 0] }
                }
            },
            {
                $project: {
                    reviews: 0 // Exclude reviews array from final output for list page
                }
            },
            { $sort: { createdAt: -1 } }
        ];
        
        const books = await db.collection('books').aggregate(booksPipeline).toArray();
        const totalBooks = await db.collection('books').countDocuments(filter);

        return { books: JSON.parse(JSON.stringify(books)), totalPages: Math.ceil(totalBooks / BOOKS_PER_PAGE) };

    } catch (error) {
        console.error(error);
        return { books: [], totalPages: 0 };
    }
}

export async function getBookById(id: string): Promise<IBook | null> {
    if (!ObjectId.isValid(id)) {
        return null;
    }

    try {
        const { db } = await dbConnect();

        const bookPipeline = [
            { $match: { _id: new ObjectId(id) } },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'bookId',
                    as: 'reviews',
                     pipeline: [
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'userId',
                                foreignField: '_id',
                                as: 'user'
                            }
                        },
                        { $unwind: '$user' },
                        { 
                            $addFields: { 
                                'userId': {
                                  _id: '$user._id',
                                  name: '$user.name',
                                  email: '$user.email'
                                }
                            }
                        },
                        { $project: { user: 0 } },
                        { $sort: { createdAt: -1 } }
                    ]
                }
            },
             {
                $lookup: {
                    from: 'users',
                    localField: 'addedBy',
                    foreignField: '_id',
                    as: 'addedByUser'
                }
            },
            { $unwind: '$addedByUser' },
            {
                $addFields: {
                    averageRating: { $ifNull: [{ $avg: '$reviews.rating' }, 0] },
                    addedBy: {
                        _id: '$addedByUser._id',
                        name: '$addedByUser.name',
                    }
                }
            },
            { $project: { addedByUser: 0 } }
        ];

        const results = await db.collection('books').aggregate(bookPipeline).toArray();
        
        if (results.length === 0) return null;

        return JSON.parse(JSON.stringify(results[0]));
    } catch (error) {
        console.error("Failed to fetch book:", error);
        return null;
    }
}

const BookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  publishedYear: z.coerce.number().int().min(1000, 'Invalid year').max(new Date().getFullYear(), 'Year cannot be in the future'),
  genre: z.string().min(1, 'Genre is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  coverImage: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});

export async function addBook(prevState: FormState, formData: FormData): Promise<FormState> {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, message: 'Authentication required.' };
  }

  const validatedFields = BookSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid data provided.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { title, author, publishedYear, genre, description } = validatedFields.data;
  let coverImage = validatedFields.data.coverImage;

  if (!coverImage) {
    coverImage = PlaceHolderImages.find(p => p.id === 'book-cover-default')?.imageUrl || '';
  }
  
  try {
    const { db } = await dbConnect();
    const newBook = {
        title,
        author,
        publishedYear,
        genre,
        description,
        coverImage,
        addedBy: new ObjectId(user._id),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const result = await db.collection('books').insertOne(newBook);
    
    revalidatePath('/books');
     return { success: true, message: 'Book added successfully.', redirectUrl: `/books/${result.insertedId}` };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to create book.' };
  }
}


export async function updateBook(id: string, prevState: FormState, formData: FormData): Promise<FormState> {
    const user = await getSessionUser();
    if (!user) {
      return { success: false, message: 'Authentication required.' };
    }
  
    const validatedFields = BookSchema.safeParse(Object.fromEntries(formData.entries()));
  
    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Invalid data provided.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
  
    try {
        const { db } = await dbConnect();
        const book = await db.collection('books').findOne({ _id: new ObjectId(id) });
        if (!book) {
            return { success: false, message: 'Book not found.' };
        }
        if (book.addedBy.toString() !== user._id.toString()) {
            return { success: false, message: 'You are not authorized to edit this book.' };
        }
      
        let coverImage = validatedFields.data.coverImage;
        if (!coverImage) {
            coverImage = PlaceHolderImages.find(p => p.id === 'book-cover-default')?.imageUrl || '';
        }

        await db.collection('books').updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...validatedFields.data, coverImage, updatedAt: new Date() } }
        );
  
        revalidatePath(`/books/${id}`);
        revalidatePath('/books');
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to update book.' };
    }
    
     return { success: true, message: 'Book updated successfully.', redirectUrl: `/books/${id}` };
}
  

export async function deleteBook(id: string) {
    const user = await getSessionUser();
    if (!user) {
        throw new Error('Authentication required.');
    }

    try {
        const { db } = await dbConnect();
        const book = await db.collection('books').findOne({ _id: new ObjectId(id) });
        if (!book) {
            throw new Error('Book not found.');
        }

        if (book.addedBy.toString() !== user._id.toString()) {
            throw new Error('You are not authorized to delete this book.');
        }

        await db.collection('books').deleteOne({ _id: new ObjectId(id) });
        await db.collection('reviews').deleteMany({ bookId: new ObjectId(id) });

    } catch (error) {
        console.error(error);
        throw new Error('Failed to delete book.');
    }

    revalidatePath('/books');
    redirect('/books');
}

export async function getUniqueGenres() {
    try {
        const { db } = await dbConnect();
        const genres = await db.collection('books').distinct('genre');
        return genres;
    } catch (error) {
        console.error(error);
        return [];
    }
}
