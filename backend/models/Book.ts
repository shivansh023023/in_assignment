import { ObjectId } from 'mongodb';

export interface IBookDocument {
  _id?: ObjectId;
  title: string;
  author: string;
  description: string;
  genre: string;
  publishedYear: number;
  coverImage: string;
  addedBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
