import { ObjectId } from 'mongodb';

export interface IUserDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}
