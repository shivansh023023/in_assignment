import type { ObjectId } from 'mongodb';

export interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
}

export interface IReview {
  _id: ObjectId;
  rating: number;
  reviewText: string;
  userId: IUser;
  bookId: ObjectId;
  createdAt: string;
  updatedAt: string;
}

export interface IBook {
  _id: ObjectId;
  title: string;
  author: string;
  description: string;
  genre: string;
  publishedYear: number;
  addedBy: IUser;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  reviews: IReview[];
  averageRating: number;
}

export type BookWithReviews = IBook & {
  reviews: IReview[];
  averageRating: number;
};

export type AuthFormState = {
  message: string;
  success: boolean;
};

export type FormState = {
    message: string;
    success: boolean;
    errors?: Record<string, string[] | undefined>;
    redirectUrl?: string;
};
