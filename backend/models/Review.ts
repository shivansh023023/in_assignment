import { ObjectId } from 'mongodb';

export interface IReviewDocument {
  _id?: ObjectId;
  bookId: ObjectId;
  userId: ObjectId;
  rating: number;
  reviewText: string;
  createdAt: Date;
  updatedAt: Date;
}
